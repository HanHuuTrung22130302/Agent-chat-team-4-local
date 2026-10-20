# 🚀 Agent-chat-team-4-local (AgentForge)

> **Distributed Multi-Agent Development Platform** across 4 Physical Machines & 1 Server.
> Collaborating autonomously as **Lead**, **BA**, **Developer**, and **Tester** using **OpenCode CLI** and **Antigravity Pro**.

---

## 🏗️ Architecture Overview

AgentForge connects 4 physical computers in a local network (LAN) to a centralized **Hub Orchestrator** running on an Ubuntu Server:

```
┌─────────────────────────────────────────────────────────────┐
│                       LOCAL LAN NETWORK                     │
│                                                             │
│   [PC-3: Lead / PM]           [PC-4: BA / Architect]        │
│   Win 11 - 192.168.31.9       Win 11 Laptop - 192.168.31.52 │
│   OpenCode / Antigravity      Antigravity Pro / OpenCode    │
│              │                           │                  │
│              ▼                           ▼                  │
│   ───────────────────► [UBUNTU SERVER] ◄─────────────────   │
│                        192.168.1.50                         │
│                        • FastAPI Hub (:8000)                │
│                        • Real-time Web Dashboard            │
│                        • PostgreSQL Database (:5432)        │
│              ▲                           ▲                  │
│              │                           │                  │
│   [PC-1: Senior Developer]    [PC-2: QA / Tester]           │
│   Win 10 - 192.168.1.3        Win 10 - 192.168.1.4          │
│   OpenCode (DeepSeek Free)    OpenCode (Beam / MiMo Free)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

| Directory / File | Description |
| :--- | :--- |
| **`AGENTS.md`** | Universal entry point for any AI agent starting a session. |
| **`CONSTITUTION.md`** | Invariant rules: Code quality, Git conventions, Security, Model cost limits. |
| **`MASTER.md`** | End-to-end SDLC orchestration workflow (Spec → Plan → Code → Test → Deploy). |
| **`docs/ai/`** | Context framework, project specifications, templates, and tool adapters. |
| **`agentforge/hub/`** | Central orchestrator (FastAPI, WebSocket JSON-RPC 2.0, Web Dashboard). |
| **`agentforge/agent/`** | Lightweight Worker Daemon with 1-click startup for client machines. |
| **`agentforge/deploy/`** | Automated deployment scripts and Docker Compose for Ubuntu Server. |

---

## ⚡ Quick Start for Worker Nodes (PC-1 .. PC-4)

Any computer in the local network can join the squad in **1 single step**:

1. Clone or copy the `agentforge/agent/` folder:
   ```bash
   git clone https://github.com/HanHuuTrung22130302/Agent-chat-team-4-local.git
   cd Agent-chat-team-4-local/agentforge/agent
   ```
2. Double-click **`run_agent.bat`** (or run `python agent_daemon.py`):
   * Select your role:
     * `[1]` Lead / Architect (PC-3)
     * `[2]` BA / Spec Writer (PC-4)
     * `[3]` Developer (PC-1)
     * `[4]` Tester / QA (PC-2)
   * *Dependencies (`websockets`) will be checked and auto-installed on the first run automatically!*

3. Open the **Web Dashboard** from any browser:
   👉 **`http://192.168.1.50:8000`**

---

## 🤖 Supported Engines & Models

* **OpenCode CLI**:
  * Free tier: `deepseek-v4.1-flash-free`, `beam-free`, `mimo-v2.6-flash-free`, `glm-5.3-flash-free`, `longcat-2.5-preview-free`, `nemotron-3.5-lightning-free`.
  * Pro tier: `deepseek-v4-pro`, `claude-opus-4-6`.
* **Antigravity Pro (Jio)**:
  * `gemini-3.8-flash-high`, `claude-opus-4-6-thinking`, `claude-sonnet-4-6`.

---

## 🛡️ Target Product
* The autonomous agent team develops enterprise software products (first product: **Ánh Dương Building Construction Contractor ERP** in separate repo: `HanHuuTrung22130302/Erp-ADB-Building`).
