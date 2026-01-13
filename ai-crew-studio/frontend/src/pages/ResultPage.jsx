import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle, 
  RotateCcw,
  Clock,
  Bot,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ResultPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { 
    result, 
    agents, 
    tasks, 
    logs, 
    status,
    sessionId,
    reset,
    fetchResult
  } = useAppStore()
  
  // Try to get result from logs if not in state
  const getResultFromLogs = () => {
    const completedLog = logs.find(l => l.type === 'crew_completed' && l.result)
    return completedLog?.result || null
  }
  
  const displayResult = result || getResultFromLogs()
  
  // Auto-fetch result if not available but status is completed
  useEffect(() => {
    if (status === 'completed' && !displayResult && sessionId) {
      handleRefresh()
    }
  }, [status, displayResult, sessionId])
  
  // Debug: Log result state
  console.log('ResultPage - result from state:', result ? `${result.substring(0, 100)}...` : 'NULL')
  console.log('ResultPage - result from logs:', getResultFromLogs() ? 'FOUND' : 'NULL')
  console.log('ResultPage - displayResult:', displayResult ? `${displayResult.substring(0, 100)}...` : 'NULL')
  console.log('ResultPage - status:', status)
  console.log('ResultPage - logs count:', logs.length)
  
  const handleRefresh = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      await fetchResult()
    } catch (err) {
      console.error('Failed to fetch result:', err)
    }
    setLoading(false)
  }
  
  const handleCopy = () => {
    if (displayResult) {
      navigator.clipboard.writeText(displayResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleDownload = () => {
    if (!displayResult) {
      alert('Henüz sonuç yok!')
      return
    }
    
    try {
      const blob = new Blob([displayResult], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      a.download = `ai-crew-output-${timestamp}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('İndirme başarısız oldu!')
    }
  }
  
  const handleReset = () => {
    reset()
    navigate('/')
  }
  
  // Calculate execution stats
  const startLog = logs.find(l => l.type === 'crew_started')
  const endLog = logs.find(l => l.type === 'crew_completed')
  const executionTime = startLog && endLog
    ? Math.round((new Date(endLog.timestamp) - new Date(startLog.timestamp)) / 1000)
    : 0
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-500" />
            Sonuç
          </h1>
          <p className="text-dark-400 mt-1">AI ekibinizin ürettiği içerik</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-300 hover:text-white hover:border-dark-600 transition-all"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all"
          >
            <Download className="w-4 h-4" />
            İndir
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Yeni Proje
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl glass border border-dark-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Ajanlar</p>
              <p className="text-xl font-bold text-white">{agents.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass border border-dark-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Görevler</p>
              <p className="text-xl font-bold text-white">{tasks.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl glass border border-dark-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Süre</p>
              <p className="text-xl font-bold text-white">{executionTime}s</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass border border-dark-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Durum</p>
              <p className="text-xl font-bold text-green-400">
                {status === 'completed' ? 'Tamamlandı' : status}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Result Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-dark-700"
      >
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-dark-700">
          <FileText className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-white">Üretilen İçerik</h2>
          {displayResult && (
            <span className="ml-auto text-sm text-dark-400">
              {displayResult.length} karakter
            </span>
          )}
          {sessionId && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="ml-2 p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
              title="Sonucu yenile"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        
        {displayResult ? (
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-dark-200 leading-relaxed font-mono text-sm bg-dark-800/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
              {displayResult}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-dark-600" />
            <p className="text-dark-400 mb-2">Sonuç alınamadı</p>
            <p className="text-sm text-dark-500 mb-4">
              {status === 'completed' 
                ? 'WebSocket bağlantısı kesilmiş olabilir. Yenilemeyi deneyin.' 
                : 'Önce ekibi çalıştırın'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {status === 'completed' && sessionId && (
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sonucu Al
                </button>
              )}
              {status !== 'completed' && (
                <button
                  onClick={() => navigate('/execution')}
                  className="px-6 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all"
                >
                  Ekibi Çalıştır
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Execution Log Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-dark-700"
      >
        <h3 className="font-semibold text-white mb-4">Çalışma Özeti</h3>
        
        <div className="space-y-3">
          {agents.map((agent, idx) => {
            const agentLogs = logs.filter(l => l.agent === agent.name)
            const hasCompleted = agentLogs.some(l => l.type === 'agent_completed')
            const actionCount = agentLogs.filter(l => l.type === 'agent_action').length
            
            return (
              <div 
                key={agent.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{agent.name}</h4>
                  <p className="text-sm text-dark-400">{agent.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-400">{actionCount} aksiyon</p>
                  <p className={`text-sm ${hasCompleted ? 'text-green-400' : 'text-dark-500'}`}>
                    {hasCompleted ? '✓ Tamamlandı' : 'Bekliyor'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
