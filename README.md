🚀 DevTinder: Where Code Meets Its Match
DevTinder is a full-stack networking application designed specifically for developers. Much like a dating app, it allows users to discover other developers, view their technical stacks, and "swipe" to connect for project collaborations, hackathons, or mentorship.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Redux Toolkit

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT (JSON Web Tokens) & Cookie-parser

Validation: Validator.js & B-crypt for password hashing

✨ Key Features
User Profiles: Detailed profiles showcasing skills (e.g., MERN, Python, DevOps) and a "bio."

Secure Auth: Robust Signup/Login system using JWT stored in secure cookies.

The Feed: An intelligent discovery feed that hides already "swiped" or "ignored" users.

Connection Logic: * Ignore: Dismiss profiles you aren't interested in.

Interested: Send a connection request.

Matched: If both users show interest, they become a "Match."

Profile Management: Edit skills, photos, and personal details via a secure dashboard.

🏗️ System Architecture
The application follows a standard Client-Server architecture:

Client: Handles UI/UX and stores user state via Redux.

API (Express): Manages routing, business logic, and database interactions.

Middleware: Validates JWT tokens on every protected route to ensure the user is authenticated.

Database (MongoDB): Stores User data and a "Connection Request" collection to track interactions.

🚀 Getting Started
Prerequisites
Node.js (v18+)

MongoDB Atlas account or local MongoDB

NPM or Yarn
