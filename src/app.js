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
