# DECISIONS.md — Architecture Decision Records

> **All technical decisions are logged here.** See [CONSTITUTION.md](../../CONSTITUTION.md) — decisions must never be fabricated.

## Decision Log

### D001: Hub Framework — FastAPI + WebSocket

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Need a central orchestrator for agent communication with real-time messaging |
| Alternatives | Express.js + Socket.io, Django Channels, aiohttp |
| Decision | **FastAPI with native WebSocket support** |
| Rationale | Python ecosystem compatibility with agent code; async-first; excellent typing support; auto-generated OpenAPI docs |

### D002: Communication Protocol — JSON-RPC 2.0

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Need structured bidirectional messaging between Hub and agents |
| Alternatives | REST polling, gRPC, custom WebSocket protocol, MQTT |
| Decision | **JSON-RPC 2.0 over WebSocket** |
| Rationale | Structured request/response with error handling; human-readable; language-agnostic; no code generation needed (vs gRPC) |

### D003: Git Hosting — Gitea + GitHub Mirror

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Need version control accessible on LAN with cloud backup |
| Alternatives | GitHub only, GitLab self-hosted, Forgejo |
| Decision | **Gitea self-hosted on Ubuntu server, mirrored to GitHub** |
| Rationale | LAN-speed git operations; no internet dependency for dev workflow; GitHub mirror for backup and external access |

### D004: Frontend Framework — React

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Need UI framework for Dashboard and ERP frontend |
| Alternatives | Vue.js, Svelte, Angular |
| Decision | **React 18 + TypeScript** |
| Rationale | User preference; largest ecosystem; strong TypeScript support; abundant component libraries for enterprise UI |

### D005: Orchestrator Database — PostgreSQL

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Need persistent storage for Hub state, task tracking, message audit trail |
| Alternatives | SQLite, MySQL, MongoDB |
| Decision | **PostgreSQL 16** |
| Rationale | Concurrent access from multiple agents; JSONB for flexible message storage; robust transaction support; scales to ERP needs |

### D006: LAN Security — API Key Authentication

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Agent-to-Hub authentication on trusted LAN |
| Alternatives | JWT tokens, mTLS, OAuth2 |
| Decision | **Simple API key per agent** |
| Rationale | Trusted LAN environment; minimal overhead; sufficient for initial phase. Will revisit if exposed to internet. |

### D007: Automation Mode — Full Auto

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Whether agents should require human approval at each step |
| Alternatives | Human-in-the-loop (approve each task), semi-auto (approve specs only) |
| Decision | **Full autonomous mode** — agents proceed without per-step human approval |
| Rationale | User preference; maximizes throughput; human monitors via Dashboard; can intervene via Hub commands |

### D008: Model Cost Optimization — Default to Free Models

| Field | Detail |
|-------|--------|
| Date | 2025-01 |
| Status | **Accepted** |
| Context | Strict user budget constraint ($20 total credit). Need to prevent accidental API consumption during testing and development iterations. |
| Alternatives | Use paid Claude Opus / DeepSeek Pro for everything, use local Ollama only |
| Decision | **Use OpenCode FREE models (`deepseek-v4.1-flash-free`, `mimo-v2.6-flash-free`, `nemotron-3.5-lightning-free`) and Antigravity free tier for all automated test runs, dev cycles, and task verification.** |
| Rationale | Zero cost for 95% of agent executions; preserve user credit exclusively for final architectural reviews or when explicitly instructed. |

### D009: ERP Product Backend Stack — Spring Boot 3 (Java 21)

| Field | Detail |
|-------|--------|
| Date | 2026-10 |
| Status | **Accepted** |
| Context | User instruction to build the Ánh Dương Building ERP with React + Spring Boot instead of Python FastAPI |
| Alternatives | FastAPI, NestJS, Go |
| Decision | **Java 21 + Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security, Maven, PostgreSQL)** |
| Rationale | Enterprise gold standard for ERP systems; robust transaction handling; battle-tested ORM/Hibernate; high scalability for complex construction accounting & operations |

---

## Template

```markdown
### DXXX: [Short Title]

| Field | Detail |
|-------|--------|
| Date | YYYY-MM |
| Status | Proposed / Accepted / Deprecated / Superseded by DXXX |
| Context | Why this decision is needed |
| Alternatives | What else was considered |
| Decision | **What was chosen** |
| Rationale | Why this option was selected |
```
