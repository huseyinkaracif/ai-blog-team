"""
CrewAI Manager - Agent ve Task yönetimi
"""

import os
import asyncio
from typing import List, Optional, Callable, Any
from dataclasses import dataclass, field
from datetime import datetime
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from crewai.tools import BaseTool
from duckduckgo_search import DDGS

# Environment setup
os.environ.setdefault("OPENAI_API_KEY", "NA")

@dataclass
class AgentConfig:
    name: str
    role: str
    goal: str
    backstory: str
    tools: List[str] = field(default_factory=list)

@dataclass
class TaskConfig:
    description: str
    expected_output: str
    agent_name: str

class InternetSearchTool(BaseTool):
    """DuckDuckGo internet search tool"""
    name: str = "Internet Search"
    description: str = "İnternette güncel konuları aramak için kullanılır."

    def _run(self, query: str) -> str:
        try:
            with DDGS() as ddgs:
                results = [r for r in ddgs.text(query, max_results=5)]
                return str(results)
        except Exception as e:
            return f"Arama hatası: {str(e)}"

class WebScraperTool(BaseTool):
    """Simple web scraper tool"""
    name: str = "Web Scraper"
    description: str = "Web sayfalarından içerik çekmek için kullanılır."

    def _run(self, url: str) -> str:
        try:
            import requests
            from bs4 import BeautifulSoup
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            # Get main text content
            for script in soup(["script", "style"]):
                script.decompose()
            text = soup.get_text()
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            return text[:3000]  # Limit to 3000 chars
        except Exception as e:
            return f"Scraping hatası: {str(e)}"

# Tool registry
TOOL_REGISTRY = {
    "internet_search": InternetSearchTool(),
    "web_scraper": WebScraperTool(),
}

class CrewCallback:
    """Custom callback for tracking crew execution"""
    
    def __init__(self, callback_fn: Optional[Callable] = None):
        self.callback_fn = callback_fn
        self.logs = []
    
    def log(self, message_type: str, data: dict):
        log_entry = {
            "type": message_type,
            "timestamp": datetime.now().isoformat(),
            **data
        }
        self.logs.append(log_entry)
        if self.callback_fn:
            self.callback_fn(log_entry)
    
    def agent_started(self, agent_name: str, task_description: str):
        self.log("agent_started", {
            "agent": agent_name,
            "task": task_description,
            "message": f"🤖 {agent_name} göreve başladı"
        })
    
    def agent_thinking(self, agent_name: str, thought: str):
        self.log("agent_thinking", {
            "agent": agent_name,
            "thought": thought[:200],
            "message": f"💭 {agent_name} düşünüyor..."
        })
    
    def agent_action(self, agent_name: str, action: str, tool: str = None):
        self.log("agent_action", {
            "agent": agent_name,
            "action": action,
            "tool": tool,
            "message": f"⚡ {agent_name}: {action}"
        })
    
    def agent_completed(self, agent_name: str, output: str):
        self.log("agent_completed", {
            "agent": agent_name,
            "output": output[:500],
            "message": f"✅ {agent_name} görevini tamamladı"
        })
    
    def agent_communication(self, from_agent: str, to_agent: str, message: str):
        self.log("agent_communication", {
            "from": from_agent,
            "to": to_agent,
            "content": message[:200],
            "message": f"💬 {from_agent} → {to_agent}"
        })

class CrewManager:
    """Manages CrewAI agents and tasks"""
    
    def __init__(self, model_name: str = "gemini-2.0-flash-lite", 
                 callback: Optional[Callable] = None,
                 api_key: Optional[str] = None):
        self.model_name = model_name
        self.api_key = api_key or os.environ.get("GOOGLE_API_KEY")
        self.agents: List[Agent] = []
        self.tasks: List[Task] = []
        self.agent_configs: List[AgentConfig] = []
        self.task_configs: List[TaskConfig] = []
        self.callback = CrewCallback(callback)
        self._init_llm()
    
    def _init_llm(self):
        """Initialize the LLM"""
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            verbose=True,
            temperature=0.5,
            google_api_key=self.api_key
        )
    
    def add_agent(self, config: AgentConfig):
        """Add an agent from config"""
        tools = [TOOL_REGISTRY[t] for t in config.tools if t in TOOL_REGISTRY]
        
        agent = Agent(
            role=config.role,
            goal=config.goal,
            backstory=config.backstory,
            verbose=True,
            allow_delegation=False,
            tools=tools,
            llm=self.llm
        )
        
        self.agents.append(agent)
        self.agent_configs.append(config)
        
        self.callback.log("agent_added", {
            "agent": config.name,
            "role": config.role,
            "message": f"Ajan eklendi: {config.name}"
        })
        
        return agent
    
    def add_task(self, config: TaskConfig):
        """Add a task from config"""
        # Find the agent for this task
        agent_idx = None
        for i, ac in enumerate(self.agent_configs):
            if ac.name == config.agent_name:
                agent_idx = i
                break
        
        if agent_idx is None:
            raise ValueError(f"Agent not found: {config.agent_name}")
        
        task = Task(
            description=config.description,
            expected_output=config.expected_output,
            agent=self.agents[agent_idx]
        )
        
        self.tasks.append(task)
        self.task_configs.append(config)
        
        self.callback.log("task_added", {
            "task": config.description[:50],
            "agent": config.agent_name,
            "message": f"Görev eklendi: {config.description[:50]}..."
        })
        
        return task
    
    async def run(self, topic: str = "") -> str:
        """Run the crew with the given topic"""
        if not self.agents or not self.tasks:
            raise ValueError("No agents or tasks defined")
        
        # Update task descriptions with topic
        for task in self.tasks:
            if "{topic}" in task.description:
                task.description = task.description.replace("{topic}", topic)
        
        # Set output file for the last task
        if self.tasks:
            self.tasks[-1].output_file = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        crew = Crew(
            agents=self.agents,
            tasks=self.tasks,
            verbose=True,
            process=Process.sequential
        )
        
        self.callback.log("crew_running", {
            "agents_count": len(self.agents),
            "tasks_count": len(self.tasks),
            "topic": topic,
            "message": "🚀 Ekip çalışmaya başladı!"
        })
        
        # Run in thread pool to not block
        loop = asyncio.get_event_loop()
        
        def execute_crew():
            # Simulate step-by-step execution with callbacks
            for i, (task, task_config) in enumerate(zip(self.tasks, self.task_configs)):
                agent_config = next(
                    ac for ac in self.agent_configs 
                    if ac.name == task_config.agent_name
                )
                self.callback.agent_started(agent_config.name, task.description[:100])
            
            # Actually run the crew
            result = crew.kickoff(inputs={'topic': topic})
            return str(result)
        
        try:
            result = await loop.run_in_executor(None, execute_crew)
            
            self.callback.log("crew_completed", {
                "result_length": len(result),
                "message": "✅ Tüm görevler tamamlandı!"
            })
            
            return result
            
        except Exception as e:
            self.callback.log("crew_error", {
                "error": str(e),
                "message": f"❌ Hata: {str(e)}"
            })
            raise
    
    def get_logs(self) -> List[dict]:
        """Get all execution logs"""
        return self.callback.logs
