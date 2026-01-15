const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true, 
    },
    status :{
        type: String,
        required: true,
        enum:{
            values:["ignored", "intrested","accepted", "rejected"],
            message: `{values} is incorrect status type!`,
        },
    },
    
},
{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId: 1 , toUserId : 1}); //compound index for faster the executionnnnnn   //1: ascending order , -1: descending order

//the pre fuction is a function which execute before executing a save() method....
connectionRequestSchema.pre("save" , async function() {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error("you are unable to send request to your self!!!");
    }

});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest" , connectionRequestSchema);

module.exports = ConnectionRequestModel;