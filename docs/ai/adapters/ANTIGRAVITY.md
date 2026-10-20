# Antigravity IDE Adapter

> How to use the AgentForge context framework with **Antigravity Pro / Antigravity IDE**.

## Session Startup

1. Antigravity automatically reads `AGENTS.md` from the project root on session start
2. Configure in Antigravity settings → AI → Custom Instructions:
   - Point to `AGENTS.md` as the entry instruction file
   - Or paste: `Read AGENTS.md first, then follow its instructions for your role`

## Context Loading Strategy

Use `@file` references to load context on demand:

```
@AGENTS.md           — Entry point (always loaded)
@CONSTITUTION.md      — Rules (always loaded)
@docs/ai/CURRENT_STATE.md — Project status
@docs/ai/SESSION.md   — Last session handoff
```

> [!TIP]
> Only reference files relevant to the current task. Antigravity's context window is shared with code — keep it lean.

## Using Antigravity Skills & Rules

### Custom Rules (`.antigravity/rules/`)

Create rule files that mirror the constitution:

```yaml
# .antigravity/rules/code-quality.yaml
name: AgentForge Code Quality
triggers: ["*.py"]
rules:
  - "All functions must have type hints and docstrings"
  - "Use Google-style docstrings"
  - "No bare except clauses"
```

### Skills

Antigravity skills can automate repetitive tasks:
- **spec-writer**: Reads [SPEC template](../templates/SPEC.md), fills from requirements
- **task-tracker**: Updates task status in TASKS.md files
- **session-closer**: Generates SESSION.md entry at end of session

## Using Antigravity as the Direct Lead Cockpit

When pairing with the Lead Agent inside Antigravity IDE:
1. **Chat directly with the Lead**: Provide any architectural directive or module request.
2. **Lead creates plans**: Saves structured breakdown to `docs/plans/`.
3. **Dispatch to squad**: Lead executes `python agentforge/agent/dispatch.py` directly from the chat or terminal.
4. **No dashboard needed**: Connected daemons on PC-1..4 pick up tasks instantly over the local WiFi/LAN.

## Agent Daemon Integration

The agent daemon runs alongside Antigravity:

```
Agent Daemon (background process)
  ├── Connects to Hub via WebSocket
  ├── Receives task assignments
  ├── Writes task context to local files
  └── Triggers Antigravity CLI to execute
```

### CLI Integration

```bash
# Antigravity CLI can be invoked by the daemon
antigravity --prompt "Implement T001 per @docs/ai/tasks/hub/TASKS.md" \
            --context @AGENTS.md @CONSTITUTION.md
```

## Tips for Multi-Agent Use

- Each machine runs its own Antigravity instance with a **role-specific system prompt**
- Use `@docs/ai/SESSION.md` to resume another agent's work
- Commit frequently — other agents may need your changes
- Check [CURRENT_STATE.md](../CURRENT_STATE.md) before starting any new task
