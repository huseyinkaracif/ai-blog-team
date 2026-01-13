import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  FileText,
  Brain,
  Send,
  Loader2,
  AlertCircle,
  PartyPopper
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useSettingsStore } from '../store/useSettingsStore'

const agentColors = [
  { bg: 'from-blue-500 to-cyan-500', glow: 'glow-blue', ring: 'ring-blue-500' },
  { bg: 'from-purple-500 to-pink-500', glow: 'glow-purple', ring: 'ring-purple-500' },
  { bg: 'from-green-500 to-emerald-500', glow: 'glow-green', ring: 'ring-green-500' },
  { bg: 'from-orange-500 to-yellow-500', glow: '', ring: 'ring-orange-500' },
]

const getLogIcon = (type) => {
  switch (type) {
    case 'agent_started': return <Zap className="w-4 h-4" />
    case 'agent_thinking': return <Brain className="w-4 h-4" />
    case 'agent_action': return <Search className="w-4 h-4" />
    case 'agent_completed': return <CheckCircle className="w-4 h-4" />
    case 'agent_communication': return <Send className="w-4 h-4" />
    case 'crew_started': return <Sparkles className="w-4 h-4" />
    case 'crew_running': return <Loader2 className="w-4 h-4" />
    case 'task_executing': return <FileText className="w-4 h-4" />
    case 'task_created': return <CheckCircle className="w-4 h-4" />
    case 'agent_created': return <Bot className="w-4 h-4" />
    case 'crew_completed': return <PartyPopper className="w-4 h-4" />
    case 'execution_error': return <AlertCircle className="w-4 h-4" />
    default: return <MessageSquare className="w-4 h-4" />
  }
}

export default function ExecutionPage() {
  const navigate = useNavigate()
  const logsEndRef = useRef(null)
  const {
    agents,
    tasks,
    logs,
    isRunning,
    status,
    result,
    startCrew
  } = useAppStore()
  const { apiKey } = useSettingsStore()
  
  const [activeAgentIdx, setActiveAgentIdx] = useState(-1)
  const [connections, setConnections] = useState([])
  const [countdown, setCountdown] = useState(null)
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])
  
  // Auto navigate when completed
  useEffect(() => {
    if (status === 'completed' && result) {
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/result')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [status, result, navigate])
  
  useEffect(() => {
    // Find active agent from logs
    const lastAgentLog = [...logs].reverse().find(log => log.agent)
    if (lastAgentLog) {
      const idx = agents.findIndex(a => a.name === lastAgentLog.agent)
      setActiveAgentIdx(idx)
    }
    
    // Create connection when agents communicate
    const commLog = [...logs].reverse().find(log => log.type === 'agent_communication')
    if (commLog) {
      const fromIdx = agents.findIndex(a => a.name === commLog.from)
      const toIdx = agents.findIndex(a => a.name === commLog.to)
      if (fromIdx !== -1 && toIdx !== -1) {
        setConnections(prev => [...prev, { from: fromIdx, to: toIdx, id: Date.now() }])
      }
    }
  }, [logs, agents])
  
  const handleStart = async () => {
    await startCrew(apiKey)
  }
  
  const handleViewResult = () => {
    navigate('/result')
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Agent Visualization */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-dark-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary-500" />
              Ajan Görselleştirmesi
            </h2>
            
            {/* Agent Network */}
            <div className="relative h-[400px]">
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, idx) => {
                  const fromX = 100 + (conn.from * 150)
                  const toX = 100 + (conn.to * 150)
                  return (
                    <motion.line
                      key={conn.id}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      x1={fromX}
                      y1={120}
                      x2={toX}
                      y2={120}
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      className="connection-line"
                    />
                  )
                })}
              </svg>
              
              {/* Agent Nodes */}
              <div className="flex items-start justify-center gap-8 pt-8">
                {agents.map((agent, idx) => {
                  const isActive = idx === activeAgentIdx
                  const color = agentColors[idx % agentColors.length]
                  const agentLogs = logs.filter(l => l.agent === agent.name)
                  const isCompleted = agentLogs.some(l => l.type === 'agent_completed')
                  
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      {/* Agent Node */}
                      <motion.div
                        animate={{
                          scale: isActive ? [1, 1.1, 1] : 1,
                          boxShadow: isActive 
                            ? ['0 0 0 rgba(14, 165, 233, 0)', '0 0 30px rgba(14, 165, 233, 0.5)', '0 0 0 rgba(14, 165, 233, 0)']
                            : 'none'
                        }}
                        transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                        className={`
                          relative w-20 h-20 rounded-2xl flex items-center justify-center
                          bg-gradient-to-br ${color.bg}
                          ${isActive ? color.glow : ''}
                          ${isCompleted ? 'ring-2 ring-green-500' : ''}
                        `}
                      >
                        <Bot className="w-10 h-10 text-white" />
                        
                        {/* Pulse ring when active */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-2xl">
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color.bg} opacity-50 animate-ping`} />
                          </div>
                        )}
                        
                        {/* Completed checkmark */}
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      
                      {/* Agent Info */}
                      <div className="mt-4 text-center">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <p className="text-xs text-dark-400">{agent.role}</p>
                      </div>
                      
                      {/* Status indicator */}
                      <div className={`
                        mt-2 px-3 py-1 rounded-full text-xs
                        ${isActive 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : isCompleted 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-dark-700 text-dark-400'
                        }
                      `}>
                        {isActive ? 'Çalışıyor...' : isCompleted ? 'Tamamlandı' : 'Bekliyor'}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Task Progress */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-dark-400" />
                  <span className="text-sm text-dark-400">Görev İlerlemesi</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: status === 'completed' 
                        ? '100%' 
                        : `${Math.min((logs.filter(l => l.type === 'agent_completed').length / tasks.length) * 100, 100)}%`
                    }}
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Start/View Result Button */}
          <div className="text-center">
            {!isRunning && status !== 'completed' && status !== 'running' && (
              <button
                onClick={handleStart}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                <Zap className="w-5 h-5" />
                Ekibi Başlat
              </button>
            )}
            
            {isRunning && (
              <div className="flex items-center justify-center gap-3 text-primary-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Ajanlar çalışıyor...</span>
              </div>
            )}
            
            {status === 'completed' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex items-center justify-center gap-3 text-accent-400 mb-4">
                  <PartyPopper className="w-6 h-6" />
                  <span className="text-lg font-semibold">İşlem Tamamlandı!</span>
                  <PartyPopper className="w-6 h-6" />
                </div>
                
                {countdown !== null && (
                  <p className="text-sm text-dark-400">
                    Sonuç sayfasına yönlendiriliyorsunuz... ({countdown})
                  </p>
                )}
                
                <button
                  onClick={handleViewResult}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-500 to-green-600 text-white font-semibold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-accent-500/25 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Sonucu Hemen Görüntüle
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Right: Live Log */}
        <div className="glass rounded-2xl p-6 border border-dark-700 flex flex-col" style={{ height: '650px' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary-500" />
              Canlı Log
            </h2>
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              {logs.length} mesaj
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <AnimatePresence>
              {logs.length === 0 && (
                <div className="text-center py-12 text-dark-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ekip başladığında loglar burada görünecek</p>
                </div>
              )}
              
              {logs.map((log, idx) => {
                const agentIdx = agents.findIndex(a => a.name === log.agent)
                const color = agentColors[agentIdx % agentColors.length]
                
                // Determine log styling
                let bgClass = 'bg-dark-800/50 border-dark-700'
                let textClass = 'text-dark-300'
                
                if (log.type === 'error' || log.type === 'execution_error') {
                  bgClass = 'bg-red-500/10 border-red-500/30'
                  textClass = 'text-red-400'
                } else if (log.type === 'crew_completed') {
                  bgClass = 'bg-green-500/10 border-green-500/30'
                  textClass = 'text-green-400'
                } else if (log.type === 'agent_started' || log.type === 'task_executing') {
                  bgClass = 'bg-blue-500/10 border-blue-500/30'
                  textClass = 'text-blue-300'
                } else if (log.type === 'agent_completed') {
                  bgClass = 'bg-green-500/10 border-green-500/30'
                  textClass = 'text-green-300'
                } else if (log.type === 'crew_running' || log.type === 'crew_started') {
                  bgClass = 'bg-purple-500/10 border-purple-500/30'
                  textClass = 'text-purple-300'
                }
                
                return (
                  <motion.div
                    key={`${log.timestamp}-${idx}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="message-bubble"
                  >
                    <div className={`p-4 rounded-xl border ${bgClass}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`
                          w-6 h-6 rounded-lg flex items-center justify-center
                          ${log.agent ? `bg-gradient-to-br ${color?.bg || 'from-gray-500 to-gray-600'}` : 'bg-dark-700'}
                        `}>
                          {getLogIcon(log.type)}
                        </div>
                        {log.agent && (
                          <span className="font-medium text-sm text-white">{log.agent}</span>
                        )}
                        {log.task_number && (
                          <span className="text-xs px-2 py-0.5 rounded bg-dark-700 text-dark-400">
                            Görev {log.task_number}/{log.total_tasks}
                          </span>
                        )}
                        <span className="text-xs text-dark-500 ml-auto">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                      <p className={`text-sm ${textClass} leading-relaxed`}>
                        {log.message}
                      </p>
                      {log.thought && (
                        <p className="text-xs text-dark-500 mt-2 italic pl-3 border-l-2 border-dark-600">
                          "{log.thought}"
                        </p>
                      )}
                      {log.tool && (
                        <span className="inline-block mt-2 px-2 py-1 rounded bg-dark-700 text-xs text-primary-400">
                          🔧 {log.tool}
                        </span>
                      )}
                      {log.action && (
                        <p className="text-xs text-dark-400 mt-1">
                          ⚡ {log.action}
                        </p>
                      )}
                      {log.result_length && (
                        <p className="text-xs text-dark-400 mt-1">
                          📊 Sonuç: {log.result_length} karakter
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
