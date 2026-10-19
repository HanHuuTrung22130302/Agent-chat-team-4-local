# PROJECT.md — Project & Company Context

> **Reference only.** Do not load this file unless you need project background.

## Platform: AgentForge

**AgentForge** is a distributed multi-agent development platform where 4 physical machines collaborate as Lead, BA, Developer, and Tester to build software autonomously.

### Architecture

- **Hub**: Central WebSocket orchestrator (FastAPI) — runs on Ubuntu Server
- **Agent Daemons**: Run on each PC, connect to Hub, execute tasks via local IDE/CLI
- **Dashboard**: React web UI for human monitoring and intervention
- **Gitea**: Self-hosted Git server on Ubuntu, mirrored to GitHub

## First Product: ADB ERP System

### Company Profile — Ánh Dương Building (ADB)

| Field | Detail |
|-------|--------|
| Full name | Công ty TNHH Xây dựng Ánh Dương (Ánh Dương Building Co., Ltd) |
| Founded | 2011 |
| License | Grade I Construction License |
| HQ | Thu Duc City, Ho Chi Minh City, Vietnam |
| Specialization | Design & Build contractor — industrial factories, logistics centers, warehouses |
| Scale | Medium enterprise, multiple concurrent projects |

### Target ERP Modules

| # | Module | Priority | Description |
|---|--------|----------|-------------|
| 1 | Project Management | High | Track projects, milestones, schedules, Gantt charts |
| 2 | Estimating & Bidding | High | BOQ, cost estimation, bid preparation, job costing |
| 3 | Subcontractor Management | High | Contracts, work orders, payment tracking |
| 4 | Equipment & Assets | Medium | Fleet tracking, maintenance schedules, depreciation |
| 5 | Workforce & Payroll | Medium | Attendance, labor allocation, payroll processing |
| 6 | Inventory | Medium | Material procurement, stock levels, delivery tracking |
| 7 | Accounting (WIP) | Medium | Work-in-progress accounting, AP/AR, financial reports |
| 8 | Document Management | Low | Drawings, permits, contracts, RFIs |
| 9 | Safety & Compliance | Low | Incident reports, safety checklists, certifications |

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Python 3.12 + FastAPI | Async, type-safe — [D001](DECISIONS.md) |
| Frontend | React 18 + TypeScript | Dashboard & ERP UI — [D004](DECISIONS.md) |
| Database | PostgreSQL 16 | Primary data store — [D005](DECISIONS.md) |
| ORM | SQLAlchemy 2.0 | Async support |
| API Protocol | JSON-RPC 2.0 | Agent communication — [D002](DECISIONS.md) |
| Git | Gitea (self-hosted) + GitHub mirror | — [D003](DECISIONS.md) |
| Containerization | Docker + Docker Compose | All services containerized |
| CI/CD | Gitea Actions | Lint → Test → Build → Deploy |

## Infrastructure

### Network Topology

```
Internet
  ├── Viettel Modem (192.168.1.x) ── Main LAN
  └── Xiaomi CR8809 (192.168.31.x) ── Extended LAN (needs Bridge Mode)

Ubuntu Server (192.168.1.100)
  ├── Gitea       :3000
  ├── PostgreSQL  :5432
  ├── Hub API     :8000
  └── Dashboard   :3001
```

### Machines

| # | OS | Role | Specs (approx) |
|---|-----|------|----------------|
| 1 | Win 11 | Lead + BA | Dev workstation |
| 2 | Win 11 | Developer | Dev workstation |
| 3 | Win 10 | Developer | Dev workstation |
| 4 | Win 10 | Tester | Test workstation |
| 5 | Ubuntu 24.04 | Server | Docker host, Gitea, PostgreSQL, Hub |
