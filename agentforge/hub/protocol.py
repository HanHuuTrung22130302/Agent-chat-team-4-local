"""
JSON-RPC 2.0 Protocol definitions and message schemas for AgentForge.
"""
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field

class JSONRPCRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: Optional[Dict[str, Any]] = Field(default_factory=dict)
    id: Optional[Union[str, int]] = None

class JSONRPCResponse(BaseModel):
    jsonrpc: str = "2.0"
    result: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None
    id: Optional[Union[str, int]] = None

class AgentInfo(BaseModel):
    agent_id: str
    role: str                       # lead, ba, developer, tester
    hostname: str = "unknown"
    ip: str = "unknown"
    engine: str = "opencode"        # opencode | antigravity
    model: str = "free"
    status: str = "idle"            # idle | busy | offline
    current_task_id: Optional[str] = None
    connected_at: Optional[str] = None
    last_heartbeat: Optional[str] = None

class TaskItem(BaseModel):
    task_id: str
    project_id: str = "adb-erp"
    title: str
    description: str = ""
    assigned_role: str              # lead, ba, developer, tester
    assigned_agent_id: Optional[str] = None
    status: str = "pending"         # pending | in_progress | review | done | failed
    priority: str = "medium"        # low | medium | high | critical
    branch: Optional[str] = None
    commit_sha: Optional[str] = None
    spec_artifact: Optional[str] = None
    created_at: Optional[str] = None
    completed_at: Optional[str] = None
    logs: List[str] = Field(default_factory=list)
