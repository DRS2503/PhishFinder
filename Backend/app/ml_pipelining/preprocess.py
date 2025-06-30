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



nltk.download('stopwords', download_dir='Backend/app/nltk_data')
nltk.download('punkt', download_dir='Backend/app/nltk_data')

'''
Preprocessing
'''

def clean_text(text: str) -> str:
    text = re.sub(r"http\S+", "", text)        #remove URLs
    text = re.sub(r"<.*?>", "", text)          #remove HTML
    text = re.sub(r"[^a-zA-Z\s]", "", text)    #remove symbols
    return text.lower().strip()

def load_and_clean_csv(file_path: Path, text_col: str, label_col: str, label_map:Dict[str, int]) -> DataFrame:
    df = pd.read_csv(file_path) #load csv

    if text_col not in df.columns or label_col not in df.columns:
        print("missing required columns") #check column for null

    df['text'] = df[text_col].astype(str).apply(clean_text) #apply formatting
    df['label'] = df[label_col].map(label_map) #apply mapping
    return df[['text', 'label']].dropna()

def run_preprocessing():
    base_path = Path(__file__).resolve().parent / "datasets"
    output_path = base_path / "combined_cleaned.csv"
    print(base_path)
    datasets = [
        {
            "file": base_path / "PhishingEmailData.csv",
            "text_col": "Email Text",
            "label_col": "Label",
            "label_map": {"phishing": 1, "legitimate": 0} #convert string labels to binary label
        },
        #add more datasets here if needed... following {format}
    ]

    all_data = []
    for d in datasets:
        df = load_and_clean_csv(d["file"], d["text_col"], d["label_col"], d["label_map"])
        all_data.append(df)

    final_df = pd.concat(all_data, ignore_index=True)
    final_df.to_csv(output_path, index=False)
    print(f"Combined cleaned data saved to: {output_path}")
