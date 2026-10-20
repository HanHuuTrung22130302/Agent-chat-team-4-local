"""
State manager and database storage for AgentForge Hub.
Maintains in-memory state of connected WebSocket clients and persists tasks/events to PostgreSQL.
"""
import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
import asyncpg
from protocol import AgentInfo, TaskItem

logger = logging.getLogger("agentforge.storage")

class HubStorage:
    def __init__(self, db_url: Optional[str] = None):
        self.db_url = db_url or os.getenv(
            "DATABASE_URL", 
            "postgresql://postgres:1@localhost:5432/agentforge"
        )
        self.pool: Optional[asyncpg.Pool] = None
        self.agents: Dict[str, AgentInfo] = {}  # agent_id -> AgentInfo
        self.tasks: Dict[str, TaskItem] = {}    # task_id -> TaskItem
        self.messages: List[Dict] = []          # live chat / log history

    async def connect_db(self):
        try:
            self.pool = await asyncpg.create_pool(self.db_url, min_size=1, max_size=5, timeout=5)
            async with self.pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS agents (
                        agent_id VARCHAR(64) PRIMARY KEY,
                        role VARCHAR(32) NOT NULL,
                        hostname VARCHAR(64),
                        ip VARCHAR(64),
                        engine VARCHAR(32),
                        model VARCHAR(64),
                        status VARCHAR(32),
                        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS tasks (
                        task_id VARCHAR(64) PRIMARY KEY,
                        project_id VARCHAR(64) NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT,
                        assigned_role VARCHAR(32),
                        assigned_agent_id VARCHAR(64),
                        status VARCHAR(32) DEFAULT 'pending',
                        priority VARCHAR(16) DEFAULT 'medium',
                        branch VARCHAR(128),
                        commit_sha VARCHAR(64),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        completed_at TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS messages (
                        id SERIAL PRIMARY KEY,
                        sender VARCHAR(64) NOT NULL,
                        recipient VARCHAR(64) DEFAULT 'all',
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
            logger.info("Connected to PostgreSQL and verified tables.")
            
            # Load existing tasks and agents from DB into memory
            async with self.pool.acquire() as conn:
                task_rows = await conn.fetch("SELECT * FROM tasks ORDER BY created_at ASC")
                for r in task_rows:
                    self.tasks[r["task_id"]] = TaskItem(
                        task_id=r["task_id"],
                        project_id=r["project_id"],
                        title=r["title"],
                        description=r["description"] or "",
                        assigned_role=r["assigned_role"] or "lead",
                        assigned_agent_id=r["assigned_agent_id"],
                        status=r["status"] or "pending",
                        priority=r["priority"] or "medium",
                        branch=r["branch"],
                        commit_sha=r["commit_sha"],
                        created_at=r["created_at"].isoformat() if r["created_at"] else None
                    )
            logger.info(f"Loaded {len(self.tasks)} existing tasks from PostgreSQL.")
        except Exception as e:
            logger.warning(f"PostgreSQL connection failed: {e}. Running with in-memory storage fallback.")

    async def register_agent(self, agent: AgentInfo):
        agent.connected_at = datetime.now().isoformat()
        agent.last_heartbeat = agent.connected_at
        self.agents[agent.agent_id] = agent
        if self.pool:
            try:
                async with self.pool.acquire() as conn:
                    await conn.execute("""
                        INSERT INTO agents (agent_id, role, hostname, ip, engine, model, status, last_seen)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                        ON CONFLICT (agent_id) DO UPDATE SET
                            hostname = EXCLUDED.hostname,
                            ip = EXCLUDED.ip,
                            engine = EXCLUDED.engine,
                            model = EXCLUDED.model,
                            status = EXCLUDED.status,
                            last_seen = NOW();
                    """, agent.agent_id, agent.role, agent.hostname, agent.ip, agent.engine, agent.model, agent.status)
            except Exception as e:
                logger.error(f"Error persisting agent: {e}")

    async def update_agent_status(self, agent_id: str, status: str, current_task_id: Optional[str] = None):
        if agent_id in self.agents:
            self.agents[agent_id].status = status
            self.agents[agent_id].last_heartbeat = datetime.now().isoformat()
            if current_task_id is not None:
                self.agents[agent_id].current_task_id = current_task_id

    async def remove_agent(self, agent_id: str):
        if agent_id in self.agents:
            self.agents[agent_id].status = "offline"

    async def save_task(self, task: TaskItem):
        if not task.created_at:
            task.created_at = datetime.now().isoformat()
        self.tasks[task.task_id] = task
        if self.pool:
            try:
                async with self.pool.acquire() as conn:
                    await conn.execute("""
                        INSERT INTO tasks (task_id, project_id, title, description, assigned_role, assigned_agent_id, status, priority, branch, commit_sha, created_at)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                        ON CONFLICT (task_id) DO UPDATE SET
                            status = EXCLUDED.status,
                            assigned_agent_id = EXCLUDED.assigned_agent_id,
                            branch = EXCLUDED.branch,
                            commit_sha = EXCLUDED.commit_sha;
                    """, task.task_id, task.project_id, task.title, task.description, task.assigned_role,
                        task.assigned_agent_id, task.status, task.priority, task.branch, task.commit_sha)
            except Exception as e:
                logger.error(f"Error saving task: {e}")

    async def add_message(self, sender: str, content: str, recipient: str = "all"):
        msg = {
            "sender": sender,
            "recipient": recipient,
            "content": content,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
        self.messages.append(msg)
        if len(self.messages) > 200:
            self.messages.pop(0)
        return msg
