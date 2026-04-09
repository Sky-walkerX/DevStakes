"""
Farm2City ML Backend — FastAPI entry point.
Start with:  uvicorn main:app --reload
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.model import ml_models   # singleton loaded once at import time

app = FastAPI(
    title="Farm2City ML API",
    description="ML-powered price prediction, crop recommendation, and chatbot",
    version="2.0.0",
)

# ── CORS (allow all origins for local dev) ─────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ─────────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    query: str


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Farm2City ML API is running 🌾",
        "models_loaded": ml_models.ready,
    }


# ── Price Prediction ───────────────────────────────────────────────────────────
@app.get("/predict-price", tags=["ML"])
def predict_price(
    category: str = Query(..., description="Crop type, e.g. tomatoes, wheat"),
    month:    int  = Query(..., ge=1, le=12, description="Month number 1-12"),
    rainfall: float = Query(..., description="Expected rainfall in mm"),
):
    """Predict market price per kg for a given crop, month and rainfall."""
    predicted = ml_models.predict_price(category, month, rainfall)

    if predicted is None:
        # Return a sensible default so UI never breaks
        known = list(ml_models.le_crop.classes_) if ml_models.ready else []
        return {
            "predicted_price": 50.0,
            "currency": "₹",
            "unit": "kg",
            "note": f"Unknown category '{category}'. Known: {known}. Showing default price.",
        }

    return {
        "predicted_price": predicted,
        "currency": "₹",
        "unit": "kg",
        "category": category,
        "month": month,
        "rainfall": rainfall,
    }


# ── Crop Recommendation ────────────────────────────────────────────────────────
@app.get("/recommend-crop", tags=["ML"])
def recommend_crop(
    soil:   str = Query(..., description="Soil type, e.g. loamy, black, red"),
    season: str = Query(..., description="Season: summer | winter | monsoon"),
):
    """Recommend the best crop to grow for a given soil type and season."""
    recommendation = ml_models.recommend_crop(soil, season)
    return {
        "recommended_crop": recommendation,
        "soil_type": soil,
        "season": season,
    }


# ── Chatbot ────────────────────────────────────────────────────────────────────
@app.post("/chat", tags=["Chatbot"])
def chat(req: ChatRequest):
    """ML-enhanced chatbot: keyword intent classification + model-backed replies."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    reply = ml_models.get_chat_response(req.query)
    return {"reply": reply}


# ── Dev runner ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
