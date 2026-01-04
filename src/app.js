const express = require("express");

const app = express();

const {userauth, adminauth} = require("./middlewares/auth.js");
// app.get("/admin/getdata" , (req,res) =>{
//     const auth = "abc";
//     const isauth = auth === "abc";

//     if(isauth)
//     {
//         res.send("sdmin data sent");
//     }
//     else{
//         res.status(401).send("unauthorized request!");
//     }
// });
// app.get("/user/data" ,(req,res)=>{
//     const auth = "xyz";
//     const isauth = auth === "xyz";

//     if(isauth)
//     {
//         res.send("user data sent!!");
//     }
//     else{
//         res.status(401).send("unauthorized request from user!!");
//     }
// });

// app.use("/user" , (req,res,next)=>{
//     const auth = "abcc";
//     const isauth = auth === "abc";

//     if(!isauth)
//     {
//         res.status(401).send("unauthorized request!");
//     }
//     else{
//      next();
//     }
// });


app.get("/user/data" ,userauth, (req,res)=>{
    
        res.send("user data sent!!");
    
});
app.get("/admin/getdata" ,adminauth, (req,res) =>{
    
        res.send("admin data sent");
});







app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});