# Deployment Guide for Intent Clarifier

This guide covers deploying your Intent Clarifier application to various platforms.

## Overview

The Intent Clarifier is a full-stack application with:
- **Frontend**: React app (can be deployed to GitHub Pages, Vercel, or Netlify)
- **Backend**: Node.js/Express server (can be deployed to Railway, Render, or Heroku)

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **API Keys**: You'll need Anthropic API key for the backend
3. **Environment Variables**: Set up production environment variables

## Frontend Deployment Options

### Option 1: GitHub Pages (Recommended for this project)

1. **Enable GitHub Pages**:
   - Go to your GitHub repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **The GitHub Actions workflow is already configured** in `.github/workflows/deploy-frontend.yml`
   - It will automatically build and deploy your React app
   - Your app will be available at `https://tracyyyleung.github.io/unpack`

3. **Update API URL**:
   - The frontend will automatically use the production backend URL
   - Make sure your backend is deployed first

### Option 2: Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `client` folder as root directory

2. **Configure Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

3. **Deploy**: Vercel will automatically deploy on every push to main

## Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will detect the Node.js app

2. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5001
   ANTHROPIC_API_KEY=your_anthropic_api_key
   FRONTEND_URL=https://tracyyyleung.github.io/unpack
   ```

3. **Deploy**: Railway will automatically deploy on every push to main

### Option 2: Render

1. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure Service**:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment: Node

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5001
   ANTHROPIC_API_KEY=your_anthropic_api_key
   FRONTEND_URL=https://tracyyyleung.github.io/unpack
   ```

### Option 3: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ANTHROPIC_API_KEY=your_anthropic_api_key
   heroku config:set FRONTEND_URL=https://tracyyyleung.github.io/unpack
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

## Complete Deployment Steps

### Step 1: Deploy Backend First

1. Choose a backend platform (Railway recommended)
2. Connect your GitHub repository
3. Set the required environment variables
4. Deploy and note the backend URL

### Step 2: Update Frontend Configuration

1. Update the backend URL in your frontend configuration
2. If using GitHub Pages, the workflow will handle this automatically
3. If using Vercel/Netlify, update the environment variables

### Step 3: Deploy Frontend

1. Choose a frontend platform (GitHub Pages recommended for this project)
2. Configure the deployment
3. Test the complete application

## Environment Variables Reference

### Backend (Server)
```
NODE_ENV=production
PORT=5001
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FRONTEND_URL=https://tracyyyleung.github.io/unpack
```

### Frontend (Client)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Testing Your Deployment

1. **Backend Health Check**: Visit `https://your-backend-domain.com/api/health`
2. **Frontend**: Visit your frontend URL
3. **Full Flow**: Test the complete application flow

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **API Key Issues**: Verify your Anthropic API key is valid
3. **Build Failures**: Check that all dependencies are installed
4. **Environment Variables**: Ensure all required variables are set

### Debugging

1. **Check Logs**: Most platforms provide logs in their dashboard
2. **Test Locally**: Use `npm run build-and-start` to test production build locally
3. **Health Check**: Use the `/api/health` endpoint to verify backend is running

## Security Considerations

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** on all platforms
4. **Set up proper CORS** configuration

## Monitoring and Maintenance

1. **Monitor Usage**: Check your Anthropic API usage regularly
2. **Update Dependencies**: Keep your dependencies updated
3. **Monitor Logs**: Check for errors and performance issues
4. **Backup Configuration**: Keep your environment variables documented

## Cost Considerations

- **GitHub Pages**: Free
- **Railway**: Free tier available, paid plans for higher usage
- **Render**: Free tier available, paid plans for higher usage
- **Heroku**: Paid plans only (no free tier)
- **Anthropic API**: Pay-per-use based on tokens

Choose platforms based on your budget and usage requirements.
