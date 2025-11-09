# CollabSync Environment Variables Template
# Copy this file to .env and fill in your values

# ===========================================
# FRONTEND ENVIRONMENT VARIABLES (.env in root)
# ===========================================

# Backend API URL
# For local development, use: http://localhost:5000
# For production, use your Render backend URL: https://your-app.onrender.com
REACT_APP_API_URL=http://localhost:5000

# ===========================================
# BACKEND ENVIRONMENT VARIABLES (backend/.env)
# ===========================================

# Node Environment (development or production)
NODE_ENV=development

# Server Port
PORT=5000

# MongoDB Connection String
# Get this from MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/collabsync?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret Key
# Generate a secure random string (64+ characters recommended)
# Use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_here_change_in_production

# JWT Expiration Time
JWT_EXPIRE=30d

# Frontend URL (for CORS)
# For local development: http://localhost:3000
# For production: https://your-app.vercel.app
FRONTEND_URL=http://localhost:3000

# ===========================================
# OPTIONAL: EMAIL CONFIGURATION (for notifications)
# ===========================================

# Email Service (e.g., gmail, outlook)
EMAIL_SERVICE=gmail

# Your email address
EMAIL_USER=your-email@gmail.com

# App-specific password (not your regular password)
# For Gmail: https://support.google.com/accounts/answer/185833
EMAIL_PASS=your_app_specific_password

# ===========================================
# DEPLOYMENT NOTES
# ===========================================

# For Render (Backend):
# Add these environment variables in Render Dashboard → Environment tab
# Required: NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE, FRONTEND_URL
# Optional: EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS

# For Vercel (Frontend):
# Add these environment variables in Vercel Dashboard → Settings → Environment Variables
# Required: REACT_APP_API_URL

# IMPORTANT SECURITY NOTES:
# 1. Never commit .env files to git
# 2. Use strong, unique JWT_SECRET (64+ characters)
# 3. Use MongoDB connection string with strong password
# 4. For email, use app-specific passwords, not your main password
# 5. In production, set NODE_ENV=production

# ===========================================
# QUICK START
# ===========================================

# 1. Copy this file:
#    cp .env.example .env
#    cp .env.example backend/.env

# 2. Fill in your MongoDB URI from MongoDB Atlas

# 3. Generate JWT_SECRET:
#    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 4. Start development:
#    Backend: cd backend && npm start
#    Frontend: npm start

# 5. For deployment, see DEPLOYMENT_GUIDE.md
