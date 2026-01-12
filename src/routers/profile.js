const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");



profileRouter.get("/profile/view" , userAuth,  async(req,res)=>{
    try{
        const user = req.user;

        // console.log(cookie);
        res.send(user);

    }catch(Error)
    {
        res.status(400).send("something went wrong Unable to fetch profile!" + Error.message);
    }
    
});

profileRouter.patch("/profile/edit" , userAuth, async(req,res) =>{
    try{
        const isEditAllowed = validateEditProfileData(req);
        if(!isEditAllowed)
        {
            throw new Error("Invalid edit request!!!");
        }
        const loggedInUser = req.user; //we return user from userAuth middleWare 
        //console.log(loggedInUser);
        Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));
        //console.log(loggedInUser);
        await loggedInUser.save();
        //res.send(`${loggedInUser.firstName}, your profile was updated successfully!!`);
        res.json({message: `${loggedInUser.firstName}, your profile was updated successfully!!`,data : loggedInUser,});
    }
    catch(err)
    {
        res.status(400).send("Error: " + err.message);
    }
});
module.exports = profileRouter;
