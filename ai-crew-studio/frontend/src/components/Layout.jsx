import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  Play, 
  BarChart3, 
  FileText,
  Bot,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const navItems = [
  { path: '/', icon: Home, label: 'Ana Sayfa' },
  { path: '/wizard', icon: Users, label: 'Ajan Oluştur' },
  { path: '/execution', icon: Play, label: 'Çalıştır' },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/result', icon: FileText, label: 'Sonuç' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const { isRunning, status } = useAppStore()
  
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                AI Crew Studio
                <Sparkles className="w-4 h-4 text-primary-400" />
              </h1>
              <p className="text-xs text-dark-400">Agent Orchestration Platform</p>
            </div>
          </Link>
          
          {/* Status indicator */}
          {isRunning && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400">Çalışıyor...</span>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-sm text-primary-400">Tamamlandı</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-dark-700 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                  />
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* Steps indicator */}
        <div className="mt-8 p-4 rounded-xl bg-dark-800/50 border border-dark-700">
          <h3 className="text-sm font-semibold text-dark-400 mb-3">İlerleme</h3>
          <StepIndicator />
        </div>
      </aside>
      
      {/* Main content */}
      <main className="ml-64 pt-16 min-h-screen">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

function StepIndicator() {
  const { currentStep, agents, tasks, selectedModel } = useAppStore()
  
  const steps = [
    { num: 1, label: 'Ajanlar', done: agents.length > 0 },
    { num: 2, label: 'Model', done: !!selectedModel },
    { num: 3, label: 'Görevler', done: tasks.length > 0 },
    { num: 4, label: 'Çalıştır', done: false },
  ]
  
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep === step.num 
              ? 'bg-primary-500 text-white' 
              : step.done 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-dark-700 text-dark-500'
            }
          `}>
            {step.done && currentStep > step.num ? '✓' : step.num}
          </div>
          <span className={`text-sm ${currentStep === step.num ? 'text-white' : 'text-dark-500'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
