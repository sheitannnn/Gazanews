# Palestine News - Netlify Deployment Package

This folder contains everything you need to deploy the Palestine News website to Netlify.

## 🚀 Quick Deployment

### Option 1: Drag & Drop (Easiest)
1. Go to [Netlify](https://netlify.com)
2. Drag this entire `netlify-deploy` folder to the deployment area
3. Your site will be live in seconds!

### Option 2: Git Integration (Recommended for auto-updates)
1. Create a new GitHub repository
2. Upload all the project files (not just this deploy folder)
3. Connect the repository to Netlify
4. Netlify will automatically detect the build settings from `netlify.toml`

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

## 📁 What's Included

- `index.html` - Main website file
- `assets/` - Optimized CSS, JavaScript, and images
- `articles.json` - Latest scraped news articles (15 articles)
- `netlify.toml` - Netlify configuration for optimal performance
- `README.md` - Complete documentation

## 🔄 Self-Sustaining Features

Once deployed with Git integration, the website will:
- Automatically scrape news every 30 minutes during peak hours
- Update articles every 2 hours during off-peak hours
- Rebuild and redeploy automatically when new articles are found
- Maintain itself without any manual intervention

## 📊 Current Content

The deployment includes **15 real articles** scraped from:
- Al Jazeera (1 article)
- WAFA (1 article)
- IMEMC News (6 articles)
- +972 Magazine (5 articles)
- Middle East Eye (2 articles)

## 🌟 Features

✅ **Al Jazeera-inspired design** with dark theme and immersive layout
✅ **Real-time news aggregation** from 8+ Palestinian news sources
✅ **Responsive design** that works on all devices
✅ **Advanced search and filtering** by keywords and sources
✅ **Auto-refresh** functionality for live updates
✅ **Performance optimized** with caching and compression
✅ **Self-sustaining** with automated scraping and deployment

## 🔧 Post-Deployment Setup

For automated updates (optional):
1. Set up GitHub repository with the full project
2. Configure GitHub Actions secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. The website will then update itself automatically

## 📞 Support

If you need help with deployment:
- Check the main README.md for detailed instructions
- Visit [Netlify Documentation](https://docs.netlify.com)
- Create an issue in the GitHub repository

---

**Palestine News** - Independent journalism for Palestinian voices.

*Ready to deploy in 3... 2... 1... 🚀*

