"""
Nodes Router — CRUD for syllabus nodes and connections
"""

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import get_database
from schemas import (
    SyllabusNodeCreate, SyllabusNodeUpdate, SyllabusNodeResponse,
    NodeConnectionCreate, NodesWithConnectionsResponse
)

router = APIRouter(prefix="/api/nodes", tags=["Nodes"])


def node_doc_to_response(doc: dict) -> dict:
    """Convert a MongoDB document to a SyllabusNodeResponse-compatible dict."""
    return {
        "id": str(doc["_id"]),
        "label": doc["label"],
        "icon": doc["icon"],
        "x": doc["x"],
        "y": doc["y"],
        "status": doc["status"],
        "color": doc.get("color"),
    }


def connection_doc_to_response(doc: dict) -> dict:
    """Convert a MongoDB connection doc to a response dict."""
    return {
        "from": doc["fromId"],
        "to": doc["toId"],
    }


@router.get("", response_model=NodesWithConnectionsResponse)
async def list_nodes():
    """Get all nodes and connections."""
    db = get_database()

    nodes = []
    async for doc in db.nodes.find():
        nodes.append(node_doc_to_response(doc))

    connections = []
    async for doc in db.connections.find():
        connections.append(connection_doc_to_response(doc))

    return NodesWithConnectionsResponse(nodes=nodes, connections=connections)


@router.post("", response_model=SyllabusNodeResponse, status_code=201)
async def create_node(node: SyllabusNodeCreate):
    """Create a new syllabus node with optional parent connection."""
    db = get_database()

    doc = {
        "label": node.label,
        "icon": node.icon,
        "x": node.x,
        "y": node.y,
        "status": node.status,
        "color": node.color,
    }

    result = await db.nodes.insert_one(doc)
    new_id = str(result.inserted_id)

    # Auto-create connection to parent if specified
    if node.parentId:
        # Verify parent exists
        try:
            parent_obj_id = ObjectId(node.parentId)
            parent = await db.nodes.find_one({"_id": parent_obj_id})
        except Exception:
            parent = None

        if parent:
            await db.connections.insert_one({
                "fromId": node.parentId,
                "toId": new_id,
            })

    doc["_id"] = result.inserted_id
    return node_doc_to_response(doc)


@router.put("/{node_id}", response_model=SyllabusNodeResponse)
async def update_node(node_id: str, update: SyllabusNodeUpdate):
    """Update a node (position, status, label, etc.)."""
    db = get_database()

    try:
        obj_id = ObjectId(node_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid node ID format")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.nodes.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Node not found")

    return node_doc_to_response(result)


@router.delete("/{node_id}", status_code=204)
async def delete_node(node_id: str):
    """Delete a node and all its connections."""
    db = get_database()

    try:
        obj_id = ObjectId(node_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid node ID format")

    # Delete the node
    result = await db.nodes.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Node not found")

    # Delete all connections involving this node
    await db.connections.delete_many({
        "$or": [
            {"fromId": node_id},
            {"toId": node_id},
        ]
    })


# ─── Connection Endpoints ────────────────────────────────

@router.post("/connections", status_code=201)
async def create_connection(connection: NodeConnectionCreate):
    """Create a connection between two nodes."""
    db = get_database()

    # Check if connection already exists
    existing = await db.connections.find_one({
        "$or": [
            {"fromId": connection.fromId, "toId": connection.toId},
            {"fromId": connection.toId, "toId": connection.fromId},
        ]
    })

    if existing:
        raise HTTPException(status_code=409, detail="Connection already exists")

    await db.connections.insert_one({
        "fromId": connection.fromId,
        "toId": connection.toId,
    })

    return {"from": connection.fromId, "to": connection.toId}


@router.delete("/connections", status_code=204)
async def delete_connection(fromId: str, toId: str):
    """Delete a connection between two nodes."""
    db = get_database()

    result = await db.connections.delete_many({
        "$or": [
            {"fromId": fromId, "toId": toId},
            {"fromId": toId, "toId": fromId},
        ]
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Connection not found")
