import { create } from "zustand";

const API_BASE = "/api";

export const useAppStore = create((set, get) => ({
  // Session state
  sessionId: null,
  currentStep: 1,
  status: "idle",

  // Data
  agents: [],
  tasks: [],
  selectedModel: "gemini-2.5-flash-preview-05-20",
  topic: "",

  // Execution state
  logs: [],
  result: null,
  isRunning: false,

  // WebSocket
  ws: null,

  // Available options
  availableModels: [],
  availableTools: [],

  // Actions
  setStep: (step) => set({ currentStep: step }),

  setTopic: (topic) => set({ topic }),

  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, { ...agent, id: Date.now() }],
    })),

  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now() }],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  setModel: (model) => set({ selectedModel: model }),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, { ...log, timestamp: new Date().toISOString() }],
    })),

  clearLogs: () => set({ logs: [] }),

  // API calls
  fetchModels: async () => {
    try {
      const res = await fetch(`${API_BASE}/models`);
      const data = await res.json();
      set({ availableModels: data.models });
    } catch (err) {
      console.error("Failed to fetch models:", err);
    }
  },

  fetchTools: async () => {
    try {
      const res = await fetch(`${API_BASE}/tools`);
      const data = await res.json();
      set({ availableTools: data.tools });
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    }
  },

  createSession: async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions`, { method: "POST" });
      const data = await res.json();
      set({ sessionId: data.session_id, status: "created" });

      // Connect WebSocket
      get().connectWebSocket(data.session_id);

      return data.session_id;
    } catch (err) {
      console.error("Failed to create session:", err);
      throw err;
    }
  },

  connectWebSocket: (sessionId) => {
    const wsUrl = `ws://${window.location.host}/ws/${sessionId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      get().handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    set({ ws });
  },

  handleWebSocketMessage: (message) => {
    const { addLog } = get();

    switch (message.type) {
      case "agent_started":
      case "agent_thinking":
      case "agent_action":
      case "agent_completed":
      case "agent_communication":
      case "crew_started":
      case "task_created":
      case "agent_created":
        addLog(message);
        break;

      case "crew_completed":
        console.log("Crew completed!", message);
        set({
          result: message.result,
          isRunning: false,
          status: "completed",
          currentStep: 5,
        });
        addLog(message);
        break;

      case "error":
        console.error("Crew error:", message);
        set({ isRunning: false, status: "error" });
        addLog({ ...message, type: "error" });
        break;

      case "step_update":
        set({ currentStep: message.step });
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  },

  saveAgents: async () => {
    const { sessionId, agents } = get();
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/sessions/${sessionId}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          agents.map((a) => ({
            name: a.name,
            role: a.role,
            goal: a.goal,
            backstory: a.backstory,
            tools: a.tools || [],
          }))
        ),
      });
    } catch (err) {
      console.error("Failed to save agents:", err);
      throw err;
    }
  },

  saveModel: async () => {
    const { sessionId, selectedModel } = get();
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/sessions/${sessionId}/model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: selectedModel }),
      });
    } catch (err) {
      console.error("Failed to save model:", err);
      throw err;
    }
  },

  saveTasks: async () => {
    const { sessionId, tasks } = get();
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/sessions/${sessionId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          tasks.map((t) => ({
            description: t.description,
            expected_output: t.expectedOutput,
            agent_name: t.agentName,
          }))
        ),
      });
    } catch (err) {
      console.error("Failed to save tasks:", err);
      throw err;
    }
  },

  startCrew: async (apiKey) => {
    const { sessionId, topic } = get();
    if (!sessionId) return;

    set({ isRunning: true, status: "running", logs: [] });

    try {
      // First, set the API key for this session
      if (apiKey) {
        await fetch(`${API_BASE}/sessions/${sessionId}/api-key`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: apiKey }),
        });
      }

      await fetch(`${API_BASE}/sessions/${sessionId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
    } catch (err) {
      console.error("Failed to start crew:", err);
      set({ isRunning: false, status: "error" });
      throw err;
    }
  },

  fetchResult: async () => {
    const { sessionId } = get();
    if (!sessionId) return null;

    try {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}/result`);
      const data = await res.json();
      set({ result: data.result, status: data.status });
      return data;
    } catch (err) {
      console.error("Failed to fetch result:", err);
      return null;
    }
  },

  reset: () => {
    const { ws } = get();
    if (ws) ws.close();

    set({
      sessionId: null,
      currentStep: 1,
      status: "idle",
      agents: [],
      tasks: [],
      selectedModel: "gemini-2.5-flash-preview-05-20",
      topic: "",
      logs: [],
      result: null,
      isRunning: false,
      ws: null,
    });
  },
}));
