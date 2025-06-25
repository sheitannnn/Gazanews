#!/bin/bash

# Palestine News - Deployment Script
# This script sets up the project for deployment

set -e

echo "🇵🇸 Palestine News - Deployment Setup"
echo "======================================"

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm 8+ first."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    echo "✅ All requirements satisfied"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    echo "Installing Node.js dependencies..."
    npm install
    
    echo "Installing Python dependencies..."
    pip3 install requests beautifulsoup4 feedparser
    
    echo "✅ Dependencies installed"
}

# Run initial scraping
initial_scrape() {
    echo "📰 Running initial news scraping..."
    
    python3 scraper.py
    cp articles.json public/articles.json
    
    echo "✅ Initial scraping completed"
}

# Build the project
build_project() {
    echo "🔨 Building the project..."
    
    npm run build
    
    echo "✅ Project built successfully"
}

# Test the build
test_build() {
    echo "🧪 Testing the build..."
    
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        echo "✅ Build test passed"
    else
        echo "❌ Build test failed - dist directory or index.html not found"
        exit 1
    fi
}

# Display deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🚀 Deployment Instructions"
    echo "========================="
    echo ""
    echo "Your Palestine News website is ready for deployment!"
    echo ""
    echo "📁 The 'dist' folder contains all the files needed for deployment."
    echo ""
    echo "🌐 Netlify Deployment Options:"
    echo ""
    echo "Option 1 - Drag & Drop (Easiest):"
    echo "  1. Go to https://netlify.com"
    echo "  2. Drag the 'dist' folder to the deployment area"
    echo "  3. Your site will be live in seconds!"
    echo ""
    echo "Option 2 - Git Integration (Recommended for auto-updates):"
    echo "  1. Push this code to a GitHub repository"
    echo "  2. Connect the repository to Netlify"
    echo "  3. Set up environment variables for automated updates:"
    echo "     - NETLIFY_AUTH_TOKEN"
    echo "     - NETLIFY_SITE_ID"
    echo ""
    echo "Option 3 - Netlify CLI:"
    echo "  1. Install: npm install -g netlify-cli"
    echo "  2. Login: netlify login"
    echo "  3. Deploy: netlify deploy --prod --dir=dist"
    echo ""
    echo "🔄 For self-sustaining operations:"
    echo "  - The GitHub Actions workflow will automatically scrape news"
    echo "  - Articles update every 30 minutes during peak hours"
    echo "  - The site rebuilds and redeploys automatically"
    echo ""
    echo "📖 For detailed instructions, see README.md"
    echo ""
    echo "✨ Your Palestine News website is ready to serve independent journalism!"
}

# Main execution
main() {
    check_requirements
    install_dependencies
    initial_scrape
    build_project
    test_build
    show_deployment_instructions
}

# Run the script
main

