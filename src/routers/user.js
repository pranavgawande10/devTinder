const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");



userRouter.get("/user/requests/received" , userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "intrested",
        }).populate("fromUserId" , "firstName lastName photoUrl age gender about skills");
        //.populate("fromUserId" , ["firstName" , "lastName","photoUrl"]);
        


        res.json({
            message: "Data fetched successfullly!!!",
            data : connectionRequest,
        });

    }
    catch(err)
    {
        req.statusCode(404).send("Error: "+err.message);
    }
});


userRouter.get("/user/connections" , userAuth , async (req,res) => {
    try
    { 
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id , status:"accepted"},
                {toUserId: loggedInUser._id , status: "accepted"},
            ]
        }).populate("fromUserId" , ["firstName" ,"lastName" ,"age", "photoUrl" ,"about" ,"skills"])
        .populate("toUserId" , ["firstName" ,"lastName" ,"age", "photoUrl" ,"about" ,"skills"]);

        const data  = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data } );


    } 
    catch(err)
    {
        res.status(404).json({message : err.message});
    }
});


userRouter.get("/feed" , userAuth , async (req,res)=>{
    try 
    {
        const loggedInUser = req.user;
        
        const page  = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const  connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId : loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ],
        }).select("firstName lastName photoUrl age about skills gender")
        .skip(skip)
        .limit(limit);

       

        res.send(users);
    }
    catch(err) 
    {
        res.status(400).json({message : err.message});
    }
})

module.exports = userRouter;