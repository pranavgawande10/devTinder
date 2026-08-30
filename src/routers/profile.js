const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");
const multer = require("multer");
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");

const upload = multer({ storage: multer.memoryStorage() });

profileRouter.post("/profile/uploadPhoto", userAuth, upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided!" });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "devTinder_profiles" },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return res.status(500).json({ message: "Error uploading to Cloudinary" });
                }
                
                const loggedInUser = req.user;
                loggedInUser.photoUrl = result.secure_url;
                await loggedInUser.save();

                res.json({
                    message: "Photo uploaded successfully!",
                    photoUrl: result.secure_url,
                    data: loggedInUser
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong!" });
    }
});

profileRouter.get("/profile/view" , userAuth,  async(req,res)=>{
    try{
        const user = req.user;

        // console.log(cookie);
        res.send(user);

    }catch(Error)
    {
        res.status(400).send("something went wrong Unable to fetch profile!" + Error.message);
    }
    
});

profileRouter.patch("/profile/edit" , userAuth, async(req,res) =>{
    try{
        const isEditAllowed = validateEditProfileData(req);
        if(!isEditAllowed)
        {
            throw new Error("Invalid edit request!!!");
        }
        const loggedInUser = req.user; //we return user from userAuth middleWare 
        //console.log(loggedInUser);
        Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));
        //console.log(loggedInUser);
        await loggedInUser.save();
        //res.send(`${loggedInUser.firstName}, your profile was updated successfully!!`);
        res.json({message: `${loggedInUser.firstName}, your profile was updated successfully!!`,data : loggedInUser,});
    }
    catch(err)
    {
        res.status(400).send("Error: " + err.message);
    }
});
module.exports = profileRouter;
