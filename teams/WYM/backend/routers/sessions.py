"""
Sessions Router — CRUD + Recalculation for study sessions
"""

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import get_database
from schemas import (
    SessionCreate, SessionUpdate, SessionResponse,
    RecalculateResponse, DashboardStats
)
from services.burnout import calculate_burnout_risk, calculate_efficiency, compute_peak_output
from services.scheduler import recalculate_schedule

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])


def session_doc_to_response(doc: dict) -> dict:
    """Convert a MongoDB document to a SessionResponse-compatible dict."""
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc["description"],
        "time": doc["time"],
        "timeEnd": doc.get("timeEnd"),
        "priority": doc["priority"],
        "status": doc["status"],
        "subject": doc["subject"],
        "sessionNumber": doc.get("sessionNumber"),
    }


@router.get("", response_model=list[SessionResponse])
async def list_sessions():
    """Get all sessions, sorted by time."""
    db = get_database()
    cursor = db.sessions.find().sort("time", 1)
    sessions = []
    async for doc in cursor:
        sessions.append(session_doc_to_response(doc))
    return sessions


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session(session: SessionCreate):
    """Create a new session."""
    db = get_database()

    # Auto-calculate session number based on subject
    subject_count = await db.sessions.count_documents({"subject": session.subject})
    session_number = session.sessionNumber or (subject_count + 1)

    doc = {
        **session.model_dump(),
        "sessionNumber": session_number,
    }

    result = await db.sessions.insert_one(doc)
    doc["_id"] = result.inserted_id

    return session_doc_to_response(doc)


@router.put("/{session_id}", response_model=SessionResponse)
async def update_session(session_id: str, update: SessionUpdate):
    """Update a session (e.g., change status to 'missed' or 'completed')."""
    db = get_database()

    try:
        obj_id = ObjectId(session_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.sessions.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Session not found")

    return session_doc_to_response(result)


@router.delete("/{session_id}", status_code=204)
async def delete_session(session_id: str):
    """Delete a session."""
    db = get_database()

    try:
        obj_id = ObjectId(session_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    result = await db.sessions.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")


@router.post("/recalculate", response_model=RecalculateResponse)
async def recalculate_sessions():
    """
    Run smart recalculation:
    1. Fetch all sessions
    2. Reschedule missed ones into available slots
    3. Update the database
    4. Return new sessions + burnout risk
    """
    db = get_database()

    # Fetch all sessions
    cursor = db.sessions.find()
    sessions = []
    async for doc in cursor:
        sessions.append({**doc, "_id": str(doc["_id"])})

    # Run recalculation
    rescheduled = recalculate_schedule(
        [{**s, "id": s["_id"]} for s in sessions]
    )

    # Clear and rewrite sessions in database
    await db.sessions.delete_many({})
    if rescheduled:
        # Remove the temporary 'id' and '_id' fields before reinserting
        clean_docs = []
        for s in rescheduled:
            doc = {k: v for k, v in s.items() if k not in ("id", "_id")}
            clean_docs.append(doc)
        await db.sessions.insert_many(clean_docs)

    # Fetch fresh sessions
    cursor = db.sessions.find().sort("time", 1)
    fresh_sessions = []
    async for doc in cursor:
        fresh_sessions.append(session_doc_to_response(doc))

    # Calculate metrics
    all_docs = []
    async for doc in db.sessions.find():
        all_docs.append(doc)

    burnout = calculate_burnout_risk(all_docs)
    efficiency = calculate_efficiency(all_docs)

    return RecalculateResponse(
        sessions=fresh_sessions,
        burnoutRisk=burnout,
        efficiency=efficiency,
    )


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get computed dashboard statistics."""
    db = get_database()

    sessions = []
    async for doc in db.sessions.find():
        sessions.append(doc)

    total = len(sessions)
    completed = sum(1 for s in sessions if s.get("status") == "completed")
    missed = sum(1 for s in sessions if s.get("status") == "missed")
    pending = sum(1 for s in sessions if s.get("status") in ("upcoming", "active"))

    burnout = calculate_burnout_risk(sessions)
    efficiency = calculate_efficiency(sessions)
    peak = compute_peak_output(sessions)

    # Day streak: count consecutive days with at least one completed session
    # Simplified: use completed count as proxy
    day_streak = max(1, completed * 3)  # Rough estimation

    return DashboardStats(
        burnoutRisk=burnout,
        efficiency=efficiency,
        dayStreak=day_streak,
        peakOutput=peak,
        totalSessions=total,
        completedSessions=completed,
        missedSessions=missed,
        pendingSessions=pending,
    )
