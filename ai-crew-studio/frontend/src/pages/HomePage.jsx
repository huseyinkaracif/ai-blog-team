import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Bot, 
  ArrowRight, 
  Cpu, 
  Network, 
  Zap,
  Globe,
  Brain,
  Rocket,
  Key,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useSettingsStore } from '../store/useSettingsStore'

const features = [
  {
    icon: Bot,
    title: 'Özel Ajanlar',
    description: 'Rol, hedef ve backstory ile kendi AI ajanlarınızı tanımlayın'
  },
  {
    icon: Network,
    title: 'Orchestration',
    description: 'CrewAI ile ajanlar arası koordinasyon ve iş akışı yönetimi'
  },
  {
    icon: Zap,
    title: 'Gerçek Zamanlı',
    description: 'Ajanların çalışmasını ve iletişimini canlı izleyin'
  },
  {
    icon: Globe,
    title: 'Web Araması',
    description: 'DuckDuckGo entegrasyonu ile güncel bilgilere erişim'
  },
  {
    icon: Brain,
    title: 'Gemini LLM',
    description: 'Google Gemini modelleri ile güçlü AI yetenekleri'
  },
  {
    icon: Cpu,
    title: 'Dashboard',
    description: 'Detaylı istatistikler ve performans grafikleri'
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { createSession, reset } = useAppStore()
  const { apiKey, isApiKeyValid } = useSettingsStore()
  
  const hasValidKey = apiKey && isApiKeyValid
  
  const handleStart = async () => {
    if (!hasValidKey) {
      navigate('/settings')
      return
    }
    reset()
    await createSession()
    navigate('/wizard')
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Session Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-primary-300 font-medium">Tek Kullanımlık Oturum</p>
            <p className="text-xs text-dark-400 mt-1">
              Bu uygulama tarayıcı belleğinde çalışır. Sayfa yenilendiğinde veya kapatıldığında tüm ajanlar, görevler ve sonuçlar silinecektir. 
              İşleminiz tamamlandığında sonucu kaydetmeyi unutmayın.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* API Key Warning */}
      {!hasValidKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-300 font-medium">API Anahtarı Gerekli</p>
            <p className="text-xs text-dark-400">Başlamadan önce Gemini API anahtarınızı ayarlamanız gerekmektedir.</p>
          </div>
          <Link
            to="/settings"
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            Ayarlar
          </Link>
        </motion.div>
      )}
      
      {/* Hero Section */}
      <section className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 mx-auto mb-6 rounded-xl bg-primary-500 flex items-center justify-center"
        >
          <Bot className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-3"
        >
          AI Crew Studio
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-dark-400 mb-8 max-w-xl mx-auto"
        >
          Yapay zeka ajanlarınızı oluşturun, görevler atayın ve birlikte çalışmalarını izleyin.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={handleStart}
            disabled={!hasValidKey}
            className={`
              group px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all
              ${hasValidKey
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-dark-700 text-dark-500 cursor-not-allowed'
              }
            `}
          >
            <Rocket className="w-5 h-5" />
            {hasValidKey ? 'Başla' : 'API Anahtarı Gerekli'}
            {hasValidKey && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg border border-dark-700 text-dark-400 font-medium hover:bg-dark-800 hover:text-white transition-all"
          >
            GitHub
          </a>
        </motion.div>
      </section>
      
      {/* Features Grid */}
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white text-center mb-8">Özellikler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="p-5 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="font-medium text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-dark-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white text-center mb-8">Nasıl Çalışır?</h2>
        
        <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { step: 1, title: 'Ajanları Tanımla', desc: 'Rol ve hedef belirle' },
            { step: 2, title: 'Model Seç', desc: 'Gemini modeli seç' },
            { step: 3, title: 'Görev Ata', desc: 'Her ajana görev ver' },
            { step: 4, title: 'Çalıştır', desc: 'Canlı takip et' },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary-500 flex items-center justify-center text-lg font-semibold text-white">
                {item.step}
              </div>
              <h3 className="font-medium text-white text-sm mb-0.5">{item.title}</h3>
              <p className="text-xs text-dark-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="py-8">
        <div className="rounded-lg bg-dark-900 border border-dark-800 p-6">
          <h3 className="text-sm font-medium text-dark-400 text-center mb-4 uppercase tracking-wider">Teknoloji Stack</h3>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['CrewAI', 'Google Gemini', 'FastAPI', 'React', 'WebSocket', 'DuckDuckGo'].map((tech) => (
              <div key={tech} className="px-3 py-1.5 rounded-md bg-dark-800 text-dark-400 text-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
