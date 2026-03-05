"""
Academic Paper Ingestion
Fetches papers from arXiv and SSRN.
"""
import requests
import feedparser
import pandas as pd

def fetch_arxiv(query="cat:q-fin.RM OR cat:q-fin.CP", max_results=50):
    """Fetch recent papers from arXiv quantitative finance."""
    url = f"http://export.arxiv.org/api/query?search_query={query}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
    feed = feedparser.parse(url)

    papers = []
    for entry in feed.entries:
        papers.append({
            "title": entry.title.replace("\n", " ").strip(),
            "abstract": entry.summary.replace("\n", " ").strip(),
            "authors": ", ".join([a.name for a in entry.authors]),
            "date": entry.published[:10],
            "source": "arXiv",
            "url": entry.link,
            "tags": [t.term for t in entry.tags],
        })
    return pd.DataFrame(papers)
