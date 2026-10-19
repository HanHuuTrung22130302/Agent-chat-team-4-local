# AGENTS.md — Agent Entry Point

> **Every AI agent session starts here.** Read this file first, then follow the links.

## Quick Start

1. Read this file → identify your role
2. Read [CONSTITUTION.md](CONSTITUTION.md) → invariant rules
3. Read [docs/ai/CURRENT_STATE.md](docs/ai/CURRENT_STATE.md) → where the project stands
4. Read your role-specific docs (below) → only what you need
5. Read [docs/ai/SESSION.md](docs/ai/SESSION.md) → last session handoff

## Role Definitions

| Role | Responsibilities | Primary Docs |
|------|-----------------|--------------|
| **Lead** | Decompose epics, assign tasks, review PRs, unblock agents | [MASTER.md](MASTER.md), [PLAN template](docs/ai/templates/PLAN.md) |
| **BA** | Write specs, define acceptance criteria, validate requirements | [SPEC template](docs/ai/templates/SPEC.md), [PROJECT.md](docs/ai/PROJECT.md) |
| **Developer** | Implement features, write tests, fix bugs | [CONSTITUTION.md](CONSTITUTION.md), [TASKS template](docs/ai/templates/TASKS.md) |
| **Tester** | Verify implementations, run test suites, report defects | [TASKS template](docs/ai/templates/TASKS.md), specs |

## How to Identify Your Role

Your role is determined by the **system prompt or task assignment** you receive. Look for:
- Explicit role declaration (e.g., "You are the Developer agent")
- Task type: spec writing → BA, implementation → Developer, verification → Tester, orchestration → Lead
- If unclear, default to **Developer** and flag for clarification

## Context Loading Rules

> [!IMPORTANT]
> Minimize context usage. Only load files relevant to your current task.

- **Always load**: `AGENTS.md`, `CONSTITUTION.md`, `CURRENT_STATE.md`
- **Load on demand**: Specs, plans, and task files relevant to your assigned work
- **Never load all files at once** — use cross-references to navigate
- See IDE-specific adapters: [Antigravity](docs/ai/adapters/ANTIGRAVITY.md) · [OpenCode](docs/ai/adapters/OPENCODE.md) · [Gemini API](docs/ai/adapters/GEMINI_API.md)

## Documentation Map

```
AGENTS.md .............. You are here
CONSTITUTION.md ........ Invariant rules for all agents
MASTER.md .............. Workflow & orchestration
docs/ai/
  PROJECT.md ........... Project & company context
  CURRENT_STATE.md ..... Live project status
  SESSION.md ........... Session handoff log
  DECISIONS.md ......... Architecture Decision Records
  templates/
    SPEC.md ............ BA specification template
    PLAN.md ............ Lead planning template
    TASKS.md ........... Task tracking template
  adapters/
    ANTIGRAVITY.md ..... Antigravity IDE adapter
    OPENCODE.md ........ OpenCode CLI adapter
    GEMINI_API.md ...... Gemini API adapter
```
