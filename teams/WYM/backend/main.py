"""
Aegis: Kinetic Archive — FastAPI Backend
Main entry point with CORS, router mounts, and database lifecycle.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import connect_to_mongo, close_mongo_connection
from seed import seed_database
from routers import sessions, nodes, ai

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: connect to MongoDB on startup, close on shutdown."""
    await connect_to_mongo()
    await seed_database()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Aegis: Kinetic Archive API",
    description="Backend API for the AI-powered adaptive Learning Operating System.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server and deployed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       # Vite dev server
        "http://localhost:4173",       # Vite preview
        "http://127.0.0.1:5173",
        "*",                           # Allow all in dev (tighten for production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(sessions.router)
app.include_router(nodes.router)
app.include_router(ai.router)


@app.get("/")
async def root():
    return {
        "name": "Aegis: Kinetic Archive API",
        "version": "1.0.0",
        "status": "operational",
        "message": "The Kinetic Archive is online. All systems nominal.",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=True)
