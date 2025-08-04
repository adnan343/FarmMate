import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// Create new order (checkout)
export const createOrder = async (req, res) => {
    const { userId } = req.params;
    const { shippingAddress, paymentMethod = 'cash', notes } = req.body;

    try {
        // Get user with populated cart
        const user = await User.findById(userId).populate('cart.items.productId');
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        if (user.cart.items.length === 0) {
            return res.status(400).json({ success: false, msg: 'Cart is empty' });
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
                farmer: item.farmer
            })),
            total: user.cart.total,
            shippingAddress,
            paymentMethod,
            notes
        });

        // Update product stock
        for (const { product, item } of stockValidation) {
            product.stock -= item.quantity;
            await product.save();
        }

        // Save order
        await order.save();

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
    const { userId } = req.params;

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

    try {
        const order = await Order.findById(orderId)
            .populate('buyer', 'name email')
            .populate('items.productId')
            .populate('items.farmer', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
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
    const { user } = req; // From auth middleware

    try {
        const order = await Order.findById(orderId)
            .populate('items.farmer', 'name email');
        
        if (!order) {
            return res.status(404).json({ success: false, msg: 'Order not found' });
        }

        // Check if user is admin or if they are a farmer with products in this order
        const isAdmin = user.role === 'admin';
        const isFarmerWithProducts = user.role === 'farmer' && 
            order.items.some(item => item.farmer._id.toString() === user._id.toString());

        if (!isAdmin && !isFarmerWithProducts) {
            return res.status(403).json({ 
                success: false, 
                msg: 'Not authorized to update this order' 
            });
        }

        // Validate status transition
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                msg: 'Invalid status. Must be one of: pending, confirmed, shipped, delivered, cancelled' 
            });
        }

        // Store the previous status to check if we need to restore stock
        const previousStatus = order.status;
        
        order.status = status;
        
        if (status === 'delivered') {
            order.deliveryDate = new Date();
        }

        // If order is being cancelled, restore product stock
        if (status === 'cancelled' && previousStatus !== 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
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

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
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

// Get orders for a specific farmer
export const getFarmerOrders = async (req, res) => {
    const { farmerId } = req.params;
    const { status } = req.query;

    try {
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