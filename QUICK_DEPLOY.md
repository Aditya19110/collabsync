# CollabSync - Quick Deployment Guide

Fast-track deployment guide for experienced developers.

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository ready
- [ ] MongoDB Atlas account
- [ ] Render account
- [ ] Vercel account

---

## ⚡ Quick Steps

### 1. MongoDB Atlas (5 mins)

```bash
1. Create free M0 cluster at https://www.mongodb.com/cloud/atlas
2. Create database user (save credentials)
3. Whitelist IP: 0.0.0.0/0
4. Get connection string:
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/collabsync?retryWrites=true&w=majority
```

### 2. Deploy Backend to Render (10 mins)

```bash
1. Go to https://dashboard.render.com
2. New → Web Service → Connect GitHub repo
3. Configure:
   - Name: collabsync-backend
   - Root Directory: backend
   - Build: npm install
   - Start: npm start
   
4. Add Environment Variables:
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<generate_random_string>
   JWT_EXPIRE=30d
   FRONTEND_URL=https://your-app.vercel.app (update later)
   
5. Create Web Service
6. Save your backend URL: https://your-app.onrender.com
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Deploy Frontend to Vercel (5 mins)

```bash
# Option A: Dashboard
1. Go to https://vercel.com/dashboard
2. New Project → Import your GitHub repo
3. Root Directory: . (leave as root)
4. Framework: Create React App (auto-detected)
5. Add Environment Variable:
   REACT_APP_API_URL=https://your-backend.onrender.com
6. Deploy

# Option B: CLI
npm install -g vercel
cd /path/to/collabsync
vercel
# Follow prompts
vercel --prod
```

### 4. Update Backend CORS (2 mins)

```bash
1. Go back to Render Dashboard
2. Open your backend service
3. Environment tab
4. Update FRONTEND_URL to your Vercel URL
5. Save (auto-redeploys)
```

---

## 🧪 Quick Test

### Backend
```bash
curl https://your-backend.onrender.com
# Should return: {"message":"Welcome to CollabSync API"}
```

### Frontend
1. Open your Vercel URL
2. Register a new account
3. Create a board
4. Create a list
5. Add a task
6. Test drag & drop

---

## 🔧 Environment Variables Reference

### Render (Backend)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/collabsync?retryWrites=true&w=majority
JWT_SECRET=your_64_char_random_string
JWT_EXPIRE=30d
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS Error | Update `FRONTEND_URL` in Render to match Vercel URL exactly |
| Backend 503 | Wait 30-60s (free tier spin-up) |
| MongoDB Error | Check connection string format and IP whitelist |
| JWT Error | Clear localStorage, register new user |
| Socket.IO Not Working | Verify `REACT_APP_API_URL` includes `https://` |

---

## 📦 Deployment Files

Your project includes:

**`vercel.json`** - Vercel configuration (already configured)
```json
{
  "version": 2,
  "builds": [{"src": "package.json", "use": "@vercel/static-build"}],
  "routes": [{"src": "/(.*)", "dest": "/index.html"}]
}
```

**`render.yaml`** - Render Blueprint (optional, manual setup recommended)

---

## 🚀 URLs After Deployment

**Backend (Render):**
- URL: `https://collabsync-backend-xxxx.onrender.com`
- Health: `https://collabsync-backend-xxxx.onrender.com/`
- API Docs: See README.md

**Frontend (Vercel):**
- URL: `https://collabsync-xxxx.vercel.app`
- Custom domain: Configure in Vercel settings

---

## 📊 Deployment Status

- [x] Code cleanup complete
- [x] Build tested (139.46 kB gzipped)
- [x] Professional styling applied
- [x] Configuration files ready
- [x] Deployment guides created

**Total Time:** ~20 minutes
**Cost:** Free (with limitations) or ~$7/month

---

## 📚 Full Documentation

For detailed step-by-step guide with screenshots, see:
**[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

**Ready to deploy!** 🎉

Follow the steps above, and your CollabSync app will be live in under 30 minutes!
