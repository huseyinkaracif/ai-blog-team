# AI Crew Studio 🤖

Interactive AI Agent Orchestration Platform powered by CrewAI and Google Gemini.

![AI Crew Studio](https://img.shields.io/badge/AI-Crew%20Studio-blue?style=for-the-badge)
![CrewAI](https://img.shields.io/badge/CrewAI-Orchestration-green?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google-Gemini-orange?style=for-the-badge)

## 🌟 Features

- **🤖 Custom Agents**: Define AI agents with custom roles, goals, and backstories
- **🔄 Agent Orchestration**: CrewAI-powered coordination and workflow management
- **⚡ Real-time Monitoring**: Watch agents work and communicate in real-time
- **🔍 Web Search**: DuckDuckGo integration for up-to-date information
- **🧠 Gemini LLM**: Powered by Google's Gemini AI models
- **📊 Dashboard**: Detailed statistics and performance charts
- **🎨 Beautiful UI**: Modern, animated interface with dark theme

## 📸 Screenshots

### Home Page
Interactive landing page with feature overview

### Agent Wizard
Step-by-step agent and task configuration

### Execution View
Real-time agent visualization with live logs

### Dashboard
Performance metrics and activity charts

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google AI API Key (for Gemini)

### Backend Setup

```bash
# Navigate to backend directory
cd ai-crew-studio/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your Google API Key
set GOOGLE_API_KEY=your_api_key_here  # Windows
export GOOGLE_API_KEY=your_api_key_here  # macOS/Linux

# Run the server
python main.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd ai-crew-studio/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start at `http://localhost:3000`

## 🎯 How to Use

1. **Define Agents** 🤖
   - Click "Başla" (Start) on the home page
   - Add agents with name, role, goal, and backstory
   - Optionally assign tools (web search)
   - Or load sample agents

2. **Select Model** 🧠
   - Choose your preferred Gemini model
   - Options include Flash Lite, Flash, and Pro versions

3. **Create Tasks** 📋
   - Define tasks for each agent
   - Specify expected outputs
   - Use `{topic}` placeholder in descriptions

4. **Review & Start** 🚀
   - Enter your topic
   - Review configuration
   - Click "Başlat" (Start)

5. **Monitor Progress** 👀
   - Watch agents work in real-time
   - See live logs and communications
   - View progress on dashboard

6. **Get Results** 📄
   - View generated content
   - Download as Markdown
   - Copy to clipboard

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **CrewAI** - AI agent orchestration
- **LangChain** - LLM framework
- **Google Gemini** - AI language model
- **DuckDuckGo Search** - Web search capability
- **WebSocket** - Real-time communication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Zustand** - State management
- **Lucide React** - Icons

## 📁 Project Structure

```
ai-crew-studio/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── crew_manager.py      # CrewAI management
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── Layout.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── WizardPage.jsx
│   │   │   ├── ExecutionPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── store/           # State management
│   │   │   └── useAppStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/models` | Get available Gemini models |
| GET | `/api/tools` | Get available agent tools |
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions/{id}` | Get session details |
| POST | `/api/sessions/{id}/agents` | Add agents to session |
| POST | `/api/sessions/{id}/model` | Set model for session |
| POST | `/api/sessions/{id}/tasks` | Add tasks to session |
| POST | `/api/sessions/{id}/start` | Start crew execution |
| GET | `/api/sessions/{id}/result` | Get execution result |
| GET | `/api/sessions/{id}/stats` | Get execution statistics |
| WS | `/ws/{id}` | WebSocket for real-time updates |

## 🎨 UI Features

- **Dark Theme**: Eye-friendly dark mode with glass morphism effects
- **Animations**: Smooth transitions and agent status animations
- **Responsive**: Works on all screen sizes
- **Interactive Charts**: Real-time updating graphs and statistics
- **Live Logs**: Color-coded, auto-scrolling execution logs

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google AI API key for Gemini | Yes |
| `OPENAI_API_KEY` | Set to "NA" (required by CrewAI) | Yes |

## 📝 Sample Configuration

### Default Agents

```json
[
  {
    "name": "Araştırmacı",
    "role": "Kıdemli Teknoloji Araştırmacısı",
    "goal": "Konu hakkında internetteki en güncel gelişmeleri bulmak",
    "backstory": "Teknoloji trendlerini takip eden deneyimli bir araştırmacısın.",
    "tools": ["internet_search"]
  },
  {
    "name": "Yazar",
    "role": "Teknoloji Blog Yazarı",
    "goal": "Araştırma verilerini kullanarak Türkçe blog yazısı yazmak",
    "backstory": "Karmaşık teknik konuları basit bir dile çevirirsin.",
    "tools": []
  },
  {
    "name": "Editör",
    "role": "Baş Editör",
    "goal": "Yazıyı dilbilgisi ve yapısal olarak mükemmelleştirmek",
    "backstory": "Yazının Türkçe imla kurallarına uygunluğunu kontrol edersin.",
    "tools": []
  }
]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CrewAI](https://github.com/joaomdmoura/crewAI) - AI Agent Orchestration Framework
- [Google Gemini](https://ai.google.dev/) - AI Language Model
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python Web Framework
- [React](https://react.dev/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework

---

Made with ❤️ by AI Team
