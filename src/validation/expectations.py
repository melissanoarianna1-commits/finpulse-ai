"""
Data Validation with Great Expectations
Ensures data quality for all ingested papers and news.
"""

def validate_papers(df):
    """Validate paper data meets quality expectations."""
    checks = {
        "has_title": df["title"].notna().all(),
        "has_abstract": df["abstract"].notna().all(),
        "has_authors": df["authors"].notna().all(),
        "has_date": df["date"].notna().all(),
        "has_source": df["source"].notna().all(),
        "no_duplicates": not df.duplicated(subset=["title", "authors"]).any(),
        "title_not_empty": (df["title"].str.len() > 0).all(),
        "abstract_min_length": (df["abstract"].str.len() > 50).all(),
    }
    passed = all(checks.values())
    return {"passed": passed, "checks": checks}

def validate_news(df):
    """Validate news data meets quality expectations."""
    checks = {
        "has_title": df["title"].notna().all(),
        "has_source": df["source"].notna().all(),
        "has_date": df["published_at"].notna().all(),
        "no_duplicates": not df.duplicated(subset=["title"]).any(),
        "title_not_empty": (df["title"].str.len() > 0).all(),
    }
    passed = all(checks.values())
    return {"passed": passed, "checks": checks}
