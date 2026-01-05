const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    const user = new User(req.body);

    try{
        await user.save();
        res.send("user data saved successfully!");
    }
    catch(err)
    {
        res.status(400).send("data not saved!");
    }
    
});

//to get the data for one user matched with the emailID!!!!
app.get("/user" , async(req,res) =>{
    const userEmail  = req.body.emailId;

    // try { 
    //     const users = await User.find({emailId : userEmail});
    //     if(users.length === 0)
    //     {
    //         res.status(404).send("user not found!");
    //     }
    //     else {
    //         res.send(users);
    //     }
    // }
    try{
        const users = await User.findOne({emailId : userEmail});
        if(!users)
        {
            
            res.status(404).send("user not found!");
        }
        else{
            res.send(users);
        }
    }
    catch (error)
    {
        res.status(400).send("something went wrong!!");
    }
});


app.get("/feed" , async(req,res) =>{
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch(error)
    {
        res.status(400).send("soething went wrong!!!");
    }
})

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
