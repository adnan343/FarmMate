import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller.js';

const router = express.Router();

// Get user's cart
router.get('/:userId', getCart);

// Add item to cart
router.post('/:userId/add', addToCart);

// Update cart item quantity
router.put('/:userId/items/:itemId', updateCartItem);

// Remove item from cart
router.delete('/:userId/items/:itemId', removeFromCart);

// Clear entire cart
router.delete('/:userId/clear', clearCart);

export default router; 