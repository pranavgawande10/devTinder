const express = require("express");
const aiRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

aiRouter.post("/chat/ai", userAuth, async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API key is not configured" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-3.6-flash for general chat
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const systemPrompt = `You are DevSpark AI, a helpful and expert AI assistant for a developer platform called DevTinder. 
You provide concise, accurate, and insightful answers to developers. 
When asked for project ideas, always provide project titles, key features, recommended tech stacks, and step-by-step execution steps.
Format all your responses nicely using Markdown.`;

        const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (err) {
        console.error("AI Chat Error:", err);
        res.status(500).json({ message: "Error communicating with DevSpark AI: " + err.message });
    }
});

module.exports = aiRouter;
