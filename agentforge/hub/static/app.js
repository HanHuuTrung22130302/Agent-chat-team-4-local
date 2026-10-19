// AgentForge Web Dashboard WebSocket Client & UI Handler

let ws = null;
let currentAgentsList = [];
let targetConfigAgentId = null;
const host = window.location.host;
const wsUrl = `ws://${host}/ws/ui`;

const MODEL_PRESETS = {
  opencode: [
    { value: "opencode/deepseek-v4.1-flash-free", label: "DeepSeek v4.1 Flash (FREE - Recommended)", free: true },
    { value: "opencode/mimo-v2.6-flash-free", label: "Mimo v2.6 Flash (FREE)", free: true },
    { value: "opencode/nemotron-3.5-lightning-free", label: "Nemotron 3.5 Lightning (FREE)", free: true },
    { value: "opencode/glm-5.3-flash-free", label: "GLM 5.3 Flash (FREE)", free: true },
    { value: "opencode/minimax-m3.1-flash-free", label: "MiniMax m3.1 Flash (FREE)", free: true },
    { value: "opencode/deepseek-v4-pro", label: "DeepSeek v4 Pro", free: false },
    { value: "opencode/claude-opus-4-6", label: "Claude Opus 4.6", free: false },
    { value: "custom", label: "Custom Model Identifier...", free: false }
  ],
  antigravity: [
    { value: "gemini-3.8-flash-high", label: "Gemini 3.8 Flash High (FREE Tier)", free: true },
    { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 (Thinking)", free: false },
    { value: "claude-opus-4-6-thinking", label: "Claude Opus 4.6 (Thinking)", free: false },
    { value: "gemini-4-argon", label: "Gemini 4 Argon (Pro Tier)", free: false },
    { value: "gpt-oss-120b-medium", label: "GPT-OSS 120B (Medium)", free: true },
    { value: "custom", label: "Custom Model Identifier...", free: false }
  ]
};

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

    currentAgentsList = agentsRes;
    renderAgents(agentsRes);
    renderTasks(tasksRes);
    renderMessages(msgsRes);
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }
}

function handleServerEvent(eventType, data) {
  if (eventType === "agent_update" || eventType === "agent_offline" || eventType === "agent_heartbeat") {
    fetch("/api/agents").then(r => r.json()).then(res => {
      currentAgentsList = res;
      renderAgents(res);
    });
  } else if (eventType === "task_created" || eventType === "task_complete" || eventType === "task_failed" || eventType === "task_progress") {
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
    const engineId = `engine-${roleMap[agent.role] || agent.role}`;
    const modelId = `model-${roleMap[agent.role] || agent.role}`;
    const taskId = `task-${roleMap[agent.role] || agent.role}`;

    const card = document.getElementById(cardId);
    const statusEl = document.getElementById(statusId);
    const engineEl = document.getElementById(engineId);
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

      if (engineEl) engineEl.textContent = agent.engine === "antigravity" ? "Antigravity Pro" : "OpenCode CLI";
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
    
    const engineBadge = t.engine ? `<span class="text-[9px] uppercase px-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${t.engine}</span>` : '';
    
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="mono font-semibold text-slate-300">${t.task_id}</span>
        <div class="flex items-center gap-1">
          ${engineBadge}
          <span class="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">${t.assigned_role}</span>
        </div>
      </div>
      <p class="font-medium text-slate-200 line-clamp-2">${t.title}</p>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span class="mono text-[10px] text-slate-400 truncate max-w-[140px]">${t.model || 'default'}</span>
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
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      jsonrpc: "2.0",
      method: "chat.message",
      params: { sender: "You (Admin)", content: text }
    }));
  }
  input.value = "";
}

// --- Dynamic IDE & Model Population ---

function populateModels(selectId, engine, currentModel = null) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  const list = MODEL_PRESETS[engine] || MODEL_PRESETS.opencode;

  list.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.value;
    opt.textContent = m.label;
    if (currentModel && m.value === currentModel) opt.selected = true;
    select.appendChild(opt);
  });
}

// Modal Task Dispatcher Handlers
function openNewTaskModal() {
  populateModels("modal-task-model", document.getElementById("modal-task-engine").value);
  document.getElementById("task-modal").classList.remove("hidden");
}

function closeNewTaskModal() {
  document.getElementById("task-modal").classList.add("hidden");
}

function onTaskEngineChange() {
  const engine = document.getElementById("modal-task-engine").value;
  populateModels("modal-task-model", engine);
  onTaskModelChange();
}

function onTaskModelChange() {
  const val = document.getElementById("modal-task-model").value;
  const customBox = document.getElementById("modal-custom-model-box");
  if (val === "custom") {
    customBox.classList.remove("hidden");
  } else {
    customBox.classList.add("hidden");
  }
}

async function submitNewTask(e) {
  e.preventDefault();
  const title = document.getElementById("modal-task-title").value.trim();
  const desc = document.getElementById("modal-task-desc").value.trim();
  const role = document.getElementById("modal-task-role").value;
  const priority = document.getElementById("modal-task-priority").value;
  const engine = document.getElementById("modal-task-engine").value;
  
  let model = document.getElementById("modal-task-model").value;
  if (model === "custom") {
    model = document.getElementById("modal-task-custom-model").value.trim();
  }

  try {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc, assigned_role: role, priority, engine, model })
    });
    closeNewTaskModal();
    document.getElementById("modal-task-title").value = "";
    document.getElementById("modal-task-desc").value = "";
  } catch (err) {
    alert("Failed to create task: " + err);
  }
}

// --- Agent Configuration Modal Handlers ---

function openAgentConfigModal(role) {
  document.getElementById("cfg-agent-role").textContent = role;
  const agent = currentAgentsList.find(a => a.role === role);
  targetConfigAgentId = agent ? agent.agent_id : `${role}-node`;

  const engineSelect = document.getElementById("cfg-engine");
  engineSelect.value = agent ? agent.engine : (role === "ba" ? "antigravity" : "opencode");
  
  populateModels("cfg-model", engineSelect.value, agent ? agent.model : null);
  onConfigModelChange();

  document.getElementById("config-modal").classList.remove("hidden");
}

function closeAgentConfigModal() {
  document.getElementById("config-modal").classList.add("hidden");
}

function onConfigEngineChange() {
  const engine = document.getElementById("cfg-engine").value;
  populateModels("cfg-model", engine);
  onConfigModelChange();
}

function onConfigModelChange() {
  const val = document.getElementById("cfg-model").value;
  const customBox = document.getElementById("cfg-custom-model-box");
  if (val === "custom") {
    customBox.classList.remove("hidden");
  } else {
    customBox.classList.add("hidden");
  }
}

async function saveAgentConfig(e) {
  e.preventDefault();
  const engine = document.getElementById("cfg-engine").value;
  let model = document.getElementById("cfg-model").value;
  if (model === "custom") {
    model = document.getElementById("cfg-custom-model").value.trim();
  }

  try {
    await fetch(`/api/agents/${targetConfigAgentId}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ engine, model })
    });
    closeAgentConfigModal();
  } catch (err) {
    alert("Failed to update config: " + err);
  }
}

window.addEventListener("DOMContentLoaded", initWebSocket);
