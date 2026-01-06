const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    const user = new User(req.body);

    try{

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

//to delete the user using emailID
app.delete("/user" , async (req,res )=>{
    const userid = req.body.userId;

    try{
        
        const users = await User.findByIdAndDelete({_id : userid});
       // const users = await User.findByIdAndDelete(userEmail);
        res.send("data deleted successfully!!!");

    }
    catch(error)
    {
        res.status(400).send("something went wrong!!!");
    }
});

//to update the data
app.patch("/user" , async (req,res) =>{
    const data = req.body;
    const userId = req.body.userId;

    try{
//this will allow to update only particular fields like user will not able to edit the email once it signup 
        const update_allow = ["userId" , "skills" , "photoUrl" , "about" , "gender","age"];
        const isUpdateAllowed = Object.keys(data).every((k) => update_allow.includes(k));
        if(!(isUpdateAllowed))
        {
            res.status(400).send("update not allowed!!");
           
        }
 //-------------------------------------------------------------------
        const users = await User.findByIdAndUpdate({_id: userId},data, {runValidators:true});
        
        res.send("data updated successfully!!!");
    }
    catch(error)
    {
        res.status(400).send("something went wrong!!!" + error);
    }
})

//to get the data for one user matched with the emailID!!!!
app.get("/user" , async(req,res) =>{
    const userEmail  = req.body.emailId;

    try { 
        const users = await User.find({emailId : userEmail});
        if(users.length === 0)
        {
            res.status(404).send("user not found!");
        }
        else {
            res.send(users);
        }
    }
    // try{
    //     const users = await User.findOne({emailId : userEmail});
    //     if(!users)
    //     {
            
    //         res.status(404).send("user not found!");
    //     }
    //     else{
    //         res.send(users);
    //     }
    // }
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
