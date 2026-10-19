# Gemini API Adapter

> How to use the AgentForge context framework with the **Gemini API** directly.

## Setup

### API Key

```bash
# Store in .env (gitignored)
GEMINI_API_KEY=your-key-here
```

> [!CAUTION]
> Never commit API keys. See [CONSTITUTION.md](../../../CONSTITUTION.md) security rules.

### Python Client

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")
```

## System Prompt Injection

Build the system prompt by concatenating role context from framework files:

```python
def build_system_prompt(role: str, task_files: list[str]) -> str:
    """Assemble system prompt from context framework files."""
    # Always include
    base_context = [
        read_file("AGENTS.md"),
        read_file("CONSTITUTION.md"),
        read_file("docs/ai/CURRENT_STATE.md"),
    ]
    
    # Role-specific instruction
    role_instruction = f"You are the {role} agent. Follow your role's responsibilities."
    
    # Task-specific context (on demand)
    task_context = [read_file(f) for f in task_files]
    
    return "\n---\n".join([role_instruction] + base_context + task_context)
```

## Efficient Context Passing

### Strategy: Layered Context

```
Layer 1 (always):  AGENTS.md + CONSTITUTION.md     ~2K tokens
Layer 2 (session): CURRENT_STATE.md + SESSION.md    ~1K tokens
Layer 3 (task):    Relevant spec + task file         ~2K tokens
Layer 4 (code):    Source files being worked on       Variable
```

> [!TIP]
> Gemini has 1M+ context window, but shorter prompts = faster + cheaper. Target < 50K tokens for routine tasks.

### Batching File Context

```python
def build_code_context(file_paths: list[str], max_tokens: int = 30000) -> str:
    """Include source files with path headers, respecting token budget."""
    context_parts = []
    total = 0
    for path in file_paths:
        content = read_file(path)
        estimated_tokens = len(content) // 4
        if total + estimated_tokens > max_tokens:
            break
        context_parts.append(f"### File: {path}\n```\n{content}\n```")
        total += estimated_tokens
    return "\n\n".join(context_parts)
```

## Token Management

| Model | Context Window | Input Cost | Output Cost |
|-------|---------------|------------|-------------|
| Gemini 2.0 Flash | 1M tokens | Low | Low |
| Gemini 2.0 Pro | 1M tokens | Medium | Medium |

### Optimization Tips

- Summarize large files instead of including them whole
- Use structured output (JSON mode) for machine-parseable responses
- Cache system prompts across calls within the same task
- Strip comments/docstrings from code context when they're not relevant

## Agent Daemon Integration

```python
async def execute_task(task: dict, role: str) -> str:
    """Agent daemon calls Gemini API to execute a task."""
    system_prompt = build_system_prompt(
        role=role,
        task_files=[task["spec_path"], task["task_path"]]
    )
    
    code_context = build_code_context(task["relevant_files"])
    
    response = model.generate_content(
        contents=[
            {"role": "user", "parts": [
                f"{system_prompt}\n\n{code_context}\n\n"
                f"Execute task: {task['title']}\n{task['description']}"
            ]}
        ],
        generation_config={"temperature": 0.2, "max_output_tokens": 8192}
    )
    return response.text
```

## Tips

- Set `temperature: 0.1–0.3` for code generation, `0.5–0.7` for spec writing
- Use Gemini's native JSON mode for structured task outputs
- For large codebases, use Gemini Pro (better reasoning) over Flash (better speed)
- Always validate generated code against [CONSTITUTION.md](../../../CONSTITUTION.md) rules before committing
