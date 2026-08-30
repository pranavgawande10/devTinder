const express = require("express");
const notificationRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const Notification = require("../models/notification.js");

notificationRouter.get("/notifications", userAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("senderId", "firstName lastName photoUrl");
            
        res.json({ data: notifications });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

notificationRouter.patch("/notifications/mark-read", userAuth, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        
        const loggedInUser = req.user;
        loggedInUser.unreadNotificationsCount = 0;
        await loggedInUser.save();
        
        res.json({ message: "Notifications marked as read" });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = notificationRouter;
