import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Clock, ExternalLink, Share2, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import './App.css';
import heroImage from './assets/hero-image.jpg';
import newsBg from './assets/news-bg.jpg';
import palestineFlag from './assets/palestine-flag.png';

// Data service to load articles
class ArticleService {
  static async loadArticles() {
    try {
      // In a real deployment, this would fetch from an API or updated JSON file
      const response = await fetch('/articles.json');
      if (response.ok) {
        const data = await response.json();
        return data.articles || [];
      }
    } catch (error) {
      console.warn('Could not load live articles, using mock data');
    }
    
    // Fallback to mock data
    return [
      {
        id: 1,
        title: "Breaking: Latest developments in Gaza humanitarian crisis",
        summary: "International organizations call for immediate action as the humanitarian situation continues to deteriorate across the Gaza Strip.",
        source: "Al Jazeera",
        author: "Sarah Ahmed",
        publishedAt: "2025-06-25T10:00:00Z",
        imageUrl: heroImage,
        category: "Breaking News",
        priority: 5,
        tags: ["Gaza", "Humanitarian Crisis", "Breaking News"],
        url: "https://www.aljazeera.com/news/2025/6/25/gaza-humanitarian-crisis"
      },
      {
        id: 2,
        title: "Palestinian journalists face unprecedented challenges",
        summary: "Press freedom organizations document systematic targeting of media workers and destruction of news facilities.",
        source: "Middle East Eye",
        author: "Omar Hassan",
        publishedAt: "2025-06-25T09:30:00Z",
        imageUrl: newsBg,
        category: "Press Freedom",
        priority: 4,
        tags: ["Journalism", "Press Freedom", "Palestine"],
        url: "https://www.middleeasteye.net/news/palestinian-journalists-challenges"
      },
      {
        id: 3,
        title: "International law experts call for accountability",
        summary: "Legal scholars and human rights organizations demand investigation into alleged violations of international humanitarian law.",
        source: "+972 Magazine",
        author: "Dr. Amira Khalil",
        publishedAt: "2025-06-25T08:45:00Z",
        imageUrl: heroImage,
        category: "Analysis",
        priority: 3,
        tags: ["International Law", "Human Rights", "Analysis"],
        url: "https://www.972mag.com/international-law-accountability"
      },
      {
        id: 4,
        title: "Voices from Gaza: Stories of resilience and hope",
        summary: "Despite overwhelming challenges, Palestinian families continue to find strength and maintain their cultural identity.",
        source: "The Electronic Intifada",
        author: "Layla Mahmoud",
        publishedAt: "2025-06-25T07:15:00Z",
        imageUrl: newsBg,
        category: "Human Stories",
        priority: 3,
        tags: ["Gaza", "Human Stories", "Resilience"],
        url: "https://electronicintifada.net/content/voices-gaza-resilience"
      },
      {
        id: 5,
        title: "Medical facilities struggle to provide basic care",
        summary: "Healthcare workers describe dire conditions as medical supplies run critically low across Palestinian territories.",
        source: "IMEMC News",
        author: "Dr. Fatima Al-Zahra",
        publishedAt: "2025-06-25T06:30:00Z",
        imageUrl: heroImage,
        category: "Healthcare",
        priority: 4,
        tags: ["Healthcare", "Medical Crisis", "Gaza"],
        url: "https://imemc.org/article/medical-facilities-struggle"
      },
      {
        id: 6,
        title: "International solidarity movements gain momentum",
        summary: "Global protests and advocacy campaigns continue to grow as awareness of Palestinian struggles increases worldwide.",
        source: "The Palestine Chronicle",
        author: "Ahmed Mansour",
        publishedAt: "2025-06-25T05:45:00Z",
        imageUrl: newsBg,
        category: "International",
        priority: 2,
        tags: ["Solidarity", "International", "Activism"],
        url: "https://www.palestinechronicle.com/international-solidarity"
      }
    ];
  }
}

const sources = [
  "All Sources",
  "Al Jazeera",
  "Middle East Eye",
  "+972 Magazine",
  "The Electronic Intifada",
  "IMEMC News",
  "The Palestine Chronicle",
  "WAFA"
];

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const loadedArticles = await ArticleService.loadArticles();
      setArticles(loadedArticles);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh articles every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadArticles();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter articles based on search and source
  useEffect(() => {
    let filtered = articles;
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (selectedSource !== 'All Sources') {
      filtered = filtered.filter(article => article.source === selectedSource);
    }
    
    setFilteredArticles(filtered);
  }, [searchTerm, selectedSource, articles]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 5: return 'bg-palestine-red';
      case 4: return 'bg-orange-600';
      case 3: return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const handleArticleClick = (article) => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const featuredArticle = filteredArticles.find(article => article.priority === 5) || filteredArticles[0];
  const otherArticles = filteredArticles.filter(article => article.id !== featuredArticle?.id);

  if (isLoading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading latest Palestine news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-custom bg-background/90 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={palestineFlag} alt="Palestine" className="w-8 h-5 object-cover rounded" />
              <h1 className="text-2xl font-bold text-palestine-white">Palestine News</h1>
              <Badge variant="outline" className="text-palestine-red border-palestine-red animate-pulse-red">
                LIVE
              </Badge>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="hover:text-palestine-red transition-colors">Breaking</a>
              <a href="#" className="hover:text-palestine-red transition-colors">Analysis</a>
              <a href="#" className="hover:text-palestine-red transition-colors">Opinion</a>
              <a href="#" className="hover:text-palestine-red transition-colors">Reports</a>
              <a href="#" className="hover:text-palestine-red transition-colors">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                {currentTime.toLocaleTimeString()}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={loadArticles}
                className="hover:text-palestine-red"
                title="Refresh articles"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <nav className="flex flex-col space-y-2">
                <a href="#" className="hover:text-palestine-red transition-colors py-2">Breaking</a>
                <a href="#" className="hover:text-palestine-red transition-colors py-2">Analysis</a>
                <a href="#" className="hover:text-palestine-red transition-colors py-2">Opinion</a>
                <a href="#" className="hover:text-palestine-red transition-colors py-2">Reports</a>
                <a href="#" className="hover:text-palestine-red transition-colors py-2">About</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm"
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            {lastUpdated && (
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {featuredArticle && (
        <section className="relative h-[70vh] overflow-hidden cursor-pointer" onClick={() => handleArticleClick(featuredArticle)}>
          <div
            className="absolute inset-0 bg-cover bg-center image-hover-scale"
            style={{ backgroundImage: `url(${featuredArticle.imageUrl || heroImage})` }}
          />
          <div className="absolute inset-0 article-overlay" />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className={`${getPriorityColor(featuredArticle.priority)} text-white`}>
                  {featuredArticle.category}
                </Badge>
                <span className="text-sm text-gray-300">{featuredArticle.source}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{formatTime(featuredArticle.publishedAt)}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow leading-tight">
                {featuredArticle.title}
              </h1>
              <p className="text-xl text-gray-200 mb-6 text-shadow max-w-3xl">
                {featuredArticle.summary}
              </p>
              <div className="flex items-center space-x-4">
                <Button 
                  className="bg-palestine-red hover:bg-red-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(featuredArticle);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Full Story
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.share?.({
                      title: featuredArticle.title,
                      url: featuredArticle.url
                    }) || navigator.clipboard?.writeText(featuredArticle.url);
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Coverage</h2>
          <Badge variant="outline" className="text-palestine-green border-palestine-green">
            {filteredArticles.length} Articles
          </Badge>
        </div>
        
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article) => (
              <article
                key={article.id}
                className="bg-card rounded-lg overflow-hidden border border-border hover:border-palestine-red transition-all-300 group cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.imageUrl || newsBg}
                    alt={article.title}
                    className="w-full h-48 object-cover image-hover-scale"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getPriorityColor(article.priority)} text-white`}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span>{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTime(article.publishedAt)}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-palestine-red transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {(article.tags || []).slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-palestine-red hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArticleClick(article);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            <Button 
              onClick={loadArticles} 
              className="mt-4 bg-palestine-red hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Articles
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={palestineFlag} alt="Palestine" className="w-6 h-4 object-cover rounded" />
                <h3 className="text-lg font-semibold">Palestine News</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Independent coverage and analysis of Palestinian affairs, bringing you the stories that matter.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://www.aljazeera.com" target="_blank" rel="noopener noreferrer" className="hover:text-palestine-red transition-colors">Al Jazeera</a></li>
                <li><a href="https://www.middleeasteye.net" target="_blank" rel="noopener noreferrer" className="hover:text-palestine-red transition-colors">Middle East Eye</a></li>
                <li><a href="https://www.972mag.com" target="_blank" rel="noopener noreferrer" className="hover:text-palestine-red transition-colors">+972 Magazine</a></li>
                <li><a href="https://electronicintifada.net" target="_blank" rel="noopener noreferrer" className="hover:text-palestine-red transition-colors">Electronic Intifada</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-palestine-red transition-colors">Breaking News</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Analysis</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Opinion</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Human Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-palestine-red transition-colors">Mission</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Editorial Policy</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-palestine-red transition-colors">Support Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Palestine News. All rights reserved. | Independent journalism for Palestinian voices.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

