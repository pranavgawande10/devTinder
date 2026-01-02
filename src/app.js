const express = require("express");

const app = express();

//this will only handle GET call to /user

app.get("/user" , (req,res) => {
    res.send({firstname : "pranav", lastname : "Gawande"});
});

app.post("/user" , (req,res) => {
    res.send("data saved successfully in DB!");
});

app.delete("/user" , (req,res) => {
    res.send("data deleted successfully!!");
});

app.put("/user" , (req, res) => {
    res.send("Testing PUT call !!");
});

app.patch("/user" , (req,res) => {
    res.send("TEsting PATCH call !!");
});

//this will match all the HTTP methods API call to /user
app.use("/test", (req,res) => {
    res.send("hello from the pranav!....");
});



app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});