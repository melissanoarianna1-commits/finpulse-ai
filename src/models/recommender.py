"""
Paper Relevance Recommender
Uses Sentence-BERT embeddings + logistic regression to score paper relevance.
"""
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import numpy as np
import pandas as pd
import pickle

EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def load_data(path="data/processed/paper_relevance.csv"):
    """Load paper abstracts with relevance labels."""
    df = pd.read_csv(path)
    train_df, val_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["relevant"])
    return train_df, val_df

def compute_embeddings(texts, model=None):
    """Generate Sentence-BERT embeddings for paper abstracts."""
    if model is None:
        model = SentenceTransformer(EMBEDDING_MODEL)
    return model.encode(texts, show_progress_bar=True)

def train(train_df, val_df, output_dir="models/recommender"):
    """Train logistic regression on top of Sentence-BERT embeddings."""
    encoder = SentenceTransformer(EMBEDDING_MODEL)

    # Compute embeddings
    train_embeddings = compute_embeddings(train_df["abstract"].tolist(), encoder)
    val_embeddings = compute_embeddings(val_df["abstract"].tolist(), encoder)

    # Train classifier
    clf = LogisticRegression(max_iter=1000, C=1.0)
    clf.fit(train_embeddings, train_df["relevant"].values)

    # Evaluate
    val_preds = clf.predict(val_embeddings)
    print(classification_report(val_df["relevant"].values, val_preds))

    # Save
    with open(f"{output_dir}/classifier.pkl", "wb") as f:
        pickle.dump(clf, f)

    return clf, encoder

def score(abstract, clf, encoder):
    """Score a single paper abstract for relevance (0-100)."""
    embedding = encoder.encode([abstract])
    prob = clf.predict_proba(embedding)[0][1]  # probability of relevant class
    return round(prob * 100, 1)
