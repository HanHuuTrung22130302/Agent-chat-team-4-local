"""
AgentForge Environment Diagnostic Tool.
Run this script on any computer (PC-1..4) to verify CLI binaries and Hub connectivity.
"""
import sys
import shutil
import subprocess
import urllib.request
from engines import find_agy_executable, find_opencode_executable, IS_WINDOWS

def check_env():
    print("==========================================================")
    print("      AgentForge Node Environment Diagnostic Tool         ")
    print("==========================================================")
    print(f"Platform       : {sys.platform} (Windows={IS_WINDOWS})")
    print(f"Python Exec    : {sys.executable}")
    print(f"Python Version : {sys.version.split()[0]}")

    # 1. Check Antigravity CLI
    print("\n[1] Checking Antigravity CLI (agy):")
    agy_bin = find_agy_executable()
    print(f"    Resolved Path: {agy_bin}")
    try:
        res = subprocess.run([agy_bin, "--version"], capture_output=True, text=True, timeout=5, shell=IS_WINDOWS)
        if res.returncode == 0:
            print(f"    Status       : OK (Version: {res.stdout.strip()})")
        else:
            print(f"    Status       : Warning (Exit code {res.returncode}: {res.stderr.strip() or res.stdout.strip()})")
    except Exception as e:
        print(f"    Status       : FAILED ({e})")
        print("    -> Recommendation: Make sure Antigravity is installed and agy.exe is in PATH or AppData\\Local\\agy\\bin")

    # 2. Check OpenCode CLI
    print("\n[2] Checking OpenCode CLI:")
    opencode_bin = find_opencode_executable()
    print(f"    Resolved Path: {opencode_bin}")
    try:
        res = subprocess.run([opencode_bin, "--version"], capture_output=True, text=True, timeout=5, shell=IS_WINDOWS)
        if res.returncode == 0:
            print(f"    Status       : OK (Version: {res.stdout.strip()})")
        else:
            print(f"    Status       : Warning (Exit code {res.returncode}: {res.stderr.strip() or res.stdout.strip()})")
    except Exception as e:
        print(f"    Status       : FAILED ({e})")
        print("    -> Recommendation: Make sure OpenCode is installed via npm or on PATH.")

    # 3. Check Hub Server Connectivity
    hub_url = "http://192.168.1.50:8000/api/agents"
    print(f"\n[3] Checking Hub Connectivity ({hub_url}):")
    try:
        with urllib.request.urlopen(hub_url, timeout=5) as res:
            if res.status == 200:
                print("    Status       : Connected OK (Hub is Live)")
            else:
                print(f"    Status       : HTTP {res.status}")
    except Exception as e:
        print(f"    Status       : Failed to reach Hub ({e})")

    print("\n==========================================================")

if __name__ == "__main__":
    check_env()
