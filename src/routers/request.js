const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { connections } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest.js");
 
requestRouter.post("/request/send/:status/:userId" ,userAuth, async (req,res) => {
   
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored" , "intrested"];

        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({
                message:"Invalid status type " + status,
            });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: "connection requestsent successfully!",
            data,
        });
    }
    catch(err)
    {
        res.status(400).send("Error: " + err.message);
    }



});

module.exports = requestRouter;