const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["connection_request", "request_accepted", "new_message"],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    connectionRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ConnectionRequest"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
