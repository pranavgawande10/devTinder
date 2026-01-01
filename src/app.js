const express = require("express");

const app = express();

app.use("/test", (req,res) => {
    res.send("hello from the pranav!....");
});

app.use("/hello", (req,res) => {
    res.send("hello from the namaste node js!....");
});

app.listen(3000, () => {
    console.log("server is sucessfully listening at port 3000....");

});