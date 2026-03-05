# FinPulse AI

**Banking & Finance Research Intelligence System**

*AI in Financial Risk — PhD Course Project*

---

## Overview

FinPulse AI is a personalized research intelligence system designed for PhD researchers in Banking & Finance. It continuously ingests academic papers, central bank publications, regulatory updates, and financial news, then uses AI to classify, summarize, recommend, and surface insights through an interactive dashboard.

The system addresses a core challenge in financial risk research: **information overload**. With hundreds of papers published weekly across SSRN, arXiv, and working paper series from BIS, ECB, and the Fed, staying current is itself a risk management problem — the risk of missing critical developments, duplicating work, or failing to spot methodological trends early.

## Trained Models

### Model 1: Financial Sentiment Classifier

| | |
|---|---|
| **Task** | Classify financial text as positive / negative / neutral |
| **Base Model** | FinBERT (ProsusAI/finbert) — BERT pre-trained on financial text |
| **Dataset** | Financial PhraseBank (mteb/financial_phrasebank) — expert-labeled financial sentences |
| **Train / Val Split** | 1,131 / 1,128 sentences |
| **Accuracy** | **94.3%** |
| **Macro F1** | **0.896** |
| **Notebook** | `notebooks/01_sentiment_model.ipynb` |

**Role in FinPulse**: Powers the sentiment dots (positive/negative/neutral) and impact badges on every news card in the dashboard.

**Connection to Financial Risk**: Sentiment analysis is used in market risk monitoring (negative sentiment predicts price drops), credit risk early warning (negative press about borrowers), and operational risk (reputational risk detection).

### Model 2: Paper Relevance Recommender

| | |
|---|---|
| **Task** | Score academic papers by relevance to Banking & Finance research (0-100%) |
| **Approach** | Sentence-BERT embeddings (`all-MiniLM-L6-v2`) + logistic regression |
| **Dataset** | ~400 arXiv paper abstracts (finance vs. non-finance categories) |
| **Train / Val Split** | 80% / 20%, stratified |
| **Results** | Finance papers: 87-92% relevance scores · Non-finance: 5-31% scores |
| **Notebook** | `notebooks/02_recommender_model.ipynb` |

**Role in FinPulse**: Powers the relevance percentage bars on paper cards and determines the ranking order of papers in the daily feed.

**Connection to Financial Risk**: Same architecture as recommendation/ranking systems used in portfolio optimization (ranking assets by expected utility), credit scoring (ranking applicants by risk profile), and alert prioritization (ranking risk events to investigate first).

## Data Validation

All ingested data passes through a validation layer inspired by [Great Expectations](https://github.com/great-expectations/great_expectations), enforcing:
- No null values in critical fields (title, abstract, authors, date)
- No duplicate records
- Minimum text length requirements
- Class balance checks for training data
- Source freshness monitoring

This mirrors how banks validate model inputs under Basel III/IV model risk management requirements. See `notebooks/00_data_collection.ipynb` for the full validation pipeline.

## System Architecture

```
Data Sources                    NLP Layer                    Intelligence Layer
┌─────────────┐          ┌──────────────────┐          ┌───────────────────┐
│ arXiv API   │──┐       │ FinBERT Sentiment│──────────│ News Scoring      │
│ SSRN API    │  │       │ (Model 1)        │          │ (pos/neg/neutral) │
│ NewsAPI     │──┼──GE──▶│                  │          └───────────────────┘
│ BIS/ECB/Fed │  │       │ Sentence-BERT    │──────────┌───────────────────┐
└─────────────┘  │       │ + LogReg         │          │ Paper Ranking     │
                 │       │ (Model 2)        │          │ (0-100% relevance)│
            Validation   └──────────────────┘          └───────────────────┘
        (Great Expectations)                                    │
                                                                ▼
                                                     ┌───────────────────┐
                                                     │   Dashboard       │
                                                     │   Chat (RAG)      │
                                                     │   Podcast (TTS)   │
                                                     └───────────────────┘
```

## Repository Structure

```
finpulse-ai/
├── data/
│   ├── raw/              # Raw ingested data (not committed)
│   ├── processed/        # Cleaned, transformed data
│   └── validated/        # Data that passed validation checks
├── models/
│   ├── sentiment/        # Saved FinBERT fine-tuned model
│   └── recommender/      # Saved recommender model
├── notebooks/
│   ├── 00_data_collection.ipynb    # Data ingestion & validation
│   ├── 01_sentiment_model.ipynb    # Train & validate sentiment classifier
│   └── 02_recommender_model.ipynb  # Train & validate recommender
├── src/
│   ├── ingestion/        # Data collection scripts (arXiv, news)
│   ├── validation/       # Data quality validation
│   ├── models/           # Model training & inference code
│   └── api/              # FastAPI backend
├── tests/                # Unit tests
├── docs/                 # Architecture docs, evaluation plots
├── requirements.txt
└── README.md
```

## Setup & Reproduction

### Option A: Google Colab (Recommended)
1. Open any notebook from this repo in [Google Colab](https://colab.research.google.com)
2. File → Open notebook → GitHub → paste this repo URL
3. Run notebooks in order: `00` → `01` → `02`
4. Each notebook's first cell handles all package installations

### Option B: Local
```bash
git clone https://github.com/melissanoarianna1-commits/finpulse-ai.git
cd finpulse-ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## GitHub Repositories Used as Inspiration

| Repository | Role in FinPulse |
|-----------|-----------------|
| [fraud-detection / PyOD](https://github.com/topics/fraud-detection) | Anomaly detection techniques for trend identification |
| [great_expectations](https://github.com/great-expectations/great_expectations) | Data validation layer |
| [sentiment-analysis](https://github.com/topics/sentiment-analysis) | Financial sentiment classification |
| [misinformation-detection](https://github.com/topics/misinformation-detection) | Source reliability scoring |
| [course-recommendation](https://github.com/topics/course-recommendation) | Recommendation engine architecture |
| [job-recommendation](https://github.com/topics/job-recommendation) | Relevance scoring pipeline |

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Sentiment Model | FinBERT (HuggingFace Transformers) |
| Recommender Model | Sentence-BERT + scikit-learn |
| Data Validation | Great Expectations pattern |
| Backend API | Python + FastAPI |
| Dashboard | React |
| Vector Search (Chat) | FAISS |
| Podcast | LLM script + TTS API |

## License

MIT
