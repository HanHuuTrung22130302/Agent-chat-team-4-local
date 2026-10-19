import paramiko
import os

SERVER_HOST = "192.168.1.50"
SERVER_PORT = 22
SERVER_USER = "hant"
SERVER_PASS = "1"
REMOTE_HUB = "/home/hant/agentforge/hub"

files_to_upload = [
    ("agentforge/hub/app.py", f"{REMOTE_HUB}/app.py"),
    ("agentforge/hub/protocol.py", f"{REMOTE_HUB}/protocol.py"),
    ("agentforge/hub/static/index.html", f"{REMOTE_HUB}/static/index.html"),
    ("agentforge/hub/static/app.js", f"{REMOTE_HUB}/static/app.js")
]

def update_hub():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER_HOST, port=SERVER_PORT, username=SERVER_USER, password=SERVER_PASS, timeout=10)
    sftp = ssh.open_sftp()

    base_dir = "e:/Nam5/MultiAgentChat"
    for local_rel, remote_path in files_to_upload:
        local_full = os.path.join(base_dir, local_rel)
        print(f"Uploading {local_rel} -> {remote_path}...")
        sftp.put(local_full, remote_path)
    sftp.close()

    print("Rebuilding and restarting agentforge-hub container...")
    stdin, stdout, stderr = ssh.exec_command("cd /home/hant/agentforge && docker compose build hub && docker compose up -d hub")
    stdout.channel.recv_exit_status()
    
    print("Checking container status...")
    stdin, stdout, _ = ssh.exec_command("docker ps --filter name=agentforge-hub --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")
    print(stdout.read().decode('utf-8'))
    ssh.close()
    print("Update complete!")

if __name__ == "__main__":
    update_hub()
