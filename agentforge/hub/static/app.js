// AgentForge Web Dashboard WebSocket Client & UI Handler

let ws = null;
const host = window.location.host;
const wsUrl = `ws://${host}/ws/ui`;

function initWebSocket() {
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    document.getElementById("ws-indicator").className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
    document.getElementById("ws-status").textContent = `Hub Live (${host})`;
    fetchInitialData();
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleServerEvent(msg.event, msg.data);
    } catch (e) {
      console.error("Error parsing WS message:", e);
    }
  };

  ws.onclose = () => {
    document.getElementById("ws-indicator").className = "w-2.5 h-2.5 rounded-full bg-red-500";
    document.getElementById("ws-status").textContent = "Hub Disconnected (Retrying...)";
    setTimeout(initWebSocket, 3000);
  };
}

async function fetchInitialData() {
  try {
    const [agentsRes, tasksRes, msgsRes] = await Promise.all([
      fetch("/api/agents").then(r => r.json()),
      fetch("/api/tasks").then(r => r.json()),
      fetch("/api/messages").then(r => r.json())
    ]);

    renderAgents(agentsRes);
    renderTasks(tasksRes);
    renderMessages(msgsRes);
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }
}

function handleServerEvent(eventType, data) {
  if (eventType === "agent_update" || eventType === "agent_offline" || eventType === "agent_heartbeat") {
    fetch("/api/agents").then(r => r.json()).then(renderAgents);
  } else if (eventType === "task_created" || eventType === "task_complete" || eventType === "task_failed") {
    fetch("/api/tasks").then(r => r.json()).then(renderTasks);
  } else if (eventType === "chat_message") {
    appendChatMessage(data);
  }
}

function renderAgents(agents) {
  let onlineCount = 0;
  const roleMap = { lead: "lead", ba: "ba", developer: "developer", tester: "tester" };

  agents.forEach(agent => {
    const cardId = `card-${roleMap[agent.role] || agent.role}`;
    const statusId = `status-${roleMap[agent.role] || agent.role}`;
    const modelId = `model-${roleMap[agent.role] || agent.role}`;
    const taskId = `task-${roleMap[agent.role] || agent.role}`;

    const card = document.getElementById(cardId);
    const statusEl = document.getElementById(statusId);
    const modelEl = document.getElementById(modelId);
    const taskEl = document.getElementById(taskId);

    if (card && statusEl) {
      if (agent.status === "busy") {
        statusEl.className = "text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20";
        statusEl.textContent = "Busy";
        onlineCount++;
      } else if (agent.status === "idle") {
        statusEl.className = "text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        statusEl.textContent = "Online";
        onlineCount++;
      } else {
        statusEl.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700";
        statusEl.textContent = "Offline";
      }

      if (modelEl) modelEl.textContent = agent.model || "Free";
      if (taskEl) taskEl.textContent = agent.current_task_id || "None";
    }
  });

  document.getElementById("agent-count").textContent = `${onlineCount} of 4 connected`;
}

function renderTasks(tasks) {
  const cols = {
    pending: document.getElementById("col-pending"),
    in_progress: document.getElementById("col-in_progress"),
    review: document.getElementById("col-review"),
    done: document.getElementById("col-done")
  };

  const counts = { pending: 0, in_progress: 0, review: 0, done: 0 };
  Object.values(cols).forEach(c => { if(c) c.innerHTML = ""; });

  tasks.forEach(t => {
    const colKey = cols[t.status] ? t.status : "pending";
    counts[colKey]++;

    const card = document.createElement("div");
    card.className = "p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs space-y-1.5 shadow-sm hover:border-slate-700 transition";
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="mono font-semibold text-slate-300">${t.task_id}</span>
        <span class="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">${t.assigned_role}</span>
      </div>
      <p class="font-medium text-slate-200 line-clamp-2">${t.title}</p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Priority: ${t.priority}</span>
        <span class="text-indigo-400 font-mono">${t.assigned_agent_id ? t.assigned_agent_id : 'unassigned'}</span>
      </div>
    `;
    if (cols[colKey]) cols[colKey].appendChild(card);
  });

  document.getElementById("count-pending").textContent = counts.pending;
  document.getElementById("count-in_progress").textContent = counts.in_progress;
  document.getElementById("count-review").textContent = counts.review;
  document.getElementById("count-done").textContent = counts.done;
}

function renderMessages(messages) {
  const stream = document.getElementById("chat-stream");
  stream.innerHTML = "";
  messages.forEach(appendChatMessage);
}

function appendChatMessage(msg) {
  const stream = document.getElementById("chat-stream");
  const el = document.createElement("div");
  el.className = "p-2 rounded bg-slate-900/40 border border-slate-800/80 leading-relaxed";
  
  let senderColor = "text-indigo-400";
  if (msg.sender === "System" || msg.sender === "Hub") senderColor = "text-amber-400";
  if (msg.sender && msg.sender.includes("dev")) senderColor = "text-emerald-400";
  if (msg.sender && msg.sender.includes("test")) senderColor = "text-purple-400";

  el.innerHTML = `
    <div class="flex justify-between items-center mb-0.5">
      <span class="font-semibold ${senderColor}">[${msg.sender}]</span>
      <span class="text-[10px] text-slate-500">${msg.timestamp || ''}</span>
    </div>
    <div class="text-slate-300 break-words">${msg.content}</div>
  `;
  stream.appendChild(el);
  stream.scrollTop = stream.scrollHeight;
}

async function sendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  
  // Send via WebSocket if open
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      jsonrpc: "2.0",
      method: "chat.message",
      params: { sender: "You (Admin)", content: text }
    }));
  }
  input.value = "";
}

function openNewTaskModal() {
  document.getElementById("task-modal").classList.remove("hidden");
}

function closeNewTaskModal() {
  document.getElementById("task-modal").classList.add("hidden");
}

async function submitNewTask(e) {
  e.preventDefault();
  const title = document.getElementById("modal-task-title").value.trim();
  const desc = document.getElementById("modal-task-desc").value.trim();
  const role = document.getElementById("modal-task-role").value;
  const priority = document.getElementById("modal-task-priority").value;

  try {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc, assigned_role: role, priority })
    });
    closeNewTaskModal();
    document.getElementById("modal-task-title").value = "";
    document.getElementById("modal-task-desc").value = "";
  } catch (err) {
    alert("Failed to create task: " + err);
  }
}

window.addEventListener("DOMContentLoaded", initWebSocket);
