"""
AI Crew Studio - Backend API
FastAPI ile CrewAI agent orchestration
"""

import os
import json
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import uuid

from crew_manager import CrewManager, AgentConfig, TaskConfig

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
    
    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            try:
                await self.active_connections[session_id].send_json(message)
            except:
                self.disconnect(session_id)
    
    async def broadcast(self, message: dict):
        for session_id in list(self.active_connections.keys()):
            await self.send_message(session_id, message)

manager = ConnectionManager()

# Pydantic Models
class AgentCreate(BaseModel):
    name: str
    role: str
    goal: str
    backstory: str
    tools: List[str] = []

class TaskCreate(BaseModel):
    description: str
    expected_output: str
    agent_name: str

class CrewConfig(BaseModel):
    agents: List[AgentCreate]
    tasks: List[TaskCreate]
    model: str = "gemini-2.0-flash-lite"
    topic: str = ""

class SessionState(BaseModel):
    id: str
    status: str
    agents: List[dict] = []
    tasks: List[dict] = []
    model: str = ""
    api_key: str = ""
    current_step: int = 0
    logs: List[dict] = []
    result: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

# Session storage
sessions: Dict[str, SessionState] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 AI Crew Studio Backend Starting...")
    yield
    # Shutdown
    print("👋 AI Crew Studio Backend Shutting Down...")

app = FastAPI(
    title="AI Crew Studio",
    description="Interactive AI Agent Orchestration Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Available Gemini Models
AVAILABLE_MODELS = [
    {"id": "gemini-2.5-flash-preview-05-20", "name": "Gemini 2.5 Flash", "description": "HIZLI VE AKILLI", "badge": "Önerilen"},
    {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "description": "İKİNCİ NESİL ÇALIŞKAN", "badge": ""},
    {"id": "gemini-2.5-pro-preview-06-05", "name": "Gemini 2.5 Pro", "description": "EN AKILLI", "badge": "Pro"},
    {"id": "gemini-2.5-flash-lite-preview-06-17", "name": "Gemini 2.5 Flash Lite", "description": "EN DENGELİ", "badge": ""},
]

# Available Tools
AVAILABLE_TOOLS = [
    {"id": "internet_search", "name": "İnternet Araması", "description": "DuckDuckGo ile web araması"},
    {"id": "web_scraper", "name": "Web Scraper", "description": "Web sayfalarından veri çekme"},
]

@app.get("/")
async def root():
    return {"message": "AI Crew Studio API", "version": "1.0.0"}

@app.get("/api/models")
async def get_models():
    return {"models": AVAILABLE_MODELS}

@app.get("/api/tools")
async def get_tools():
    return {"tools": AVAILABLE_TOOLS}

# Settings - API Key validation
class ApiKeyRequest(BaseModel):
    api_key: str

@app.post("/api/settings/validate-key")
async def validate_api_key(request: ApiKeyRequest):
    """Validate Gemini API key by making a test request"""
    import google.generativeai as genai
    try:
        genai.configure(api_key=request.api_key)
        # Quick test to validate key
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content("Say 'OK'", generation_config={"max_output_tokens": 10})
        return {"valid": True, "message": "API anahtarı geçerli"}
    except Exception as e:
        return {"valid": False, "message": f"API anahtarı geçersiz: {str(e)}"}

@app.post("/api/sessions/{session_id}/api-key")
async def set_api_key(session_id: str, request: ApiKeyRequest):
    """Set API key for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id].api_key = request.api_key
    return {"status": "success"}

@app.post("/api/sessions")
async def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = SessionState(
        id=session_id,
        status="created",
        current_step=1
    )
    return {"session_id": session_id}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]

@app.post("/api/sessions/{session_id}/agents")
async def add_agents(session_id: str, agents: List[AgentCreate]):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id].agents = [agent.model_dump() for agent in agents]
    sessions[session_id].current_step = 2
    sessions[session_id].status = "agents_defined"
    
    await manager.send_message(session_id, {
        "type": "step_update",
        "step": 2,
        "message": "Ajanlar tanımlandı"
    })
    
    return {"status": "success", "agents_count": len(agents)}

@app.post("/api/sessions/{session_id}/model")
async def set_model(session_id: str, model: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id].model = model.get("model_id", "gemini-2.0-flash-lite")
    sessions[session_id].current_step = 3
    sessions[session_id].status = "model_selected"
    
    await manager.send_message(session_id, {
        "type": "step_update",
        "step": 3,
        "message": f"Model seçildi: {sessions[session_id].model}"
    })
    
    return {"status": "success", "model": sessions[session_id].model}

@app.post("/api/sessions/{session_id}/tasks")
async def add_tasks(session_id: str, tasks: List[TaskCreate]):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id].tasks = [task.model_dump() for task in tasks]
    sessions[session_id].current_step = 4
    sessions[session_id].status = "tasks_defined"
    
    await manager.send_message(session_id, {
        "type": "step_update",
        "step": 4,
        "message": "Görevler tanımlandı"
    })
    
    return {"status": "success", "tasks_count": len(tasks)}

@app.post("/api/sessions/{session_id}/start")
async def start_crew(session_id: str, config: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    session.status = "running"
    session.started_at = datetime.now().isoformat()
    session.logs = []
    
    topic = config.get("topic", "Yapay Zeka Teknolojileri")
    
    # Start crew execution in background
    asyncio.create_task(run_crew(session_id, topic))
    
    return {"status": "started", "session_id": session_id}

async def run_crew(session_id: str, topic: str):
    """Run the crew and send real-time updates"""
    session = sessions[session_id]
    
    try:
        # Callback function to send messages
        def send_update(msg):
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    asyncio.ensure_future(manager.send_message(session_id, msg))
                else:
                    loop.create_task(manager.send_message(session_id, msg))
            except Exception:
                # Ignore callback errors to not interrupt execution
                pass
        
        # Initialize CrewManager with API key from session
        crew_manager = CrewManager(
            model_name=session.model,
            callback=send_update,
            api_key=session.api_key if session.api_key else None
        )
        
        # Create agents
        for agent_data in session.agents:
            agent_config = AgentConfig(**agent_data)
            crew_manager.add_agent(agent_config)
            
            await manager.send_message(session_id, {
                "type": "agent_created",
                "agent": agent_data["name"],
                "status": "ready"
            })
        
        # Create tasks
        for task_data in session.tasks:
            task_config = TaskConfig(**task_data)
            crew_manager.add_task(task_config)
            
            await manager.send_message(session_id, {
                "type": "task_created",
                "task": task_data["description"][:50] + "...",
                "agent": task_data["agent_name"]
            })
        
        # Run the crew
        await manager.send_message(session_id, {
            "type": "crew_started",
            "message": "Ekip çalışmaya başladı!"
        })
        
        result = await crew_manager.run(topic)
        
        session.result = result
        session.status = "completed"
        session.completed_at = datetime.now().isoformat()
        
        await manager.send_message(session_id, {
            "type": "crew_completed",
            "result": result,
            "message": "İşlem tamamlandı!"
        })
        
    except Exception as e:
        session.status = "error"
        session.logs.append({
            "type": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        })
        
        await manager.send_message(session_id, {
            "type": "error",
            "message": str(e)
        })

@app.get("/api/sessions/{session_id}/result")
async def get_result(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    return {
        "status": session.status,
        "result": session.result,
        "logs": session.logs,
        "started_at": session.started_at,
        "completed_at": session.completed_at
    }

@app.get("/api/sessions/{session_id}/stats")
async def get_stats(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    # Calculate stats
    agent_stats = []
    for agent in session.agents:
        agent_logs = [log for log in session.logs if log.get("agent") == agent["name"]]
        agent_stats.append({
            "name": agent["name"],
            "role": agent["role"],
            "tasks_completed": len([l for l in agent_logs if l.get("type") == "task_completed"]),
            "messages_sent": len([l for l in agent_logs if l.get("type") == "message"])
        })
    
    return {
        "session_id": session_id,
        "status": session.status,
        "total_agents": len(session.agents),
        "total_tasks": len(session.tasks),
        "agent_stats": agent_stats,
        "total_logs": len(session.logs)
    }

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
            message = json.loads(data)
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
