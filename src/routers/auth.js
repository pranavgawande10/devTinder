const express = require("express");
const authRouter = express.Router();
const User  = require("../models/user.js");
const {signupValidation} = require("../utils/validation.js");
const bcrypt =  require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

authRouter.post("/login" , async(req,res)=>{
    try{
        const {emailId , password} = req.body;
        if(!(validator.isEmail(emailId)))
        {
            res.status(400).send("Please enter valid EmailId!");
        }

        const userpresent  = await User.findOne({emailId : emailId});
        if(!userpresent)
        {
            throw new Error("Invalid Credentials!");
        }
        const isPasswordvalid = await userpresent.validatePassword(password);

        if(isPasswordvalid)
        {
            //create a JWT token
            // const token = await jwt.sign({_id : userpresent._id }, "dev@tinder", {expiresIn : "1h"});
            const token = await userpresent.getJWT();
            //add token to cookie and send the response back to user !!
            res.cookie("token" , token); 
            
            res.send(userpresent);
        }
        else
        {
            throw new Error(" Invalid credentials!!");
        }
    }
    catch(error)
    {
        res.status(400).send( "Error: "+ error.message);
       // res.status(400).send(" login failed please enter valid data!   " + error.message);
    }
});

authRouter.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    

    try{
        //validation of data
        signupValidation(req);

        //encrypt the password
        const {firstName, lastName, emailId,password,age} = req.body;

        const passwordHash = await bcrypt.hash(password , 10);

        // console.log(passwordHash);


        //create a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password : passwordHash,
        });
        

        const data = req.body;
        if(data?.skills?.length > 10)
        {
            res.status(400).send("skills list excceded!!"); 
        }
        // console.log(user);
        const savedUser = await user.save();
         const token = await savedUser.getJWT();
            //add token to cookie and send the response back to user !!
            res.cookie("token" , token); 
        res.json({message : "User Added successfully!" , data :savedUser});
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).send("data not saved!" + err);
    }
    
});

authRouter.post("/logout" , (req,res) =>{
    res.cookie("token" , null ,{
        expires :new Date(Date.now()), 
    });

    res.send("Logout successfully!");
});


module.exports = authRouter;