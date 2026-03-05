"""
Financial News Ingestion
Fetches financial news from NewsAPI.
"""
import requests
import pandas as pd
from datetime import datetime, timedelta

def fetch_news(api_key, query="banking finance regulation", days_back=1):
    """Fetch recent financial news articles."""
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "from": (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d"),
        "sortBy": "publishedAt",
        "language": "en",
        "apiKey": api_key,
    }
    response = requests.get(url, params=params)
    articles = response.json().get("articles", [])

    return pd.DataFrame([{
        "title": a["title"],
        "description": a.get("description", ""),
        "source": a["source"]["name"],
        "published_at": a["publishedAt"],
        "url": a["url"],
    } for a in articles])
