import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useSettingsStore } from './store/useSettingsStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WizardPage from './pages/WizardPage'
import ExecutionPage from './pages/ExecutionPage'
import DashboardPage from './pages/DashboardPage'
import ResultPage from './pages/ResultPage'
import SettingsPage from './pages/SettingsPage'

// Protected route wrapper - requires API key
function RequireApiKey({ children }) {
  const { apiKey, isApiKeyValid } = useSettingsStore()
  
  if (!apiKey || !isApiKeyValid) {
    return <Navigate to="/settings" replace />
  }
  
  return children
}

function App() {
  const { fetchModels, fetchTools } = useAppStore()
  const { apiKey, validateApiKey } = useSettingsStore()
  
  useEffect(() => {
    fetchModels()
    fetchTools()
    
    // Validate stored API key on mount
    if (apiKey) {
      validateApiKey(apiKey)
    }
  }, [])
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/wizard" element={
          <RequireApiKey>
            <WizardPage />
          </RequireApiKey>
        } />
        <Route path="/execution" element={
          <RequireApiKey>
            <ExecutionPage />
          </RequireApiKey>
        } />
        <Route path="/dashboard" element={
          <RequireApiKey>
            <DashboardPage />
          </RequireApiKey>
        } />
        <Route path="/result" element={
          <RequireApiKey>
            <ResultPage />
          </RequireApiKey>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
