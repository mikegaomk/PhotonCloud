import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, BookOpen, Wrench, Users, Calendar, Lightbulb, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { photonicsChips } from '../data/photonicsData'

type TabKey = 'overview' | 'physics' | 'fabrication' | 'metrics' | 'ecosystem' | 'articles'

export default function ChipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const chip = photonicsChips.find((c) => c.id === id)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  if (!chip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">未找到该芯片信息</p>
        <Link to="/chips" className="text-indigo-600 hover:underline mt-4 inline-block">
          返回芯片库
        </Link>
      </div>
    )
  }

  const tabs: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
    { key: 'overview', label: '概览', icon: Lightbulb },
    { key: 'physics', label: '物理原理', icon: BookOpen },
    { key: 'fabrication', label: '制造工艺', icon: Wrench },
    { key: 'metrics', label: '性能指标', icon: FileText },
    { key: 'ecosystem', label: '生态&趋势', icon: Users },
    { key: 'articles', label: '深度文章', icon: BookOpen },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/chips" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回芯片库
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: chip.color }}
        >
          {chip.name.slice(0, 2)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{chip.name}</h1>
          <p className="text-gray-500">{chip.fullName}</p>
          <span
            className="chip-tag mt-2"
            style={{ backgroundColor: chip.bgColor, color: chip.color }}
          >
            {chip.category}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab chip={chip} />}
      {activeTab === 'physics' && <PhysicsTab chip={chip} />}
      {activeTab === 'fabrication' && <FabricationTab chip={chip} />}
      {activeTab === 'metrics' && <MetricsTab chip={chip} />}
      {activeTab === 'ecosystem' && <EcosystemTab chip={chip} />}
      {activeTab === 'articles' && <ArticlesTab chip={chip} />}
    </div>
  )
}

// --- Overview Tab ---
function OverviewTab({ chip }: { chip: any }) {
  return (
    <div>
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-3">技术简介</h2>
        <p className="text-gray-700 leading-relaxed">{chip.description}</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">架构示意</p>
          <p className="text-sm font-mono text-gray-800">{chip.architectureDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">核心指标</h2>
          <div className="space-y-3">
            {chip.keySpecs.map((spec: any) => (
              <div key={spec.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{spec.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {spec.value} <span className="text-gray-400 font-normal">{spec.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">市场趋势 ($ Billion)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chip.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="market" stroke={chip.color} fill={chip.bgColor} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> 技术优势
          </h2>
          <ul className="space-y-2">
            {chip.advantages.map((adv: string) => (
              <li key={adv} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> 技术挑战
          </h2>
          <ul className="space-y-2">
            {chip.challenges.map((ch: string) => (
              <li key={ch} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {ch}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="text-lg font-semibold mb-4">应用场景</h2>
        <div className="flex flex-wrap gap-3">
          {chip.applications.map((app: string) => (
            <span key={app} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
              {app}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Physics Tab ---
function PhysicsTab({ chip }: { chip: any }) {
  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">物理原理</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{chip.physicsExplanation}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">工作原理（步骤）</h2>
        <div className="space-y-3">
          {chip.workingPrinciple.split('\n').map((line: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: chip.color }}>
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 pt-0.5">{line.replace(/^\d+\.\s*/, '')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">设计参数</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">参数</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">描述</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">典型值</th>
              </tr>
            </thead>
            <tbody>
              {chip.designParameters.map((p: any, i: number) => (
                <tr key={p.param} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2.5 px-3 font-medium text-gray-800">{p.param}</td>
                  <td className="py-2.5 px-3 text-gray-600">{p.description}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-700">{p.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">关键材料</h2>
        <div className="flex flex-wrap gap-2">
          {chip.keyMaterials.map((mat: string) => (
            <span key={mat} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
              {mat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Fabrication Tab ---
function FabricationTab({ chip }: { chip: any }) {
  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">制造工艺流程</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {chip.fabricationProcess.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white z-10 flex-shrink-0"
                  style={{ backgroundColor: chip.color }}
                >
                  {i + 1}
                </div>
                <div className="pt-1">
                  <p className="text-sm text-gray-800 font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">关键材料体系</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chip.keyMaterials.map((mat: string) => (
            <div key={mat} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chip.color }} />
              <span className="text-sm text-gray-700">{mat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">相关标准</h2>
        <div className="flex flex-wrap gap-2">
          {chip.relatedStandards.map((std: string) => (
            <span key={std} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
              {std}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Metrics Tab ---
function MetricsTab({ chip }: { chip: any }) {
  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">性能指标详解</h2>
        <div className="space-y-4">
          {chip.performanceMetrics.map((m: any) => (
            <div key={m.metric} className="p-4 border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chip.color }} />
                <h3 className="font-semibold text-gray-900">{m.metric}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1"><strong>定义：</strong>{m.definition}</p>
              <p className="text-sm text-gray-600"><strong>重要性：</strong>{m.importance}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">核心规格速查</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chip.keySpecs.map((spec: any) => (
            <div key={spec.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold" style={{ color: chip.color }}>{spec.value}</p>
              <p className="text-xs text-gray-500">{spec.unit}</p>
              <p className="text-sm text-gray-700 mt-1">{spec.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Ecosystem Tab ---
function EcosystemTab({ chip }: { chip: any }) {
  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" /> 主要厂商
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chip.keyPlayers.map((player: any) => (
            <div key={player.name} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{player.country}</span>
              </div>
              <p className="text-sm text-gray-600">{player.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" /> 技术里程碑
        </h2>
        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {chip.techMilestones.map((milestone: any) => (
              <div key={milestone.year} className="flex items-start gap-4">
                <span className="text-sm font-bold text-gray-400 w-10 text-right pt-0.5">{milestone.year}</span>
                <div className="w-3 h-3 rounded-full border-2 border-white z-10 flex-shrink-0 mt-1" style={{ backgroundColor: chip.color }} />
                <p className="text-sm text-gray-700 pt-0.5">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" /> 未来展望
        </h2>
        <p className="text-gray-700 leading-relaxed">{chip.futureOutlook}</p>
      </div>
    </div>
  )
}

// --- Articles Tab ---
function ArticlesTab({ chip }: { chip: any }) {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">深度技术文章</h2>
        <p className="text-sm text-gray-500">点击展开查看详细内容</p>
      </div>

      {chip.articles.map((article: any) => (
        <div key={article.id} className="card">
          <button
            onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
            className="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
              <p className="text-sm text-gray-500">{article.summary}</p>
              <div className="flex gap-2 mt-2">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {expandedArticle === article.id
              ? <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
              : <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            }
          </button>

          {expandedArticle === article.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {article.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
