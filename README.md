# Learnmist LMS

Learnmist LMS is a full-stack learning management system where students can discover and enroll in courses, and educators can create and manage course content.

## Live Demo

https://learnmist-lms-1.onrender.com/

## Project Overview

This repository contains:
- **Frontend**: React + Vite application (`/frontend`)
- **Backend**: Express + MongoDB API (`/backend`)

The app supports authentication, course publishing, lecture delivery, payments, reviews, and AI-assisted course search.

## Main Features

- User authentication with email/password and Google sign-up
- Email verification OTP and password reset OTP flow
- Role-based access for **student** and **educator**
- Educator course management (create/edit/delete courses and lectures)
- Published course listing and course detail/lecture views
- Free enrollment and paid enrollment (Razorpay)
- Course reviews by enrolled users
- User profile update and account deletion
- AI-assisted course search (`/api/ai/search`)

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Redux Toolkit + React Redux
- Tailwind CSS
- Axios
- Firebase Auth (Google provider)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Cloudinary (media uploads via Multer)
- Nodemailer (OTP emails)
- Razorpay (payments)
- Google GenAI SDK (AI search)
- Helmet, CORS, express-rate-limit

## Frontend Setup (`/frontend`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env`:
   ```env
   VITE_SERVER_URL=http://localhost:8000
   VITE_FIREBASE_APIKEY=your_firebase_api_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Backend Setup (`/backend`)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env`:
   ```env
   PORT=8000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173

   EMAIL=your_email
   EMAIL_PASS=your_email_password

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret

   GEMINI_API_KEY=your_gemini_api_key
   ```
   > `GOOGLE_API_KEY` is also accepted by the AI controller as an alternative to `GEMINI_API_KEY`.
3. Start backend server:
   ```bash
   npm run dev
   ```

## Project Structure

```text
Learnmist-LMS/
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── customHooks/
    │   ├── pages/
    │   └── redux/
    └── utils/
```

## How to Run Locally

1. Start backend (port `8000`):
   ```bash
   cd backend
   npm run dev
   ```
2. In a new terminal, start frontend (port `5173`):
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173`.

