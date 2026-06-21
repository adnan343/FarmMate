import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// Get user's cart
export const getCart = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('cart.items.productId');
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const validItems = user.cart.items.filter(item => item.productId);
        if (validItems.length !== user.cart.items.length) {
            user.cart.items = validItems;
            user.cart.itemCount = validItems.reduce((total, item) => total + item.quantity, 0);
            user.cart.total = validItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: user.cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, msg: 'Invalid product ID' });
    }

    try {
        // Validate quantity: must be a positive integer
        const parsedQuantity = parseInt(quantity, 10);
        if (!parsedQuantity || parsedQuantity < 1) {
            return res.status(400).json({ success: false, msg: 'Quantity must be a positive integer' });
        }

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }

        if (!product.isAvailable) {
            return res.status(400).json({ success: false, msg: 'Product is not available' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Check if item already exists in cart
        const existingItemIndex = user.cart.items.findIndex(
            item => item.productId && item.productId.toString() === productId
        );

        let newQuantity = parsedQuantity;
        if (existingItemIndex > -1) {
            newQuantity = user.cart.items[existingItemIndex].quantity + parsedQuantity;
        }

        // Validate stock availability
        if (newQuantity > product.stock) {
            return res.status(400).json({ 
                success: false, 
                msg: `Cannot add more than available stock. Available: ${product.stock}, Requested: ${newQuantity}` 
            });
        }

        if (existingItemIndex > -1) {
            user.cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            user.cart.items.push({
                productId: productId,
                name: product.name,
                price: product.price,
                quantity: parsedQuantity,
                image: product.image,
                farmer: product.farmer
            });
        }

        // Update cart totals
        user.cart.itemCount = user.cart.items.reduce((total, item) => total + item.quantity, 0);
        user.cart.total = user.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Item added to cart successfully',
            data: user.cart
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, msg: 'Invalid cart item ID' });
    }

    try {
        // Validate quantity: must be a positive integer
        const parsedQuantity = parseInt(quantity, 10);
        if (!parsedQuantity || parsedQuantity < 1) {
            return res.status(400).json({ success: false, msg: 'Quantity must be at least 1' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const itemIndex = user.cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, msg: 'Item not found in cart' });
        }

        // Check product availability
        const product = await Product.findById(user.cart.items[itemIndex].productId);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Product not found' });
        }
        
        if (!product.isAvailable) {
            return res.status(400).json({ success: false, msg: 'Product is not available' });
        }
        
        if (product.stock < parsedQuantity) {
            return res.status(400).json({ 
                success: false, 
                msg: `Cannot update to more than available stock. Available: ${product.stock}, Requested: ${parsedQuantity}` 
            });
        }

        user.cart.items[itemIndex].quantity = parsedQuantity;

        // Update cart totals
        user.cart.itemCount = user.cart.items.reduce((total, item) => total + item.quantity, 0);
        user.cart.total = user.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Cart item updated successfully',
            data: user.cart
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, msg: 'Invalid cart item ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const itemIndex = user.cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, msg: 'Item not found in cart' });
        }

        user.cart.items.splice(itemIndex, 1);

        // Update cart totals
        user.cart.itemCount = user.cart.items.reduce((total, item) => total + item.quantity, 0);
        user.cart.total = user.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Item removed from cart successfully',
            data: user.cart
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    // Use authenticated user's ID — ignore URL param to prevent IDOR
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        user.cart.items = [];
        user.cart.total = 0;
        user.cart.itemCount = 0;

        await user.save();

        res.status(200).json({
            success: true,
            msg: 'Cart cleared successfully',
            data: user.cart
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};