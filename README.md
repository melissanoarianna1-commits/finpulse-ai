# FinPulse AI

**Banking & Finance Research Intelligence System**

AI in Financial Risk — PhD Course Project

## Overview

FinPulse AI is a personalized research intelligence system that ingests academic papers, financial news, and regulatory updates, then uses AI to classify, summarize, recommend, and surface insights through an interactive dashboard.

## Trained Models

### Model 1: Financial Sentiment Classifier
- **Task**: Classify financial text as positive / negative / neutral
- **Base model**: FinBERT (fine-tuned BERT for financial NLP)
- **Dataset**: Financial PhraseBank (~5,000 labeled sentences)
- **Train/Val split**: 80/20
- **Metrics**: Accuracy, F1-score, confusion matrix
- **Notebook**: `notebooks/01_sentiment_model.ipynb`

### Model 2: Paper Relevance Recommender
- **Task**: Score academic papers by relevance to banking & finance research
- **Approach**: Sentence-BERT embeddings + logistic regression classifier
- **Dataset**: Curated set of paper abstracts with relevance labels
- **Train/Val split**: 80/20
- **Metrics**: Precision, Recall, F1, NDCG
- **Notebook**: `notebooks/02_recommender_model.ipynb`

## System Components

| Component | Description | Technology |
|-----------|------------|------------|
| Data Ingestion | Pulls papers & news from APIs | SSRN, arXiv, NewsAPI |
| Data Validation | Quality checks on all ingested data | Great Expectations |
| Sentiment Model | Classifies news sentiment | FinBERT (HuggingFace) |
| Recommender Model | Ranks papers by relevance | Sentence-BERT + sklearn |
| Chat Interface | RAG-powered Q&A over knowledge base | FAISS + LLM API |
| Dashboard | Interactive research dashboard | React |
| Podcast | Daily AI-generated audio briefing | LLM + TTS API |

## Repository Structure

```
finpulse-ai/
├── data/
│   ├── raw/              # Raw ingested data (not committed)
│   ├── processed/        # Cleaned, transformed data
│   └── validated/        # Data that passed Great Expectations checks
├── models/
│   ├── sentiment/        # Saved FinBERT fine-tuned model
│   └── recommender/      # Saved recommender model
├── notebooks/
│   ├── 01_sentiment_model.ipynb    # Train & validate sentiment classifier
│   ├── 02_recommender_model.ipynb  # Train & validate recommender
│   └── 03_data_validation.ipynb    # Great Expectations pipeline
├── src/
│   ├── ingestion/        # Data collection scripts
│   ├── validation/       # Great Expectations suites
│   ├── models/           # Model training & inference code
│   └── api/              # FastAPI backend
├── tests/                # Unit tests
├── docs/                 # Architecture docs, reports
├── requirements.txt
└── README.md
```

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/finpulse-ai.git
cd finpulse-ai
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

## GitHub Repositories Used as Inspiration

| Repository | Role in FinPulse |
|-----------|-----------------|
| [fraud-detection (PyOD)](https://github.com/topics/fraud-detection) | Anomaly detection for trend identification |
| [great_expectations](https://github.com/great-expectations/great_expectations) | Data validation layer |
| [sentiment-analysis](https://github.com/topics/sentiment-analysis) | Financial sentiment classification |
| [misinformation-detection](https://github.com/topics/misinformation-detection) | Source reliability scoring |
| [course-recommendation](https://github.com/topics/course-recommendation) | Recommendation engine architecture |
| [job-recommendation](https://github.com/topics/job-recommendation) | Relevance scoring pipeline |

## License

MIT
