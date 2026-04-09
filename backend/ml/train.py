"""
Train ML models for Farm2City price prediction and crop recommendation.
Run from the backend/ directory:
    python -m ml.train
"""

import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

from ml.utils import generate_price_data, generate_rec_data

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)


def train_price_model():
    csv_path = os.path.join(BASE_DIR, "price_data.csv")
    df = generate_price_data(csv_path)

    le_crop = LabelEncoder()
    df["category_enc"] = le_crop.fit_transform(df["category"].str.lower())

    X = df[["category_enc", "month", "rainfall"]].values   # plain numpy → no feature-name warning
    y = df["predicted_price"].values

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model,   os.path.join(MODELS_DIR, "price_model.joblib"))
    joblib.dump(le_crop, os.path.join(MODELS_DIR, "le_crop.joblib"))
    print("✓ Price model trained and saved.")
    return le_crop.classes_.tolist()


def train_rec_model():
    csv_path = os.path.join(BASE_DIR, "rec_data.csv")
    df = generate_rec_data(csv_path)

    le_soil   = LabelEncoder()
    le_season = LabelEncoder()
    le_rec    = LabelEncoder()

    df["soil_enc"]   = le_soil.fit_transform(df["soil"].str.lower())
    df["season_enc"] = le_season.fit_transform(df["season"].str.lower())
    df["rec_enc"]    = le_rec.fit_transform(df["recommended_crop"])

    X = df[["soil_enc", "season_enc"]].values   # plain numpy
    y = df["rec_enc"].values

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model,     os.path.join(MODELS_DIR, "rec_model.joblib"))
    joblib.dump(le_soil,   os.path.join(MODELS_DIR, "le_soil.joblib"))
    joblib.dump(le_season, os.path.join(MODELS_DIR, "le_season.joblib"))
    joblib.dump(le_rec,    os.path.join(MODELS_DIR, "le_rec.joblib"))
    print("✓ Recommendation model trained and saved.")


if __name__ == "__main__":
    train_price_model()
    train_rec_model()
    print("All models ready.")
