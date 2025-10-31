# Render Deployment Guide - FIXED VERSION

## ⚠️ IMPORTANT: Directory Structure Fix

The error you're seeing happens because Render is looking for `package.json` in the wrong directory. Here's the **correct configuration**:

## Quick Fix Steps

### 1. In Render Dashboard
Go to your service settings and update these **exact** configurations:

- **Root Directory**: (leave completely empty - do not enter "backend")
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 2. Save and Redeploy
- Click "Save Changes"
- Go to "Deploys" tab
- Click "Deploy latest commit"

## Complete Deployment Steps

### 1. Setup MongoDB Atlas (if not done)
- Create a MongoDB Atlas account
- Create a new cluster
- Create a database user
- Get your connection string (MONGO_URI)
- **Important**: Whitelist all IPs (0.0.0.0/0) for Render

### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service with **these exact settings**:
   - **Name**: `bharatdigital-backend`
   - **Environment**: `Node`
   - **Root Directory**: (leave this field completely empty)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Branch**: `main`

### 3. Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bharatdigital
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 4. After Deployment
Once deployed successfully:
1. Your backend will be available at: `https://bharatdigital-backend.onrender.com`
2. Test the health endpoint: `https://bharatdigital-backend.onrender.com/api/health`
3. The database will need to be seeded (see Database Setup section)

## Database Setup

### Option 1: Automatic Seeding (Recommended for Testing)
Add this to your Render environment variables:
```
AUTO_SEED=sample
```

### Option 2: Manual Seeding
After deployment, you can seed the database by accessing your service and running:
1. Connect to your Render service terminal (if available)
2. Run: `npm run seed:sample` (for testing) or `npm run seed` (for full data)

### Option 3: Pre-seeded Database
Set up your MongoDB database locally, seed it, then use that connection string in Render.

## Troubleshooting

### Error: "Cannot find package.json"
**Cause**: Incorrect Root Directory setting
**Fix**: 
- Go to Render Settings
- Set Root Directory to empty (not "backend")
- Use Build Command: `cd backend && npm install`
- Use Start Command: `cd backend && npm start`

### Error: "Database connection failed"
**Cause**: MongoDB connection issues
**Fix**:
- Verify MONGO_URI environment variable
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0)
- Ensure database user has read/write permissions

### Error: "No data found"
**Cause**: Database is empty
**Fix**:
- Run database seeding: `npm run seed:sample`
- Or set AUTO_SEED=sample environment variable

## Testing Deployment

### 1. Health Check
```bash
curl https://bharatdigital-backend.onrender.com/api/health
```

### 2. Test API Endpoints
```bash
# Get states
curl https://bharatdigital-backend.onrender.com/api/states

# Get districts for a state
curl https://bharatdigital-backend.onrender.com/api/states/Uttar%20Pradesh/districts
```

### 3. Update Frontend
Update your Vercel environment variables:
```bash
VITE_API_BASE_URL=https://bharatdigital-backend.onrender.com/api
VITE_USE_MOCK_DATA=false
```

## Final Configuration Summary

✅ **Correct Render Settings:**
- Root Directory: (empty)
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

❌ **Incorrect Settings (causes the error):**
- Root Directory: backend
- Root Directory: src
- Build Command: npm install
- Start Command: npm start

The key is to leave Root Directory empty and use `cd backend &&` in the commands to navigate to the correct directory.