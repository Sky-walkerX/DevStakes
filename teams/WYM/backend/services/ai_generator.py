"""
AI Generator — Groq API integration for project description generation
Uses Groq's blazing-fast LLM inference (free tier).
"""

import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


async def generate_description(task_name: str, priority: str = "medium", context: str = "") -> str:
    """
    Generate a project/task description using Groq's LLM API.
    Falls back to a template-based description if the API key is missing or the call fails.
    """
    # Fallback if no API key is configured
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
        return _fallback_description(task_name, priority)

    try:
        client = AsyncGroq(api_key=GROQ_API_KEY)

        priority_context = {
            "high": "This is a critical, high-priority initiative requiring immediate and focused attention.",
            "medium": "This is a standard-priority initiative with balanced urgency.",
            "low": "This is a low-priority initiative that can be worked on during available downtime.",
        }

        system_prompt = (
            "You are Aegis, an AI learning assistant inside the Kinetic Archive platform. "
            "You help students plan and describe their study projects and learning initiatives. "
            "Your tone is precise, motivating, and slightly futuristic — like a mission briefing from a sci-fi command center. "
            "Keep descriptions concise (2-3 paragraphs max). Use strategic language."
        )

        user_prompt = (
            f"Generate a compelling project description for a study initiative called: \"{task_name}\"\n\n"
            f"Priority Level: {priority}. {priority_context.get(priority, '')}\n"
            f"{f'Additional context: {context}' if context else ''}\n\n"
            "The description should outline goals, approach, and expected outcomes. "
            "Make it sound like a strategic mission briefing."
        )

        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=300,
            top_p=1,
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"⚠️ Groq API error: {e}")
        return _fallback_description(task_name, priority)


def _fallback_description(task_name: str, priority: str) -> str:
    """Template-based fallback when the Groq API is unavailable."""
    priority_label = {
        "high": "CRITICAL PRIORITY",
        "medium": "STANDARD PRIORITY",
        "low": "BACKGROUND PRIORITY",
    }

    return (
        f"MISSION BRIEF — {priority_label.get(priority, 'STANDARD PRIORITY')}\n\n"
        f"Initiative \"{task_name}\" has been queued for strategic deployment within the Kinetic Archive. "
        f"This operation focuses on establishing core knowledge foundations and mapping synaptic pathways "
        f"for accelerated comprehension.\n\n"
        f"Phase 1 involves reconnaissance of existing knowledge structures, followed by systematic "
        f"integration of new data streams. The Aegis Engine will monitor burnout vectors and dynamically "
        f"adjust session intensity to maintain optimal cognitive throughput.\n\n"
        f"Expected outcome: Full operational competence within the designated timeline. Stay sharp, Operator."
    )
