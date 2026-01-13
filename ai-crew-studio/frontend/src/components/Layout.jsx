import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  Play, 
  BarChart3, 
  FileText,
  Bot,
  Settings,
  Key,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Lock
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useSettingsStore } from '../store/useSettingsStore'

const navItems = [
  { path: '/', icon: Home, label: 'Ana Sayfa', step: 0 },
  { path: '/wizard', icon: Users, label: 'Ajan Oluştur', protected: true, step: 1 },
  { path: '/execution', icon: Play, label: 'Çalıştır', protected: true, step: 4 },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard', protected: true, step: 5 },
  { path: '/result', icon: FileText, label: 'Sonuç', protected: true, step: 5 },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isRunning, status, currentStep, agents, sessionId } = useAppStore()
  const { apiKey, isApiKeyValid } = useSettingsStore()
  
  const hasValidKey = apiKey && isApiKeyValid
  
  // Check if nav item is accessible based on progress
  const isNavAccessible = (item) => {
    if (!item.protected) return true
    if (!hasValidKey) return false
    if (!sessionId) return item.step <= 1
    return currentStep >= item.step || item.step === 1
  }
  
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Session Warning Banner */}
      {sessionId && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">
              <strong>Tek Kullanımlık Oturum:</strong> Sayfa yenilendiğinde tüm veriler silinecektir. İşlem tamamlanana kadar sayfayı kapatmayın.
            </span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className={`fixed left-0 right-0 z-50 bg-dark-900 border-b border-dark-800 ${sessionId ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                AI Crew Studio
              </h1>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent-500/10 border border-accent-500/20">
                <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-sm text-accent-500 font-medium">Çalışıyor</span>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-500/10 border border-primary-500/20">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-sm text-primary-400 font-medium">Tamamlandı</span>
              </div>
            )}
            
            {/* Settings Link */}
            <Link
              to="/settings"
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${location.pathname === '/settings'
                  ? 'bg-dark-800 text-white'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
                }
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Ayarlar</span>
              {!hasValidKey && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>
          </div>
        </div>
      </header>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 bottom-0 w-60 bg-dark-900 border-r border-dark-800 flex flex-col ${sessionId ? 'top-24' : 'top-14'}`}>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            const isDisabled = !isNavAccessible(item)
            
            if (isDisabled) {
              return (
                <div
                  key={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-600 cursor-not-allowed"
                  title={!hasValidKey ? "API anahtarı gerekli" : "Bu adıma henüz ulaşmadınız"}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {!hasValidKey ? (
                    <Key className="w-3.5 h-3.5 ml-auto" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 ml-auto" />
                  )}
                </div>
              )
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary-500/10 text-primary-400' 
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1 h-5 rounded-full bg-primary-500"
                  />
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* API Key Status */}
        {!hasValidKey && (
          <div className="p-3 border-t border-dark-800">
            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-400">API Anahtarı Gerekli</p>
                <p className="text-xs text-dark-500">Ayarlardan ekleyin</p>
              </div>
            </Link>
          </div>
        )}
        
        {/* Steps indicator */}
        {hasValidKey && (
          <div className="p-3 border-t border-dark-800">
            <div className="p-3 rounded-lg bg-dark-800/50">
              <h3 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-3">İlerleme</h3>
              <StepIndicator />
            </div>
          </div>
        )}
      </aside>
      
      {/* Main content */}
      <main className={`ml-60 min-h-screen bg-dark-950 ${sessionId ? 'pt-24' : 'pt-14'}`}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

function StepIndicator() {
  const navigate = useNavigate()
  const { currentStep, agents, tasks, selectedModel, status, sessionId } = useAppStore()
  
  const steps = [
    { num: 1, label: 'Ajanlar', done: agents.length > 0, path: '/wizard' },
    { num: 2, label: 'Model', done: !!selectedModel && currentStep >= 2, path: '/wizard' },
    { num: 3, label: 'Görevler', done: tasks.length > 0 && currentStep >= 3, path: '/wizard' },
    { num: 4, label: 'Çalıştır', done: status === 'completed', path: '/execution' },
  ]
  
  const handleStepClick = (step) => {
    if (step.done || currentStep >= step.num) {
      navigate(step.path)
    }
  }
  
  return (
    <div className="space-y-2">
      {steps.map((step) => {
        const isAccessible = step.done || currentStep >= step.num
        const isCurrent = currentStep === step.num
        const isCompleted = step.done && currentStep > step.num
        
        return (
          <button
            key={step.num}
            onClick={() => handleStepClick(step)}
            disabled={!isAccessible}
            className={`
              w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left
              ${isAccessible ? 'hover:bg-dark-700 cursor-pointer' : 'cursor-not-allowed opacity-50'}
              ${isCurrent ? 'bg-dark-700' : ''}
            `}
          >
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${isCurrent 
                ? 'bg-primary-500 text-white' 
                : isCompleted 
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-dark-700 text-dark-500'
              }
            `}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.num}
            </div>
            <span className={`text-sm ${isCurrent ? 'text-white font-medium' : 'text-dark-400'}`}>
              {step.label}
            </span>
            {!isAccessible && <Lock className="w-3 h-3 ml-auto text-dark-600" />}
          </button>
        )
      })}
      
      {status === 'completed' && (
        <button
          onClick={() => navigate('/result')}
          className="w-full mt-3 p-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium hover:bg-accent-500/20 transition-colors"
        >
          🎉 Sonucu Görüntüle
        </button>
      )}
    </div>
  )
}
