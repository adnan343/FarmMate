import express from 'express';
import { clearAllNotifications, getNotifications, markAsRead } from '../controllers/notification.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get notifications for the authenticated user
router.get('/', auth, getNotifications);

// Mark a notification as read
router.patch('/:id/read', auth, markAsRead);

// Clear all notifications for the authenticated user
router.delete('/', auth, clearAllNotifications);

export default router;