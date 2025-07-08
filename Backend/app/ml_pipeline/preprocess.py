import re
import string
import numpy as np
import sklearn

import pandas as pd
from pandas import DataFrame
from pathlib import Path
from typing import Callable, Dict

import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report
import joblib

nltk.download('stopwords', download_dir='Backend/app/nltk_data')
nltk.download('punkt', download_dir='Backend/app/nltk_data')

'''
Preprocessing
'''

def clean_text(text: str) -> str:
    text = re.sub(r"http\S+", "", text)        # Remove URLs
    text = re.sub(r"<.*?>", "", text)          # Remove HTML
    text = re.sub(r"[^a-zA-Z\s]", "", text)    # Remove symbols
    return text.lower().strip()

def load_and_clean_csv(file_path: Path, text_col: str, label_col: str, label_map: Dict[str, int]) -> DataFrame:
    df = pd.read_csv(file_path)  # Load CSV

    if text_col not in df.columns or label_col not in df.columns:
        raise ValueError("Missing required columns")  # Check column for null

    df['text'] = df[text_col].astype(str).apply(clean_text)  # Apply formatting
    df['label'] = df[label_col].map(label_map)  # Apply mapping
    return df[['text', 'label']].dropna()

def preprocess_texts(texts: list) -> list:
    return [clean_text(text) for text in texts]

'''
Model Training and Prediction
'''

def train_model(data: DataFrame, model_path: Path) -> None:
    # Vectorize text data
    vectorizer = CountVectorizer(stop_words=stopwords.words('english'))
    X = vectorizer.fit_transform(data['text'])
    y = data['label']

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a Naive Bayes classifier
    model = MultinomialNB()
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

    # Save the model and vectorizer
    joblib.dump(model, model_path / "phishing_model.pkl")
    joblib.dump(vectorizer, model_path / "vectorizer.pkl")
    print(f"Model and vectorizer saved to {model_path}")

def load_model(model_path: Path):
    model = joblib.load(model_path / "phishing_model.pkl")
    vectorizer = joblib.load(model_path / "vectorizer.pkl")
    return model, vectorizer

def predict_emails(emails: list, model_path: Path) -> list:
    model, vectorizer = load_model(model_path)
    processed_emails = preprocess_texts(emails)
    email_vectors = vectorizer.transform(processed_emails)
    predictions = model.predict(email_vectors)
    return predictions

'''
Pipeline Execution
'''

def run_pipeline():
    base_path = Path(__file__).resolve().parent / "datasets"
    output_path = base_path / "combined_cleaned.csv"
    model_path = Path(__file__).resolve().parent / "models"
    model_path.mkdir(exist_ok=True)

    datasets = [
        {
            "file": base_path / "PhishingEmailData.csv",
            "text_col": "Email Text",
            "label_col": "Label",
            "label_map": {"phishing": 1, "legitimate": 0}  # Convert string labels to binary label
        },
        # Add more datasets here if needed... following {format}
    ]

    all_data = []
    for d in datasets:
        df = load_and_clean_csv(d["file"], d["text_col"], d["label_col"], d["label_map"])
        all_data.append(df)

    final_df = pd.concat(all_data, ignore_index=True)
    final_df.to_csv(output_path, index=False)
    print(f"Combined cleaned data saved to: {output_path}")

    # Train the model
    train_model(final_df, model_path)

# Example usage for prediction
def predict_new_emails(file_path: Path, model_path: Path):
    df = pd.read_csv(file_path)
    if 'Email Text' not in df.columns:
        raise ValueError("Missing 'Email Text' column in uploaded CSV")
    emails = df['Email Text'].tolist()
    predictions = predict_emails(emails, model_path)
    df['Prediction'] = predictions
    output_path = file_path.parent / "predictions.csv"
    df.to_csv(output_path, index=False)
    print(f"Predictions saved to: {output_path}")
