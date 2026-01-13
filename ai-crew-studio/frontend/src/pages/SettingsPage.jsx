import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
  ExternalLink,
  Info
} from 'lucide-react'
import { useSettingsStore } from '../store/useSettingsStore'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { 
    apiKey, 
    isApiKeyValid, 
    isValidating,
    setApiKey,
    validateApiKey,
    clearApiKey
  } = useSettingsStore()
  
  const [showKey, setShowKey] = useState(false)
  const [inputKey, setInputKey] = useState(apiKey || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleSave = async () => {
    setError('')
    setSuccess(false)
    
    if (!inputKey || inputKey.trim().length < 20) {
      setError('Geçerli bir API anahtarı girin (en az 20 karakter)')
      return
    }
    
    const isValid = await validateApiKey(inputKey.trim())
    
    if (isValid) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError('API anahtarı doğrulanamadı. Lütfen kontrol edin.')
    }
  }
  
  const handleClear = () => {
    clearApiKey()
    setInputKey('')
    setError('')
    setSuccess(false)
  }
  
  const maskedKey = inputKey 
    ? `${inputKey.substring(0, 8)}${'•'.repeat(20)}${inputKey.substring(inputKey.length - 4)}`
    : ''
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-primary-500" />
            Ayarlar
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            API yapılandırması ve uygulama ayarları
          </p>
        </div>
      </div>
      
      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden"
      >
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-dark-700 bg-dark-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h2 className="font-medium text-white">Google Gemini API</h2>
              <p className="text-sm text-dark-400">AI modelleri için API anahtarı</p>
            </div>
            {isApiKeyValid && (
              <div className="ml-auto badge-success">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Bağlı
              </div>
            )}
          </div>
        </div>
        
        {/* Section Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-500/5 border border-primary-500/20">
            <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-dark-200">
                Google AI Studio'dan ücretsiz API anahtarı alabilirsiniz.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 mt-2"
              >
                API anahtarı al
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              API Anahtarı
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 pr-24 rounded-lg bg-dark-800 border border-dark-600 text-white placeholder-dark-500 font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 rounded-md hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-3 text-accent-500 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                API anahtarı başarıyla kaydedildi!
              </motion.div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isValidating || !inputKey}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Kaydet ve Doğrula
                </>
              )}
            </button>
            
            {apiKey && (
              <button
                onClick={handleClear}
                className="px-5 py-3 rounded-lg border border-dark-600 text-dark-300 hover:bg-dark-800 hover:text-white transition-all"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
        
        {/* Security Note */}
        <div className="px-6 py-4 border-t border-dark-700 bg-dark-800/30">
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <Shield className="w-3.5 h-3.5" />
            API anahtarınız yalnızca tarayıcınızda güvenli şekilde saklanır.
          </div>
        </div>
      </motion.div>
      
      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 bg-dark-900 rounded-xl border border-dark-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-dark-700 bg-dark-800/50">
          <h2 className="font-medium text-white">Uygulama Bilgisi</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-dark-500">Versiyon</span>
              <p className="text-dark-200">1.0.0</p>
            </div>
            <div>
              <span className="text-dark-500">Orchestration</span>
              <p className="text-dark-200">CrewAI</p>
            </div>
            <div>
              <span className="text-dark-500">LLM Provider</span>
              <p className="text-dark-200">Google Gemini</p>
            </div>
            <div>
              <span className="text-dark-500">Web Search</span>
              <p className="text-dark-200">DuckDuckGo</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
