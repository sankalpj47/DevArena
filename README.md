<div align="center">

# DEV ARENA

Connect with developers, collaborate on real-world projects, and grow your software engineering career.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dev--arena--tau.vercel.app-00ff87?style=for-the-badge&logo=vercel&logoColor=black)](https://dev-arena-tau.vercel.app/login)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

### Auth & Profile
- JWT-based authentication with HTTP-only cookies
- Signup / Login / Forgot Password / Reset Password via email OTP
- Custom avatar picker or upload your own photo (Cloudinary)
- Skill tags, bio, GitHub & LinkedIn links

### Explore & Match
- Swipe-style developer discovery (like / ignore)
- Connection requests with accept / decline
- Instagram-style real-time notifications with accept/decline buttons
- Match when both developers like each other

### Real-Time Chat
- Socket.IO powered instant messaging
- Image sharing with WhatsApp-style crop & edit before sending
- Typing indicators & online status
- Code snippets with syntax highlighting in chat

### Dev AI
- AI-powered developer assistant (Groq LLaMA)
- AI Code Review — paste code, get instant feedback
- Resume Builder with AI suggestions

### Analytics & Social
- Profile view analytics & contribution graph
- Dev Score leaderboard
- Collab Board — post and find project collaborators
- Open Source Match — find projects that match your skills
- Hackathon listings
- Jobs board

### Fun Features
- Dev Games
- Dev DNA — personality analysis based on your stack
- Dev World Cup — bracket-style developer tournaments

### UI/UX
- Dark mode (default)
- Fully responsive design
- Smooth Framer Motion animations
- Click-anywhere-to-close dropdowns (no stacking bug)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6 |
| **Styling** | Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time** | Socket.IO |
| **Auth** | JWT, bcrypt, HTTP-only cookies |
| **Email** | Nodemailer (Gmail) |
| **Image Upload** | Cloudinary (unsigned preset, direct browser upload) |
| **AI** | Groq API (LLaMA 3.1) |
| **Security** | Helmet, express-rate-limit, CORS |

---

## Project Structure

```
DEV-ARENA/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT auth middleware
│   │   ├── models/
│   │   │   ├── user.js              # User schema
│   │   │   ├── connectionRequest.js # Match/request schema
│   │   │   └── other.js             # Messages, notifications etc.
│   │   ├── routes/
│   │   │   ├── auth.js              # Login, signup, password reset
│   │   │   ├── profile.js           # Profile CRUD
│   │   │   ├── features.js          # Requests, matches, chat, feed
│   │   │   └── other.js             # Notifications, analytics, jobs
│   │   └── app.js                   # Express + Socket.IO entry point
│   ├── uploads/                     # Local upload temp folder
│   └── .env                         # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationsPanel.jsx
│   │   │   ├── VideoCallModal.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTheme.js
│   │   ├── utils/
│   │   │   ├── constants.js         # BASE_URL, API keys (from .env)
│   │   │   └── store.js             # Redux store
│   │   └── index.css                # Global styles & CSS variables
│   ├── vite.config.js               # Vite dev server + proxy config
│   └── .env                         # Frontend environment variables
```

---

## Prerequisites

Make sure you have these installed before starting:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** — either:
  - Local: [Install MongoDB Community](https://www.mongodb.com/try/download/community), OR
  - Cloud: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sankalpj47/DevArena.git
cd DevArena
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend — `backend/.env`

Create a file named `.env` inside the `backend/` folder:

```env
# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/devArena
# For MongoDB Atlas use:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devArena

# JWT secret — use any long random string
JWT_SECRET=your_random_secret_key_here

# Port for backend server
PORT=4000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# Gmail account for sending OTP emails
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# App display name
APP_NAME=DevArena

# Cloudinary (get free account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **How to get Gmail App Password:**
> Go to your Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

> **How to get Cloudinary credentials:**
> Sign up free at [cloudinary.com](https://cloudinary.com) → Dashboard → Cloud Name. Then Settings → Upload → Add upload preset (set to "Unsigned")

---

### Frontend — `frontend/.env`

Create a file named `.env` inside the `frontend/` folder:

```env
# Backend URL
VITE_BASE_URL=http://localhost:4000

# Groq AI key — get FREE at console.groq.com
VITE_GROQ_API_KEY=your_groq_api_key_here

# Cloudinary (same values as backend)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **How to get Groq API key:**
> Go to [console.groq.com](https://console.groq.com) → Sign up free → API Keys → Create Key

---

## Running the App

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will start at: `http://localhost:4000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will open at: `http://localhost:3001`

---

### Build for Production

```bash
# Build frontend
cd frontend
npm run build
# Output goes to frontend/dist/

# Start backend in production
cd backend
npm start
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login & get JWT cookie |
| POST | `/logout` | Clear session |
| POST | `/forgot-password` | Send OTP to email |
| POST | `/reset-password` | Reset with OTP |
| GET | `/profile/view` | Get own profile |
| PATCH | `/profile/edit` | Update profile |
| GET | `/feed` | Get developer feed |
| POST | `/request/send/:status/:userId` | Send like/ignore request |
| POST | `/request/review/:status/:requestId` | Accept/reject request |
| GET | `/user/connections` | Get all connections |
| GET | `/user/requests/received` | Get pending requests |
| GET | `/messages/:userId` | Fetch chat history |
| POST | `/messages/:userId` | Send message |
| GET | `/notifications` | Get all notifications |
| PATCH | `/notifications/read` | Mark all as read |

---

## Deployment

### Backend — Render

The backend is deployed manually via the Render dashboard (no `render.yaml` required).

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and click **New → Web Service**.
3. Connect your GitHub repository and select the `backend/` folder as the root directory (or set the root directory to `backend` in the service settings).
4. Configure the service:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all backend environment variables under **Settings → Environment**.
6. Click **Deploy**.

Your backend URL will look like: `https://your-service-name.onrender.com`

---

### Frontend — Vercel

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

Or connect your GitHub repo directly in the Vercel dashboard and set the root directory to `frontend/`.

Set `VITE_BASE_URL` to your Render backend URL in Vercel's environment variable settings.

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

Made with love by [Sankalp Joshi](https://github.com/sankalpj47)

Star this repo if you found it useful!

</div>
