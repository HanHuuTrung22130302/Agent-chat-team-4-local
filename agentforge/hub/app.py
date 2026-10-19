"""
AgentForge Hub — Central Orchestrator FastAPI & WebSocket Server.
Runs on Ubuntu Server (port 8000), coordinates 4 agent machines and serves Dashboard UI.
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from protocol import JSONRPCRequest, JSONRPCResponse, AgentInfo, TaskItem
from storage import HubStorage

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("agentforge.hub")

storage = HubStorage()
active_connections: Dict[str, WebSocket] = {}  # agent_id -> WebSocket
ui_connections: List[WebSocket] = []           # Web dashboard sockets

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AgentForge Hub starting up...")
    await storage.connect_db()
    yield
    logger.info("AgentForge Hub shutting down...")

app = FastAPI(title="AgentForge Hub", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def broadcast_ui(event_type: str, data: Any):
    """Broadcast real-time state change to all web dashboard tabs."""
    message = json.dumps({"event": event_type, "data": data})
    dead_uis = []
    for ws in ui_connections:
        try:
            await ws.send_text(message)
        except Exception:
            dead_uis.append(ws)
    for ws in dead_uis:
        if ws in ui_connections:
            ui_connections.remove(ws)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    current_agent_id = None
    try:
        while True:
            raw_text = await websocket.receive_text()
            try:
                data = json.loads(raw_text)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}}))
                continue

            method = data.get("method", "")
            params = data.get("params", {})
            msg_id = data.get("id")

            # 1. Agent Registration
            if method == "agent.register":
                current_agent_id = params.get("agent_id")
                active_connections[current_agent_id] = websocket
                client_ip = websocket.client.host if websocket.client else "unknown"
                agent = AgentInfo(
                    agent_id=current_agent_id,
                    role=params.get("role", "developer"),
                    hostname=params.get("hostname", "unknown"),
                    ip=client_ip,
                    engine=params.get("engine", "opencode"),
                    model=params.get("model", "free"),
                    status="idle"
                )
                await storage.register_agent(agent)
                await storage.add_message("System", f"Agent [{agent.role.upper()}] ({agent.agent_id}) connected from {client_ip}")
                await broadcast_ui("agent_update", agent.dict())
                await websocket.send_text(json.dumps({
                    "jsonrpc": "2.0",
                    "result": {"status": "registered", "agent_id": current_agent_id},
                    "id": msg_id
                }))
                logger.info(f"Agent registered: {current_agent_id} ({agent.role})")

            # 2. Agent Heartbeat
            elif method == "agent.heartbeat":
                if current_agent_id:
                    await storage.update_agent_status(current_agent_id, params.get("status", "idle"))
                    await broadcast_ui("agent_heartbeat", {"agent_id": current_agent_id})

            # 3. Task Progress Stream
            elif method == "task.progress":
                task_id = params.get("task_id")
                msg = params.get("message", "")
                await storage.add_message(current_agent_id or "Agent", f"[{task_id}] {msg}")
                await broadcast_ui("task_progress", params)

            # 4. Task Completion
            elif method == "task.complete":
                task_id = params.get("task_id")
                if task_id in storage.tasks:
                    task = storage.tasks[task_id]
                    task.status = "done"
                    task.branch = params.get("branch", task.branch)
                    task.commit_sha = params.get("commit_sha")
                    await storage.save_task(task)
                if current_agent_id:
                    await storage.update_agent_status(current_agent_id, "idle", current_task_id=None)
                summary = params.get("summary", "Task completed")
                await storage.add_message(current_agent_id or "Agent", f"✅ Task {task_id} completed: {summary}")
                await broadcast_ui("task_complete", params)

            # 5. Task Failure / Defect Report
            elif method == "task.failed":
                task_id = params.get("task_id")
                if task_id in storage.tasks:
                    storage.tasks[task_id].status = "failed"
                    await storage.save_task(storage.tasks[task_id])
                details = params.get("details", "Task failed")
                await storage.add_message(current_agent_id or "Agent", f"❌ Task {task_id} FAILED: {details}")
                await broadcast_ui("task_failed", params)

            # 6. Chat Message
            elif method == "chat.message":
                sender = params.get("sender", current_agent_id or "Anonymous")
                content = params.get("content", "")
                msg_obj = await storage.add_message(sender, content)
                await broadcast_ui("chat_message", msg_obj)

    except WebSocketDisconnect:
        if current_agent_id:
            logger.info(f"Agent disconnected: {current_agent_id}")
            if current_agent_id in active_connections:
                del active_connections[current_agent_id]
            await storage.remove_agent(current_agent_id)
            await storage.add_message("System", f"Agent {current_agent_id} disconnected")
            await broadcast_ui("agent_offline", {"agent_id": current_agent_id})

@app.websocket("/ws/ui")
async def ui_websocket_endpoint(websocket: WebSocket):
    """Dedicated WebSocket for the real-time web dashboard."""
    await websocket.accept()
    ui_connections.append(websocket)
    try:
        while True:
            # Keep alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in ui_connections:
            ui_connections.remove(websocket)

# --- REST APIs for Web Dashboard & Automation ---

@app.get("/api/agents")
async def get_agents():
    return list(storage.agents.values())

@app.get("/api/tasks")
async def get_tasks():
    return list(storage.tasks.values())

class CreateTaskRequest(BaseModel):
    title: str
    description: str = ""
    assigned_role: str = "lead"
    priority: str = "medium"
    engine: Optional[str] = "opencode"   # opencode | antigravity
    model: Optional[str] = None          # model override

@app.post("/api/tasks")
async def create_task(req: CreateTaskRequest):
    task_id = f"TASK-{len(storage.tasks) + 1:03d}"
    task = TaskItem(
        task_id=task_id,
        title=req.title,
        description=req.description,
        assigned_role=req.assigned_role,
        priority=req.priority,
        engine=req.engine,
        model=req.model,
        status="pending"
    )
    # Find matching agent for role
    target_ws = None
    target_agent_id = None
    for a_id, agent in storage.agents.items():
        if agent.role == req.assigned_role and agent.status == "idle" and a_id in active_connections:
            target_ws = active_connections[a_id]
            target_agent_id = a_id
            break

    if target_ws and target_agent_id:
        task.assigned_agent_id = target_agent_id
        task.status = "in_progress"
        await storage.update_agent_status(target_agent_id, "busy", current_task_id=task_id)
        # Dispatch JSON-RPC to agent with engine and model choice
        payload = {
            "jsonrpc": "2.0",
            "method": "task.assign",
            "params": {
                "task_id": task_id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "engine": task.engine,
                "model": task.model
            },
            "id": 1
        }
        await target_ws.send_text(json.dumps(payload))
        engine_label = f"{task.engine or 'default'} ({task.model or 'default'})"
        await storage.add_message("Hub", f"Assigned {task_id} to {target_agent_id} [{engine_label}]")

    await storage.save_task(task)
    await broadcast_ui("task_created", task.dict())
    return task

class UpdateAgentConfig(BaseModel):
    engine: str
    model: str

@app.post("/api/agents/{agent_id}/config")
async def update_agent_config(agent_id: str, req: UpdateAgentConfig):
    if agent_id in storage.agents:
        storage.agents[agent_id].engine = req.engine
        storage.agents[agent_id].model = req.model
        await broadcast_ui("agent_update", storage.agents[agent_id].dict())
        if agent_id in active_connections:
            await active_connections[agent_id].send_text(json.dumps({
                "jsonrpc": "2.0",
                "method": "agent.config_update",
                "params": {"engine": req.engine, "model": req.model}
            }))
        return {"status": "ok", "agent": storage.agents[agent_id]}
    raise HTTPException(status_code=404, detail="Agent not found")

@app.get("/api/messages")
async def get_messages():
    return storage.messages

# Serve static dashboard UI files if present
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
