"""
Schemas — Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


# ─── Session Schemas ──────────────────────────────────────

class SessionBase(BaseModel):
    title: str
    description: str
    time: str  # e.g. "10:00"
    timeEnd: Optional[str] = None  # e.g. "11:30"
    priority: Literal["high", "medium", "low"]
    status: Literal["upcoming", "active", "completed", "missed"] = "upcoming"
    subject: str
    sessionNumber: Optional[int] = None


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time: Optional[str] = None
    timeEnd: Optional[str] = None
    priority: Optional[Literal["high", "medium", "low"]] = None
    status: Optional[Literal["upcoming", "active", "completed", "missed"]] = None
    subject: Optional[str] = None
    sessionNumber: Optional[int] = None


class SessionResponse(SessionBase):
    id: str


# ─── Syllabus Node Schemas ────────────────────────────────

class SyllabusNodeBase(BaseModel):
    label: str
    icon: str  # Lucide icon name
    x: float
    y: float
    status: Literal["active", "completed", "locked"] = "locked"
    color: Optional[str] = None


class SyllabusNodeCreate(SyllabusNodeBase):
    parentId: Optional[str] = None  # Optional parent to auto-create connection


class SyllabusNodeUpdate(BaseModel):
    label: Optional[str] = None
    icon: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    status: Optional[Literal["active", "completed", "locked"]] = None
    color: Optional[str] = None


class SyllabusNodeResponse(SyllabusNodeBase):
    id: str


# ─── Node Connection Schemas ─────────────────────────────

class NodeConnectionBase(BaseModel):
    fromId: str = Field(alias="from")
    toId: str = Field(alias="to")

    model_config = {"populate_by_name": True}


class NodeConnectionCreate(BaseModel):
    fromId: str
    toId: str


class NodeConnectionResponse(BaseModel):
    fromId: str = Field(serialization_alias="from")
    toId: str = Field(serialization_alias="to")

    model_config = {"populate_by_name": True}


# ─── Nodes + Connections combined response ────────────────

class NodesWithConnectionsResponse(BaseModel):
    nodes: list[SyllabusNodeResponse]
    connections: list[dict]  # [{from: str, to: str}]


# ─── AI Generation Schemas ───────────────────────────────

class AIGenerateRequest(BaseModel):
    taskName: str
    priority: Optional[Literal["high", "medium", "low"]] = "medium"
    context: Optional[str] = None


class AIGenerateResponse(BaseModel):
    generatedText: str


# ─── Recalculation Response ──────────────────────────────

class RecalculateResponse(BaseModel):
    sessions: list[SessionResponse]
    burnoutRisk: float
    efficiency: float


# ─── Dashboard Stats ─────────────────────────────────────

class DashboardStats(BaseModel):
    burnoutRisk: float
    efficiency: float
    dayStreak: int
    peakOutput: str
    totalSessions: int
    completedSessions: int
    missedSessions: int
    pendingSessions: int
