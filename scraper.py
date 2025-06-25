#!/usr/bin/env python3
"""
Palestine News Scraper
A comprehensive news scraping system for Palestinian news sources
"""

import requests
from bs4 import BeautifulSoup
import json
import hashlib
import time
from datetime import datetime, timezone
import re
import logging
from urllib.parse import urljoin, urlparse
import os
from typing import List, Dict, Optional
import feedparser

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NewsArticle:
    def __init__(self, title: str, summary: str, url: str, source: str, 
                 author: str = "", published_at: str = "", image_url: str = "", 
                 tags: List[str] = None, category: str = "news", priority: int = 1):
        self.id = self._generate_id(title, url)
        self.title = title.strip()
        self.summary = summary.strip()
        self.url = url
        self.source = source
        self.author = author
        self.published_at = published_at or datetime.now(timezone.utc).isoformat()
        self.scraped_at = datetime.now(timezone.utc).isoformat()
        self.image_url = image_url
        self.tags = tags or []
        self.category = category
        self.priority = priority

    def _generate_id(self, title: str, url: str) -> str:
        """Generate unique ID based on title and URL"""
        content = f"{title}{url}"
        return hashlib.md5(content.encode()).hexdigest()

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "summary": self.summary,
            "url": self.url,
            "source": self.source,
            "author": self.author,
            "publishedAt": self.published_at,
            "scrapedAt": self.scraped_at,
            "imageUrl": self.image_url,
            "tags": self.tags,
            "category": self.category,
            "priority": self.priority
        }

class NewsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.articles = []

    def scrape_aljazeera_gaza(self) -> List[NewsArticle]:
        """Scrape Al Jazeera Gaza section"""
        try:
            url = "https://www.aljazeera.com/where/gaza/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article containers
            article_containers = soup.find_all(['article', 'div'], class_=re.compile(r'article|post|story'))
            
            for container in article_containers[:10]:  # Limit to 10 articles
                try:
                    title_elem = container.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'title|headline'))
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    if len(title) < 10:  # Skip very short titles
                        continue
                    
                    # Get article URL
                    link_elem = title_elem.find('a') or container.find('a')
                    if link_elem:
                        article_url = urljoin(url, link_elem.get('href', ''))
                    else:
                        continue
                    
                    # Get summary
                    summary_elem = container.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                    summary = summary_elem.get_text(strip=True) if summary_elem else title
                    
                    # Get image
                    img_elem = container.find('img')
                    image_url = ""
                    if img_elem:
                        img_src = img_elem.get('src') or img_elem.get('data-src')
                        if img_src:
                            image_url = urljoin(url, img_src)
                    
                    article = NewsArticle(
                        title=title,
                        summary=summary,
                        url=article_url,
                        source="Al Jazeera",
                        image_url=image_url,
                        tags=["Gaza", "Palestine", "Middle East"],
                        category="News",
                        priority=4
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing Al Jazeera article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from Al Jazeera")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping Al Jazeera: {e}")
            return []

    def scrape_middle_east_eye(self) -> List[NewsArticle]:
        """Scrape Middle East Eye"""
        try:
            url = "https://www.middleeasteye.net/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article links
            article_links = soup.find_all('a', href=re.compile(r'/news/|/opinion/|/analysis/'))
            
            seen_urls = set()
            for link in article_links[:15]:
                try:
                    article_url = urljoin(url, link.get('href'))
                    if article_url in seen_urls:
                        continue
                    seen_urls.add(article_url)
                    
                    title = link.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    # Try to get more details from the link's parent container
                    container = link.find_parent(['article', 'div'])
                    summary = title  # Default to title
                    image_url = ""
                    
                    if container:
                        # Look for summary
                        summary_elem = container.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                        if summary_elem:
                            summary = summary_elem.get_text(strip=True)
                        
                        # Look for image
                        img_elem = container.find('img')
                        if img_elem:
                            img_src = img_elem.get('src') or img_elem.get('data-src')
                            if img_src:
                                image_url = urljoin(url, img_src)
                    
                    article = NewsArticle(
                        title=title,
                        summary=summary,
                        url=article_url,
                        source="Middle East Eye",
                        image_url=image_url,
                        tags=["Palestine", "Middle East", "Analysis"],
                        category="News",
                        priority=3
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing Middle East Eye article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from Middle East Eye")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping Middle East Eye: {e}")
            return []

    def scrape_972_magazine(self) -> List[NewsArticle]:
        """Scrape +972 Magazine"""
        try:
            url = "https://www.972mag.com/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article containers
            article_containers = soup.find_all(['article', 'div'], class_=re.compile(r'post|article|story'))
            
            for container in article_containers[:10]:
                try:
                    title_elem = container.find(['h1', 'h2', 'h3'], class_=re.compile(r'title|headline'))
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    # Get article URL
                    link_elem = title_elem.find('a') or container.find('a')
                    if link_elem:
                        article_url = urljoin(url, link_elem.get('href', ''))
                    else:
                        continue
                    
                    # Get summary
                    summary_elem = container.find(['p', 'div'], class_=re.compile(r'excerpt|summary'))
                    summary = summary_elem.get_text(strip=True) if summary_elem else title
                    
                    # Get image
                    img_elem = container.find('img')
                    image_url = ""
                    if img_elem:
                        img_src = img_elem.get('src') or img_elem.get('data-src')
                        if img_src:
                            image_url = urljoin(url, img_src)
                    
                    article = NewsArticle(
                        title=title,
                        summary=summary,
                        url=article_url,
                        source="+972 Magazine",
                        image_url=image_url,
                        tags=["Palestine", "Israel", "Human Rights"],
                        category="Analysis",
                        priority=3
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing +972 Magazine article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from +972 Magazine")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping +972 Magazine: {e}")
            return []

    def scrape_electronic_intifada(self) -> List[NewsArticle]:
        """Scrape The Electronic Intifada"""
        try:
            url = "https://electronicintifada.net/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article links
            article_links = soup.find_all('a', href=re.compile(r'/content/'))
            
            seen_urls = set()
            for link in article_links[:10]:
                try:
                    article_url = urljoin(url, link.get('href'))
                    if article_url in seen_urls:
                        continue
                    seen_urls.add(article_url)
                    
                    title = link.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    article = NewsArticle(
                        title=title,
                        summary=title,  # Use title as summary for now
                        url=article_url,
                        source="The Electronic Intifada",
                        tags=["Palestine", "Human Rights", "Activism"],
                        category="News",
                        priority=3
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing Electronic Intifada article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from Electronic Intifada")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping Electronic Intifada: {e}")
            return []

    def scrape_imemc(self) -> List[NewsArticle]:
        """Scrape IMEMC News"""
        try:
            url = "https://imemc.org/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article containers
            article_containers = soup.find_all(['article', 'div'], class_=re.compile(r'post|article|news'))
            
            for container in article_containers[:10]:
                try:
                    title_elem = container.find(['h1', 'h2', 'h3', 'h4'])
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    # Get article URL
                    link_elem = title_elem.find('a') or container.find('a')
                    if link_elem:
                        article_url = urljoin(url, link_elem.get('href', ''))
                    else:
                        continue
                    
                    # Get summary
                    summary_elem = container.find('p')
                    summary = summary_elem.get_text(strip=True) if summary_elem else title
                    
                    article = NewsArticle(
                        title=title,
                        summary=summary,
                        url=article_url,
                        source="IMEMC News",
                        tags=["Palestine", "West Bank", "Gaza"],
                        category="News",
                        priority=3
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing IMEMC article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from IMEMC")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping IMEMC: {e}")
            return []

    def scrape_palestine_chronicle(self) -> List[NewsArticle]:
        """Scrape The Palestine Chronicle"""
        try:
            url = "https://www.palestinechronicle.com/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article links
            article_links = soup.find_all('a', href=re.compile(r'/\d{4}/'))
            
            seen_urls = set()
            for link in article_links[:10]:
                try:
                    article_url = urljoin(url, link.get('href'))
                    if article_url in seen_urls:
                        continue
                    seen_urls.add(article_url)
                    
                    title = link.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    article = NewsArticle(
                        title=title,
                        summary=title,
                        url=article_url,
                        source="The Palestine Chronicle",
                        tags=["Palestine", "Politics", "Culture"],
                        category="News",
                        priority=2
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing Palestine Chronicle article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from Palestine Chronicle")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping Palestine Chronicle: {e}")
            return []

    def scrape_wafa(self) -> List[NewsArticle]:
        """Scrape WAFA News"""
        try:
            url = "https://english.wafa.ps/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = []
            # Look for article links
            article_links = soup.find_all('a', href=re.compile(r'/Pages/'))
            
            seen_urls = set()
            for link in article_links[:10]:
                try:
                    article_url = urljoin(url, link.get('href'))
                    if article_url in seen_urls:
                        continue
                    seen_urls.add(article_url)
                    
                    title = link.get_text(strip=True)
                    if len(title) < 10:
                        continue
                    
                    article = NewsArticle(
                        title=title,
                        summary=title,
                        url=article_url,
                        source="WAFA",
                        tags=["Palestine", "Official", "Government"],
                        category="News",
                        priority=3
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.warning(f"Error parsing WAFA article: {e}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from WAFA")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping WAFA: {e}")
            return []

    def scrape_all_sources(self) -> List[NewsArticle]:
        """Scrape all news sources"""
        all_articles = []
        
        scrapers = [
            self.scrape_aljazeera_gaza,
            self.scrape_middle_east_eye,
            self.scrape_972_magazine,
            self.scrape_electronic_intifada,
            self.scrape_imemc,
            self.scrape_palestine_chronicle,
            self.scrape_wafa
        ]
        
        for scraper in scrapers:
            try:
                articles = scraper()
                all_articles.extend(articles)
                time.sleep(2)  # Be respectful to servers
            except Exception as e:
                logger.error(f"Error in scraper {scraper.__name__}: {e}")
                continue
        
        # Remove duplicates based on ID
        unique_articles = {}
        for article in all_articles:
            unique_articles[article.id] = article
        
        final_articles = list(unique_articles.values())
        logger.info(f"Total unique articles scraped: {len(final_articles)}")
        
        return final_articles

    def save_articles_to_json(self, articles: List[NewsArticle], filename: str = "articles.json"):
        """Save articles to JSON file"""
        data = {
            "articles": [article.to_dict() for article in articles],
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "totalArticles": len(articles)
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(articles)} articles to {filename}")

def main():
    """Main function to run the scraper"""
    scraper = NewsScraper()
    
    logger.info("Starting news scraping...")
    articles = scraper.scrape_all_sources()
    
    if articles:
        # Sort by priority and publication date
        articles.sort(key=lambda x: (x.priority, x.published_at), reverse=True)
        
        # Save to JSON
        scraper.save_articles_to_json(articles)
        
        # Print summary
        sources = {}
        for article in articles:
            sources[article.source] = sources.get(article.source, 0) + 1
        
        print("\n=== Scraping Summary ===")
        for source, count in sources.items():
            print(f"{source}: {count} articles")
        print(f"Total: {len(articles)} articles")
    else:
        logger.warning("No articles were scraped")

if __name__ == "__main__":
    main()

