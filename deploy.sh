#!/bin/bash

# Intent Clarifier Deployment Script
# This script helps you deploy your Intent Clarifier application

echo "🚀 Intent Clarifier Deployment Helper"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Found project files"

# Check git status
if ! git status > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository. Please initialize git first."
    exit 1
fi

echo "✅ Git repository found"

# Check if GitHub remote is configured
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: No GitHub remote configured. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/yourrepo.git"
    exit 1
fi

echo "✅ GitHub remote configured: $(git remote get-url origin)"

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Git status clean"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env file found. Creating from template..."
    cp env.template .env
    echo "📝 Please edit .env file with your API keys before deploying"
    echo ""
fi

echo "✅ Environment configuration ready"

# Show deployment options
echo ""
echo "🎯 Deployment Options:"
echo "====================="
echo ""
echo "1. Frontend (GitHub Pages) - FREE"
echo "   - Already configured with GitHub Actions"
echo "   - Will deploy automatically on push to main"
echo "   - URL: https://tracyyyleung.github.io/unpack"
echo ""
echo "2. Backend Options:"
echo "   a) Railway (Recommended) - FREE tier available"
echo "   b) Render - FREE tier available"
echo "   c) Heroku - Paid plans only"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Push to GitHub (deploy frontend)"
echo "2) Show backend deployment instructions"
echo "3) Test production build locally"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Pushing to GitHub..."
        echo "======================="
        
        # Check if we can push
        if git push origin main; then
            echo ""
            echo "✅ Successfully pushed to GitHub!"
            echo ""
            echo "🎉 Frontend Deployment:"
            echo "   - GitHub Actions will automatically build and deploy"
            echo "   - Check the Actions tab in your GitHub repository"
            echo "   - Your app will be available at: https://tracyyyleung.github.io/unpack"
            echo ""
            echo "📋 Next Steps:"
            echo "   1. Deploy your backend (see DEPLOYMENT.md)"
            echo "   2. Update REACT_APP_API_URL in your frontend environment"
            echo "   3. Test your complete application"
        else
            echo "❌ Failed to push to GitHub. Please check your authentication."
            echo "   You may need to set up a Personal Access Token or SSH key."
        fi
        ;;
    2)
        echo ""
        echo "🔧 Backend Deployment Instructions:"
        echo "==================================="
        echo ""
        echo "1. Railway (Recommended):"
        echo "   - Go to https://railway.app"
        echo "   - Connect your GitHub repository"
        echo "   - Set environment variables:"
        echo "     * ANTHROPIC_API_KEY=your_api_key"
        echo "     * NODE_ENV=production"
        echo "     * FRONTEND_URL=https://tracyyyleung.github.io/unpack"
        echo ""
        echo "2. Render:"
        echo "   - Go to https://render.com"
        echo "   - Create new Web Service"
        echo "   - Connect your GitHub repository"
        echo "   - Build Command: cd server && npm install"
        echo "   - Start Command: cd server && npm start"
        echo ""
        echo "3. See DEPLOYMENT.md for detailed instructions"
        ;;
    3)
        echo ""
        echo "🧪 Testing Production Build Locally..."
        echo "======================================"
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm run install-all
        fi
        
        # Build the frontend
        echo "🔨 Building frontend..."
        if npm run build; then
            echo "✅ Frontend build successful!"
            
            # Test the production server
            echo "🚀 Starting production server..."
            echo "   Visit: http://localhost:5001"
            echo "   Press Ctrl+C to stop"
            echo ""
            npm start
        else
            echo "❌ Frontend build failed. Please check for errors."
        fi
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see:"
echo "   - DEPLOYMENT.md - Detailed deployment guide"
echo "   - README.md - Project documentation"
echo ""
echo "🎉 Happy deploying!"
