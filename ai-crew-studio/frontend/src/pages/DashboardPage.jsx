import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Bot, 
  Clock, 
  CheckCircle, 
  Activity,
  Zap,
  MessageSquare,
  TrendingUp
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { useAppStore } from '../store/useAppStore'

const COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f97316']

export default function DashboardPage() {
  const { agents, tasks, logs, status, isRunning } = useAppStore()
  const [timelineData, setTimelineData] = useState([])
  
  useEffect(() => {
    // Create timeline data from logs
    const grouped = {}
    logs.forEach(log => {
      const time = new Date(log.timestamp).toLocaleTimeString()
      if (!grouped[time]) {
        grouped[time] = { time, events: 0 }
      }
      grouped[time].events++
    })
    setTimelineData(Object.values(grouped))
  }, [logs])
  
  // Calculate stats
  const completedTasks = logs.filter(l => l.type === 'agent_completed').length
  const totalActions = logs.filter(l => l.type === 'agent_action').length
  const totalThoughts = logs.filter(l => l.type === 'agent_thinking').length
  
  // Agent stats for pie chart
  const agentStats = agents.map((agent, idx) => ({
    name: agent.name,
    value: logs.filter(l => l.agent === agent.name).length,
    color: COLORS[idx % COLORS.length]
  }))
  
  // Log type distribution
  const logTypeStats = [
    { name: 'Başladı', value: logs.filter(l => l.type === 'agent_started').length },
    { name: 'Düşündü', value: totalThoughts },
    { name: 'Aksiyon', value: totalActions },
    { name: 'Tamamladı', value: completedTasks },
  ]
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary-500" />
          Dashboard
        </h1>
        
        <div className={`
          px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
          ${status === 'completed' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : isRunning 
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-dark-700 text-dark-400'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${
            status === 'completed' ? 'bg-green-500' : isRunning ? 'bg-primary-500 animate-pulse' : 'bg-dark-500'
          }`} />
          {status === 'completed' ? 'Tamamlandı' : isRunning ? 'Çalışıyor' : 'Bekliyor'}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Bot}
          label="Toplam Ajan"
          value={agents.length}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Tamamlanan Görev"
          value={completedTasks}
          total={tasks.length}
          color="green"
        />
        <StatCard
          icon={Zap}
          label="Toplam Aksiyon"
          value={totalActions}
          color="purple"
        />
        <StatCard
          icon={MessageSquare}
          label="Log Sayısı"
          value={logs.length}
          color="orange"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="glass rounded-2xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            Aktivite Zaman Çizelgesi
          </h3>
          <div className="h-64">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorEvents)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-dark-500">
                Henüz veri yok
              </div>
            )}
          </div>
        </div>
        
        {/* Agent Activity Pie */}
        <div className="glass rounded-2xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-500" />
            Ajan Aktivite Dağılımı
          </h3>
          <div className="h-64">
            {agentStats.some(s => s.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {agentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-dark-500">
                Henüz veri yok
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Log Type Distribution */}
      <div className="glass rounded-2xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Log Türü Dağılımı
        </h3>
        <div className="h-64">
          {logTypeStats.some(s => s.value > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logTypeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  {logTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-dark-500">
              Henüz veri yok
            </div>
          )}
        </div>
      </div>
      
      {/* Agent Details */}
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent, idx) => {
          const agentLogs = logs.filter(l => l.agent === agent.name)
          const hasStarted = agentLogs.some(l => l.type === 'agent_started')
          const hasCompleted = agentLogs.some(l => l.type === 'agent_completed')
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-dark-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})` }}
                >
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{agent.name}</h4>
                  <p className="text-xs text-dark-400">{agent.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Durum</span>
                  <span className={`
                    px-2 py-0.5 rounded
                    ${hasCompleted 
                      ? 'bg-green-500/20 text-green-400' 
                      : hasStarted 
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-dark-700 text-dark-400'
                    }
                  `}>
                    {hasCompleted ? 'Tamamlandı' : hasStarted ? 'Çalışıyor' : 'Bekliyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Log Sayısı</span>
                  <span className="text-white">{agentLogs.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Aksiyonlar</span>
                  <span className="text-white">
                    {agentLogs.filter(l => l.type === 'agent_action').length}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, total, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    orange: 'from-orange-500/20 to-yellow-500/20 text-orange-400',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} 
        border border-dark-700 glass
      `}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-dark-800/50 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-dark-400">{label}</p>
          <p className="text-2xl font-bold text-white">
            {value}
            {total !== undefined && <span className="text-sm text-dark-500">/{total}</span>}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
