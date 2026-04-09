"""
Singleton ML model wrapper loaded once at FastAPI startup.
"""

import os
import joblib
import numpy as np

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ── Intent keyword sets ────────────────────────────────────────────────────────
_PRICE_WORDS  = {"price", "cost", "rate", "how much", "expensive", "cheap", "worth"}
_REC_WORDS    = {"grow", "suggest", "recommend", "crop", "soil", "season", "plant", "sow"}
_HELP_WORDS   = {"help", "support", "navigate", "how to", "where", "what is", "can i"}
_TIPS_WORDS   = {"tip", "advice", "trick", "fertilizer", "water", "irrigation", "pest", "disease"}

# ── Model singleton ────────────────────────────────────────────────────────────
class MLModels:
    def __init__(self):
        self.price_model = None
        self.le_crop     = None
        self.rec_model   = None
        self.le_soil     = None
        self.le_season   = None
        self.le_rec      = None
        self._load()

    # ── Loader ────────────────────────────────────────────────────────────────
    def _load(self):
        try:
            self.price_model = joblib.load(os.path.join(MODELS_DIR, "price_model.joblib"))
            self.le_crop     = joblib.load(os.path.join(MODELS_DIR, "le_crop.joblib"))
            self.rec_model   = joblib.load(os.path.join(MODELS_DIR, "rec_model.joblib"))
            self.le_soil     = joblib.load(os.path.join(MODELS_DIR, "le_soil.joblib"))
            self.le_season   = joblib.load(os.path.join(MODELS_DIR, "le_season.joblib"))
            self.le_rec      = joblib.load(os.path.join(MODELS_DIR, "le_rec.joblib"))
            print("✓ All ML models loaded successfully.")
        except FileNotFoundError as e:
            print(f"⚠  Model file missing: {e}  — run `python -m ml.train` first.")
        except Exception as e:
            print(f"⚠  Could not load models: {e}")

    @property
    def ready(self) -> bool:
        return all([self.price_model, self.le_crop,
                    self.rec_model, self.le_soil,
                    self.le_season, self.le_rec])

    # ── Price prediction ──────────────────────────────────────────────────────
    def predict_price(self, category: str, month: int, rainfall: float) -> float | None:
        if not self.ready:
            return None
        cat = category.lower().strip()
        if cat not in self.le_crop.classes_:
            # Unknown crop — return average-ish fallback
            return None
        crop_enc   = int(self.le_crop.transform([cat])[0])
        X          = np.array([[crop_enc, month, rainfall]])   # plain ndarray
        prediction = self.price_model.predict(X)[0]
        return round(float(prediction), 2)

    # ── Crop recommendation ───────────────────────────────────────────────────
    def recommend_crop(self, soil: str, season: str) -> str:
        if not self.ready:
            return "Millets"
        soil_l   = soil.lower().strip()
        season_l = season.lower().strip()

        if soil_l not in self.le_soil.classes_:
            return "Millets"
        if season_l not in self.le_season.classes_:
            return "Millets"

        soil_enc   = int(self.le_soil.transform([soil_l])[0])
        season_enc = int(self.le_season.transform([season_l])[0])
        X          = np.array([[soil_enc, season_enc]])
        rec_enc    = int(self.rec_model.predict(X)[0])
        return str(self.le_rec.inverse_transform([rec_enc])[0])

    # ── Chatbot intent response ───────────────────────────────────────────────
    def get_chat_response(self, query: str) -> str:
        q = query.lower()

        # Check for crop+soil recommendation intent first (most specific)
        if any(w in q for w in _REC_WORDS):
            found_soil   = next((s for s in self.le_soil.classes_   if s in q), None) if self.ready else None
            found_season = next((s for s in self.le_season.classes_ if s in q), None) if self.ready else None

            if found_soil and found_season:
                crop = self.recommend_crop(found_soil, found_season)
                return (
                    f"🌱 Based on our ML model, I recommend growing **{crop}** "
                    f"for {found_soil.title()} soil during {found_season.title()}. "
                    f"It's predicted to give the best yield and market demand!"
                )
            return (
                "🌾 I can recommend crops! Tell me your soil type "
                "(loamy, clay, sandy, alluvial, black, red, laterite) and "
                "season (summer, winter, monsoon). "
                "Example: *'What should I grow in black soil during monsoon?'*"
            )

        elif any(w in q for w in _PRICE_WORDS):
            knowncrops = list(self.le_crop.classes_) if self.ready else ["tomatoes", "wheat", "mangoes"]
            return (
                f"💰 Our AI models predict prices based on crop type, month and rainfall. "
                f"Currently supported crops: {', '.join(knowncrops)}. "
                f"Head to your **Dashboard → Add Product** and hit **AI Suggest** to get the predicted price!"
            )

        elif any(w in q for w in _TIPS_WORDS):
            return (
                "🌿 Farming Tips: \n"
                "• Water crops early morning to reduce evaporation.\n"
                "• Rotate crops to maintain soil health.\n"
                "• Use organic fertilizers to improve long-term yields.\n"
                "• Monitor pests weekly and act early for best results."
            )

        elif any(w in q for w in _HELP_WORDS):
            return (
                "🤖 I'm AgriBot, your AI farming assistant! Here's what I can do:\n"
                "• **Price Predictions** — ask 'What is the price of tomatoes?'\n"
                "• **Crop Recommendations** — ask 'What should I grow in loamy soil this summer?'\n"
                "• **Farming Tips** — ask 'Any tips for irrigation?'\n"
                "• **Platform Help** — navigate the Dashboard to add products & view AI insights."
            )

        elif any(w in q for w in {"farm2city", "platform", "marketplace", "app", "site"}):
            return (
                "🏪 Farm2City connects farmers directly with city buyers, removing middlemen. "
                "Farmers get fair prices; buyers get fresh produce. "
                "Use the Dashboard to list your products with AI-suggested prices!"
            )

        else:
            return (
                "I'm not quite sure about that. Try asking me:\n"
                "• 'What should I grow in black soil in summer?'\n"
                "• 'What is the price of wheat?'\n"
                "• 'Give me farming tips'\n"
                "• 'Help me use the platform'"
            )


# Global singleton — loaded once when FastAPI starts
ml_models = MLModels()
