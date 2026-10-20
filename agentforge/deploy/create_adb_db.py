import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("192.168.1.50", port=22, username="hant", password="1", timeout=10)

cmd = """docker exec postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'adb_erp'" | grep -q 1 || docker exec postgres psql -U postgres -c "CREATE DATABASE adb_erp;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
stdout.channel.recv_exit_status()

stdin, stdout, stderr = ssh.exec_command("docker exec postgres psql -U postgres -c \"\\l\" | grep adb_erp")
print("Database created/verified on PostgreSQL container:")
print(stdout.read().decode())
ssh.close()
