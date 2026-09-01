# 🚀 DevTinder API — Where Code Meets Its Match (Backend)

Welcome to the backend repository for **DevTinder**, a full-stack developer networking platform. This robust Node.js/Express API powers the core functionality of DevTinder, utilizing a modern tech stack to handle everything from real-time WebSockets to AI-generated content.

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **WebSockets:** Socket.io
- **AI Integration:** `@google/generative-ai` (Gemini 3.6 Flash)
- **Security:** `jsonwebtoken`, `bcrypt`, `cookie-parser`, `validator`
- **Cloud & Automation:** Cloudinary, Nodemailer, `node-cron`

---

## ✨ Detailed Feature Breakdown

### 1. 🔐 Advanced Authentication & Session Management
Security is handled completely server-side to prevent client-side tampering. 
*   **Password Hashing:** User passwords are encrypted utilizing `bcrypt` before database insertion.
*   **JWT & HTTP-Only Cookies:** Upon login, a JSON Web Token (JWT) is generated and securely attached to an HTTP-Only cookie. This prevents Cross-Site Scripting (XSS) attacks, as the token cannot be accessed via JavaScript on the frontend.
*   **Data Validation:** Strict sanitization and validation of all incoming payload data using `validator.js` to prevent NoSQL injection and malformed data.

### 2. 🧠 DevSpark AI Engine (Profile & Chat)
Integrated with **Google Gemini AI (3.6 Flash)** to act as a built-in assistant for developers across the platform.
*   **AI Profile Enhancer:** When a user updates their profile, the backend takes their raw skills/notes and uses a specialized prompt to return a highly polished, professional developer bio and headline in strict JSON format.
*   **DevSpark AI Chat Assistant:** A dedicated `/chat/ai` endpoint allows users to converse directly with an AI expert. The model is system-prompted to provide concise, accurate architectural advice and can generate full project ideas complete with titles, tech stacks, and step-by-step execution plans.

### 3. 🐙 GitHub Profile Integration
Because developers live on GitHub, the backend integrates directly with the GitHub API to enrich user profiles.
*   **Automated Data Fetching:** The `/profile/github/:userId` endpoint retrieves real-time data from a user's linked GitHub account (repositories, stats, etc.).
*   **Smart Caching Mechanism:** To avoid hitting rate limits and improve response times, the backend caches the fetched GitHub data in MongoDB and only triggers a fresh fetch if the cached data is older than 90 days.

### 4. 🔁 4-State Connection Engine (Swipe Logic)
To emulate a modern swipe-based app, the backend utilizes a state-machine architecture for user connections:
*   **States:** `ignored` (swiped left), `interested` (swiped right), `accepted` (mutual match), and `rejected`.
*   **Conflict Prevention:** Robust database querying ensures that duplicate connection requests cannot be created, and users cannot send requests to themselves or to users they have already interacted with.

### 5. 🧭 Smart Feed Algorithm
The `/user/feed` endpoint is responsible for delivering relevant developers to the user.
*   It dynamically filters the entire database of users.
*   It automatically excludes: the logged-in user, users who have been `ignored`, users who the current user is already `interested` in, and users who are already `accepted` or `rejected`.
*   This ensures the feed is always fresh and never shows repeated profiles.

### 6. 💬 Real-Time Communication
Once two developers reach the `accepted` state, the chat functionality unlocks.
*   Powered by **Socket.io**, the backend establishes a persistent WebSocket connection with authenticated clients.
*   Messages are emitted and broadcasted in real-time between matched users, facilitating instant collaboration.

### 7. ☁️ Cloud Media & Automations
*   **Cloudinary Integration:** Profile images are uploaded via memory streams (`multer` + `streamifier`) directly to Cloudinary, ensuring the Node server isn't bogged down by local file storage.
*   **Scheduled Cron Jobs:** Utilizes `node-cron` for running background tasks, and `Nodemailer` for dispatching transactional emails or notifications.

---
*Built with ❤️ by Pranav Gawande*
