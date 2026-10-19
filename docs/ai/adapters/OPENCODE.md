# OpenCode CLI Adapter

> How to use the AgentForge context framework with **OpenCode** CLI tool.

## Session Startup

```bash
# Start OpenCode in the project root
cd /path/to/MultiAgentChat
opencode
```

OpenCode reads project context from its config file or CLI flags.

## Configuration

### `opencode.json` (project root)

```json
{
  "model": "deepseek-v4-pro",
  "systemPrompt": "Read AGENTS.md first. You are the [ROLE] agent. Follow CONSTITUTION.md rules.",
  "contextFiles": [
    "AGENTS.md",
    "CONSTITUTION.md",
    "docs/ai/CURRENT_STATE.md"
  ]
}
```

### Model Selection

| Model | Best For | Context Window |
|-------|----------|---------------|
| DeepSeek V4 Pro | Complex implementation, large codebases | 128K |
| Claude Opus | Architecture decisions, spec writing | 200K |
| Claude Sonnet | Balanced speed/quality for routine tasks | 200K |
| Gemini Pro | Multi-file analysis, large context | 1M+ |

> [!TIP]
> Use DeepSeek for Developer role (strong code generation). Use Claude for BA/Lead roles (strong reasoning).

## Context Loading via CLI

```bash
# Load specific context for a task
opencode --context AGENTS.md CONSTITUTION.md docs/ai/tasks/hub/TASKS.md

# Pass a role-specific system prompt
opencode --system "You are the Developer agent. Your task is T001."

# Pipe task details
cat docs/ai/tasks/hub/TASKS.md | opencode --prompt "Implement the first pending task"
```

## Agent Daemon Integration

The daemon manages OpenCode as a subprocess:

```
Agent Daemon
  ├── Receives task from Hub
  ├── Selects appropriate model for task type
  ├── Assembles context files (AGENTS.md + task-specific)
  ├── Launches: opencode --context [files] --prompt [task]
  ├── Captures output
  └── Reports result to Hub
```

### Daemon Config (`agent-config.yaml`)

```yaml
role: developer
ide: opencode
models:
  implementation: deepseek-v4-pro
  review: claude-sonnet
  spec: claude-opus
context:
  always:
    - AGENTS.md
    - CONSTITUTION.md
    - docs/ai/CURRENT_STATE.md
  on_demand:
    - docs/ai/tasks/**/*.md
    - docs/ai/specs/**/*.md
```

## Tips

- OpenCode works best with focused, single-task prompts
- Keep context under 32K tokens for faster responses on DeepSeek
- Use `--no-stream` flag when daemon captures output programmatically
- Always include CONSTITUTION.md to maintain code quality standards
