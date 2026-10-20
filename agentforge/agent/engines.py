"""
Execution engines for AgentForge Agent Daemon.
Supports OpenCode CLI (with free models) and Antigravity CLI (agy.exe).
"""
import subprocess
import shutil
import logging
import os
import sys

logger = logging.getLogger("agentforge.engines")

IS_WINDOWS = sys.platform == "win32"

QUOTA_ERROR_KEYWORDS = [
    "resource_exhausted", "429", "rate limit", "quota reached", 
    "quota exceeded", "insufficient_quota", "resets in", "too many requests"
]

def is_quota_error(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in QUOTA_ERROR_KEYWORDS)

def find_agy_executable() -> str:
    """Finds agy.exe or agy-node.cmd across standard Windows / Unix installation paths."""
    found = shutil.which("agy") or shutil.which("agy.exe") or shutil.which("agy.cmd")
    if found:
        return found

    user_profile = os.environ.get("USERPROFILE", "")
    app_data = os.environ.get("APPDATA", "")
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    program_files = os.environ.get("ProgramFiles", "C:\\Program Files")
    program_files_x86 = os.environ.get("ProgramFiles(x86)", "C:\\Program Files (x86)")

    candidates = [
        os.path.join(local_app_data, "agy", "bin", "agy.exe"),
        os.path.join(app_data, "Antigravity", "bin", "agy-node.cmd"),
        os.path.join(app_data, "Antigravity", "bin", "agy.cmd"),
        os.path.join(user_profile, "AppData", "Local", "agy", "bin", "agy.exe"),
        os.path.join(user_profile, ".gemini", "antigravity", "bin", "agy.exe"),
        os.path.join(user_profile, "AppData", "Local", "Programs", "Antigravity", "agy.exe"),
        os.path.join(user_profile, "AppData", "Local", "Programs", "Antigravity", "resources", "app", "bin", "agy.exe"),
        os.path.join(program_files, "Antigravity", "bin", "agy.exe"),
        os.path.join(program_files, "Antigravity", "agy.exe"),
        os.path.join(program_files_x86, "Antigravity", "bin", "agy.exe"),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    return "agy"

def find_opencode_executable() -> str:
    """Finds opencode CLI across standard Windows / npm paths, preferring direct .exe over .cmd."""
    user_profile = os.environ.get("USERPROFILE", "")
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    app_data = os.environ.get("APPDATA", "")
    
    # Check for direct .exe inside npm first (avoids cmd.exe newline parsing issues on Windows)
    npm_exe_candidates = [
        os.path.join(user_profile, "AppData", "Roaming", "npm", "node_modules", "opencode-ai", "bin", "opencode.exe"),
        os.path.join(app_data, "npm", "node_modules", "opencode-ai", "bin", "opencode.exe"),
        os.path.join(local_app_data, "opencode", "bin", "opencode.exe"),
        os.path.join(user_profile, ".local", "bin", "opencode.exe"),
    ]
    for c in npm_exe_candidates:
        if os.path.isfile(c):
            return c

    found = shutil.which("opencode.exe") or shutil.which("opencode") or shutil.which("opencode.cmd")
    if found:
        return found

    candidates = [
        os.path.join(user_profile, "AppData", "Roaming", "npm", "opencode.cmd"),
        os.path.join(app_data, "npm", "opencode.cmd"),
        os.path.join(user_profile, ".local", "bin", "opencode")
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    return "opencode"

class OpenCodeEngine:
    """Executes tasks via OpenCode CLI with automatic Quota Fallback."""
    def __init__(self, default_model: str = "opencode/deepseek-v4.1-flash-free"):
        self.default_model = default_model
        self.fallback_model = "opencode/deepseek-v4.1-flash-free"
        self.cmd = find_opencode_executable()

    def execute(self, prompt: str, model: str = None) -> str:
        target_model = model or self.default_model
        logger.info(f"OpenCode executing with model [{target_model}] using binary [{self.cmd}]...")
        use_shell = not self.cmd.lower().endswith(".exe") if IS_WINDOWS else False
        clean_prompt = prompt if not use_shell else prompt.replace("\r\n", " ").replace("\n", " ")
        try:
            result = subprocess.run(
                [self.cmd, "run", "-m", target_model, clean_prompt],
                stdin=subprocess.DEVNULL,
                capture_output=True,
                encoding="utf-8",
                errors="replace",
                timeout=180,
                shell=use_shell
            )
            output = (result.stdout or "").strip()
            err_msg = (result.stderr or "").strip() or output

            if result.returncode == 0 and not is_quota_error(output):
                return output or "Task completed (empty output)."

            logger.error(f"OpenCode error: {err_msg}")
        except subprocess.TimeoutExpired:
            logger.warning(f"[TIMEOUT ALERT] Model [{target_model}] timed out after 180s. Attempting Antigravity fallback...")
            err_msg = "Execution timed out after 180s"
        except Exception as e:
            logger.error(f"OpenCode execution failed: {e}")
            err_msg = str(e)

        # Smart Engine Fallback: Whenever OpenCode fails, auto-try Antigravity CLI
        agy_bin = find_agy_executable()
        if os.path.exists(agy_bin) or shutil.which(agy_bin) or agy_bin == "agy":
            logger.info(f"==> Auto-fallback to Antigravity CLI ({agy_bin}) due to OpenCode error: {err_msg[:80]}...")
            agy_engine = AntigravityEngine(default_model="gemini-3.8-flash-high")
            agy_output = agy_engine.execute(prompt)
            if not agy_output.startswith("[") or "Notice:" in agy_output:
                return f"[Notice: Auto-switched to Antigravity (gemini-3.8-flash-high) because OpenCode failed: {err_msg[:60]}]\n\n" + agy_output

        return f"[OpenCode Error]: {err_msg}"

class AntigravityEngine:
    """Executes tasks via Antigravity CLI (agy.exe) with automatic Quota Fallback."""
    def __init__(self, default_model: str = "gemini-3.8-flash-high"):
        self.default_model = default_model
        self.fallback_model = "gemini-3.8-flash-high"
        self.cmd = find_agy_executable()

    def execute(self, prompt: str, model: str = None) -> str:
        target_model = model or self.default_model
        logger.info(f"Antigravity executing with model [{target_model}] using binary [{self.cmd}]...")
        use_shell = not self.cmd.lower().endswith(".exe") if IS_WINDOWS else False
        clean_prompt = prompt if not use_shell else prompt.replace("\r\n", " ").replace("\n", " ")
        try:
            result = subprocess.run(
                [self.cmd, "-p", clean_prompt, "--model", target_model, "--dangerously-skip-permissions"],
                capture_output=True,
                encoding="utf-8",
                errors="replace",
                timeout=300,
                shell=use_shell
            )
            output = (result.stdout or "").strip()
            err_msg = (result.stderr or "").strip() or output

            if result.returncode == 0 and not is_quota_error(output):
                return output or "Task completed (empty output)."

            if is_quota_error(err_msg) or is_quota_error(output):
                logger.warning(f"[QUOTA ALERT] Antigravity model [{target_model}] hit quota! Error: {err_msg}")
                fallbacks = ["gemini-3.8-flash-high", "gemini-3.8-flash-medium", "gpt-oss-120b-medium"]
                for fb in fallbacks:
                    if fb == target_model:
                        continue
                    logger.info(f"==> Auto-fallback to [{fb}]...")
                    fallback_result = subprocess.run(
                        [self.cmd, "-p", clean_prompt, "--model", fb, "--dangerously-skip-permissions"],
                        capture_output=True,
                        encoding="utf-8",
                        errors="replace",
                        timeout=300,
                        shell=use_shell
                    )
                    fb_out = (fallback_result.stdout or "").strip()
                    if fallback_result.returncode == 0 and not is_quota_error(fb_out):
                        return f"[Notice: Auto-switched to {fb} due to quota limit on {target_model}]\n\n" + fb_out

                return f"[QUOTA_EXHAUSTED]: {err_msg}"

            # Smart Fallback to OpenCode if Antigravity failed
            opencode_bin = find_opencode_executable()
            if os.path.exists(opencode_bin) or shutil.which(opencode_bin) or opencode_bin == "opencode":
                logger.info(f"==> Auto-fallback to OpenCode CLI ({opencode_bin}) due to Antigravity error: {err_msg[:60]}...")
                op_engine = OpenCodeEngine()
                fallback_output = op_engine.execute(prompt)
                if not fallback_output.startswith("[") or "Notice:" in fallback_output:
                    return f"[Notice: Auto-switched to OpenCode because Antigravity failed: {err_msg[:80]}]\n\n" + fallback_output

            return f"[Antigravity Error]: {err_msg}"
        except Exception as e:
            logger.error(f"Antigravity exception: {e}")
            opencode_bin = find_opencode_executable()
            if os.path.exists(opencode_bin) or shutil.which(opencode_bin) or opencode_bin == "opencode":
                logger.info(f"==> Auto-fallback to OpenCode CLI ({opencode_bin}) due to Antigravity exception: {e}")
                op_engine = OpenCodeEngine()
                return op_engine.execute(prompt)
            return f"[Execution Exception]: {e} (Antigravity binary '{self.cmd}' could not be invoked. Check PATH or installation)"

def get_engine(engine_name: str, model: str = None):
    if engine_name.lower() == "antigravity":
        return AntigravityEngine(default_model=model or "gemini-3.8-flash-high")
    else:
        return OpenCodeEngine(default_model=model or "opencode/deepseek-v4.1-flash-free")

