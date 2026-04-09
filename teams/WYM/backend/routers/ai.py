"""
AI Router — Groq-powered description generation
"""

from fastapi import APIRouter
from schemas import AIGenerateRequest, AIGenerateResponse
from services.ai_generator import generate_description

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/generate-description", response_model=AIGenerateResponse)
async def generate_project_description(request: AIGenerateRequest):
    """
    Generate a project description using Groq's LLM.
    Falls back to a template if the API key is not configured.
    """
    text = await generate_description(
        task_name=request.taskName,
        priority=request.priority or "medium",
        context=request.context or "",
    )

    return AIGenerateResponse(generatedText=text)
