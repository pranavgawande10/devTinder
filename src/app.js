const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database.js");
const app = express();
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const cors = require("cors");
require("dotenv").config();
require("./utils/cronjob.js");

const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");
const userRouter= require("./routers/user.js");
const chatRouter = require("./routers/chat.js");
const notificationRouter = require("./routers/notification.js");
const aiRouter = require("./routers/ai.js");

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
app.use("/" , chatRouter);
app.use("/", notificationRouter);
app.use("/", aiRouter);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
        credentials: true,
    },
});

// Track online users: userId -> socketId
const onlineUsers = new Map();

// Make io and onlineUsers accessible from routers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Socket.io authentication middleware
io.use(async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) return next(new Error("Authentication error"));
        const tokenCookie = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith("token="));
        if (!tokenCookie) return next(new Error("Authentication error"));
        const tokenValue = tokenCookie.split("=")[1];
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) return next(new Error("Authentication error"));
        socket.userId = user._id.toString();
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

// Socket.io connection handler
io.on("connection", (socket) => {
    // console.log("User connected: " + socket.userId);
    onlineUsers.set(socket.userId, socket.id);

    // Chat events
    socket.on("joinChat", async ({ targetUserId }) => {
        try {
            const ConnectionRequest = require("./models/connectionRequest.js");
            const Chat = require("./models/chat.js");
            
            // Verify accepted connection
            const connection = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: socket.userId, toUserId: targetUserId, status: "accepted" },
                    { fromUserId: targetUserId, toUserId: socket.userId, status: "accepted" },
                ],
            });
            if (!connection) return;

            const roomId = [socket.userId, targetUserId].sort().join("_");
            socket.join(roomId);
            socket.emit("chatJoined", { roomId });
        } catch (err) {
            console.error("joinChat error:", err.message);
        }
    });

    socket.on("sendMessage", async ({ chatId, text, targetUserId }) => {
        try {
            const Message = require("./models/message.js");
            
            const message = new Message({
                chatId,
                senderId: socket.userId,
                text,
            });
            const savedMessage = await message.save();
            await savedMessage.populate("senderId", "firstName lastName photoUrl");

            const roomId = [socket.userId, targetUserId].sort().join("_");
            io.to(roomId).emit("receiveMessage", savedMessage);

            // Increment offline count for target user
            const User = require("./models/user.js");
            const Notification = require("./models/notification.js");
            const targetUser = await User.findById(targetUserId);
            if (targetUser) {
                targetUser.unreadNotificationsCount = (targetUser.unreadNotificationsCount || 0) + 1;
                await targetUser.save();
            }

            await Notification.findOneAndUpdate(
                { userId: targetUserId, senderId: socket.userId, type: "new_message", isRead: false },
                { text: "sent you a message!" },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            // Emit notification if user is online
            const targetSocketId = onlineUsers.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit("new_message", {
                    fromUser: {
                        _id: socket.user._id,
                        firstName: socket.user.firstName,
                        lastName: socket.user.lastName,
                        photoUrl: socket.user.photoUrl,
                    },
                    message: `${socket.user.firstName} sent you a message!`,
                });
            }
        } catch (err) {
            console.error("sendMessage error:", err.message);
        }
    });

    socket.on("typing", ({ targetUserId }) => {
        const roomId = [socket.userId, targetUserId].sort().join("_");
        socket.to(roomId).emit("typing", { userId: socket.userId });
    });

    socket.on("stopTyping", ({ targetUserId }) => {
        const roomId = [socket.userId, targetUserId].sort().join("_");
        socket.to(roomId).emit("stopTyping", { userId: socket.userId });
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected: " + socket.userId);
        onlineUsers.delete(socket.userId);
    });
});

connectDB()
    .then(() => {
        console.log("connect to DB successfully!");
        const port = process.env.PORT || 3000;
        server.listen(port, ()=>{
             console.log("server is successfully listening at port " + port);
        });
    })
    .catch((err) =>{
        console.error("connection to DB is failed!");
    });
