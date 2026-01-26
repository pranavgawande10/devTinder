const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");


const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");
const userRouter= require("./routers/user.js");
const cors = require("cors");
require("dotenv").config();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);


connectDB()
    .then(() => {
        console.log("connect to DB successfully!");
        app.listen(process.env.PORT, ()=>{
             console.log("server is successfully listening at port " + process.env.PORT);
        });
    })
    .catch((err) =>{
        console.error("connection to DB is failed!");
    });
