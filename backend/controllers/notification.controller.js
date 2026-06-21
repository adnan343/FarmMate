import Notification from '../models/notification.model.js';

// Get notifications for the authenticated user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ success: false, msg: 'Notification not found' });
        }

        // Ensure the notification belongs to the authenticated user
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            msg: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Clear all notifications for the authenticated user
export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });

        res.status(200).json({
            success: true,
            msg: 'All notifications cleared'
        });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Helper to create a notification (used by other controllers)
export const createNotification = async (userId, type, message) => {
    try {
        const notification = new Notification({
            userId,
            type,
            message
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};