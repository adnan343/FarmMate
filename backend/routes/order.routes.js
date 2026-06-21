import express from 'express';
import {
    cancelOrder,
    createOrder,
    getAllOrders,
    getFarmerOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus
} from '../controllers/order.controller.js';
import auth from '../middleware/auth.js';
import { requireRole, requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// Get all orders (admin only)
router.get('/', auth, requireAdmin, getAllOrders);

// Create new order (buyer only)
router.post('/:userId/checkout', auth, requireRole('buyer'), createOrder);

// Get user's orders (buyer sees own, admin sees all)
router.get('/user/:userId', auth, requireRole('buyer', 'admin'), getUserOrders);

// Get orders for a specific farmer (farmer sees own, admin sees all)
router.get('/farmer/:farmerId', auth, requireRole('farmer', 'admin'), getFarmerOrders);

// Get specific order (buyer, farmer, or admin)
router.get('/:orderId', auth, requireRole('buyer', 'farmer', 'admin'), getOrderById);

// Cancel order (buyer only, status must be pending or confirmed)
router.post('/:orderId/cancel', auth, requireRole('buyer'), cancelOrder);

// Update order status (admin or farmer)
router.patch('/:orderId/status', auth, requireRole('admin', 'farmer'), updateOrderStatus);

export default router;
