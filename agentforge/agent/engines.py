"""
Execution engines for AgentForge Agent Daemon.
Supports OpenCode CLI (with free models) and Antigravity CLI (agy.exe).
"""
import subprocess
import shutil
import logging

logger = logging.getLogger("agentforge.engines")

QUOTA_ERROR_KEYWORDS = [
    "resource_exhausted", "429", "rate limit", "quota reached", 
    "quota exceeded", "insufficient_quota", "resets in", "too many requests"
]

def is_quota_error(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in QUOTA_ERROR_KEYWORDS)

class OpenCodeEngine:
    """Executes tasks via OpenCode CLI with automatic Quota Fallback."""
    def __init__(self, default_model: str = "opencode/deepseek-v4.1-flash-free"):
        self.default_model = default_model
        self.fallback_model = "opencode/deepseek-v4.1-flash-free"
        self.cmd = shutil.which("opencode") or "opencode"

    def execute(self, prompt: str, model: str = None) -> str:
        target_model = model or self.default_model
        logger.info(f"OpenCode executing with model [{target_model}]...")
        try:
            result = subprocess.run(
                [self.cmd, "run", "-m", target_model, prompt],
                capture_output=True,
                text=True,
                timeout=300
            )
            output = result.stdout.strip()
            err_msg = result.stderr.strip() or output

            if result.returncode == 0 and not is_quota_error(output):
                return output or "Task completed (empty output)."

            # Check if this was a Quota / Rate-limit error
            if is_quota_error(err_msg) or is_quota_error(output):
                logger.warning(f"[QUOTA ALERT] Model [{target_model}] hit rate/quota limit! Error: {err_msg}")
                if target_model != self.fallback_model:
                    logger.info(f"==> Auto-fallback to FREE model [{self.fallback_model}] to keep workflow running...")
                    fallback_result = subprocess.run(
                        [self.cmd, "run", "-m", self.fallback_model, prompt],
                        capture_output=True,
                        text=True,
                        timeout=300
                    )
                    if fallback_result.returncode == 0:
                        return f"[Notice: Auto-switched to {self.fallback_model} due to quota limit on {target_model}]\n\n" + fallback_result.stdout.strip()

                return f"[QUOTA_EXHAUSTED]: {err_msg}"

            logger.error(f"OpenCode error: {err_msg}")
            return f"[OpenCode Error]: {err_msg}"
        except Exception as e:
            logger.error(f"OpenCode execution failed: {e}")
            return f"[Execution Exception]: {e}"

class AntigravityEngine:
    """Executes tasks via Antigravity CLI (agy.exe) with automatic Quota Fallback."""
    def __init__(self, default_model: str = "gemini-3.8-flash-high"):
        self.default_model = default_model
        self.fallback_model = "gemini-3.8-flash-high"
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
            output = result.stdout.strip()
            err_msg = result.stderr.strip() or output

            if result.returncode == 0 and not is_quota_error(output):
                return output or "Task completed (empty output)."

            if is_quota_error(err_msg) or is_quota_error(output):
                logger.warning(f"[QUOTA ALERT] Antigravity model [{target_model}] hit quota! Error: {err_msg}")
                if target_model != self.fallback_model:
                    logger.info(f"==> Auto-fallback to default [{self.fallback_model}]...")
                    fallback_result = subprocess.run(
                        [self.cmd, "-p", prompt, "--model", self.fallback_model, "--dangerously-skip-permissions"],
                        capture_output=True,
                        text=True,
                        timeout=300
                    )
                    if fallback_result.returncode == 0:
                        return f"[Notice: Auto-switched to {self.fallback_model} due to quota limit]\n\n" + fallback_result.stdout.strip()

                return f"[QUOTA_EXHAUSTED]: {err_msg}"

            return f"[Antigravity Error]: {err_msg}"
        except Exception as e:
            return f"[Execution Exception]: {e}"

def get_engine(engine_name: str, model: str = None):
    if engine_name.lower() == "antigravity":
        return AntigravityEngine(default_model=model or "gemini-3.8-flash-high")
    else:
        # Default is OpenCode with free model
        return OpenCodeEngine(default_model=model or "opencode/deepseek-v4.1-flash-free")
