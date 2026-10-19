"""
Execution engines for AgentForge Agent Daemon.
Supports OpenCode CLI (with free models) and Antigravity CLI (agy.exe).
"""
import subprocess
import shutil
import logging

logger = logging.getLogger("agentforge.engines")

class OpenCodeEngine:
    """Executes tasks via OpenCode CLI."""
    def __init__(self, default_model: str = "opencode/deepseek-v4.1-flash-free"):
        self.default_model = default_model
        self.cmd = shutil.which("opencode") or "opencode"

    def execute(self, prompt: str, model: str = None) -> str:
        target_model = model or self.default_model
        logger.info(f"OpenCode executing with model [{target_model}]...")
        try:
            # Run opencode non-interactively
            result = subprocess.run(
                [self.cmd, "run", "-m", target_model, prompt],
                capture_output=True,
                text=True,
                timeout=300
            )
            if result.returncode == 0:
                return result.stdout.strip() or "Task completed (empty output)."
            else:
                err_msg = result.stderr.strip() or result.stdout.strip() or f"Exit code {result.returncode}"
                logger.error(f"OpenCode error: {err_msg}")
                return f"[OpenCode Error]: {err_msg}"
        except Exception as e:
            logger.error(f"OpenCode execution failed: {e}")
            return f"[Execution Exception]: {e}"

class AntigravityEngine:
    """Executes tasks via Antigravity CLI (agy.exe)."""
    def __init__(self, default_model: str = "gemini-3.8-flash-high"):
        self.default_model = default_model
        self.cmd = shutil.which("agy") or "agy.exe"

    def execute(self, prompt: str, model: str = None) -> str:
        target_model = model or self.default_model
        logger.info(f"Antigravity executing with model [{target_model}]...")
        try:
            result = subprocess.run(
                [self.cmd, "-p", prompt, "--model", target_model, "--dangerously-skip-permissions"],
                capture_output=True,
                text=True,
                timeout=300
            )
            if result.returncode == 0:
                return result.stdout.strip() or "Task completed (empty output)."
            else:
                err_msg = result.stderr.strip() or result.stdout.strip()
                return f"[Antigravity Error]: {err_msg}"
        except Exception as e:
            return f"[Execution Exception]: {e}"

def get_engine(engine_name: str, model: str = None):
    if engine_name.lower() == "antigravity":
        return AntigravityEngine(default_model=model or "gemini-3.8-flash-high")
    else:
        # Default is OpenCode with free model
        return OpenCodeEngine(default_model=model or "opencode/deepseek-v4.1-flash-free")
