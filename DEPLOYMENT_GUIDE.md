# CollabSync Deployment Guide

Complete step-by-step guide to deploy CollabSync on Render (Backend) and Vercel (Frontend).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- [x] GitHub account
- [x] Render account (https://render.com)
- [x] Vercel account (https://vercel.com)
- [x] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [x] Your code pushed to GitHub repository

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create a free account
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
5. Select your preferred **cloud provider** and **region**
6. Click **"Create Cluster"**

### Step 2: Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `collabsync-admin`)
5. Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Set **"Database User Privileges"** to **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Or add specific IPs: `0.0.0.0/0` (all IPs)
5. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your saved password
7. Add database name before `?`: 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/collabsync?retryWrites=true&w=majority
   ```

---

## Backend Deployment (Render)

### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub
2. Make sure `backend/package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if not already connected)
4. Find and select your **collabsync** repository
5. Click **"Connect"**

### Step 3: Configure Service Settings

Fill in the following details:

**Basic Settings:**
- **Name:** `collabsync-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Choose **"Free"** for testing (spins down with inactivity)
- Or **"Starter"** for production ($7/month, always on)

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

```
NODE_ENV = production

PORT = 5000

MONGODB_URI = your_mongodb_connection_string_from_above

JWT_SECRET = your_secure_random_string_here

JWT_EXPIRE = 30d

FRONTEND_URL = https://your-app-name.vercel.app
```

**Important Notes:**
- Replace `MONGODB_URI` with your MongoDB Atlas connection string
- Generate a strong `JWT_SECRET`: Use a random string generator or run:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Leave `FRONTEND_URL` as placeholder for now (we'll update it after Vercel deployment)

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://collabsync-backend.onrender.com`
4. **SAVE THIS URL** - you'll need it for frontend deployment

### Step 6: Verify Backend

1. Open your backend URL in browser: `https://collabsync-backend.onrender.com`
2. You should see: `{"message":"Welcome to CollabSync API"}`
3. Check logs in Render dashboard for: `MongoDB Connected: cluster0...`

---

## Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

1. Make sure you have the backend URL from Render
2. Your repository should be pushed to GitHub

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your **collabsync** repository
5. Click **"Import"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project root
cd /path/to/collabsync

# Deploy
vercel
```

### Step 3: Configure Project Settings

**Framework Preset:** Vercel should auto-detect **"Create React App"**

**Root Directory:** Leave as `.` (root) or select the root folder

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
REACT_APP_API_URL = https://collabsync-backend.onrender.com
```

**Important:** Replace with your actual Render backend URL!

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once complete, you'll get a URL like: `https://collabsync.vercel.app`
4. **SAVE THIS URL**

### Step 6: Update Backend CORS

Now go back to **Render Dashboard**:

1. Open your backend service
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL = https://collabsync.vercel.app
   ```
4. Click **"Save Changes"**
5. Wait for backend to redeploy (automatic)

---

## Testing & Verification

### Backend Health Check

1. Visit: `https://your-backend-url.onrender.com`
2. Expected response:
   ```json
   {"message":"Welcome to CollabSync API"}
   ```

### Frontend Testing

Visit your Vercel URL and test:

1. **Registration Flow:**
   - Navigate to Register page
   - Create a new account
   - Should redirect to dashboard

2. **Login Flow:**
   - Log in with created account
   - Should see dashboard with boards

3. **Create Board:**
   - Click "Create New Board"
   - Enter board name
   - Board should appear

4. **Create List:**
   - Open a board
   - Click "Add List"
   - List should be created

5. **Create Task:**
   - Click "Add Task" in a list
   - Enter task details
   - Task should appear

6. **Drag & Drop:**
   - Try dragging tasks between lists
   - Should work smoothly

7. **Real-time Updates:**
   - Open same board in two browser tabs
   - Create a task in one tab
   - Should appear in other tab (Socket.IO working)

### Check Browser Console

Open Developer Tools (F12) and check:
- No CORS errors
- Socket.IO connection established
- No authentication errors

### Check Render Logs

In Render Dashboard → Your Service → Logs:
- Look for: `MongoDB Connected: cluster0...`
- Look for: `Server running on port 5000`
- No error messages

---

## Troubleshooting

### Issue: CORS Error in Frontend

**Symptom:** Browser console shows CORS policy error

**Solution:**
1. Check `FRONTEND_URL` in Render matches exactly your Vercel URL
2. No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
3. Include `https://`: ✅ `https://app.vercel.app` ❌ `app.vercel.app`
4. Save and wait for Render to redeploy

### Issue: Backend Not Responding

**Symptom:** 503 Service Unavailable or timeout

**Solution:**
1. Check Render logs for errors
2. If using Free tier, service may be spinning up (wait 30-60 seconds)
3. Verify MongoDB connection string is correct
4. Check if MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue: MongoDB Connection Failed

**Symptom:** Backend logs show "MongoError" or "connection timeout"

**Solution:**
1. Verify `MONGODB_URI` is correctly formatted:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/collabsync?retryWrites=true&w=majority
   ```
2. Check username/password are correct (no special characters that need encoding)
3. Verify MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)
4. Check database user has read/write permissions

### Issue: JWT Authentication Errors

**Symptom:** "Invalid token" or "Not authorized" errors

**Solution:**
1. Clear browser localStorage
2. Check `JWT_SECRET` is set in Render environment variables
3. Try registering a new user
4. Verify JWT_SECRET is a strong random string

### Issue: Socket.IO Not Connecting

**Symptom:** Real-time updates not working

**Solution:**
1. Check browser console for Socket.IO errors
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Check if backend logs show WebSocket connections
4. Clear browser cache and reload

### Issue: API Not Found (404)

**Symptom:** API requests return 404

**Solution:**
1. Verify `REACT_APP_API_URL` includes `https://`
2. Check API URL doesn't have trailing slash
3. Test backend directly in browser: `https://your-backend.onrender.com`
4. Redeploy Vercel with correct environment variable

### Issue: Build Failed on Vercel

**Symptom:** Deployment fails during build

**Solution:**
1. Check Vercel build logs for specific error
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node version compatibility (Vercel uses Node 18 by default)

### Issue: React Version Conflict on Render/Vercel

**Symptom:** `npm error ERESOLVE could not resolve` - React version conflict with react-beautiful-dnd

**Solution:**
This has been fixed in the project. The package.json uses React 18 which is compatible with all dependencies.

If you encounter this issue:
1. Ensure `package.json` shows React 18.2.0 (not 19.x):
   ```json
   "react": "^18.2.0",
   "react-dom": "^18.2.0"
   ```
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Commit and push changes to trigger redeploy

### Issue: Render Free Tier Spinning Down

**Symptom:** First request takes 30-60 seconds

**Solution:**
1. This is expected behavior for free tier
2. Upgrade to Starter plan ($7/month) for always-on service
3. Or use a service like UptimeRobot to ping your backend every 14 minutes

---

## Post-Deployment Steps

### 1. Custom Domain (Optional)

**For Frontend (Vercel):**
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Backend (Render):**
1. In Render Dashboard → Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

### 2. Set Up Monitoring

**Backend Monitoring:**
- Use Render's built-in metrics
- Set up uptime monitoring (UptimeRobot, Pingdom)

**Frontend Monitoring:**
- Vercel automatically monitors performance
- Set up error tracking (Sentry)

### 3. Environment Variables Update

If you add custom domains, update:
- `FRONTEND_URL` in Render to new frontend domain
- `REACT_APP_API_URL` in Vercel to new backend domain

### 4. Security Checklist

- [x] MongoDB IP whitelist configured
- [x] Strong JWT_SECRET generated
- [x] CORS only allows your frontend URL
- [x] Environment variables not committed to git
- [x] Database user has minimal required permissions

---

## Quick Reference

### Render Backend

**URL:** `https://your-app.onrender.com`

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel Frontend

**URL:** `https://your-app.vercel.app`

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Useful Commands

**Redeploy Vercel:**
```bash
vercel --prod
```

**View Vercel Logs:**
```bash
vercel logs
```

**Test Backend Locally:**
```bash
cd backend
npm start
```

**Test Frontend Locally:**
```bash
npm start
```

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)

---

## Support

If you encounter issues not covered in this guide:

1. Check Render logs for backend errors
2. Check Vercel deployment logs
3. Check browser console for frontend errors
4. Verify all environment variables are correct
5. Test each component independently

---

**Deployment Status:** 🚀 Ready to Deploy!

**Estimated Total Time:** 30-45 minutes

**Cost:**
- MongoDB Atlas: Free (M0 tier)
- Render: Free or $7/month (Starter)
- Vercel: Free (Hobby tier)

Good luck with your deployment! 🎉
