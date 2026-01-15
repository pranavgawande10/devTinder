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
        res.json({message: "connection request " + status , data });

    }
    catch(err)
    {
        req.status(400).send("Error: " + err.message);
    }
} );

module.exports = requestRouter;