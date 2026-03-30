# Deployment Guide for StudyHub Backend

This backend is now configured for production deployment. Follow these steps to deploy:

## 1. Prerequisites
- A **Firebase Project** (Console: [firebase.google.com](https://firebase.google.com))
- A hosting platform for Node.js (e.g., Render, Railway, or VPS)
- (Optional but recommended) [Cloudinary](https://cloudinary.com) for persistent image/file storage.

## 2. Environment Variables
Ensure the following variables are set in your hosting platform:

| Variable | Description |
| :--- | :--- |
| `FIREBASE_DATABASE_URL` | The URL of your Realtime Database (found in Firebase Console) |
| `FIREBASE_SERVICE_ACCOUNT` | **The MOST IMPORTANT:** The stringified JSON of your Firebase Service Account Private Key. (More details below) |
| `FRONTEND_URL` | URL of your deployed frontend |
| `NODE_ENV` | `production` |

### How to get the `FIREBASE_SERVICE_ACCOUNT` string:
1. Go to your **Firebase Project Settings** -> **Service Accounts**.
2. Click **"Generate New Private Key"**. This will download a `.json` file.
3. Open that `.json` file, copy everything, and paste it into a JSON stringifier or just directly into the environment variable field of your hosting provider.

### Email (For Verification):
| Variable | Description |
| :--- | :--- |
| `EMAIL_USER` | Your Gmail address (if using Gmail) |
| `EMAIL_PASS` | Your Gmail **App Password** (not your regular password) |

## 3. Storage Note
The current implementation uses **local storage** for file uploads (notes and memes). 

> [!WARNING]
> Platforms like **Vercel**, **Render (Free Tier)**, and **Heroku** have "ephemeral" storage. Files uploaded to `server/uploads/` will be **deleted** when the server restarts or re-deploys.
> 
> **To fix this for production:** You should update the upload logic to use Cloudinary. I have included placeholders for Cloudinary keys in `.env.example`.

## 4. Deployment Steps

### On Render / Railway:
1. Connect your GitHub repository.
2. Select the `server` directory as the root (or set the root to `server`).
3. Set the build command to: `npm install`
4. Set the start command to: `npm start`
5. Add the environment variables listed above.

## 5. Health Check
Once deployed, you can verify it's working by visiting:
`https://your-backend-url.com/health`
