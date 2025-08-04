import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus
} from '../controllers/order.controller.js';

const router = express.Router();

// Create new order (checkout)
router.post('/:userId/checkout', createOrder);

// Get user's orders
router.get('/user/:userId', getUserOrders);

// Get specific order
router.get('/:orderId', getOrderById);

// Update order status (admin/farmer)
router.patch('/:orderId/status', updateOrderStatus);

// Get all orders (admin)
router.get('/', getAllOrders);

export default router; 