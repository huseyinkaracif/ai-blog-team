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
  PartyPopper,
  X,
  Terminal
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
  const outputEndRef = useRef(null)
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
  const [selectedLog, setSelectedLog] = useState(null)
  const [visibleLogs, setVisibleLogs] = useState([])
  const [outputLines, setOutputLines] = useState([])
  
  // Show logs sequentially with delay
  useEffect(() => {
    if (logs.length > visibleLogs.length) {
      const timer = setTimeout(() => {
        setVisibleLogs(logs.slice(0, visibleLogs.length + 1))
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [logs, visibleLogs])
  
  // Reset visible logs when logs are cleared
  useEffect(() => {
    if (logs.length === 0) {
      setVisibleLogs([])
      setOutputLines([])
    }
  }, [logs.length])
  
  // Add output lines like terminal
  useEffect(() => {
    if (visibleLogs.length > outputLines.length) {
      const newLog = visibleLogs[visibleLogs.length - 1]
      if (newLog) {
        const formattedLine = formatOutputLine(newLog)
        if (formattedLine) {
          setOutputLines(prev => [...prev, formattedLine])
        }
      }
    }
  }, [visibleLogs, outputLines.length])
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleLogs])
  
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [outputLines])
  
  // Get display name for log type
  const getLogTypeLabel = (type) => {
    switch (type) {
      case 'crew_started': return 'Crew Started'
      case 'crew_running': return 'Crew Running'
      case 'agent_started': return 'Agent Started'
      case 'agent_completed': return 'Agent Final Answer'
      case 'task_executing': return 'Task Started'
      case 'task_created': return 'Task Created'
      case 'agent_created': return 'Agent Created'
      case 'crew_completed': return 'Crew Completed'
      case 'execution_error': return 'Error'
      default: return type?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Log'
    }
  }
  
  // Get display message for log (handles cases where message is empty)
  const getLogDisplayMessage = (log) => {
    if (log.message) return log.message
    
    switch (log.type) {
      case 'agent_created':
        return `${log.agent} ajanı oluşturuldu`
      case 'task_created':
        return `Görev oluşturuldu: ${log.task || ''}`
      case 'crew_started':
      case 'crew_running':
        return 'Ekip çalışmaya başladı!'
      case 'agent_started':
        return `${log.agent || 'Agent'} göreve başladı`
      case 'agent_completed':
        return `${log.agent || 'Agent'} görevini tamamladı`
      case 'crew_completed':
        return 'Tüm görevler tamamlandı!'
      default:
        return log.type?.replace(/_/g, ' ') || 'Log'
    }
  }
  
  // Get border color for terminal output box
  const getTerminalBoxColor = (type) => {
    switch (type) {
      case 'crew_started':
      case 'crew_running':
        return 'border-purple-500'
      case 'agent_started':
      case 'agent_created':
        return 'border-cyan-500'
      case 'agent_completed':
        return 'border-green-500'
      case 'task_executing':
      case 'task_created':
        return 'border-yellow-500'
      case 'crew_completed':
        return 'border-green-400'
      case 'execution_error':
      case 'error':
        return 'border-red-500'
      default:
        return 'border-gray-600'
    }
  }
  
  // Format output line like terminal
  const formatOutputLine = (log) => {
    const time = new Date(log.timestamp).toLocaleTimeString('tr-TR')
    const typeLabel = getLogTypeLabel(log.type)
    const boxColor = getTerminalBoxColor(log.type)
    
    let lines = []
    
    switch (log.type) {
      case 'crew_started':
      case 'crew_running':
        lines = [{ label: null, value: '🚀 Ekip çalışmaya başladı!', color: 'text-purple-400' }]
        break
      case 'agent_created':
        lines = [
          { label: 'Agent', value: log.agent, color: 'text-cyan-400' },
          { label: 'Status', value: log.status || 'ready', color: 'text-green-400' }
        ]
        break
      case 'task_created':
        lines = [
          { label: 'Task', value: log.task || 'Görev oluşturuldu', color: 'text-yellow-400' },
          { label: 'Agent', value: log.agent, color: 'text-cyan-400' }
        ]
        break
      case 'agent_started':
        lines = [
          { label: 'Agent', value: log.agent, color: 'text-cyan-400' },
          { label: 'Task', value: log.task || log.message || 'Göreve başladı', color: 'text-yellow-400' }
        ]
        break
      case 'task_executing':
        lines = [
          { label: 'Name', value: log.message || log.task, color: 'text-yellow-400' },
          { label: 'ID', value: log.task_id || 'N/A', color: 'text-gray-400' }
        ]
        break
      case 'agent_completed':
        lines = [
          { label: 'Agent', value: log.agent, color: 'text-cyan-400' },
          { label: 'Final Answer', value: log.output || log.message || 'Tamamlandı', color: 'text-green-400', isMultiline: true }
        ]
        break
      case 'crew_completed':
        lines = [{ label: null, value: '🎉 Crew Completed - Tüm görevler tamamlandı!', color: 'text-green-400' }]
        break
      case 'execution_error':
      case 'error':
        lines = [{ label: 'Error', value: log.message, color: 'text-red-400' }]
        break
      default:
        lines = [{ label: null, value: getLogDisplayMessage(log), color: 'text-gray-400' }]
    }
    
    return { time, typeLabel, boxColor, lines, type: log.type, agent: log.agent, fullLog: log }
  }
  
  useEffect(() => {
    // Find active agent from logs - only when running - only when running
    if (status === 'completed') {
      setActiveAgentIdx(-1) // No active agent when completed
      return
    }
    
    const lastAgentLog = [...logs].reverse().find(log => log.agent && log.type !== 'agent_completed')
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
              {visibleLogs.length} mesaj
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            <AnimatePresence>
              {visibleLogs.length === 0 && (
                <div className="text-center py-12 text-dark-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ekip başladığında loglar burada görünecek</p>
                </div>
              )}
              
              {visibleLogs.map((log, idx) => {
                const agentIdx = agents.findIndex(a => a.name === log.agent)
                const color = agentColors[agentIdx % agentColors.length]
                const typeLabel = getLogTypeLabel(log.type)
                
                // Determine log styling
                let bgClass = 'bg-dark-800/50 border-dark-700 hover:bg-dark-700/50'
                let labelColor = 'text-gray-400'
                
                if (log.type === 'error' || log.type === 'execution_error') {
                  bgClass = 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                  labelColor = 'text-red-400'
                } else if (log.type === 'crew_completed') {
                  bgClass = 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                  labelColor = 'text-green-400'
                } else if (log.type === 'agent_started' || log.type === 'task_executing') {
                  bgClass = 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                  labelColor = 'text-blue-400'
                } else if (log.type === 'agent_completed') {
                  bgClass = 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                  labelColor = 'text-green-400'
                } else if (log.type === 'crew_running' || log.type === 'crew_started') {
                  bgClass = 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                  labelColor = 'text-purple-400'
                }
                
                return (
                  <motion.div
                    key={`${log.timestamp}-${idx}`}
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className={`p-3 rounded-xl border ${bgClass} transition-all duration-200`}>
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                          ${log.agent ? `bg-gradient-to-br ${color?.bg || 'from-gray-500 to-gray-600'}` : 'bg-dark-700'}
                        `}>
                          {getLogIcon(log.type)}
                        </div>
                        <span className={`font-medium text-sm ${log.agent ? 'text-white' : labelColor}`}>
                          {log.agent || typeLabel}
                        </span>
                        <span className="text-xs text-dark-400 truncate max-w-[150px]" title={getLogDisplayMessage(log)}>
                          {getLogDisplayMessage(log).substring(0, 30)}{getLogDisplayMessage(log).length > 30 ? '...' : ''}
                        </span>
                        <span className="text-xs text-dark-500 ml-auto flex-shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
      
      {/* Output Terminal Section */}
      <div className="mt-6 glass rounded-2xl border border-dark-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-dark-900 border-b border-dark-700">
          <Terminal className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-white">Output Terminal</span>
          <div className="flex gap-1.5 ml-auto">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="p-4 bg-[#1e1e1e] font-mono text-sm max-h-[400px] overflow-y-auto">
          {outputLines.length === 0 ? (
            <div className="text-gray-500">
              <span className="text-green-500">$</span> İşlem başladığında çıktılar burada görünecek...
            </div>
          ) : (
            outputLines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                {/* VS Code style bordered box */}
                <div className={`border-l-2 ${line.boxColor} pl-4 py-2`}>
                  {/* Header with icon and type */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{line.type === 'crew_started' || line.type === 'crew_running' ? '🚀' : 
                      line.type === 'agent_started' ? '🤖' : 
                      line.type === 'task_executing' || line.type === 'task_created' ? '📋' :
                      line.type === 'agent_completed' ? '✅' :
                      line.type === 'crew_completed' ? '🎉' :
                      line.type === 'execution_error' || line.type === 'error' ? '❌' : '📝'
                    }</span>
                    <span className={`font-bold ${
                      line.type === 'agent_completed' ? 'text-green-400' :
                      line.type === 'task_executing' || line.type === 'task_created' ? 'text-yellow-400' :
                      line.type === 'agent_started' ? 'text-cyan-400' :
                      line.type === 'crew_completed' ? 'text-green-400' :
                      line.type === 'crew_started' || line.type === 'crew_running' ? 'text-purple-400' :
                      line.type === 'execution_error' || line.type === 'error' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>{line.typeLabel}</span>
                  </div>
                  
                  {/* Content lines */}
                  <div className="space-y-1">
                    {line.lines.map((item, lineIdx) => (
                      <div key={lineIdx}>
                        {item.isHeader ? (
                          <div className={`font-bold ${item.color}`}>{item.label}</div>
                        ) : item.label ? (
                          <div className="flex">
                            <span className="text-gray-500 w-20 flex-shrink-0">{item.label}:</span>
                            <span className={`${item.color} ${item.isMultiline ? 'whitespace-pre-wrap' : ''}`}>
                              {item.value?.substring(0, 500)}{item.value?.length > 500 ? '...' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className={item.color}>{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Separator line for completed items */}
                {(line.type === 'agent_completed' || line.type === 'task_executing' || line.type === 'crew_completed') && (
                  <div className="mt-2 border-b border-gray-700/50"></div>
                )}
              </motion.div>
            ))
          )}
          <div ref={outputEndRef} />
        </div>
      </div>
      
      {/* Log Detail Popup */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-dark-800 rounded-2xl border border-dark-600 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Popup Header */}
              <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-900">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${selectedLog.agent 
                      ? `bg-gradient-to-br ${agentColors[agents.findIndex(a => a.name === selectedLog.agent) % agentColors.length]?.bg || 'from-gray-500 to-gray-600'}` 
                      : 'bg-dark-700'
                    }
                  `}>
                    {getLogIcon(selectedLog.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedLog.agent || 'Sistem'}
                    </h3>
                    <p className="text-xs text-dark-400">
                      {selectedLog.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-dark-400" />
                </button>
              </div>
              
              {/* Popup Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedLog.timestamp).toLocaleString('tr-TR')}</span>
                  </div>
                  
                  {/* Type Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-dark-400">Tür:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedLog.type === 'agent_completed' || selectedLog.type === 'crew_completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : selectedLog.type === 'agent_started' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : selectedLog.type === 'task_executing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : selectedLog.type === 'execution_error' || selectedLog.type === 'error'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {getLogTypeLabel(selectedLog.type)}
                    </span>
                  </div>
                  
                  {/* Task Info for agent_started */}
                  {selectedLog.task && (
                    <div>
                      <h4 className="text-xs font-medium text-dark-400 mb-2">📋 Görev</h4>
                      <div className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                        <p className="text-sm text-yellow-400 leading-relaxed whitespace-pre-wrap">
                          {selectedLog.task}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div>
                    <h4 className="text-xs font-medium text-dark-400 mb-2">💬 Mesaj</h4>
                    <div className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                      <p className="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">
                        {selectedLog.message || getLogDisplayMessage(selectedLog)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Output for completed agents */}
                  {selectedLog.output && (
                    <div>
                      <h4 className="text-xs font-medium text-dark-400 mb-2">✅ Çıktı</h4>
                      <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 max-h-[300px] overflow-y-auto">
                        <pre className="text-sm text-green-400 leading-relaxed whitespace-pre-wrap font-mono">
                          {selectedLog.output}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Details */}
                  {selectedLog.thought && (
                    <div>
                      <h4 className="text-xs font-medium text-dark-400 mb-2">💭 Düşünce</h4>
                      <div className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                        <p className="text-sm text-dark-300 italic">"{selectedLog.thought}"</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedLog.tool && (
                    <div>
                      <h4 className="text-xs font-medium text-dark-400 mb-2">🔧 Kullanılan Araç</h4>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-sm">
                        {selectedLog.tool}
                      </span>
                    </div>
                  )}
                  
                  {selectedLog.action && (
                    <div>
                      <h4 className="text-xs font-medium text-dark-400 mb-2">⚡ Aksiyon</h4>
                      <div className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                        <p className="text-sm text-dark-300">{selectedLog.action}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedLog.result_length && (
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <span>📊 Sonuç uzunluğu:</span>
                      <span className="text-white font-medium">{selectedLog.result_length} karakter</span>
                    </div>
                  )}
                  
                  {selectedLog.task_number && (
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <span>📋 Görev:</span>
                      <span className="text-white font-medium">{selectedLog.task_number}/{selectedLog.total_tasks}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
