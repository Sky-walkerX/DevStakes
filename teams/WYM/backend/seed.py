"""
Seed — Populate the database with default data if empty
"""

from database import get_database


SEED_SESSIONS = [
    {
        "title": "Advanced Typography",
        "description": "System-wide grid logic and variable font weight optimization.",
        "time": "10:00",
        "timeEnd": "11:30",
        "priority": "high",
        "status": "upcoming",
        "subject": "Design Systems",
        "sessionNumber": 3,
    },
    {
        "title": "Neural Architecture",
        "description": "Mapping synaptic pathways in generative design systems.",
        "time": "13:30",
        "timeEnd": "15:00",
        "priority": "medium",
        "status": "upcoming",
        "subject": "AI Fundamentals",
        "sessionNumber": 7,
    },
    {
        "title": "System Maintenance",
        "description": "Archive cleaning and node optimization cycles.",
        "time": "16:00",
        "timeEnd": "17:00",
        "priority": "low",
        "status": "upcoming",
        "subject": "Operations",
        "sessionNumber": 2,
    },
    {
        "title": "Quantum Physics",
        "description": "Particle entanglement theory and wave function collapse.",
        "time": "18:00",
        "timeEnd": "19:30",
        "priority": "high",
        "status": "upcoming",
        "subject": "Physics",
        "sessionNumber": 4,
    },
    {
        "title": "Data Structures",
        "description": "B-trees, red-black trees, and skip list implementations.",
        "time": "20:00",
        "timeEnd": "21:00",
        "priority": "medium",
        "status": "upcoming",
        "subject": "Computer Science",
        "sessionNumber": 12,
    },
]

SEED_NODES = [
    {
        "label": "BLACK HOLES",
        "icon": "Circle",
        "x": 380,
        "y": 140,
        "status": "active",
        "color": "#34d399",
    },
    {
        "label": "ASTROPHYSICS",
        "icon": "Star",
        "x": 260,
        "y": 260,
        "status": "active",
        "color": "#60a5fa",
    },
    {
        "label": "DARK MATTER",
        "icon": "CloudLightning",
        "x": 140,
        "y": 380,
        "status": "active",
        "color": "#a882ff",
    },
    {
        "label": "QUANTUM FIELD",
        "icon": "Atom",
        "x": 400,
        "y": 380,
        "status": "locked",
        "color": "#f472b6",
    },
    {
        "label": "RELATIVITY",
        "icon": "Orbit",
        "x": 100,
        "y": 160,
        "status": "completed",
        "color": "#34d399",
    },
]


async def seed_database():
    """
    Seed the database with default data if collections are empty.
    """
    db = get_database()

    # Seed sessions
    session_count = await db.sessions.count_documents({})
    if session_count == 0:
        result = await db.sessions.insert_many(SEED_SESSIONS)
        print(f"Seeded {len(result.inserted_ids)} sessions")
    else:
        print(f"Sessions collection already has {session_count} documents")

    # Seed nodes
    node_count = await db.nodes.count_documents({})
    if node_count == 0:
        result = await db.nodes.insert_many(SEED_NODES)
        node_ids = result.inserted_ids

        # Create connections using the actual MongoDB IDs
        connections = [
            {"fromId": str(node_ids[4]), "toId": str(node_ids[0])},  # RELATIVITY → BLACK HOLES
            {"fromId": str(node_ids[0]), "toId": str(node_ids[1])},  # BLACK HOLES → ASTROPHYSICS
            {"fromId": str(node_ids[1]), "toId": str(node_ids[2])},  # ASTROPHYSICS → DARK MATTER
            {"fromId": str(node_ids[1]), "toId": str(node_ids[3])},  # ASTROPHYSICS → QUANTUM FIELD
            {"fromId": str(node_ids[4]), "toId": str(node_ids[2])},  # RELATIVITY → DARK MATTER
        ]

        await db.connections.insert_many(connections)
        print(f"Seeded {len(node_ids)} nodes and {len(connections)} connections")
    else:
        print(f"Nodes collection already has {node_count} documents")
