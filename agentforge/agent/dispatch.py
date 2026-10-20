"""
AgentForge CLI Dispatcher.
Enables Lead / Humans to dispatch tasks directly from any IDE, CLI, or Terminal
to the distributed agent squad without needing the Web Dashboard.

Usage:
  # 1. Quick dispatch
  python dispatch.py --role ba --title "Viết spec Thầu phụ" --desc "Theo chuẩn FIDIC..."

  # 2. Dispatch all tasks from a Plan Markdown file
  python dispatch.py --plan docs/plans/PLAN-002-SUBCONTRACTORS.md

  # 3. Interactive mode
  python dispatch.py --interactive

  # 4. View live cluster status
  python dispatch.py --status
"""
import os
import sys
import re
import json
import argparse
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

DEFAULT_HUB_URL = os.environ.get("HUB_URL", "http://192.168.1.50:8000")

def get_agents(hub_url=DEFAULT_HUB_URL):
    try:
        req = urllib.request.Request(f"{hub_url}/api/agents")
        with urllib.request.urlopen(req, timeout=5) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        print(f"[Error] Cannot connect to Hub at {hub_url}: {e}")
        return []

def get_tasks(hub_url=DEFAULT_HUB_URL):
    try:
        req = urllib.request.Request(f"{hub_url}/api/tasks")
        with urllib.request.urlopen(req, timeout=5) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        print(f"[Error] Cannot fetch tasks from Hub: {e}")
        return []

def print_cluster_status(hub_url=DEFAULT_HUB_URL):
    agents = get_agents(hub_url)
    tasks = get_tasks(hub_url)
    print("\n==========================================================")
    print("           AgentForge Cluster Live Status                 ")
    print("==========================================================")
    print(f"Hub URL: {hub_url}")
    print("\n--- CONNECTED AGENTS ---")
    if not agents:
        print("  (No agents currently connected)")
    for a in agents:
        status_icon = "[ONLINE]" if a.get("status") == "idle" else "[BUSY]"
        print(f"  {status_icon} [{a.get('role', '').upper()}] ID: {a.get('agent_id')} | Host: {a.get('hostname')} | IP: {a.get('ip')} | Status: {a.get('status')}")

    print("\n--- RECENT TASKS ---")
    if not tasks:
        print("  (No tasks found)")
    for t in tasks[-5:]:
        icon = "[DONE]" if t.get("status") == "done" else "[IN_PROGRESS]" if t.get("status") == "in_progress" else "[FAILED]" if t.get("status") == "failed" else "[PENDING]"
        print(f"  {icon} [{t.get('task_id')}] ({t.get('assigned_role')}) {t.get('title')} [{t.get('status')}]")
    print("==========================================================\n")

def dispatch_task(role, title, description, priority="high", engine=None, model=None, hub_url=DEFAULT_HUB_URL):
    payload = {
        "title": title,
        "description": description,
        "assigned_role": role.lower(),
        "priority": priority.lower(),
        "project_id": "adb-erp"
    }
    if engine:
        payload["engine"] = engine
    if model:
        payload["model"] = model

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{hub_url}/api/tasks",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            result = json.loads(res.read().decode())
            task_id = result.get("task_id", "N/A")
            agent_id = result.get("assigned_agent_id", "unassigned")
            print(f"✅ Dispatched successfully! Task ID: [{task_id}] -> Assigned to: [{agent_id}] ({role.upper()})")
            return result
    except urllib.error.URLError as e:
        print(f"❌ Failed to dispatch task to Hub ({hub_url}): {e}")
        return None

def dispatch_from_plan_file(plan_path, hub_url=DEFAULT_HUB_URL):
    if not os.path.exists(plan_path):
        print(f"❌ Plan file not found: {plan_path}")
        return

    print(f"\nParsing Plan file: {plan_path}...")
    with open(plan_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Look for markdown table rows with: | Task ID | Description / Title | Role | ... |
    # Matches patterns like: | T-01 | Title | BA | ...
    table_pattern = re.compile(r"^\|\s*([A-Za-z0-9_\-]+)\s*\|\s*([^|]+)\|\s*(ba|dev|developer|tester|lead)\s*\|", re.IGNORECASE | re.MULTILINE)
    matches = table_pattern.findall(content)

    if not matches:
        print("⚠️ No structured task table rows found in plan file.")
        print("Table format expected: | Task ID | Title / Description | Assignee Role |")
        return

    print(f"Found {len(matches)} task(s) in plan. Dispatching to Hub...")
    for task_id, desc, role in matches:
        clean_desc = desc.strip()
        clean_role = role.strip().lower()
        if clean_role == "dev":
            clean_role = "developer"
        print(f"-> Dispatching [{task_id}]: {clean_desc} to [{clean_role}]...")
        dispatch_task(
            role=clean_role,
            title=f"[{task_id}] {clean_desc}",
            description=f"Part of plan {os.path.basename(plan_path)}. Task ref: {task_id}. See {plan_path} for full context.",
            priority="high",
            hub_url=hub_url
        )

def interactive_mode(hub_url=DEFAULT_HUB_URL):
    print("\n=== AgentForge Direct Task Dispatcher (Interactive) ===")
    print("Select Target Role:")
    print("  [1] BA / Spec Writer")
    print("  [2] Developer")
    print("  [3] Tester / QA")
    print("  [4] Lead / Architect")
    
    choice = input("Enter choice [1-4] (default 1): ").strip()
    role_map = {"1": "ba", "2": "developer", "3": "tester", "4": "lead"}
    role = role_map.get(choice, "ba")

    title = input("Enter Task Title: ").strip()
    if not title:
        print("❌ Task title cannot be empty.")
        return

    print("Enter Task Description (press Enter twice or type EOF when finished):")
    lines = []
    while True:
        try:
            line = input()
            if not line and lines and not lines[-1]:
                break
            lines.append(line)
        except EOFError:
            break
    desc = "\n".join(lines).strip() or title

    dispatch_task(role=role, title=title, description=desc, hub_url=hub_url)

def main():
    parser = argparse.ArgumentParser(description="AgentForge Task Dispatch CLI")
    parser.add_argument("--role", choices=["ba", "developer", "tester", "lead"], help="Target role")
    parser.add_argument("--title", help="Task title")
    parser.add_argument("--desc", "--description", help="Task description")
    parser.add_argument("--priority", choices=["low", "medium", "high", "critical"], default="high")
    parser.add_argument("--engine", choices=["antigravity", "opencode"], help="AI Engine")
    parser.add_argument("--model", help="AI Model")
    parser.add_argument("--plan", help="Path to Plan Markdown file to auto-dispatch tasks from")
    parser.add_argument("--status", action="store_true", help="Print live cluster status")
    parser.add_argument("--interactive", "-i", action="store_true", help="Launch interactive task creation")
    parser.add_argument("--hub", default=DEFAULT_HUB_URL, help="Hub URL")

    args = parser.parse_args()

    if args.status:
        print_cluster_status(args.hub)
        return

    if args.plan:
        dispatch_from_plan_file(args.plan, args.hub)
        return

    if args.interactive or (not args.role and not args.title):
        interactive_mode(args.hub)
        return

    if args.role and args.title:
        desc = args.desc or args.title
        dispatch_task(
            role=args.role,
            title=args.title,
            description=desc,
            priority=args.priority,
            engine=args.engine,
            model=args.model,
            hub_url=args.hub
        )
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
