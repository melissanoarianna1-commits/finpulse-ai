"""
Financial Sentiment Classifier
Fine-tunes FinBERT on Financial PhraseBank dataset.
"""
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import pandas as pd
import torch

MODEL_NAME = "ProsusAI/finbert"

def load_data(path="data/processed/financial_phrasebank.csv"):
    """Load and split the Financial PhraseBank dataset."""
    df = pd.read_csv(path)
    train_df, val_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["label"])
    return train_df, val_df

def tokenize(texts, tokenizer, max_length=128):
    """Tokenize a list of texts for FinBERT."""
    return tokenizer(texts, padding=True, truncation=True, max_length=max_length, return_tensors="pt")

def train(train_df, val_df, output_dir="models/sentiment"):
    """Fine-tune FinBERT on the training set."""
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3)

    # Training arguments
    args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        logging_steps=50,
    )

    # TODO: Create Dataset objects and compute_metrics function
    # See notebook 01_sentiment_model.ipynb for full implementation

    return model, tokenizer

def predict(text, model, tokenizer):
    """Predict sentiment for a single text."""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1)
    labels = ["negative", "neutral", "positive"]
    pred_idx = probs.argmax().item()
    return {"label": labels[pred_idx], "confidence": probs[0][pred_idx].item()}
