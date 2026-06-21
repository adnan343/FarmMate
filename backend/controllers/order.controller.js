import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { createNotification } from './notification.controller.js';
import { logAudit } from './auditLog.controller.js';

// Create new order (checkout)
export const createOrder = async (req, res) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod = 'cash', notes } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
        return res.status(400).json({ success: false, msg: 'Shipping address is required.' });
    }

    const paymentOption = String(paymentMethod || 'cash');
    if (!['cash', 'card', 'online'].includes(paymentOption)) {
        return res.status(400).json({ success: false, msg: 'Invalid payment method.' });
    }

    try {
        const user = await User.findById(userId).populate('cart.items.productId');
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        if (!user.cart?.items?.length) {
            return res.status(400).json({ success: false, msg: 'Cart is empty' });
        }

        const invalidCartItem = user.cart.items.find(item => !item.productId || !mongoose.Types.ObjectId.isValid(item.productId?._id || item.productId));
        if (invalidCartItem) {
            return res.status(400).json({ success: false, msg: 'Cart contains an invalid or removed product. Please refresh your cart.' });
        }

        // Validate stock availability for all items
        const stockValidation = [];
        for (const item of user.cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    msg: `Product ${item.name} not found` 
                });
            }
            
            if (!product.isAvailable) {
                return res.status(400).json({ 
                    success: false, 
                    msg: `Product ${item.name} is not available` 
                });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    msg: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }
            
            stockValidation.push({ product, item });
        }

        // Create order
        const order = new Order({
            buyer: userId,
            items: user.cart.items.map(item => ({
                productId: item.productId._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                farmer: item.farmer,
                status: 'pending'
            })),
            total: user.cart.total,
            shippingAddress,
            paymentMethod: paymentOption,
            notes
        });

        // Deduct stock atomically. Root cause: read-modify-write can oversell under concurrent checkouts.
        // Safe fix: guarded $inc only succeeds when enough stock is still available.
        for (const { product, item } of stockValidation) {
            const updated = await Product.updateOne(
                { _id: product._id, isAvailable: true, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            );

            if (updated.modifiedCount !== 1) {
                return res.status(409).json({
                    success: false,
                    msg: `Insufficient stock for ${item.name}. Please refresh your cart and try again.`
                });
            }
        }

        // Save order
        await order.save();

        // Audit log: order created
        logAudit({
            action: 'order_created',
            performedBy: userId,
            targetType: 'order',
            targetId: order._id,
            details: {
                total: order.total,
                itemCount: order.items.length,
                paymentMethod: order.paymentMethod,
            },
            newState: { status: order.status },
        });

        // Notify each unique farmer in the order
        const notifiedFarmers = new Set();
        for (const item of order.items) {
            const farmerIdStr = item.farmer?.toString();
            if (farmerIdStr && !notifiedFarmers.has(farmerIdStr)) {
                notifiedFarmers.add(farmerIdStr);
                const orderShortId = order._id.toString().slice(-8);
                createNotification(
                    farmerIdStr,
                    'order_created',
                    `New order #${orderShortId} received. ${order.items.length} item(s), total: $${order.total}`
                );
            }
        }

        // Clear user's cart
        user.cart.items = [];
        user.cart.total = 0;
        user.cart.itemCount = 0;
        await user.save();

        res.status(201).json({
            success: true,
            msg: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;

    try {
        const orders = await Order.find({ buyer: userId })
            .populate('items.productId')
            .populate('items.farmer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, msg: 'Invalid order ID' });
    }

    try {
        const order = await Order.findById(orderId)
            .populate('buyer', 'name email')
            .populate('items.productId')
            .populate('items.farmer', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
        }

        // H7: Only the buyer, a farmer with items in this order, or an admin may view
        const isAdmin = req.user.role === 'admin';
        const isBuyer = order.buyer._id.toString() === req.user._id.toString();
        const isFarmerInOrder = order.items.some(item => {
            const itemFarmerId = item.farmer?._id?.toString() || item.farmer?.toString();
            return itemFarmerId === req.user._id.toString();
        });

        if (!isAdmin && !isBuyer && !isFarmerInOrder) {
            return res.status(403).json({ success: false, msg: 'Not authorized to view this order' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Update order status (for admin/farmer)
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const { user } = req;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, msg: 'Invalid order ID' });
    }

    try {
        const order = await Order.findById(orderId)
            .populate('items.farmer', 'name email');
        
        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                msg: 'Invalid status. Must be one of: pending, confirmed, shipped, delivered, cancelled' 
            });
        }

        const allowedTransitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: []
        };

        // Admin can update whole order; farmers update only their items
        const isAdmin = user.role === 'admin';
        if (isAdmin) {
            const previousStatus = order.status;
            if (previousStatus !== status && !allowedTransitions[previousStatus]?.includes(status)) {
                return res.status(400).json({ success: false, msg: `Invalid order transition from ${previousStatus} to ${status}` });
            }
            order.status = status;
            if (status === 'delivered') {
                order.deliveryDate = new Date();
            }
            if (status === 'cancelled' && previousStatus !== 'cancelled') {
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product) {
                        product.stock += item.quantity;
                        await product.save();
                    }
                }
            }
        } else if (user.role === 'farmer') {
            let updatedAny = false;
            for (const item of order.items) {
                const itemFarmerId = item.farmer?._id?.toString() || item.farmer?.toString();
                if (itemFarmerId === user._id.toString()) {
                    const previousItemStatus = item.status || 'pending';
                    if (previousItemStatus !== status && !allowedTransitions[previousItemStatus]?.includes(status)) {
                        return res.status(400).json({ success: false, msg: `Invalid item transition from ${previousItemStatus} to ${status}` });
                    }
                    item.status = status;
                    updatedAny = true;

                    // Stock restore on cancellation per-item
                    if (status === 'cancelled' && previousItemStatus !== 'cancelled') {
                        const product = await Product.findById(item.productId);
                        if (product) {
                            product.stock += item.quantity;
                            await product.save();
                        }
                    }
                }
            }
            if (!updatedAny) {
                return res.status(403).json({ success: false, msg: 'No items owned by this farmer in order' });
            }

            // If all items are cancelled, mark order cancelled; if all delivered, mark delivered
            const itemStatuses = order.items.map(i => i.status || 'pending');
            if (itemStatuses.every(s => s === 'cancelled')) {
                order.status = 'cancelled';
            } else if (itemStatuses.every(s => s === 'delivered')) {
                order.status = 'delivered';
                order.deliveryDate = new Date();
            } else if (itemStatuses.some(s => s === 'confirmed') && order.status === 'pending') {
                order.status = 'confirmed';
            } else if (itemStatuses.some(s => s === 'shipped')) {
                order.status = 'shipped';
            }
        } else {
            return res.status(403).json({ success: false, msg: 'Not authorized to update this order' });
        }

        await order.save();

        res.status(200).json({
            success: true,
            msg: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
    // H6: Restrict to admin users only
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Admin access required' });
    }

    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('items.productId')
            .populate('items.farmer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Cancel order (buyer only)
export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, msg: 'Invalid order ID' });
    }

    try {
        const order = await Order.findById(orderId)
            .populate('items.productId');

        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
        }

        // Verify the requester is the buyer who owns this order
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Not authorized to cancel this order' });
        }

        // Check order status — only allow cancel if pending or confirmed
        if (order.status === 'cancelled') {
            return res.status(400).json({ success: false, msg: 'Order is already cancelled' });
        }

        if (order.status !== 'pending' && order.status !== 'confirmed') {
            return res.status(400).json({ success: false, msg: 'Order cannot be cancelled at this stage' });
        }

        const previousStatus = order.status;

        // Update order status
        order.status = 'cancelled';

        // Update each item status to cancelled
        for (const item of order.items) {
            item.status = 'cancelled';
        }

        // Restore product stock
        for (const item of order.items) {
            try {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            } catch (stockErr) {
                console.error(`Failed to restore stock for product ${item.productId}:`, stockErr);
            }
        }

        await order.save();

        // Audit log: order cancelled
        logAudit({
            action: 'order_cancelled',
            performedBy: req.user._id,
            targetType: 'order',
            targetId: order._id,
            previousState: { status: previousStatus },
            newState: { status: order.status },
            details: { total: order.total },
        });

        // Notify farmers about cancellation
        const notifiedFarmers = new Set();
        for (const item of order.items) {
            const farmerIdStr = item.farmer?.toString();
            if (farmerIdStr && !notifiedFarmers.has(farmerIdStr)) {
                notifiedFarmers.add(farmerIdStr);
                createNotification(
                    farmerIdStr,
                    'order_cancelled',
                    `Order #${order._id.toString().slice(-8)} has been cancelled. Stock has been restored.`
                );
            }
        }

        res.status(200).json({
            success: true,
            msg: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

export const getFarmerOrders = async (req, res) => {
    const { farmerId } = req.params;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return res.status(400).json({ success: false, msg: 'Invalid farmer ID' });
    }

    try {
        // IDOR guard: farmers can only view their own orders; admins can view any
        if (req.user.role !== 'admin' && req.user._id.toString() !== farmerId) {
            return res.status(403).json({ success: false, msg: 'Not authorized to view these orders' });
        }
        let query = {
            'items.farmer': farmerId
        };

        // Add status filter if provided
        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('buyer', 'name email phone')
            .populate('items.productId')
            .populate('items.farmer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching farmer orders:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}; 