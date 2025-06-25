# Palestine News - Independent Coverage & Analysis

A self-sustaining news aggregation website that scrapes Palestinian news from multiple sources 24/7, styled like Al Jazeera's longform articles, and deployable on Netlify.

## 🌟 Features

- **Real-time News Aggregation**: Automatically scrapes from 8+ Palestinian news sources
- **Al Jazeera-inspired Design**: Dark theme with immersive, magazine-style layout
- **Self-sustaining**: Automated scraping and deployment via GitHub Actions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Live Updates**: Articles refresh automatically every 5 minutes
- **Advanced Filtering**: Search by keywords, filter by source
- **Performance Optimized**: Fast loading with image optimization and caching

## 📰 News Sources

1. **Al Jazeera** (Middle East Section) - Comprehensive regional coverage
2. **Middle East Eye** - Independent outlet with detailed Palestinian reporting
3. **+972 Magazine** - Palestinian-Israeli publication with critical analysis
4. **The Electronic Intifada** - Independent news and analysis on Palestine
5. **IMEMC News** - International Middle East Media Center
6. **The Palestine Chronicle** - Independent news organization
7. **WAFA** - Palestine News & Information Agency
8. **Human Rights Watch** (Middle East Section) - Human rights reports

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Python 3.11+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/palestine-news.git
   cd palestine-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip3 install requests beautifulsoup4 feedparser
   ```

3. **Run the news scraper**
   ```bash
   python3 scraper.py
   cp articles.json public/articles.json
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🔄 Self-Sustaining Operations

### Automated Scraping

The website uses GitHub Actions to automatically:

- Scrape news every 30 minutes during peak hours (6 AM - 11 PM GMT)
- Scrape news every 2 hours during off-peak hours (11 PM - 6 AM GMT)
- Update the articles.json file
- Rebuild and redeploy the website
- Commit changes back to the repository

### GitHub Actions Workflow

The `.github/workflows/auto-update.yml` file contains the automation logic:

- **Scheduled runs**: Uses cron expressions for different time periods
- **Manual triggers**: Can be triggered manually from GitHub Actions tab
- **Error handling**: Includes retry mechanisms and fallback sources
- **Deployment**: Automatically deploys to Netlify after successful scraping

## 🌐 Deployment to Netlify

### Option 1: Automatic Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your forked repository
   - Build settings are automatically detected from `netlify.toml`

3. **Set up environment variables** (for automated updates)
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add `NETLIFY_AUTH_TOKEN` (get from Netlify User settings > Applications)
   - Add `NETLIFY_SITE_ID` (found in Site settings > General)

4. **Configure GitHub secrets** (for automated deployment)
   - In your GitHub repository, go to Settings > Secrets and variables > Actions
   - Add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify by dragging and dropping it on the Netlify dashboard

### Option 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
palestine-news/
├── .github/
│   └── workflows/
│       └── auto-update.yml      # GitHub Actions workflow
├── public/
│   ├── articles.json            # Scraped news articles
│   └── favicon.ico
├── src/
│   ├── assets/                  # Images and static files
│   ├── components/
│   │   └── ui/                  # UI components (shadcn/ui)
│   ├── App.jsx                  # Main React component
│   ├── App.css                  # Styles and theme
│   └── main.jsx                 # Entry point
├── scraper.py                   # News scraping script
├── articles.json                # Latest scraped articles
├── netlify.toml                 # Netlify configuration
├── package.json                 # Node.js dependencies
├── vite.config.js              # Vite configuration
└── README.md                    # This file
```

## 🛠 Technical Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom Al Jazeera-inspired theme
- **UI Components**: shadcn/ui for consistent design
- **Icons**: Lucide React for modern iconography
- **Responsive**: Mobile-first design with touch support

### Backend/Data Layer
- **Scraping**: Python with BeautifulSoup and requests
- **Data Storage**: JSON files with automatic deduplication
- **Automation**: GitHub Actions for scheduled operations
- **Deployment**: Netlify for static site hosting

### Data Flow
```
GitHub Actions → Python Scraper → JSON Storage → React Frontend → Netlify CDN
```

## 🔧 Configuration

### Scraping Schedule

Edit `.github/workflows/auto-update.yml` to modify scraping frequency:

```yaml
schedule:
  # Peak hours: every 30 minutes (6 AM - 11 PM GMT)
  - cron: '*/30 6-23 * * *'
  # Off-peak: every 2 hours (11 PM - 6 AM GMT)
  - cron: '0 */2 0-5 * * *'
```

### Adding New Sources

1. Add a new scraper method in `scraper.py`
2. Include it in the `scrape_all_sources()` method
3. Update the sources list in `src/App.jsx`

### Customizing Design

- **Colors**: Modify CSS variables in `src/App.css`
- **Layout**: Edit components in `src/App.jsx`
- **Images**: Replace files in `src/assets/`

## 📊 Performance Features

- **Lazy Loading**: Progressive content loading
- **Image Optimization**: WebP conversion and compression
- **Caching**: Service worker for offline functionality
- **CDN**: Netlify's global CDN for fast delivery
- **Compression**: Gzip compression for all assets

## 🔒 Security & Compliance

### Content Scraping Ethics
- **Robots.txt Compliance**: Respects website scraping policies
- **Attribution**: Proper source attribution and linking
- **Fair Use**: Excerpt-based content with full source links
- **Rate Limiting**: Respectful scraping with delays

### Data Privacy
- **No User Tracking**: Privacy-focused design
- **Local Storage Only**: No external data collection
- **GDPR Compliance**: Transparent data handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/your-username/palestine-news/issues)
- **Documentation**: Check this README for setup and configuration
- **Community**: Join discussions in the repository

## 🌍 Mission

This project aims to provide independent, comprehensive coverage of Palestinian affairs by aggregating news from multiple trusted sources. We believe in the power of journalism to inform, educate, and create positive change.

---

**Palestine News** - Independent journalism for Palestinian voices.

*Built with ❤️ for press freedom and human rights*

