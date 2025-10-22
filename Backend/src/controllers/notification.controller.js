import { getAuth } from '@clerk/express';
import notificationmodel from '../models/notification.model.js';
import usermodel from '../models/user.model.js';

export const getNotifications = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const user = await usermodel.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const notifications = await notificationmodel.find({ to: user._id }).sort({ createdAt: -1 })
            .populate("from", "username firstName lastName profilePicture")
            .populate("post", "image caption")
            .populate("comment", "content")

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


export const deletenotification = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { notificationId } = req.params;

        const user = await usermodel.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const notification = await notificationmodel.findOneAndDelete({ _id: notificationId, to: user._id });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}