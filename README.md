# AI Blog Team

An intelligent multi-agent system for automated blog content creation using CrewAI and AI technologies.

## 🚀 Overview

AI Blog Team is a sophisticated application that leverages multiple AI agents to research, write, and edit blog content. The project consists of:

- **Backend**: Python-based CrewAI implementation for managing AI agents
- **Frontend**: Modern React application with Vite and Tailwind CSS
- **Protone**: Prototype implementation demonstrating the core AI crew functionality

## 📋 Features

- **Multi-Agent System**: Coordinated AI agents (Researcher, Writer, Editor) working together
- **Research Automation**: Automatic web research using DuckDuckGo integration
- **Content Generation**: AI-powered blog post writing
- **Content Editing**: Automated proofreading and quality assurance
- **Modern UI**: Interactive dashboard for managing the AI crew
- **Wizard Interface**: Step-by-step configuration for blog creation
- **Execution Monitoring**: Real-time tracking of agent activities
- **Results Display**: View and export generated content

## 🏗️ Project Structure

```
ai-blog-team/
├── backend/           # Python backend with CrewAI
│   ├── crew_manager.py
│   ├── main.py
│   └── requirements.txt
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
└── protone/           # Prototype implementation
    ├── main.py
    └── README.md
```

## 🔧 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm** or **yarn**
- **Google Gemini API Key** (for AI functionality)

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure your API key in the appropriate configuration file

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Backend

Windows:
```bash
cd backend
run.bat
```

Or manually:
```bash
cd backend
venv\Scripts\activate
python main.py
```

### Frontend

Windows:
```bash
cd frontend
run.bat
```

Or manually:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🧪 Protone (Prototype)

For testing the core AI crew functionality, see the [protone directory](./protone/README.md).

Quick start:
```bash
cd protone
python -m venv crewai
crewai\Scripts\activate
pip install crewai crewai-tools langchain-google-genai langchain-community duckduckgo-search
python main.py
```

## 🛠️ Technologies Used

### Backend
- **CrewAI**: Multi-agent orchestration framework
- **LangChain**: LLM integration and tools
- **Google Gemini**: AI language model
- **DuckDuckGo Search**: Web research capabilities

### Frontend
- **React**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management

## 📝 Usage

1. Start both backend and frontend applications
2. Open the web interface
3. Navigate through the wizard to configure your blog parameters
4. Execute the AI crew
5. View and export the generated content

## 🤖 AI Agents

- **Researcher**: Searches the internet for current and relevant information
- **Writer**: Creates well-structured blog posts from research data
- **Editor**: Reviews content for grammar, style, and quality

## 🔐 Configuration

- API keys should be stored securely (use environment variables)
- Adjust agent parameters in the backend configuration
- Customize UI theme and settings in the frontend

## 🌐 API Endpoints

The backend provides RESTful API endpoints for:
- Starting/stopping crew execution
- Getting crew status
- Retrieving results
- Configuring agents and tasks

## 📄 License

See the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Note**: Make sure to secure your API keys and never commit them to version control.
