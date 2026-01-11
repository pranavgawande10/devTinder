const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

 
requestRouter.post("/sendConnectionRequest" ,userAuth, (req,res) => {
    const user =req.user;
    res.send(user.firstName + " has sent the request!!!!");
});

module.exports = requestRouter;