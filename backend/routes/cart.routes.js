import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// All cart routes require authentication and buyer role
// Get user's cart
router.get('/:userId', auth, requireRole('buyer'), getCart);

// Add item to cart
router.post('/:userId/add', auth, requireRole('buyer'), addToCart);

// Update cart item quantity
router.put('/:userId/items/:itemId', auth, requireRole('buyer'), updateCartItem);

// Remove item from cart
router.delete('/:userId/items/:itemId', auth, requireRole('buyer'), removeFromCart);

// Clear entire cart
router.delete('/:userId/clear', auth, requireRole('buyer'), clearCart);

export default router;
