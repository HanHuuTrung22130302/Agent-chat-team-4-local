# CURRENT_STATE.md — Live Project Status

> **Check this file at the start of every session.** Updated after each work session.

## Current Phase

| Field | Value |
|-------|-------|
| Phase | **Phase 0 — Planning & Framework Setup** |
| Sprint | Pre-sprint (infrastructure) |
| Last updated | 2025-01-20 |

## Status Summary

### ✅ Completed

- [x] Company research & requirements gathering (ADB profile, ERP needs)
- [x] Blueprint document created (architecture, tech stack, module list)
- [x] Key technical decisions made — see [DECISIONS.md](DECISIONS.md)
- [x] Agent context framework created (AGENTS.md, MASTER.md, CONSTITUTION.md, templates, adapters)
- [x] Role system prompts created for all 4 agents ([prompts/](prompts/))
- [x] Network connectivity verified: PC-3 (`192.168.31.9`) reaches Server (`192.168.1.50`) and PC-1 (`192.168.1.3`) via LAN

### 🔄 In Progress

- [ ] Verify PC-2 (`192.168.1.4`) network/firewall status
- [ ] Prepare Docker Compose & Hub MVP for Server (`192.168.1.50`)

### ⏳ Next Up

1. **Server Setup**: SSH into `192.168.1.50` to inspect existing Docker & PostgreSQL/MariaDB services
2. **Hub MVP**: Deploy FastAPI + WebSocket server on Server port 8000
3. **Agent Daemon**: Package lightweight Python daemon for PC-1, PC-2, PC-3, PC-4
4. **Dashboard MVP**: Deploy React dashboard on Server port 3000/8080

## Network Topology & Connectivity

```
[PC-3: Lead (192.168.31.9)]    ──┐
[PC-4: BA (192.168.31.52)]     ──┼──► Xiaomi (192.168.31.1) ──► Viettel (192.168.1.1)
                                                                     │
[PC-1: Dev (192.168.1.3)]      ─────────────────────────────────────┤
[PC-2: Tester (192.168.1.4)]   ─────────────────────────────────────┤
[Server: Hub (192.168.1.50)]   ◄────── All agents connect OUTWARD ──┘
```

> [!NOTE]
> Outbound WebSocket connections (`ws://192.168.1.50:8000/ws`) work across the Xiaomi router without requiring bridge mode because connections originate from clients to the central server. Bridge mode is optional for pure P2P discovery.

## Architecture Status

```
Component        Status      Notes
─────────────    ──────      ─────
Hub Server       LIVE ✅     FastAPI + WebSocket on http://192.168.1.50:8000
Web Dashboard    LIVE ✅     Single-page app on http://192.168.1.50:8000
PostgreSQL DB    LIVE ✅     Database 'agentforge' created on 192.168.1.50:5432
Agent Daemon     READY ✅    agent_daemon.py + run_agent.bat in agentforge/agent/
Gitea            Pending     Next step
ERP Backend      Pending     First task to be dispatched
ERP Frontend     Pending     Follows ERP Backend
```
