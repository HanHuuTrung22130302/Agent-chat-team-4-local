"""
Remote deployment script for AgentForge Hub on Ubuntu Server (192.168.1.50).
Connects via SSH, creates PostgreSQL database, uploads hub files via SFTP,
and starts the Hub Docker container.
"""
import os
import paramiko
import sys
import time

SERVER_HOST = "192.168.1.50"
SERVER_PORT = 22
SERVER_USER = "hant"
SERVER_PASS = "1"
REMOTE_DIR = "/home/hant/agentforge"

def log(msg):
    print(f"[AgentForge Deploy] {msg}")

def upload_directory(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass  # Directory already exists

    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        dest_dir = os.path.join(remote_dir, rel_path).replace("\\", "/")
        try:
            sftp.mkdir(dest_dir)
        except IOError:
            pass

        for file in files:
            local_file = os.path.join(root, file)
            remote_file = os.path.join(dest_dir, file).replace("\\", "/")
            log(f"Uploading {file} -> {remote_file}")
            sftp.put(local_file, remote_file)

def deploy():
    log(f"Connecting to {SERVER_HOST}:{SERVER_PORT} as {SERVER_USER}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER_HOST, port=SERVER_PORT, username=SERVER_USER, password=SERVER_PASS, timeout=10)

    # 1. Create agentforge database in existing postgres container
    log("Creating 'agentforge' database in existing PostgreSQL container...")
    create_db_cmd = "docker exec postgres psql -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname = 'agentforge'\" | grep -q 1 || docker exec postgres psql -U postgres -c \"CREATE DATABASE agentforge;\""
    stdin, stdout, stderr = ssh.exec_command(create_db_cmd)
    stdout.channel.recv_exit_status()
    log("PostgreSQL database check/creation completed.")

    # 2. Upload hub files and docker-compose
    log("Uploading AgentForge Hub files via SFTP...")
    sftp = ssh.open_sftp()
    
    # Ensure remote base directory exists
    try:
        sftp.mkdir(REMOTE_DIR)
    except IOError:
        pass

    local_hub_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "hub"))
    upload_directory(sftp, local_hub_dir, f"{REMOTE_DIR}/hub")

    local_compose = os.path.abspath(os.path.join(os.path.dirname(__file__), "docker-compose.yml"))
    sftp.put(local_compose, f"{REMOTE_DIR}/docker-compose.yml")
    sftp.close()
    log("Upload completed.")

    # 3. Build & Run Docker Compose on Server
    log("Building and launching AgentForge Hub container on Ubuntu Server...")
    run_cmd = f"cd {REMOTE_DIR} && docker compose up -d --build"
    stdin, stdout, stderr = ssh.exec_command(run_cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    
    if out:
        print(out)
    if err:
        print("Build Log:", err)

    time.sleep(3)

    # 4. Verify Hub container status
    log("Checking running containers...")
    stdin, stdout, stderr = ssh.exec_command("docker ps --filter name=agentforge-hub --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")
    print(stdout.read().decode('utf-8', errors='replace'))

    ssh.close()
    log("AgentForge Hub deployment finished! Web Dashboard available at: http://192.168.1.50:8000")

if __name__ == "__main__":
    deploy()
