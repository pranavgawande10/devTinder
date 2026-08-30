const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");
const { fetchGitHubData } = require("../utils/github.js");
const User = require("../models/user.js");
const multer = require("multer");
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
profileRouter.get("/profile/github/:userId", userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        
        if (!user.githubUsername) {
            return res.status(400).json({ message: "No GitHub username linked!" });
        }

        const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
        const now = new Date();
        if (user.githubData && user.githubData.fetchedAt && (now - user.githubData.fetchedAt < NINETY_DAYS)) {
            return res.json(user.githubData);
        }

        const newGithubData = await fetchGitHubData(user.githubUsername);
        user.githubData = newGithubData;
        await user.save();

        res.json(user.githubData);
    } catch (err) {
        res.status(500).json({ message: "Error fetching GitHub data: " + err.message });
    }
});
profileRouter.patch("/profile/notifications/clear", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        loggedInUser.unreadNotificationsCount = 0;
        await loggedInUser.save();
        res.json({ message: "Notifications cleared" });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.post("/profile/enhance-bio", userAuth, async (req, res) => {
    try {
        const { skills, about } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API key is not configured" });
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const prompt = `You are an expert tech recruiter and resume writer. 
I have a developer profile with the following details:
Skills: ${skills ? skills.join(", ") : "Not specified"}
Current About Me / Notes: ${about || "Not specified"}

Please generate a professional, engaging developer bio and a catchy headline.
Keep the bio concise (maximum 300 characters).
Format the output strictly as a JSON object with two keys: "headline" and "bio".
Do not include any markdown blocks or extra text outside the JSON.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse JSON
        let enhancedData;
        try {
            // Strip out markdown code blocks if the model wrapped it
            const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
            enhancedData = JSON.parse(cleanedText);
        } catch (e) {
             return res.status(500).json({ message: "Failed to parse AI response" });
        }
        
        res.json({ headline: enhancedData.headline, bio: enhancedData.bio });
    } catch (err) {
        console.error("AI Enhance Error:", err);
        res.status(500).json({ message: "Error enhancing bio: " + err.message });
    }
});

module.exports = profileRouter;
