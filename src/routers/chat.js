const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const Chat = require("../models/chat.js");
const Message = require("../models/message.js");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const targetUserId = req.params.targetUserId;

        // Verify accepted connection
        const connection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: loggedInUserId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: loggedInUserId, status: "accepted" },
            ],
        });

        if (!connection) {
            return res.status(403).json({ message: "You are not connected with this user!" });
        }

        // Find or create chat
        let chat = await Chat.findOne({
            participants: { $all: [loggedInUserId, targetUserId] },
        });

        if (!chat) {
            chat = new Chat({
                participants: [loggedInUserId, targetUserId],
            });
            await chat.save();
        }

        // Get messages (last 50)
        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .populate("senderId", "firstName lastName photoUrl");

        res.json({ chatId: chat._id, messages });
    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
});

module.exports = chatRouter;
