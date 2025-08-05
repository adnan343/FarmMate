import express from 'express';
import {
    createOrder,
    getAllOrders,
    getFarmerOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus
} from '../controllers/order.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create new order (checkout)
router.post('/:userId/checkout', auth, createOrder);

// Get user's orders
router.get('/user/:userId', auth, getUserOrders);

// Get orders for a specific farmer
router.get('/farmer/:farmerId', auth, getFarmerOrders);

// Get specific order
router.get('/:orderId', auth, getOrderById);

// Update order status (admin/farmer)
router.patch('/:orderId/status', auth, updateOrderStatus);

// Get all orders (admin)
router.get('/', auth, getAllOrders);

export default router; 