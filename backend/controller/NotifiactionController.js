import { io } from '../server.js';
import { Notification } from '../model/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        if (!notifications) {
            return res.status(200).json({ notifications: [] });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or access denied' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;


        const notification = await Notification.findOneAndDelete({ _id: id, userId: req.userId });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or access denied' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createAndPushNotification = async (userId, title, message) => {
    try {
        const newNotification = new Notification({
            userId,
            title,
            message,
        });
        await newNotification.save();
        io.to(userId.toString()).emit('newNotification', newNotification);

        console.log(`Notification created and pushed for user ${userId}`);
        return newNotification;
    } catch (error) {
        console.error('Error creating and pushing notification:', error);
        throw error;
    }
};