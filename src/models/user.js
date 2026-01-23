const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required: true, 
        index : true,
        minLength: 4,
        maxLength: 50,
    },
    lastName : {
        type : String,
        minLength: 4,
        maxLength: 50,
    },
    emailId : {
        type : String,
        lowercase: true, //if we write the mail in upper case then the mail get stored in lower case 
        required : true, //it is use to apply compulsion on user 
        unique: true, //check that email must  be unique
        trim :true, //no void spaces before and after the email
        validate(value){
            if(!(validator.isEmail(value)))
            {
                throw new Error("invalid emailID!");
            }
        }
        
    },
    password : {
        type : String,
        required : true,
        minLength: 8,
        maxLength: 100,
        // validate(value)
        // {
        //     if((validator.isStrongPassword(value)))
        //     {
        //         throw new Error("enter strong password!");
        //     }
        // }
    },
    age : {
        type : Number,
        min : 18, // allow user if their age is greater than 18 not less than that
        max : 100,
    },
    gender : {
        type : String,
        //custom validate function means user ristrict the particular user data 
        validate(value) {
            if(!["male","female","others","prefer not to say"].includes(value))
            {
                throw new Error("gender data is not valid!");
            }
        }
    },
    photoUrl : {
        type: String,
        default: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtNTQxLWYtMDA1LXM5My5wbmc.png",
        validate(value)
        {
            if(!(validator.isURL(value)))
            {
                res.status(400).send("invalid photoURL!!");
            }
        }
    },
    about: {
        type : String,
        maxLength: 350,
        default: "this is default about the user!!!",
    },
    skills: {
        type: [String],
    },
    
},
{
    timestamps:true,
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id }, "dev@tinder", {expiresIn : "1h"});

    return token;
};

userSchema.methods.validatePassword = async function(passwordIntputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordvalid = await bcrypt.compare(passwordIntputByUser , passwordHash);

    return isPasswordvalid;

}


const UserModel = mongoose.model("User" , userSchema);
module.exports = UserModel;