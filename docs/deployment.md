# Deployment Checklist

## 1) Setup infrastructure
- MongoDB Atlas (or self-hosted): create database and credentials
- Node.js server VM / container
- Static hosting for React (Netlify/Vercel) or same Node app

## 2) Environment
- Set production environment variables:
  - `MONGODB_URI`
  - `SECRET_KEY`
  - `PORT`
  - `HF_TOKEN` (Hugging Face API key)
  - Email settings for `sendEmail` (SMTP host/user/pass)

## 3) Backend
- `npm install` in `backend`
- `npm run start` (or `node server.js`)
- Ensure CORS supports frontend origin

## 4) Frontend
- `npm install` in `frontend`
- `npm run build`
- Serve `dist` with static host or from Node via middleware (if added)
- In production, update `src/api/axios.js` `baseURL` to deployed backend URL.

## 5) Security
- Use HTTPS
- Protect `SECRET_KEY` and tokens
- Use rate limiting (not in current code, recommended)

## 6) Monitoring and maintenance
- Logs for errors in middleware
- Health-check endpoint (not currently present, add `/health`)
- Backup MongoDB regularly
