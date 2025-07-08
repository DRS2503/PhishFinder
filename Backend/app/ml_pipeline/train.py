import argparse
from .preprocess import load_and_clean_csv
from .model_pipeline import train_and_persist

def main():
    parser = argparse.ArgumentParser(
        description="Train phishing detection model on a labeled CSV"
    )
    parser.add_argument(
        "csv_path",
        help="Path to your labeled CSV file"
    )
    parser.add_argument(
        "--text-col",
        default="body",
        help="Name of the column containing the email text"
    )
    parser.add_argument(
        "--label-col",
        default="label",
        help="Name of the column containing the binary labels"
    )
    args = parser.parse_args()

    # Load & clean
    df = load_and_clean_csv(
        args.csv_path,
        text_col=args.text_col,
        label_col=args.label_col
    )
    # Train & save
    train_and_persist(df, label_col=args.label_col)

if __name__ == "__main__":
    main()
