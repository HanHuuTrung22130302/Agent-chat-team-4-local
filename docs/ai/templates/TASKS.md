# TASKS.md — Task Tracking Template

> **Instructions**: One entry per task. Update status and progress log as work proceeds.
> Task states: `pending` → `assigned` → `in_progress` → `review` → `done` / `failed`
> See [MASTER.md](../../../MASTER.md) for full state machine.

---

## Task: T001 — [Task Title]

| Field | Value |
|-------|-------|
| Task ID | T001 |
| Plan | [PLAN-XXX](../plans/PLAN-XXX.md) |
| Spec | [SPEC-XXX](../specs/SPEC-XXX.md) |
| Assignee | Developer / Tester / BA |
| Status | `pending` |
| Priority | High / Medium / Low |
| Branch | `feature/xxx` |
| Created | YYYY-MM-DD |
| Updated | YYYY-MM-DD |

### Description

_What needs to be done. Be specific enough that any agent can pick this up._

### Acceptance Criteria

- [ ] Criterion 1 (from spec)
- [ ] Criterion 2
- [ ] All tests pass
- [ ] Code reviewed

### Progress Log

| Timestamp | Agent | Entry |
|-----------|-------|-------|
| YYYY-MM-DD HH:MM | Role | Started implementation |
| | | |

### Review Notes

_Filled by reviewer (Lead or Tester):_

- Reviewer:
- Date:
- Verdict: Approved / Changes Requested / Rejected
- Comments:

### Test Results

```
Test suite: [name]
Passed: X / Y
Failed: [list failures]
Coverage: XX%
```

---

_Copy the block above for each new task. Keep all tasks for an epic in one file._
