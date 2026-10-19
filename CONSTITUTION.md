# CONSTITUTION.md — Invariant Rules

> **These rules apply to ALL agents, ALL roles, ALL sessions. No exceptions.**

## Code Quality

- **Type hints**: All function signatures must have type annotations
- **Docstrings**: All public functions/classes must have docstrings (Google style)
- **Error handling**: No bare `except:` — catch specific exceptions, log with context
- **Tests**: Every feature must have unit tests; target 80%+ coverage
- **Lint**: Code must pass `ruff check` and `mypy --strict` before commit
- **Max file length**: 300 lines per module; refactor if exceeded

## Git Workflow

- **Branch naming**: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`
- **Commit format**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
  - Example: `feat(hub): add websocket heartbeat mechanism`
- **No direct commits to `main`** — always use feature branches + PR
- **Review required**: At least one other agent role must review before merge
- **Rebase before merge**: Keep linear history

## Security

- **No hardcoded secrets** — use environment variables or `.env` files (gitignored)
- **Input validation**: All API endpoints must validate and sanitize inputs
- **SQL injection**: Use parameterized queries only (SQLAlchemy ORM preferred)
- **Dependencies**: Pin versions in `requirements.txt`; audit with `pip-audit`

## File Structure Conventions

```
src/
  hub/           # Central orchestrator (WebSocket server)
  agents/        # Agent daemon code
  erp/           # ERP application modules
    api/         # FastAPI routes
    models/      # SQLAlchemy models
    services/    # Business logic
    schemas/     # Pydantic schemas
tests/
  unit/
  integration/
docs/
  ai/            # AI agent context (this framework)
  api/           # API documentation
```

## Communication Protocol

- **Format**: JSON-RPC 2.0 over WebSocket
- **Message structure**: See [MASTER.md](MASTER.md) for workflow details
- **All inter-agent communication goes through the Hub** — no direct agent-to-agent calls
- **Log all messages**: Hub persists every message for audit trail

## Coordination Rules

- **No concurrent edits**: Never modify a file another agent is actively working on
- **Claim before work**: Announce task pickup via Hub before starting
- **Log decisions**: All technical decisions go in [DECISIONS.md](docs/ai/DECISIONS.md)
- **Never fabricate**: Do not invent project state, metrics, or technical facts
- **Ask when uncertain**: If requirements are ambiguous, ask the Lead (or human) before implementing
- **Atomic commits**: Each commit should be a single logical change that passes all tests
