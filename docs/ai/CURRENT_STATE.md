# CURRENT_STATE.md — Live Project Status

> **Check this file at the start of every session.** Updated after each work session.

## Current Phase

| Field | Value |
|-------|-------|
| Phase | **Continuous Autonomous Evolution Loop (Active)** |
| Scope | Full 12-Module Enterprise D&B ERP (Ánh Dương Building) |
| Architecture | Java 21 + Spring Boot 3 + PostgreSQL + React 18 TS |
| Last updated | 2026-10-20 |

## Status Summary

### ✅ Completed

- [x] Company research & requirements gathering (ADB profile, Grade I D&B general contractor)
- [x] Platform Hub & Real-time Web Dashboard deployed on Ubuntu Server (`http://192.168.1.50:8000`)
- [x] Agent Daemons verified & online on all 4 physical machines (Lead, BA, Dev, Tester)
- [x] Engine Auto-Fallback implemented (OpenCode failure automatically switches to Antigravity CLI)
- [x] Strict budget protection locked (100% Free models: `gemini-3.8-flash-high`, `deepseek-v4.1-flash-free`)
- [x] Platform repository synced (`https://github.com/HanHuuTrung22130302/Agent-chat-team-4-local.git`)
- [x] Master Autonomous Roadmap established (`docs/plans/MASTER_ROADMAP.md`)
- [x] Core IAM Spec written (`docs/specs/SPEC-01-CORE-IAM.md`)
- [x] Project Management & WBS Spec written (`docs/specs/SPEC-02-PROJECTS-WBS.md`)
- [x] BOQ Estimating & Job Costing Spec written (`docs/specs/SPEC-03-BOQ-COSTING.md`)

### 🔄 In Progress

- [ ] Initialize product repository `Erp-ADB-Building` (Spring Boot 3 + React 18)
- [ ] Create PostgreSQL database `adb_erp` on Ubuntu Server (`192.168.1.50:5432`)
- [ ] Implement backend foundation (Spring Boot 3, Flyway migrations, JWT security, Project APIs)
- [ ] Implement frontend foundation (React 18, Vite, Tailwind CSS, Layout, Dashboard)
- [ ] Dispatch verification tasks to Tester Agent via Hub WebSocket

### ⏳ Autonomous Evolution Pipeline

1. **Cycle 1**: Core IAM & Project Management & Site Diary
2. **Cycle 2**: BOQ Estimating, Vietnamese Norms (TT 12/2021) & Job Costing (EVM)
3. **Cycle 3**: Subcontractor Management & Progress Payment Certificates (PPC)
4. **Cycle 4**: Material Procurement & Site Warehouse Inventory
5. **Cycle 5**: Machinery & Equipment Fleet Management
6. **Cycle 6**: WinSteel Pre-Engineered Steel Factory Module
7. **Cycle 7**: GPS Site Attendance & Vietnamese Labor Payroll
8. **Cycle 8**: Construction WIP Accounting (TK 154) & Financial Reporting
9. **Cycle 9**: Executive BI Cockpit & Risk Heatmap

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
