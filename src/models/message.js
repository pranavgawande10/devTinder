const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxLength: 1000,
    },
}, { timestamps: true });

messageSchema.index({ chatId: 1, createdAt: 1 });

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;
