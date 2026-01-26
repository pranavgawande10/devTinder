const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
            await mongoose.connect(process.env.DB_CONNECTION_SECRET);//this is how we connect to mongoose cluster 
            
    }catch(error)
    {
        console.error("")
    }
}

module.exports = connectDB;