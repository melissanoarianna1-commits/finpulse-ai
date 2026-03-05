"""Tests for data validation."""
import pandas as pd
from src.validation.expectations import validate_papers, validate_news

def test_valid_papers():
    df = pd.DataFrame({
        "title": ["Test Paper"],
        "abstract": ["This is a test abstract that is long enough to pass validation checks."],
        "authors": ["A. Test"],
        "date": ["2026-01-01"],
        "source": ["arXiv"],
    })
    result = validate_papers(df)
    assert result["passed"] is True

def test_invalid_papers_missing_title():
    df = pd.DataFrame({
        "title": [None],
        "abstract": ["Abstract text here that is long enough."],
        "authors": ["A. Test"],
        "date": ["2026-01-01"],
        "source": ["arXiv"],
    })
    result = validate_papers(df)
    assert result["passed"] is False
