const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { connections } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
 
requestRouter.post("/request/send/:status/:userId" ,userAuth, async (req,res) => {
   
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored" , "intrested"];



        // if(req.user._id === fromUserId)
        // {
        //     return res.status(400).send("you are unable to send request to your self!!!");
        // }   instead of this we use pre method in connectionRequest.js 



        //check the status
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({
                message:"Invalid status type " + status,
            });
        }
        //check whether both the user are present in db or not
        const toUser = await User.findById(toUserId);
        if(!toUser)
        {
            return res.status(400).send("the person to whom you are sendiing the request does not exist!!!");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId},
            ],
        });

        if(existingConnectionRequest)
        {
            return res.status(400).send("Connection Request already sent!!");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        // Real-time notification
        if (status === "intrested") {
            toUser.unreadNotificationsCount = (toUser.unreadNotificationsCount || 0) + 1;
            await toUser.save();
            
            const Notification = require("../models/notification.js");
            await new Notification({
                userId: toUser._id,
                senderId: req.user._id,
                type: "connection_request",
                text: "requested to connect with you",
                connectionRequestId: data._id
            }).save();

            const io = req.app.get("io");
            const onlineUsers = req.app.get("onlineUsers");
            const targetSocketId = onlineUsers.get(toUserId.toString());
            if (targetSocketId) {
                io.to(targetSocketId).emit("new_request", {
                    fromUser: {
                        _id: req.user._id,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        photoUrl: req.user.photoUrl,
                    },
                    message: req.user.firstName + " is interested in you!",
                });
            }
        }

        res.json({
            
            message: req.user.firstName + " is " + status + " in " + toUser?.firstName,
            data,
        });
    }
    catch(err)
    {
        res.status(400).send("Error: " + err.message);
    }



});

requestRouter.post("/request/review/:status/:requestId" ,userAuth, async(req,res)=>{
    try {
        const loggedInUserId = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const allowedStatus = ["accepted" , "rejected"];
        if(!allowedStatus.includes(status))
        {
            return res.status(404).json({message: "status not allowed!"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUserId._id,
            status : "intrested",
        });

        if(!connectionRequest)
        {
            throw res.status(404).json({message: "connection Request not found!!"});
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        // Real-time notification
        if (status === "accepted") {
            const senderUserId = connectionRequest.fromUserId.toString();
            const senderUser = await User.findById(senderUserId);
            if (senderUser) {
                senderUser.unreadNotificationsCount = (senderUser.unreadNotificationsCount || 0) + 1;
                await senderUser.save();

                const Notification = require("../models/notification.js");
                await new Notification({
                    userId: senderUser._id,
                    senderId: req.user._id,
                    type: "request_accepted",
                    text: "accepted your connection request"
                }).save();
            }

            const io = req.app.get("io");
            const onlineUsers = req.app.get("onlineUsers");
            const targetSocketId = onlineUsers.get(senderUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit("request_accepted", {
                    fromUser: {
                        _id: req.user._id,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        photoUrl: req.user.photoUrl,
                    },
                    message: req.user.firstName + " accepted your request!",
                });
            }
        }

        res.json({message: "connection request " + status , data });

    }
    catch(err)
    {
        req.status(400).send("Error: " + err.message);
    }
} );

module.exports = requestRouter;