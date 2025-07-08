import os
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Always save/load the model alongside this script
MODEL_PATH = os.path.join(os.path.dirname(__file__), "phish_model.pkl")

def build_pipeline() -> Pipeline:
    """
    Construct a scikit-learn Pipeline:
      - TF-IDF vectorizer on cleaned text (up to 15k features, bi-grams)
      - Balanced logistic regression classifier
    """
    return Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=15_000,
            ngram_range=(1, 2),
            stop_words="english"
        )),
        ("clf", LogisticRegression(
            solver="liblinear",
            class_weight="balanced",
            max_iter=1000
        )),
    ])

def train_and_persist(df, label_col="label") -> None:
    """
    Train the pipeline on df.cleaned_text vs. df[label_col], then save it.
    """
    X = df["cleaned_text"]
    y = df[label_col].astype(int)
    pipeline = build_pipeline()
    pipeline.fit(X, y)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")

def load_pipeline() -> Pipeline:
    """
    Load and return the persisted Pipeline for inference.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"No model found at {MODEL_PATH}. Have you run train_and_persist?")
    return joblib.load(MODEL_PATH)
