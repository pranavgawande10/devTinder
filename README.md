# 🚀 DevTinder API — Microservices Architecture (Backend)

> ⚠️ **Microservices Architecture:** This repository contains the Node.js/Express Backend API service. The decoupled React.js Frontend service can be found here: [👉 DevTinder-Web Repository](https://github.com/pranavgawande10/devTinder-web)

Welcome to the backend service for **DevTinder**, a full-stack developer networking platform. This API is designed using a **microservices-oriented approach**, where core domains (Authentication, User Feed, Chat, AI integrations) are highly modularized, decoupled from the frontend, and designed for independent scalability.

## 🏗️ Architectural Overview
- **Decoupled Services:** Strict separation of concerns between the React client and Node API.
- **Modular Domains:** Routing and business logic are isolated by feature (`auth`, `profile`, `chat`, `ai`), making it trivial to spin them out into independent Docker containers in the future.
- **Stateless Authentication:** JWT-based auth ensures the API remains stateless, a crucial requirement for horizontally scaling microservices.

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **WebSockets:** Socket.io
- **AI Integration:** `@google/generative-ai` (Gemini 3.6 Flash)
- **Security:** `jsonwebtoken`, `bcrypt`, `cookie-parser`, `validator`
- **Cloud & Automation:** Cloudinary, Nodemailer, `node-cron`

---

## ✨ Detailed Feature Breakdown

### 1. 🔐 Advanced Authentication Service
Security is handled completely server-side to prevent client-side tampering. 
*   **Stateless JWT:** Generates JSON Web Tokens secured in HTTP-Only cookies to prevent XSS attacks while allowing the API to scale without session memory.
*   **Password Hashing:** User passwords are encrypted utilizing `bcrypt`.
*   **Data Validation:** Strict sanitization using `validator.js`.

### 2. 🧠 DevSpark AI Engine (Profile & Chat)
Integrated with **Google Gemini AI (3.6 Flash)** to act as a built-in assistant for developers.
*   **AI Profile Enhancer:** Takes raw skills/notes and returns a highly polished, professional developer bio and headline in strict JSON format.
*   **DevSpark AI Chat Assistant:** A dedicated `/chat/ai` endpoint allows users to converse directly with an AI expert to generate full project ideas and execution plans.

### 3. 🐙 GitHub Profile Integration
*   **Automated Data Fetching:** Retrieves real-time data from a user's linked GitHub account.
*   **Smart Caching Mechanism:** Caches fetched GitHub data in MongoDB and only triggers a fresh fetch if the cached data is older than 90 days, reducing external API loads.

### 4. 🔁 Connection & Matching Engine
A state-machine architecture for user connections:
*   **States:** `ignored`, `interested`, `accepted`, and `rejected`.
*   **Conflict Prevention:** Robust database querying ensures duplicate requests cannot be created.

### 5. 🧭 Smart Discovery Feed
The `/user/feed` endpoint delivers relevant developers to the user.
*   Dynamically filters the database, automatically excluding: the logged-in user, and users already interacted with.
*   Optimized aggregation queries ensure high performance even as the user base grows.

### 6. 💬 Real-Time Communication Service
*   Powered by **Socket.io**, establishing a persistent WebSocket connection.
*   Messages are broadcasted in real-time between mutually `accepted` users.

### 7. ☁️ Cloud Media & Automations
*   **Cloudinary Integration:** Profile images are uploaded via memory streams (`multer` + `streamifier`) directly to Cloudinary.
*   **Scheduled Cron Jobs:** Utilizes `node-cron` for running background tasks and `Nodemailer` for transactional emails.

---
*Built with ❤️ by Pranav Gawande*
