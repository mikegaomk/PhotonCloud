import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, Layers, Key, BarChart3, Copy, Eye, EyeOff, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../data/authContext'
import { useI18n } from '../data/i18nContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const { lang } = useI18n()
  const zh = lang === 'zh'
  const [activeTab, setActiveTab] = useState<'overview' | 'sims' | 'pdks' | 'usage' | 'apikeys'>('overview')
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const mockApiKey = 'pc_live_a7f3k9d2x8m4p1q6w5n0b3c7'

  const copyKey = () => {
    navigator.clipboard.writeText(mockApiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return null

  const tabs = [
    { key: 'overview' as const, label: zh ? '总览' : 'Overview', icon: BarChart3 },
    { key: 'sims' as const, label: zh ? '我的仿真' : 'My Simulations', icon: Cloud },
    { key: 'pdks' as const, label: zh ? '我的 PDK' : 'My PDKs', icon: Layers },
    { key: 'usage' as const, label: zh ? '用量统计' : 'Usage', icon: BarChart3 },
    { key: 'apikeys' as const, label: 'API Keys', icon: Key },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{user.avatar}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{zh ? `欢迎回来，${user.displayName}` : `Welcome back, ${user.displayName}`}</h1>
          <p className="text-sm text-gray-500">{user.email} · {user.organization} · {user.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 -mb-[2px] transition-colors ${activeTab === tab.key ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label={zh ? '本月仿真' : 'Sims This Month'} value="12" subtext={zh ? '/ 100 配额' : '/ 100 quota'} color="text-indigo-600" />
            <StatCard label={zh ? '算力消耗' : 'Core·Hours'} value="48.5h" subtext={zh ? '本月累计' : 'this month'} color="text-purple-600" />
            <StatCard label={zh ? '已下载 PDK' : 'PDKs Downloaded'} value="3" subtext="CUMEC, SiOPT, LNOI" color="text-green-600" />
            <StatCard label={zh ? 'API 调用' : 'API Calls'} value="234" subtext={zh ? '/ 1000 配额' : '/ 1000 quota'} color="text-orange-600" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/cloud-sim" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all">
              <Cloud className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{zh ? '提交新仿真' : 'New Simulation'}</h3>
              <p className="text-xs text-gray-500">{zh ? '选择器件 → 配参数 → 云端运算' : 'Select device → Configure → Cloud compute'}</p>
            </Link>
            <Link to="/pdk" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <Layers className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{zh ? '浏览 PDK' : 'Browse PDKs'}</h3>
              <p className="text-xs text-gray-500">{zh ? '6 家 Foundry PDK 在线获取' : '6 foundry PDKs available'}</p>
            </Link>
            <Link to="/design" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{zh ? '设计工具' : 'Design Tools'}</h3>
              <p className="text-xs text-gray-500">{zh ? '波导/耦合器/MZI 在线设计' : 'Online photonic device design'}</p>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{zh ? '最近活动' : 'Recent Activity'}</h3>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: 'text-green-500', text: zh ? 'MZI 调制器 FDTD 仿真完成' : 'MZI Modulator FDTD completed', time: '2h ago' },
                { icon: Layers, color: 'text-blue-500', text: zh ? '下载 CUMEC-SiPh180 PDK v3.2.1' : 'Downloaded CUMEC-SiPh180 PDK', time: '5h ago' },
                { icon: Clock, color: 'text-orange-500', text: zh ? '微环滤波器仿真运行中 (67%)' : 'Ring filter sim running (67%)', time: '1h ago' },
                { icon: AlertCircle, color: 'text-red-500', text: zh ? 'Ge-PD 仿真失败 - 收敛错误' : 'Ge-PD sim failed - convergence error', time: '6h ago' },
                { icon: Key, color: 'text-purple-500', text: zh ? '生成新 API Key' : 'Generated new API Key', time: '1d ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm text-gray-700 flex-1">{item.text}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Simulations */}
      {activeTab === 'sims' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{zh ? '我的仿真作业' : 'My Simulation Jobs'}</h3>
            <Link to="/cloud-sim" className="text-sm text-indigo-600 hover:underline">{zh ? '查看全部 →' : 'View all →'}</Link>
          </div>
          <div className="space-y-3">
            {[
              { name: 'MZI 调制器 FDTD', status: 'completed', date: '2026-06-07', engine: 'FDTD', cost: '4.2 h' },
              { name: '微环滤波器 EME', status: 'running', date: '2026-06-07', engine: 'EME', cost: '1.8 h' },
              { name: 'TFLN IQ 全波仿真', status: 'queued', date: '2026-06-07', engine: 'FDTD', cost: '—' },
              { name: 'Ge-PD 频率响应', status: 'failed', date: '2026-06-07', engine: 'CHARGE', cost: '0.5 h' },
              { name: '光栅耦合器优化', status: 'completed', date: '2026-06-06', engine: 'FDTD', cost: '2.1 h' },
            ].map((job, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'completed' ? 'bg-green-50 text-green-700' : job.status === 'running' ? 'bg-orange-50 text-orange-700' : job.status === 'queued' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                  {job.status}
                </span>
                <span className="text-sm text-gray-900 flex-1">{job.name}</span>
                <span className="text-xs text-gray-400">{job.engine}</span>
                <span className="text-xs text-gray-400">{job.cost}</span>
                <span className="text-xs text-gray-400">{job.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My PDKs */}
      {activeTab === 'pdks' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{zh ? '我的 PDK' : 'My PDKs'}</h3>
          <div className="space-y-3">
            {[
              { name: 'CUMEC-SiPh180', version: 'v3.2.1', status: 'downloaded', date: '2026-06-05' },
              { name: 'SiOPT-SiN800', version: 'v2.1.0', status: 'downloaded', date: '2026-05-20' },
              { name: 'LNOI-Photonics', version: 'v1.3.0-beta', status: 'approved', date: '2026-05-15' },
              { name: 'PH18-CN', version: 'v4.0.0', status: 'pending', date: '2026-06-06' },
              { name: 'InP-EPI', version: 'v0.9.0', status: 'nda_required', date: '2026-05-28' },
            ].map((pdk, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-900 flex-1">{pdk.name} <code className="text-xs text-gray-400 ml-1">{pdk.version}</code></span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pdk.status === 'downloaded' ? 'bg-green-50 text-green-700' : pdk.status === 'approved' ? 'bg-blue-50 text-blue-700' : pdk.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-orange-50 text-orange-700'}`}>
                  {pdk.status === 'downloaded' ? '✓ 已下载' : pdk.status === 'approved' ? '可下载' : pdk.status === 'pending' ? '审批中' : '需 NDA'}
                </span>
                <span className="text-xs text-gray-400">{pdk.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{zh ? '仿真用量' : 'Simulation Usage'}</h3>
              <div className="space-y-4">
                <UsageBar label={zh ? '本月作业数' : 'Jobs this month'} used={12} total={100} />
                <UsageBar label={zh ? '算力消耗 (Core·h)' : 'Core Hours'} used={48.5} total={200} />
                <UsageBar label={zh ? 'GPU 时间 (h)' : 'GPU Hours'} used={8.2} total={50} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{zh ? 'API 用量' : 'API Usage'}</h3>
              <div className="space-y-4">
                <UsageBar label={zh ? 'API 调用次数' : 'API Calls'} used={234} total={1000} />
                <UsageBar label={zh ? 'GDS 生成' : 'GDS Generation'} used={45} total={200} />
                <UsageBar label={zh ? 'S 参数生成' : 'S-Param Generation'} used={23} total={100} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{zh ? '当前套餐' : 'Current Plan'}</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">{zh ? '专业版' : 'Professional'}</span>
              <span className="text-sm text-gray-500">¥299/{zh ? '月' : 'mo'} · {zh ? '续期日: 2026-07-07' : 'Renews: 2026-07-07'}</span>
              <button className="ml-auto text-sm text-indigo-600 hover:underline">{zh ? '升级套餐' : 'Upgrade'}</button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">API Keys</h3>
            <p className="text-sm text-gray-500 mb-4">{zh ? '使用 API Key 通过 REST API 调用仿真引擎和 GDS 生成服务' : 'Use API Keys to access simulation engine and GDS generation via REST API'}</p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm font-mono text-gray-700">
                  {showApiKey ? mockApiKey : '•'.repeat(32)}
                </code>
                <button onClick={() => setShowApiKey(!showApiKey)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={copyKey} className="p-1.5 text-gray-400 hover:text-indigo-600">
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{zh ? '创建于 2026-06-01' : 'Created 2026-06-01'}</span>
                <span>{zh ? '最近使用: 2h 前' : 'Last used: 2h ago'}</span>
                <span>{zh ? '权限: 全部' : 'Scope: Full'}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <RefreshCw className="h-3.5 w-3.5" /> {zh ? '生成新 Key' : 'Generate New Key'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{zh ? 'API 使用示例' : 'API Usage Example'}</h3>
            <pre className="p-4 bg-gray-900 rounded-lg text-xs text-green-400 font-mono overflow-x-auto">{`curl -X POST https://api.photoncloud.cn/v1/sim/submit \\
  -H "Authorization: Bearer ${mockApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "component": "mzi_modulator",
    "engine": "FDTD",
    "params": {"arm_length": 3.0, "vpi_l": 2.5},
    "priority": "normal"
  }'`}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
  )
}

function UsageBar({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.min(100, (used / total) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{used} / {total}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
