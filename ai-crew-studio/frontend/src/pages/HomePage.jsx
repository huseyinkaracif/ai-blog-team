import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Network, 
  Zap,
  Globe,
  Brain,
  Rocket
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

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
  const { createSession, reset } = useAppStore()
  
  const handleStart = async () => {
    reset()
    await createSession()
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center glow-blue"
        >
          <Bot className="w-14 h-14 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-4"
        >
          <span className="text-gradient">AI Crew Studio</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto"
        >
          Yapay zeka ajanlarınızı oluşturun, görevler atayın ve birlikte çalışmalarını izleyin.
          İnteraktif orchestration platformu ile AI ekibinizi yönetin.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            to="/wizard"
            onClick={handleStart}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Başla
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl border border-dark-600 text-dark-300 font-semibold hover:bg-dark-800 transition-all"
          >
            GitHub'da Gör
          </a>
        </motion.div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Özellikler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="p-6 rounded-2xl glass border border-dark-700 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-dark-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        
        <div className="flex items-start justify-between max-w-4xl mx-auto">
          {[
            { step: 1, title: 'Ajanları Tanımla', desc: 'Rol, hedef ve özellikler belirle' },
            { step: 2, title: 'Model Seç', desc: 'Gemini modelini seç' },
            { step: 3, title: 'Görev Ata', desc: 'Her ajana görev ver' },
            { step: 4, title: 'Çalıştır & İzle', desc: 'Canlı takip et' },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex-1 text-center relative"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-dark-400">{item.desc}</p>
              
              {idx < 3 && (
                <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-500/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="py-16">
        <div className="glass rounded-2xl p-8 border border-dark-700">
          <h3 className="text-lg font-semibold text-center mb-6">Teknoloji Stack</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['CrewAI', 'Google Gemini', 'FastAPI', 'React', 'WebSocket', 'DuckDuckGo'].map((tech) => (
              <div key={tech} className="px-4 py-2 rounded-lg bg-dark-800 text-dark-300 text-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
