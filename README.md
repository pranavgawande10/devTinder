# 🚀 DevTinder — Where Code Meets Its Match

DevTinder is a **full-stack developer networking platform** inspired by swipe-based apps.  
It helps developers discover, connect, and collaborate with other developers for **projects, hackathons, mentorship, and startups**.

---

## ✨ Features

### 👤 Developer Profiles
- Create and manage detailed profiles
- Add skills (MERN, Python, DevOps, etc.)
- Bio, profile photo, and personal details

### 🔐 Secure Authentication
- Signup & Login using **JWT**
- JWT stored in **HTTP-only cookies**
- Password hashing with **bcrypt**
- Input validation using **Validator.js**

### 🧭 Smart Discovery Feed
- Shows only **new and relevant developers**
- Automatically hides:
  - Ignored users
  - Already interacted users
  - Accepted or rejected connections

### 🔁 Connection System (State-Based)

DevTinder uses a **clear connection state machine** to manage interactions:

| State       | Description |
|------------|-------------|
| `ignored`  | User dismissed the profile |
| `interested` | Connection request sent |
| `accepted` | Both users connected |
| `rejected` | Request declined |

### 🧠 Connection Logic
- Prevents duplicate requests
- Avoids spam
- Ensures clean user experience
- Easily scalable for future features (chat, recommendations)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Redux Toolkit

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Tokens)
- Cookie-Parser
- bcrypt
- Validator.js

---

## 🏗️ System Architecture

```text
Client (React + Redux)
        ↓
Express API (Node.js)
        ↓
Auth & Validation Middleware
        ↓
MongoDB (Users & Connections)
