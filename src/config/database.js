const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
            await mongoose.connect("mongodb+srv://pranavgawande05:pranav%402002@namastenode.g9cwmrq.mongodb.net/devTinder");//this is how we connect to mongoose cluster 

    }catch(error)
    {
        console.error("")
    }
}

module.exports = connectDB;