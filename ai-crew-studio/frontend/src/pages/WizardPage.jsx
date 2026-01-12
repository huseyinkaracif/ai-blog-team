import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Search,
  Globe,
  CheckCircle,
  Target,
  User,
  BookOpen
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const STEPS = ['agents', 'model', 'tasks', 'review']

const defaultAgents = [
  {
    name: 'Araştırmacı',
    role: 'Kıdemli Teknoloji Araştırmacısı',
    goal: 'Konu hakkında internetteki en güncel gelişmeleri bulmak',
    backstory: 'Teknoloji trendlerini takip eden deneyimli bir araştırmacısın. İnterneti tarayıp en doğru bilgiyi bulursun.',
    tools: ['internet_search']
  },
  {
    name: 'Yazar',
    role: 'Teknoloji Blog Yazarı',
    goal: 'Araştırma verilerini kullanarak Türkçe blog yazısı yazmak',
    backstory: 'Karmaşık teknik konuları basit bir dile çevirirsin. Akıcı ve anlaşılır yazılar yazarsın.',
    tools: []
  },
  {
    name: 'Editör',
    role: 'Baş Editör',
    goal: 'Yazıyı dilbilgisi ve yapısal olarak mükemmelleştirmek',
    backstory: 'Yazının Türkçe imla kurallarına uygunluğunu kontrol edersin. Profesyonel editörsün.',
    tools: []
  }
]

export default function WizardPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const {
    agents,
    tasks,
    selectedModel,
    availableModels,
    availableTools,
    topic,
    setTopic,
    addAgent,
    updateAgent,
    removeAgent,
    addTask,
    updateTask,
    removeTask,
    setModel,
    saveAgents,
    saveModel,
    saveTasks,
    sessionId,
    createSession
  } = useAppStore()
  
  useEffect(() => {
    if (!sessionId) {
      createSession()
    }
  }, [sessionId])
  
  const handleNext = async () => {
    if (step === 0 && agents.length > 0) {
      await saveAgents()
    } else if (step === 1) {
      await saveModel()
    } else if (step === 2 && tasks.length > 0) {
      await saveTasks()
    }
    
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/execution')
    }
  }
  
  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }
  
  const loadDefaultAgents = () => {
    defaultAgents.forEach(agent => addAgent(agent))
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-12">
        {STEPS.map((s, idx) => (
          <div key={s} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: idx === step ? 1.1 : 1,
                backgroundColor: idx <= step ? '#0ea5e9' : '#334155'
              }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${idx <= step ? 'glow-blue' : ''}
              `}
            >
              {idx < step ? <CheckCircle className="w-5 h-5" /> : idx + 1}
            </motion.div>
            {idx < STEPS.length - 1 && (
              <div className={`w-20 h-1 mx-2 rounded ${idx < step ? 'bg-primary-500' : 'bg-dark-700'}`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <AgentStep
              agents={agents}
              availableTools={availableTools}
              addAgent={addAgent}
              updateAgent={updateAgent}
              removeAgent={removeAgent}
              loadDefaultAgents={loadDefaultAgents}
            />
          )}
          
          {step === 1 && (
            <ModelStep
              availableModels={availableModels}
              selectedModel={selectedModel}
              setModel={setModel}
            />
          )}
          
          {step === 2 && (
            <TaskStep
              tasks={tasks}
              agents={agents}
              addTask={addTask}
              updateTask={updateTask}
              removeTask={removeTask}
            />
          )}
          
          {step === 3 && (
            <ReviewStep
              agents={agents}
              tasks={tasks}
              selectedModel={selectedModel}
              topic={topic}
              setTopic={setTopic}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium
            ${step === 0 
              ? 'text-dark-600 cursor-not-allowed' 
              : 'text-white bg-dark-800 hover:bg-dark-700'
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" />
          Geri
        </button>
        
        <button
          onClick={handleNext}
          disabled={(step === 0 && agents.length === 0) || (step === 2 && tasks.length === 0)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium
            ${(step === 0 && agents.length === 0) || (step === 2 && tasks.length === 0)
              ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-500/25'
            }
          `}
        >
          {step === STEPS.length - 1 ? 'Başlat' : 'İleri'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function AgentStep({ agents, availableTools, addAgent, updateAgent, removeAgent, loadDefaultAgents }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    goal: '',
    backstory: '',
    tools: []
  })
  
  const handleSubmit = () => {
    if (formData.name && formData.role && formData.goal) {
      addAgent(formData)
      setFormData({ name: '', role: '', goal: '', backstory: '', tools: [] })
      setShowForm(false)
    }
  }
  
  const toggleTool = (toolId) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter(t => t !== toolId)
        : [...prev.tools, toolId]
    }))
  }
  
  return (
    <div>
      <div className="text-center mb-8">
        <Bot className="w-12 h-12 mx-auto mb-4 text-primary-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Ajanlarınızı Tanımlayın</h2>
        <p className="text-dark-400">Her ajan için rol, hedef ve özellikler belirleyin</p>
      </div>
      
      {agents.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-dark-400 mb-4">Henüz ajan eklenmedi</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
            >
              <Plus className="w-5 h-5" />
              Yeni Ajan Ekle
            </button>
            <button
              onClick={loadDefaultAgents}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-800"
            >
              <Sparkles className="w-5 h-5" />
              Örnek Ajanları Yükle
            </button>
          </div>
        </div>
      )}
      
      {/* Agent List */}
      <div className="space-y-4 mb-6">
        {agents.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass border border-dark-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <p className="text-primary-400 text-sm">{agent.role}</p>
                  <p className="text-dark-400 text-sm mt-2">{agent.goal}</p>
                  {agent.tools?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {agent.tools.map(t => (
                        <span key={t} className="px-2 py-1 rounded bg-dark-800 text-xs text-dark-300">
                          {t === 'internet_search' ? '🔍 Web Araması' : t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeAgent(agent.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Add Agent Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl glass border border-primary-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Yeni Ajan</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Ajan Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Araştırmacı"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Rol
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Örn: Kıdemli Araştırmacı"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-dark-400 mb-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Hedef
            </label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Bu ajanın ana hedefi nedir?"
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-dark-400 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Backstory
            </label>
            <textarea
              value={formData.backstory}
              onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
              placeholder="Ajanın geçmişi ve uzmanlık alanları..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 resize-none"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-dark-400 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Araçlar
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all
                    ${formData.tools.includes(tool.id)
                      ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                      : 'bg-dark-800 border border-dark-700 text-dark-400 hover:border-dark-600'
                    }
                  `}
                >
                  <Globe className="w-4 h-4" />
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600"
            >
              Ajan Ekle
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl border border-dark-600 text-dark-400 hover:bg-dark-800"
            >
              İptal
            </button>
          </div>
        </motion.div>
      )}
      
      {agents.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:border-primary-500 hover:text-primary-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Başka Ajan Ekle
        </button>
      )}
    </div>
  )
}

function ModelStep({ availableModels, selectedModel, setModel }) {
  return (
    <div>
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Gemini Modelini Seçin</h2>
        <p className="text-dark-400">Ajanlarınızın kullanacağı AI modelini belirleyin</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {availableModels.map(model => (
          <motion.button
            key={model.id}
            onClick={() => setModel(model.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              p-6 rounded-2xl text-left transition-all
              ${selectedModel === model.id
                ? 'glass border-2 border-primary-500 glow-blue'
                : 'glass border border-dark-700 hover:border-dark-600'
              }
            `}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedModel === model.id ? 'bg-primary-500' : 'bg-dark-700'
              }`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{model.name}</h3>
                <p className="text-sm text-dark-400">{model.description}</p>
              </div>
            </div>
            
            {selectedModel === model.id && (
              <div className="flex items-center gap-2 text-primary-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Seçili
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function TaskStep({ tasks, agents, addTask, updateTask, removeTask }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    expectedOutput: '',
    agentName: ''
  })
  
  const handleSubmit = () => {
    if (formData.description && formData.agentName) {
      addTask(formData)
      setFormData({ description: '', expectedOutput: '', agentName: '' })
      setShowForm(false)
    }
  }
  
  const loadDefaultTasks = () => {
    const defaultTasks = [
      {
        description: "'{topic}' konusu hakkında 2024-2025 yıllarındaki trendleri araştır.",
        expectedOutput: "Önemli noktaların bulunduğu özet rapor.",
        agentName: agents[0]?.name || ''
      },
      {
        description: "Araştırma raporunu kullanarak '{topic}' hakkında detaylı blog yazısı yaz. Türkçe olsun.",
        expectedOutput: "Markdown formatında blog yazısı.",
        agentName: agents[1]?.name || ''
      },
      {
        description: "Yazıyı kontrol et. Sonuna 'Yazar: AI Team' ekle.",
        expectedOutput: "Final blog yazısı.",
        agentName: agents[2]?.name || ''
      }
    ]
    defaultTasks.forEach(task => {
      if (task.agentName) addTask(task)
    })
  }
  
  return (
    <div>
      <div className="text-center mb-8">
        <Target className="w-12 h-12 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Görevleri Tanımlayın</h2>
        <p className="text-dark-400">Her ajan için yapılacak görevleri belirleyin</p>
      </div>
      
      {tasks.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-dark-400 mb-4">Henüz görev eklenmedi</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600"
            >
              <Plus className="w-5 h-5" />
              Yeni Görev Ekle
            </button>
            {agents.length >= 3 && (
              <button
                onClick={loadDefaultTasks}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-800"
              >
                <Sparkles className="w-5 h-5" />
                Örnek Görevleri Yükle
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Task List */}
      <div className="space-y-4 mb-6">
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass border border-dark-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-white">{task.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-primary-400">
                      <Bot className="w-4 h-4 inline mr-1" />
                      {task.agentName}
                    </span>
                    <span className="text-dark-400">
                      Beklenen: {task.expectedOutput}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Add Task Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl glass border border-green-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Yeni Görev</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-dark-400 mb-2">Ajan Seç</label>
            <select
              value={formData.agentName}
              onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white focus:border-primary-500"
            >
              <option value="">Ajan seçin...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>{agent.name} - {agent.role}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-dark-400 mb-2">Görev Açıklaması</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Bu görevde ne yapılmalı? ({topic} kullanabilirsiniz)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 resize-none"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-dark-400 mb-2">Beklenen Çıktı</label>
            <input
              type="text"
              value={formData.expectedOutput}
              onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
              placeholder="Bu görevin sonucu ne olmalı?"
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600"
            >
              Görev Ekle
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl border border-dark-600 text-dark-400 hover:bg-dark-800"
            >
              İptal
            </button>
          </div>
        </motion.div>
      )}
      
      {tasks.length > 0 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:border-green-500 hover:text-green-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Başka Görev Ekle
        </button>
      )}
    </div>
  )
}

function ReviewStep({ agents, tasks, selectedModel, topic, setTopic }) {
  return (
    <div>
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Özet ve Başlat</h2>
        <p className="text-dark-400">Ayarlarınızı gözden geçirin ve konuyu belirleyin</p>
      </div>
      
      {/* Topic Input */}
      <div className="mb-8 p-6 rounded-2xl glass border border-primary-500/30">
        <label className="block text-sm text-dark-400 mb-2">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Konu (Topic)
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Örn: Yapay Zeka Teknolojileri"
          className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white text-lg placeholder-dark-500 focus:border-primary-500"
        />
        <p className="text-xs text-dark-500 mt-2">
          Bu konu görev açıklamalarındaki {'{topic}'} yerlerinde kullanılacak
        </p>
      </div>
      
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl glass border border-dark-700 text-center">
          <div className="text-3xl font-bold text-primary-400">{agents.length}</div>
          <div className="text-sm text-dark-400">Ajan</div>
        </div>
        <div className="p-4 rounded-xl glass border border-dark-700 text-center">
          <div className="text-3xl font-bold text-purple-400">{tasks.length}</div>
          <div className="text-sm text-dark-400">Görev</div>
        </div>
        <div className="p-4 rounded-xl glass border border-dark-700 text-center">
          <div className="text-lg font-bold text-green-400 truncate">{selectedModel}</div>
          <div className="text-sm text-dark-400">Model</div>
        </div>
      </div>
      
      {/* Agent & Task Preview */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">İş Akışı</h3>
        {tasks.map((task, idx) => {
          const agent = agents.find(a => a.name === task.agentName)
          return (
            <div key={task.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-dark-800/50">
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="w-4 h-4 text-primary-400" />
                  <span className="text-primary-400">{agent?.name}</span>
                  <span className="text-dark-500">→</span>
                  <span className="text-dark-300 truncate">{task.description.substring(0, 50)}...</span>
                </div>
              </div>
              {idx < tasks.length - 1 && (
                <ArrowRight className="w-5 h-5 text-dark-600" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
