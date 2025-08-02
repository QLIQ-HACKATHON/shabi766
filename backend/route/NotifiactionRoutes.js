import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { deleteNotification, getNotifications, markNotificationAsRead } from "../controller/NotifiactionController.js";


const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/mark-read', protect, markNotificationAsRead);
router.delete('/:id', protect, deleteNotification);


export default router;