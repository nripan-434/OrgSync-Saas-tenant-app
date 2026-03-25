# Installation Guide

## Prerequisites
- Node.js >= 18
- npm
- MongoDB (local instance or atlas)
- In production: set `.env` values including `MONGODB_URI`, `SECRET_KEY`, `PORT`, `HF_TOKEN`, and SMTP settings for email.

## Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` (if present) and set:
   - `MONGODB_URI` (e.g., `mongodb://localhost:27017/aiSaasTenant`)
   - `SECRET_KEY` (JWT secret)
   - `PORT` (e.g., `5000`)
   - `HF_TOKEN` (Hugging Face API token)
   - Optional: SMTP env variables for `sendEmail` workflow
4. `npm run start` (uses `nodemon server.js`)

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Default backend base URL is `http://localhost:5000` in `src/api/axios.js`.

## Environment Variables (backend)
- `MONGODB_URI`
- `SECRET_KEY`
- `PORT`
- `HF_TOKEN`
- (MAIL variables if using email invites)

## Quick check
- Backend: `GET /` is not defined; verify with explicit endpoints.
- Postman/Insomnia: login register via `http://localhost:5000/auth/register` and `.../auth/login`.
