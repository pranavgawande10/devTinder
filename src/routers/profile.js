const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");



profileRouter.get("/profile" , userAuth,  async(req,res)=>{
    try{
        const user = req.user;

        // console.log(cookie);
        res.send(user);

    }catch(Error)
    {
        res.status(400).send("something went wrong Unable to fetch profile!" + Error.message);
    }
    
});

module.exports = profileRouter;
