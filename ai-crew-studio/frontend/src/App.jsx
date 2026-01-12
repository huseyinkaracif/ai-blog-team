import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WizardPage from './pages/WizardPage'
import ExecutionPage from './pages/ExecutionPage'
import DashboardPage from './pages/DashboardPage'
import ResultPage from './pages/ResultPage'

function App() {
  const { fetchModels, fetchTools } = useAppStore()
  
  useEffect(() => {
    fetchModels()
    fetchTools()
  }, [])
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wizard" element={<WizardPage />} />
        <Route path="/execution" element={<ExecutionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
