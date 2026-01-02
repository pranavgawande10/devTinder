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

app.use("/user" , (req,res) => {
    console.log(req.query);
    res.send({firstname:"Pranav" , lastname: "Gawande"});
});

app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});