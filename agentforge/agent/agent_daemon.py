"""
AgentForge Agent Daemon.
Runs in the background on each client PC (PC-1..4).
Maintains persistent WebSocket connection to Hub (192.168.1.50:8000),
receives tasks, invokes local AI engine (OpenCode / Antigravity), and reports status.
"""
import os
import sys
import json
import socket
import asyncio
import logging
import argparse

# Auto-check and install dependencies on first run
try:
    import websockets
except ImportError:
    import subprocess
    print("[AgentForge] Dependency 'websockets' not found. Installing automatically via pip...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets"])
        import websockets
        print("[AgentForge] Successfully installed 'websockets'.")
    except Exception as e:
        print(f"[AgentForge Error] Failed to auto-install 'websockets': {e}")
        sys.exit(1)

from engines import get_engine

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("agentforge.daemon")

class AgentDaemon:
    def __init__(self, role: str, hub_url: str, engine_name: str, model: str, agent_id: str = None):
        self.role = role
        self.hub_url = hub_url
        self.engine_name = engine_name
        self.model = model
        self.hostname = socket.gethostname()
        self.agent_id = agent_id or f"{role}-{self.hostname.lower()}"
        self.engine = get_engine(self.engine_name, self.model)
        self.ws = None
        self.current_task_id = None
        self.is_busy = False

    async def run(self):
        logger.info(f"Starting Agent Daemon [{self.agent_id}] for Role: {self.role.upper()}")
        logger.info(f"Target Hub: {self.hub_url} | Engine: {self.engine_name} | Model: {self.model}")
        
        while True:
            try:
                logger.info(f"Connecting to Hub at {self.hub_url}...")
                async with websockets.connect(self.hub_url) as ws:
                    self.ws = ws
                    logger.info("Connected to Hub successfully!")
                    
                    # 1. Register with Hub
                    await self.register()
                    
                    # 2. Start heartbeat & message listener concurrently
                    heartbeat_task = asyncio.create_task(self.heartbeat_loop())
                    listener_task = asyncio.create_task(self.listener_loop())
                    
                    done, pending = await asyncio.wait(
                        [heartbeat_task, listener_task],
                        return_when=asyncio.FIRST_COMPLETED
                    )
                    for task in pending:
                        task.cancel()
                        
            except (websockets.ConnectionClosed, ConnectionRefusedError, OSError) as e:
                logger.warning(f"Connection lost or failed: {e}. Retrying in 5 seconds...")
                await asyncio.sleep(5)
            except Exception as e:
                logger.error(f"Unexpected error: {e}. Retrying in 5 seconds...")
                await asyncio.sleep(5)

    async def register(self):
        payload = {
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": self.agent_id,
                "role": self.role,
                "hostname": self.hostname,
                "engine": self.engine_name,
                "model": self.model
            },
            "id": 1
        }
        await self.ws.send(json.dumps(payload))
        logger.info(f"Sent registration for agent: {self.agent_id}")

    async def heartbeat_loop(self):
        while True:
            await asyncio.sleep(20)
            if self.ws:
                payload = {
                    "jsonrpc": "2.0",
                    "method": "agent.heartbeat",
                    "params": {
                        "agent_id": self.agent_id,
                        "status": "busy" if self.is_busy else "idle"
                    }
                }
                try:
                    await self.ws.send(json.dumps(payload))
                except Exception:
                    break

    async def listener_loop(self):
        async for raw_message in self.ws:
            try:
                data = json.loads(raw_message)
            except json.JSONDecodeError:
                continue

            method = data.get("method")
            params = data.get("params", {})
            msg_id = data.get("id")

            if method == "task.assign":
                asyncio.create_task(self.handle_task(params, msg_id))
            elif method == "agent.config_update":
                new_engine = params.get("engine")
                new_model = params.get("model")
                if new_engine: self.engine_name = new_engine
                if new_model: self.model = new_model
                self.engine = get_engine(self.engine_name, self.model)
                logger.info(f"Active engine/model switched to: {self.engine_name} ({self.model})")

    async def handle_task(self, params: dict, msg_id):
        task_id = params.get("task_id")
        title = params.get("title", "")
        description = params.get("description", "")
        
        # Auto-sync codebase with origin/main before executing task
        try:
            logger.info("Auto-syncing codebase: git pull origin main before task execution...")
            git_res = subprocess.run(
                ["git", "pull", "--rebase", "origin", "main"],
                stdin=subprocess.DEVNULL,
                capture_output=True,
                encoding="utf-8",
                errors="replace",
                timeout=30
            )
            if git_res.returncode == 0:
                logger.info("Codebase successfully synced with origin/main.")
            else:
                logger.warning(f"Git pull non-zero: {git_res.stderr.strip() or git_res.stdout.strip()}")
        except Exception as e:
            logger.warning(f"Auto git pull failed or skipped: {e}")

        # Allow task-level engine and model override
        task_engine_name = params.get("engine") or self.engine_name
        task_model = params.get("model") or self.model
        active_engine = get_engine(task_engine_name, task_model)
        
        logger.info(f"Received Task {task_id}: {title} | Engine: {task_engine_name} | Model: {task_model}")

        self.is_busy = True
        self.current_task_id = task_id

        # Notify progress: task accepted
        await self.send_progress(task_id, f"Accepted task: {title} via [{task_engine_name}:{task_model}]")

        system_skill_instructions = ""
        if self.role == "developer":
            system_skill_instructions = """
[UI/UX & Engineering Standards Activated]:
1. Follow the Enterprise UI/UX Design System: Dark slate theme (bg-slate-950, bg-slate-900, border-slate-800), clean typography hierarchy (minimum text-xs / 12px), high information density.
2. Build interactive components: KPI metric summary cards, searchable/filterable data tables, modal dialogs for CRUD actions, slide-over detail drawers, status badges.
3. Modular code: Place components in frontend/src/components/ and maintain clean separation of concerns.
4. Robust backend: Spring Boot 3 + PostgreSQL with complete DDL migrations, input validation, and proper HTTP status codes.
"""
        elif self.role == "ba":
            system_skill_instructions = """
[BA Specification Standards Activated]:
1. Structure specs according to docs/ai/templates/SPEC.md.
2. Include concrete User Stories (As a... I want... So that...).
3. Specify exact PostgreSQL DDL with column types, constraints, and default values.
4. Detail REST API request/response JSON schemas, error codes, and business invariants (FIDIC, Circular 12/2021/TT-BXD, Decree 06/2021/NĐ-CP).
"""

        prompt = f"""You are the {self.role.upper()} agent for the Ánh Dương Building ERP project.
Task ID: {task_id}
Title: {title}
Requirements / Context: {description}
{system_skill_instructions}
Please analyze the requirements and complete the assigned task. Output clear, production-ready deliverables.
"""
        try:
            # Notify progress: executing model
            await self.send_progress(task_id, f"Executing {task_engine_name} with {task_model}...")
            
            # Run engine in thread pool to not block asyncio event loop
            loop = asyncio.get_running_loop()
            output = await loop.run_in_executor(None, active_engine.execute, prompt)
            
            # Check for error outputs from engine
            if output.startswith("[OpenCode Error]") or output.startswith("[Antigravity Error]") or output.startswith("[Execution Exception]") or output.startswith("[QUOTA_EXHAUSTED]"):
                logger.error(f"Task {task_id} failed: {output}")
                await self.send_failed(task_id, output)
            else:
                # Send completion
                summary = output[:300] + "..." if len(output) > 300 else output
                await self.send_complete(task_id, summary)
                logger.info(f"Task {task_id} completed successfully via {task_engine_name}!")
            
        except Exception as e:
            logger.error(f"Task {task_id} execution error: {e}")
            await self.send_failed(task_id, str(e))
        finally:
            self.is_busy = False
            self.current_task_id = None

    async def send_progress(self, task_id: str, message: str):
        if self.ws:
            payload = {
                "jsonrpc": "2.0",
                "method": "task.progress",
                "params": {"task_id": task_id, "message": message}
            }
            await self.ws.send(json.dumps(payload))

    async def send_complete(self, task_id: str, summary: str):
        if self.ws:
            payload = {
                "jsonrpc": "2.0",
                "method": "task.complete",
                "params": {"task_id": task_id, "summary": summary}
            }
            await self.ws.send(json.dumps(payload))

    async def send_failed(self, task_id: str, details: str):
        if self.ws:
            payload = {
                "jsonrpc": "2.0",
                "method": "task.failed",
                "params": {"task_id": task_id, "details": details}
            }
            await self.ws.send(json.dumps(payload))

def main():
    parser = argparse.ArgumentParser(description="AgentForge Client Daemon")
    parser.add_argument("--role", choices=["lead", "ba", "developer", "tester"], default="developer",
                        help="Role of this agent (lead, ba, developer, tester)")
    parser.add_argument("--hub", default="ws://192.168.1.50:8000/ws",
                        help="WebSocket URL of AgentForge Hub (default: ws://192.168.1.50:8000/ws)")
    parser.add_argument("--engine", choices=["opencode", "antigravity"], default="opencode",
                        help="AI execution engine (opencode or antigravity)")
    parser.add_argument("--model", default="opencode/deepseek-v4.1-flash-free",
                        help="Model name (default: opencode/deepseek-v4.1-flash-free)")
    parser.add_argument("--id", default=None, help="Custom agent ID")
    
    args = parser.parse_args()
    daemon = AgentDaemon(
        role=args.role,
        hub_url=args.hub,
        engine_name=args.engine,
        model=args.model,
        agent_id=args.id
    )
    asyncio.run(daemon.run())

if __name__ == "__main__":
    main()
