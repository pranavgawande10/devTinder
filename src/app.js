const express = require("express");

const app = express();

app.get("/user/getdata" , (req,res) =>{

    throw new Error("asfasdfa");
    res.send("user data sent");
});

app.use("/" ,(err,req,res)=>{
    if(err)
    {
        res.status(500).send("Something went wrong!");
    }
});







app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});