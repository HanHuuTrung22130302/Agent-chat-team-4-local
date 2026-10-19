# MASTER.md — Workflow Orchestration

> **How work flows through the multi-agent system.** See [CONSTITUTION.md](CONSTITUTION.md) for rules.

## Development Workflow

```mermaid
flowchart LR
    A["1. Specification"] --> B["2. Plan"]
    B --> C["3. Tasks"]
    C --> D["4. Implementation"]
    D --> E["5. Verification"]
    E -->|Pass| F["6. Deployment"]
    E -->|Fail| D
```

| Phase | Owner | Input | Output |
|-------|-------|-------|--------|
| Specification | BA | Requirements / epic | Spec doc ([template](docs/ai/templates/SPEC.md)) |
| Plan | Lead | Approved spec | Plan doc ([template](docs/ai/templates/PLAN.md)) |
| Tasks | Lead | Plan | Task entries ([template](docs/ai/templates/TASKS.md)) |
| Implementation | Developer | Assigned task | Code + tests on feature branch |
| Verification | Tester | PR + spec | Test results, approval or defect report |
| Deployment | Lead | Approved PR | Merge to main, deploy |

## Task Flow Between Agents

```mermaid
sequenceDiagram
    participant L as Lead
    participant B as BA
    participant D as Developer
    participant T as Tester

    L->>B: Request spec for feature
    B->>L: Deliver spec (SPEC.md)
    L->>L: Decompose into tasks (PLAN.md)
    L->>D: Assign task
    D->>D: Implement on feature branch
    D->>T: Request verification (PR)
    T->>T: Run tests, review
    T-->>D: Fail → defect report
    T->>L: Pass → approve merge
    L->>L: Merge & update state
```

## Task State Machine

```
pending → assigned → in_progress → review → done
                         ↓            ↓
                      blocked       failed → in_progress (rework)
```

| State | Meaning | Who transitions |
|-------|---------|----------------|
| `pending` | Created, not yet assigned | Lead creates |
| `assigned` | Assigned to agent, not started | Lead assigns |
| `in_progress` | Agent actively working | Assignee starts |
| `blocked` | Cannot proceed, dependency or question | Assignee flags |
| `review` | Implementation done, awaiting verification | Assignee submits |
| `done` | Verified and merged | Lead after Tester approval |
| `failed` | Verification failed, needs rework | Tester rejects |

## Handling Blockers & Rework

- **Blocked**: Agent sets status to `blocked` with reason. Lead must unblock or reassign.
- **Failed**: Tester logs specific failures. Task returns to `in_progress` with defect details.
- **Rework limit**: If a task fails 3 times, escalate to Lead for redesign.

## Communication via Hub

All agents connect to the Hub via **WebSocket** (see [DECISIONS.md — D001](docs/ai/DECISIONS.md)).

```json
{
  "jsonrpc": "2.0",
  "method": "task.update",
  "params": {
    "task_id": "T001",
    "status": "in_progress",
    "agent_role": "developer",
    "message": "Starting implementation of auth module"
  },
  "id": 1
}
```

- Hub broadcasts state changes to all connected agents
- Hub persists all messages to PostgreSQL for audit
- Agents poll [CURRENT_STATE.md](docs/ai/CURRENT_STATE.md) when Hub is offline

## Sprint Structure

- **Sprint length**: 1 week
- **Sprint planning**: Lead creates plan from backlog, assigns tasks
- **Daily sync**: Agents report status via Hub (or SESSION.md if async)
- **Sprint review**: Lead summarizes completed work, updates CURRENT_STATE.md
- **Backlog**: Maintained in TASKS.md files per epic
