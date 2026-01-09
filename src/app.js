const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const {signupValidation} = require("./utils/validation.js");
const bcrypt =  require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");


app.use(express.json());
app.use(cookieParser());

app.post("/login" , async(req,res)=>{
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
        const isPasswordvalid = await bcrypt.compare(password ,userpresent.password);

        if(isPasswordvalid)
        {
            //create a JWT token
            const token = await jwt.sign({_id : userpresent._id }, "dev@tinder", {expiresIn : "1h"});
            //add token to cookie and send the response back to user !!
            res.cookie("token" , token);
            
            res.send("Login successfully!!!");
        }
        else
        {
            throw new Error("Invalid credentials!!");
        }
    }
    catch(error)
    {
        res.status(400).send("login failed please enter valid data!" + error.message);
    }
})

app.get("/profile" , userAuth,  async(req,res)=>{
    try{
        const user = req.user;

        // console.log(cookie);
        res.send(user);

    }catch(Error)
    {
        res.status(400).send("something went wrong Unable to fetch profile!" + Error.message);
    }
    
});

app.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    

    try{
        //validation of data
        signupValidation(req);

        //encrypt the password
        const {firstName, lastName, emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password , 10);

        console.log(passwordHash);

        //create a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        });

        const data = req.body;
        if(data?.skills.length > 10)
        {
            res.status(400).send("skills list excceded!!"); 
        }
        await user.save();
        res.send("user data saved successfully!");
    }
    catch(err)
    {
        res.status(400).send("data not saved!" + err);
    }
    
});

app.post("/sendConnectionRequest" ,userAuth, (req,res) => {
    const user =req.user;
    res.send(user.firstName + " has sent the request!!!!");
});


connectDB()
    .then(() => {
        console.log("connect to DB successfully!");
        app.listen(3000, ()=>{
             console.log("server is successfully listening at port 3000....");
        });
    })
    .catch((err) =>{
        console.error("connection to DB is failed!");
    });
