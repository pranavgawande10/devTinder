const express = require("express");

const app = express();

//this will only handle GET call to /user

// app.get("/a/:b/c" , (req,res) => {
//     res.send({firstname : "pranav", lastname : "Gawande"});
// });

// app.get("/a/c" , (req,res) => {
//     res.send({firstname : "pranav", lastname : "Gawande"});
// });/
// app.get(["/a/c", "/a/:b/c"], (req, res) => {
//   res.send({ firstname: "pranav", lastname: "Gawande" });
// });

// app.get(/^\/ab+c$/, (req, res) => {
//   res.send({ firstname: "pranav", lastname: "Gawande" });
// });


// app.get(/^\/ab*cd$/, (req, res) => {
//   res.send({ firstname: "pranav", lastname: "Gawande" });
// });

// app.get(/^\/ab?cd$/, (req, res) => {
//   res.send({ firstname: "pranav", lastname: "Gawande" });
// });

// app.use("/user" , (req,res) => {
//     console.log(req.query);
//     res.send({firstname:"Pranav" , lastname: "Gawande"});
// });
app.use("/user" , (req,res,next) => {
    console.log("handling the route user1 ");
    //next();
    //res.send("response 1!");
    next();
}, (req,res,next) => {
    console.log("handling the route user2 ");
    next();
    res.send("response 2!"); });

    //multiple route handlers!!!!
    //syntax: app.use("/user" , RH1,RH2,RH3...);
    //syntax: app.use("/user" , [RH1,RH2],RH3,RH4,RH5...); it is possible to encapsulate into array no problem or error occur!!!!!


app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});