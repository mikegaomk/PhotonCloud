import { useState, useEffect, useMemo } from 'react'
import { Cloud, Play, Clock, CheckCircle, AlertCircle, Download, RefreshCw, Trash2, Eye, Cpu, Zap, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useI18n } from '../data/i18nContext'
import GDSPreview from '../components/GDSPreview'

// ===================================================================
// Types
// ===================================================================

interface SimJob {
  id: string
  name: string
  component: string
  engine: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  submittedAt: string
  startedAt: string | null
  completedAt: string | null
  params: Record<string, any>
  result: SimResult | null
  coreHours: number
  priority: 'low' | 'normal' | 'high'
}

interface SimResult {
  sparamData: { freq: number; S21: number; S11: number; S21_phase: number; S11_phase: number }[]
  metrics: { label: string; value: string }[]
  logPreview: string
}

// ===================================================================
// Mock Data & Simulation Engine
// ===================================================================

const JOBS_KEY = 'photonics_sim_jobs'

function loadJobs(): SimJob[] {
  const stored = localStorage.getItem(JOBS_KEY)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* ignore */ }
  }
  return initialJobs
}

function saveJobs(jobs: SimJob[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

const initialJobs: SimJob[] = [
  {
    id: 'job-001', name: 'MZI 调制器 FDTD 仿真', component: 'mzi_modulator', engine: 'FDTD',
    status: 'completed', progress: 100, submittedAt: '2026-06-07T09:15:00Z', startedAt: '2026-06-07T09:16:30Z', completedAt: '2026-06-07T09:42:15Z',
    params: { arm_length: 3.0, vpi_l: 2.5, width: 0.5, wavelength: 1550 }, coreHours: 4.2, priority: 'normal',
    result: {
      sparamData: Array.from({ length: 100 }, (_, i) => {
        const f = 1 + i * 0.66
        const bw = 20; const rolloff = 1 / Math.sqrt(1 + (f / bw) ** 4)
        return { freq: parseFloat(f.toFixed(2)), S21: parseFloat((-3 + 20 * Math.log10(rolloff)).toFixed(2)), S11: parseFloat((-15 + 3 * Math.log10(1 + (f / bw) ** 2)).toFixed(2)), S21_phase: parseFloat((-f * 8).toFixed(1)), S11_phase: parseFloat((90 + f).toFixed(1)) }
      }),
      metrics: [{ label: '3dB 带宽', value: '45.2 GHz' }, { label: '插入损耗', value: '3.1 dB' }, { label: 'Vπ', value: '4.8 V' }, { label: '消光比', value: '28.5 dB' }],
      logPreview: '[09:16:30] Job started on node gpu-cn-east-03\n[09:16:31] Loading mesh: 2.4M cells\n[09:16:35] FDTD engine initialized (GPU: A100 80GB)\n[09:16:36] Running 50,000 time steps...\n[09:38:12] Simulation complete. Post-processing...\n[09:42:15] S-parameters extracted. Job finished.',
    },
  },
  {
    id: 'job-002', name: '微环滤波器 Mode 仿真', component: 'ring_filter', engine: 'EME',
    status: 'running', progress: 67, submittedAt: '2026-06-07T10:30:00Z', startedAt: '2026-06-07T10:31:00Z', completedAt: null,
    params: { radius: 10, gap: 0.2, coupling_length: 5, n_eff: 2.45 }, coreHours: 1.8, priority: 'normal', result: null,
  },
  {
    id: 'job-003', name: 'TFLN IQ 调制器全波仿真', component: 'tfln_iq', engine: 'FDTD',
    status: 'queued', progress: 0, submittedAt: '2026-06-07T10:45:00Z', startedAt: null, completedAt: null,
    params: { length: 20, electrode_gap: 5, ln_thickness: 0.6, vpi_target: 1.2 }, coreHours: 0, priority: 'high', result: null,
  },
  {
    id: 'job-004', name: 'Ge-PD 频率响应', component: 'ge_pd', engine: 'CHARGE+FDTD',
    status: 'failed', progress: 35, submittedAt: '2026-06-07T08:00:00Z', startedAt: '2026-06-07T08:01:00Z', completedAt: '2026-06-07T08:12:00Z',
    params: { ge_length: 30, ge_width: 8, bias: -2 }, coreHours: 0.5, priority: 'low',
    result: { sparamData: [], metrics: [], logPreview: '[08:01:00] Job started\n[08:05:22] CHARGE solver: mesh generation\n[08:08:15] ERROR: Convergence failure at bias=-2V\n[08:08:15] Max iterations (500) reached\n[08:12:00] Job failed. Suggestion: reduce bias voltage or refine mesh.' },
  },
]

// ===================================================================
// Main Component
// ===================================================================

export default function CloudSimPage() {
  const [jobs, setJobs] = useState<SimJob[]>(loadJobs)
  const [activeTab, setActiveTab] = useState<'submit' | 'templates' | 'jobs' | 'results' | 'cluster' | 'benchmark'>('jobs')
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const { t, lang } = useI18n()

  // Simulate progress for running jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) => {
        let changed = false
        const updated = prev.map((j) => {
          if (j.status === 'running' && j.progress < 100) {
            changed = true
            const newProgress = Math.min(100, j.progress + Math.random() * 3)
            if (newProgress >= 100) {
              return { ...j, progress: 100, status: 'completed' as const, completedAt: new Date().toISOString(), coreHours: j.coreHours + 0.1, result: generateMockResult(j.component) }
            }
            return { ...j, progress: newProgress, coreHours: j.coreHours + 0.02 }
          }
          if (j.status === 'queued') {
            // Auto-start queued jobs after a delay
            const queueTime = Date.now() - new Date(j.submittedAt).getTime()
            if (queueTime > 10000) { // Start after 10s
              changed = true
              return { ...j, status: 'running' as const, startedAt: new Date().toISOString(), progress: 1 }
            }
          }
          return j
        })
        if (changed) { saveJobs(updated) }
        return changed ? updated : prev
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (job: Omit<SimJob, 'id' | 'submittedAt' | 'startedAt' | 'completedAt' | 'progress' | 'status' | 'result' | 'coreHours'>) => {
    const newJob: SimJob = {
      ...job,
      id: `job-${Date.now()}`,
      status: 'queued',
      progress: 0,
      submittedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      coreHours: 0,
    }
    const updated = [newJob, ...jobs]
    setJobs(updated)
    saveJobs(updated)
    setActiveTab('jobs')
  }

  const handleDelete = (id: string) => {
    const updated = jobs.filter((j) => j.id !== id)
    setJobs(updated)
    saveJobs(updated)
    if (selectedJob === id) setSelectedJob(null)
  }

  const selectedJobData = jobs.find((j) => j.id === selectedJob)
  const queuedCount = jobs.filter((j) => j.status === 'queued').length
  const runningCount = jobs.filter((j) => j.status === 'running').length
  const completedCount = jobs.filter((j) => j.status === 'completed').length
  const totalCoreHours = jobs.reduce((sum, j) => sum + j.coreHours, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Cloud className="h-8 w-8 text-indigo-600" />
            {lang === 'zh' ? '云仿真引擎' : 'Cloud Simulation Engine'}
          </h1>
          <p className="text-gray-500 mt-1">{lang === 'zh' ? '提交仿真作业 → 云端 GPU 集群运算 → 查看结果并下载' : 'Submit jobs → GPU cluster computing → View & download results'}</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard icon={Clock} label={lang === 'zh' ? '排队中' : 'Queued'} value={queuedCount} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={RefreshCw} label={lang === 'zh' ? '运行中' : 'Running'} value={runningCount} color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={CheckCircle} label={lang === 'zh' ? '已完成' : 'Completed'} value={completedCount} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={Cpu} label={lang === 'zh' ? '总算力消耗' : 'Core·Hours'} value={`${totalCoreHours.toFixed(1)}h`} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={Zap} label={lang === 'zh' ? '集群状态' : 'Cluster'} value={lang === 'zh' ? '在线' : 'Online'} color="text-green-600" bg="bg-green-50" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'submit' as const, label: lang === 'zh' ? '➕ 提交作业' : '➕ Submit Job' },
          { key: 'templates' as const, label: lang === 'zh' ? '📦 案例模板' : '📦 Templates' },
          { key: 'jobs' as const, label: lang === 'zh' ? `📋 作业 (${jobs.length})` : `📋 Jobs (${jobs.length})` },
          { key: 'results' as const, label: lang === 'zh' ? '📊 结果' : '📊 Results' },
          { key: 'cluster' as const, label: lang === 'zh' ? '🖥️ 集群' : '🖥️ Cluster' },
          { key: 'benchmark' as const, label: lang === 'zh' ? '🏆 Benchmark' : '🏆 Benchmark' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'submit' && <SubmitPanel onSubmit={handleSubmit} />}
      {activeTab === 'templates' && <TemplatesPanel onSubmit={handleSubmit} />}
      {activeTab === 'jobs' && <JobsPanel jobs={jobs} onSelect={setSelectedJob} onDelete={handleDelete} selectedId={selectedJob} />}
      {activeTab === 'results' && <ResultsPanel job={selectedJobData} jobs={jobs} onSelect={setSelectedJob} />}
      {activeTab === 'cluster' && <ClusterPanel />}
      {activeTab === 'benchmark' && <BenchmarkPanel />}
    </div>
  )
}

// ===================================================================
// Submit Panel (Enhanced)
// ===================================================================

function SubmitPanel({ onSubmit }: { onSubmit: (job: any) => void }) {
  const { lang } = useI18n()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [component, setComponent] = useState('mzi_modulator')
  const [engine, setEngine] = useState('FDTD')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal')
  const [params, setParams] = useState<Record<string, number>>({})
  const [pdk, setPdk] = useState('CUMEC-SiPh180')
  const [meshAccuracy, setMeshAccuracy] = useState(3)
  const [freqPoints, setFreqPoints] = useState(500)
  const [freqStart, setFreqStart] = useState(1)
  const [freqEnd, setFreqEnd] = useState(67)
  const [gdsFile, setGdsFile] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const components: { id: string; label: string; labelEn: string; icon: string; defaultParams: Record<string, number>; paramLabels: Record<string, string> }[] = [
    { id: 'mzi_modulator', label: 'MZI 调制器', labelEn: 'MZI Modulator', icon: '⚡', defaultParams: { arm_length: 3.0, vpi_l: 2.5, width: 0.5, wavelength: 1550 }, paramLabels: { arm_length: '臂长 (mm)', vpi_l: 'VπL (V·cm)', width: '波导宽度 (μm)', wavelength: '波长 (nm)' } },
    { id: 'ring_filter', label: '微环滤波器', labelEn: 'Ring Filter', icon: '🔵', defaultParams: { radius: 10, gap: 0.2, coupling_length: 5, n_eff: 2.45 }, paramLabels: { radius: '半径 (μm)', gap: '间隙 (μm)', coupling_length: '耦合长 (μm)', n_eff: '有效折射率' } },
    { id: 'tfln_iq', label: 'TFLN IQ 调制器', labelEn: 'TFLN IQ Modulator', icon: '💎', defaultParams: { length: 20, electrode_gap: 5, ln_thickness: 0.6, vpi_target: 1.2 }, paramLabels: { length: '调制长度 (mm)', electrode_gap: '电极间距 (μm)', ln_thickness: 'LN 厚度 (μm)', vpi_target: '目标 Vπ (V)' } },
    { id: 'ge_pd', label: 'Ge 光电探测器', labelEn: 'Ge Photodetector', icon: '📡', defaultParams: { ge_length: 30, ge_width: 8, bias: -1, wavelength: 1310 }, paramLabels: { ge_length: 'Ge 长度 (μm)', ge_width: 'Ge 宽度 (μm)', bias: '偏压 (V)', wavelength: '波长 (nm)' } },
    { id: 'grating_coupler', label: '光栅耦合器', labelEn: 'Grating Coupler', icon: '📶', defaultParams: { period: 0.63, n_periods: 20, etch_depth: 70, fiber_angle: 10 }, paramLabels: { period: '周期 (μm)', n_periods: '周期数', etch_depth: '刻蚀深度 (nm)', fiber_angle: '光纤角度 (°)' } },
    { id: 'directional_coupler', label: '定向耦合器', labelEn: 'Directional Coupler', icon: '🔀', defaultParams: { gap: 0.2, length: 10, width: 0.5 }, paramLabels: { gap: '间隙 (μm)', length: '耦合长 (μm)', width: '宽度 (μm)' } },
    { id: 'spiral_delay', label: '螺旋延迟线', labelEn: 'Spiral Delay Line', icon: '🌀', defaultParams: { total_length: 10000, radius: 50, n_turns: 20 }, paramLabels: { total_length: '总长 (μm)', radius: '最小半径 (μm)', n_turns: '圈数' } },
    { id: 'edge_coupler', label: '边缘耦合器 (SSC)', labelEn: 'Edge Coupler (SSC)', icon: '➡️', defaultParams: { taper_length: 300, tip_width: 0.1, end_width: 0.5 }, paramLabels: { taper_length: '锥长 (μm)', tip_width: '尖端宽 (μm)', end_width: '末端宽 (μm)' } },
  ]

  const engines = [
    { id: 'FDTD', label: 'FDTD', desc: lang === 'zh' ? '时域有限差分 · 全波仿真' : 'Finite-Difference Time-Domain', time: '15-60 min', gpu: 'A100 × 1', mesh: '2-5M cells', accuracy: '最高' },
    { id: 'EME', label: 'EME', desc: lang === 'zh' ? '本征模展开 · 适合长结构' : 'Eigenmode Expansion', time: '2-10 min', gpu: 'CPU × 8', mesh: '100K modes', accuracy: '高' },
    { id: 'BPM', label: 'BPM', desc: lang === 'zh' ? '光束传播法 · 弱导波' : 'Beam Propagation Method', time: '1-5 min', gpu: 'CPU × 4', mesh: '500K grid', accuracy: '中' },
    { id: 'CHARGE+FDTD', label: 'CHARGE+FDTD', desc: lang === 'zh' ? '电光耦合 · 载流子+光场' : 'Electrical-Optical Coupling', time: '30-120 min', gpu: 'A100 × 2', mesh: '5-10M cells', accuracy: '最高' },
    { id: 'HEAT+MODE', label: 'HEAT+MODE', desc: lang === 'zh' ? '热光耦合 · 热场+模式' : 'Thermo-Optic Coupling', time: '5-20 min', gpu: 'CPU × 8', mesh: '1M elements', accuracy: '高' },
  ]

  const pdks = [
    { id: 'CUMEC-SiPh180', label: 'CUMEC SOI 180nm' },
    { id: 'SiOPT-SiN800', label: 'SiOPT SiN 800nm' },
    { id: 'PH18-CN', label: '绍兴中芯 PH18' },
    { id: 'LNOI-Photonics', label: 'LNOI 铌酸锂' },
    { id: 'InP-EPI', label: 'InP 有源' },
    { id: 'custom', label: lang === 'zh' ? '自定义参数' : 'Custom' },
  ]

  const selectedComp = components.find((c) => c.id === component)
  const selectedEngine = engines.find((e) => e.id === engine)

  useEffect(() => {
    if (selectedComp) setParams({ ...selectedComp.defaultParams })
  }, [component])

  const estimatedTime = selectedEngine?.time || '10-30 min'
  const estimatedCost = priority === 'high' ? 15 : priority === 'normal' ? 8 : 4
  const meshCells = meshAccuracy <= 2 ? '500K' : meshAccuracy <= 3 ? '2M' : meshAccuracy <= 4 ? '5M' : '10M+'

  const handleFinalSubmit = async () => {
    setSubmitting(true)
    // Simulate API call to backend
    await new Promise((r) => setTimeout(r, 1500))
    onSubmit({ name: name || `${selectedComp?.label} ${engine} 仿真`, component, engine, params, priority })
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setStep(1); setName('') }, 2000)
  }

  // Step 1: Select component + PDK
  if (step === 1) {
    return (
      <div>
        <StepIndicator current={1} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Component selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">{lang === 'zh' ? '选择仿真器件' : 'Select Component'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {components.map((c) => (
                  <button key={c.id} onClick={() => setComponent(c.id)}
                    className={`p-4 rounded-xl text-center transition-all ${component === c.id ? 'bg-indigo-50 border-2 border-indigo-400 shadow-md' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <p className="text-xs font-medium text-gray-900">{lang === 'zh' ? c.label : c.labelEn}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* PDK Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '选择工艺 PDK' : 'Select PDK'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {pdks.map((p) => (
                  <button key={p.id} onClick={() => setPdk(p.id)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pdk === p.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GDS Upload (optional) */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '上传 GDS（可选）' : 'Upload GDS (Optional)'}</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">{lang === 'zh' ? '上传器件 GDS 文件，自动提取结构参数' : 'Upload device GDS for automatic parameter extraction'}</p>
                <input type="file" accept=".gds,.gds2" onChange={(e) => setGdsFile(e.target.files?.[0]?.name || null)} className="text-xs" />
                {gdsFile && <p className="text-xs text-green-600 mt-2">✓ {gdsFile}</p>}
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{lang === 'zh' ? '器件预览' : 'Preview'}</h4>
              <GDSPreview component={component} params={params} height={180} />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{lang === 'zh' ? '已选配置' : 'Selected'}</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '器件' : 'Component'}</span><span className="font-medium">{selectedComp?.icon} {lang === 'zh' ? selectedComp?.label : selectedComp?.labelEn}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">PDK</span><span className="font-medium">{pdk}</span></div>
                {gdsFile && <div className="flex justify-between"><span className="text-gray-500">GDS</span><span className="font-medium text-green-600">{gdsFile}</span></div>}
              </div>
            </div>
            <button onClick={() => setStep(2)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              {lang === 'zh' ? '下一步：配置参数 →' : 'Next: Configure Parameters →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Configure parameters + engine
  if (step === 2) {
    return (
      <div>
        <StepIndicator current={2} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Device parameters */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">{lang === 'zh' ? '器件参数' : 'Device Parameters'}</h3>
            <div className="space-y-4">
              {Object.entries(params).map(([key, val]) => (
                <div key={key}>
                  <label className="text-xs text-gray-600 block mb-1">{selectedComp?.paramLabels[key] || key}</label>
                  <input type="number" value={val} onChange={(e) => setParams({ ...params, [key]: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" step="any" />
                </div>
              ))}
            </div>
          </div>

          {/* Engine + Mesh */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '仿真引擎' : 'Simulation Engine'}</h3>
              <div className="space-y-2">
                {engines.map((e) => (
                  <label key={e.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${engine === e.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name="engine" value={e.id} checked={engine === e.id} onChange={() => setEngine(e.id)} className="accent-indigo-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{e.label}</p>
                      <p className="text-xs text-gray-500">{e.desc}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-400">
                        <span>⏱ {e.time}</span>
                        <span>💻 {e.gpu}</span>
                        <span>🎯 {e.accuracy}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '网格精度' : 'Mesh Accuracy'}</h3>
              <input type="range" min={1} max={5} value={meshAccuracy} onChange={(e) => setMeshAccuracy(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{lang === 'zh' ? '粗糙(快)' : 'Coarse'}</span>
                <span>{lang === 'zh' ? '精细(慢)' : 'Fine'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">{lang === 'zh' ? '网格规模' : 'Mesh size'}: ~{meshCells}</p>
            </div>
          </div>

          {/* Frequency + Priority */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '频率设置' : 'Frequency Settings'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">{lang === 'zh' ? '起始频率 (GHz)' : 'Start (GHz)'}</label>
                  <input type="number" value={freqStart} onChange={(e) => setFreqStart(Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{lang === 'zh' ? '终止频率 (GHz)' : 'End (GHz)'}</label>
                  <input type="number" value={freqEnd} onChange={(e) => setFreqEnd(Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{lang === 'zh' ? '频率点数' : 'Points'}</label>
                  <input type="number" value={freqPoints} onChange={(e) => setFreqPoints(Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '优先级' : 'Priority'}</h3>
              <div className="space-y-2">
                {(['low', 'normal', 'high'] as const).map((p) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium text-left px-4 ${priority === p ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    {p === 'low' ? (lang === 'zh' ? '🐢 低优先 — 排队等待' : '🐢 Low — Queued') : p === 'normal' ? (lang === 'zh' ? '⚡ 普通 — 标准调度' : '⚡ Normal — Standard') : (lang === 'zh' ? '🚀 高优先 — 立即执行' : '🚀 High — Immediate')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200">
                ← {lang === 'zh' ? '上一步' : 'Back'}
              </button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                {lang === 'zh' ? '确认提交 →' : 'Confirm →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Review and submit
  return (
    <div>
      <StepIndicator current={3} />
      <div className="max-w-2xl mx-auto mt-6">
        {submitted ? (
          <div className="bg-white rounded-xl shadow-md p-8 border border-green-200 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{lang === 'zh' ? '🎉 作业已提交！' : '🎉 Job Submitted!'}</h3>
            <p className="text-gray-500">{lang === 'zh' ? '您可以在作业列表中查看进度' : 'Track progress in the Jobs tab'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">{lang === 'zh' ? '确认仿真配置' : 'Confirm Simulation'}</h3>

            {/* Job Name */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-1">{lang === 'zh' ? '作业名称' : 'Job Name'}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={`${selectedComp?.label} ${engine} 仿真`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '器件' : 'Component'}</span><span className="font-medium">{selectedComp?.icon} {selectedComp?.label}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PDK</span><span className="font-medium">{pdk}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '仿真引擎' : 'Engine'}</span><span className="font-medium">{engine}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '网格精度' : 'Mesh'}</span><span className="font-medium">{meshCells}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '频率范围' : 'Freq Range'}</span><span className="font-medium">{freqStart}-{freqEnd} GHz ({freqPoints} pts)</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{lang === 'zh' ? '优先级' : 'Priority'}</span><span className="font-medium">{priority === 'high' ? '🚀 高' : priority === 'normal' ? '⚡ 普通' : '🐢 低'}</span></div>
              {gdsFile && <div className="flex justify-between"><span className="text-gray-500">GDS</span><span className="font-medium text-green-600">{gdsFile}</span></div>}
            </div>

            {/* Parameters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">{lang === 'zh' ? '器件参数' : 'Parameters'}</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(params).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs"><span className="text-gray-500 font-mono">{k}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
            </div>

            {/* Cost estimate */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-indigo-800">{lang === 'zh' ? '预估资源消耗' : 'Estimated Resources'}</p>
                  <p className="text-xs text-indigo-600 mt-1">GPU: {selectedEngine?.gpu} · {lang === 'zh' ? '预估时间' : 'Time'}: {estimatedTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-700">¥{estimatedCost}</p>
                  <p className="text-xs text-indigo-500">{lang === 'zh' ? '预估费用' : 'est. cost'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200">
                ← {lang === 'zh' ? '返回修改' : 'Back'}
              </button>
              <button onClick={handleFinalSubmit} disabled={submitting}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <><RefreshCw className="h-4 w-4 animate-spin" /> {lang === 'zh' ? '提交中...' : 'Submitting...'}</> : <><Play className="h-4 w-4" /> {lang === 'zh' ? '提交仿真作业' : 'Submit Job'}</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  const { lang } = useI18n()
  const steps = lang === 'zh'
    ? ['选择器件 & PDK', '配置参数 & 引擎', '确认提交']
    : ['Select Component', 'Configure', 'Submit']
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= current ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
          <span className={`text-xs font-medium ${i + 1 <= current ? 'text-indigo-700' : 'text-gray-400'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i + 1 < current ? 'bg-indigo-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

// ===================================================================
// Jobs Panel
// ===================================================================

function JobsPanel({ jobs, onSelect, onDelete, selectedId }: { jobs: SimJob[]; onSelect: (id: string) => void; onDelete: (id: string) => void; selectedId: string | null }) {
  const { lang } = useI18n()
  const statusConfig = {
    queued: { label: lang === 'zh' ? '排队中' : 'Queued', color: 'bg-blue-50 text-blue-700', icon: Clock },
    running: { label: lang === 'zh' ? '运行中' : 'Running', color: 'bg-orange-50 text-orange-700', icon: RefreshCw },
    completed: { label: lang === 'zh' ? '已完成' : 'Completed', color: 'bg-green-50 text-green-700', icon: CheckCircle },
    failed: { label: lang === 'zh' ? '失败' : 'Failed', color: 'bg-red-50 text-red-700', icon: AlertCircle },
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const sc = statusConfig[job.status]
        return (
          <div key={job.id} className={`bg-white rounded-xl shadow-md p-4 border transition-all cursor-pointer ${selectedId === job.id ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-100 hover:border-gray-300'}`}
            onClick={() => onSelect(job.id)}>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{job.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}>{sc.label}</span>
                  {job.priority === 'high' && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">⚡ Rush</span>}
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>🔧 {job.engine}</span>
                  <span>📐 {job.component}</span>
                  <span>⏱️ {new Date(job.submittedAt).toLocaleTimeString()}</span>
                  <span>💻 {job.coreHours.toFixed(1)} core·h</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.status === 'completed' && (
                  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="View result"><Eye className="h-4 w-4" /></button>
                )}
                <button onClick={(e) => { e.stopPropagation(); onDelete(job.id) }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {/* Progress bar */}
            {(job.status === 'running' || job.status === 'queued') && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{job.status === 'queued' ? (lang === 'zh' ? '等待分配资源...' : 'Waiting for resources...') : (lang === 'zh' ? '仿真进行中...' : 'Simulating...')}</span>
                  <span>{job.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${job.status === 'running' ? 'bg-orange-500' : 'bg-blue-300'}`}
                    style={{ width: `${job.progress}%` }} />
                </div>
              </div>
            )}
          </div>
        )
      })}
      {jobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Cloud className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{lang === 'zh' ? '暂无仿真作业，点击"提交作业"开始' : 'No jobs yet. Click "Submit Job" to start'}</p>
        </div>
      )}
    </div>
  )
}

// ===================================================================
// Results Panel
// ===================================================================

function exportPDF(job: SimJob) {
  // Generate a professional simulation report as a downloadable text file (browser PDF generation would need a library like jsPDF)
  const report = `
╔══════════════════════════════════════════════════════════╗
║        光芯云 PhotonCloud 仿真报告                         ║
║        Simulation Report                                ║
╚══════════════════════════════════════════════════════════╝

作业名称 (Job Name): ${job.name}
作业 ID (Job ID): ${job.id}
提交时间 (Submitted): ${job.submittedAt}
完成时间 (Completed): ${job.completedAt}
仿真引擎 (Engine): ${job.engine}
器件类型 (Component): ${job.component}
算力消耗 (Core Hours): ${job.coreHours.toFixed(2)} h
优先级 (Priority): ${job.priority}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
器件参数 (Device Parameters)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(job.params).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
仿真结果 (Results)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${job.result?.metrics.map((m) => `  ${m.label}: ${m.value}`).join('\n') || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
运行日志 (Log)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${job.result?.logPreview || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S 参数数据 (前 10 点)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Freq(GHz)  S21(dB)   S11(dB)
${job.result?.sparamData.slice(0, 10).map((p) => `${p.freq.toFixed(2).padStart(8)}  ${p.S21.toFixed(2).padStart(8)}  ${p.S11.toFixed(2).padStart(8)}`).join('\n') || 'N/A'}
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 光芯云 PhotonCloud
国产光芯片设计第一云平台
https://photoncloud.cn
`
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `PhotonCloud_Report_${job.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function ResultsPanel({ job, jobs, onSelect }: { job: SimJob | undefined; jobs: SimJob[]; onSelect: (id: string) => void }) {
  const { lang } = useI18n()
  const completedJobs = jobs.filter((j) => j.status === 'completed')

  if (!job || !job.result) {
    return (
      <div>
        {completedJobs.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">{lang === 'zh' ? '选择一个已完成的作业查看结果：' : 'Select a completed job to view results:'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedJobs.map((j) => (
                <button key={j.id} onClick={() => onSelect(j.id)}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 text-left hover:border-indigo-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 text-sm">{j.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">✓ {new Date(j.completedAt!).toLocaleString()} · {j.coreHours.toFixed(1)} core·h</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{lang === 'zh' ? '暂无已完成的仿真结果' : 'No completed results yet'}</p>
          </div>
        )}
      </div>
    )
  }

  const { result } = job

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{job.name}</h3>
            <p className="text-xs text-gray-500">{job.engine} · {job.component} · {job.coreHours.toFixed(1)} core·h</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> {lang === 'zh' ? '导出 .s2p' : 'Export .s2p'}
            </button>
            <button onClick={() => exportPDF(job)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> {lang === 'zh' ? '导出报告 PDF' : 'Export PDF Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {result.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-xl shadow-md p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-lg font-bold text-indigo-700 mt-1">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* S-Parameter Chart */}
      {result.sparamData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">{lang === 'zh' ? 'S 参数频率响应' : 'S-Parameter Frequency Response'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.sparamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="freq" label={{ value: 'Frequency (GHz)', position: 'bottom', offset: -5 }} tick={{ fontSize: 10 }} />
              <YAxis label={{ value: 'Magnitude (dB)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="S21" stroke="#3b82f6" dot={false} strokeWidth={2} name="|S21| (dB)" />
              <Line type="monotone" dataKey="S11" stroke="#ef4444" dot={false} strokeWidth={2} name="|S11| (dB)" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log */}
      {result.logPreview && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">{lang === 'zh' ? '运行日志' : 'Job Log'}</h3>
          <pre className="p-4 bg-gray-900 rounded-lg text-xs text-green-400 font-mono overflow-auto max-h-48 whitespace-pre-wrap">{result.logPreview}</pre>
        </div>
      )}
    </div>
  )
}

// ===================================================================
// Helpers
// ===================================================================

function StatCard({ icon: Icon, label, value, color, bg }: { icon: typeof Clock; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function generateMockResult(component: string): SimResult {
  const data = Array.from({ length: 80 }, (_, i) => {
    const f = 1 + i * 0.83
    let s21 = -3, s11 = -15
    if (component.includes('ring')) {
      const fsr = 12; const resonance = Math.sin(Math.PI * f / fsr) ** 2
      s21 = 10 * Math.log10(Math.max(0.001, resonance)); s11 = -20
    } else {
      const bw = 35; const rolloff = 1 / Math.sqrt(1 + (f / bw) ** 4)
      s21 = -3 + 20 * Math.log10(rolloff); s11 = -15 + 3 * Math.log10(1 + (f / bw) ** 2)
    }
    return { freq: parseFloat(f.toFixed(2)), S21: parseFloat(s21.toFixed(2)), S11: parseFloat(s11.toFixed(2)), S21_phase: parseFloat((-f * 6).toFixed(1)), S11_phase: parseFloat((90 + f * 0.5).toFixed(1)) }
  })
  return {
    sparamData: data,
    metrics: [{ label: '3dB BW', value: `${(30 + Math.random() * 20).toFixed(1)} GHz` }, { label: 'IL', value: `${(2 + Math.random() * 2).toFixed(1)} dB` }, { label: 'ER', value: `${(20 + Math.random() * 10).toFixed(0)} dB` }],
    logPreview: `[${new Date().toLocaleTimeString()}] Job completed successfully.\nMesh: 1.8M cells | GPU: A100 | Time: ${(5 + Math.random() * 20).toFixed(0)} min`,
  }
}


// ===================================================================
// Templates Panel - 预设案例一键加载
// ===================================================================
function TemplatesPanel({ onSubmit }: { onSubmit: (job: any) => void }) {
  const { lang } = useI18n()
  const zh = lang === 'zh'

  const templates = [
    { id: 't1', name: zh ? '400G DR4 EML 链路仿真' : '400G DR4 EML Link', icon: '📡', category: zh ? '数据中心' : 'Datacom', engine: 'FDTD', component: 'mzi_modulator', params: { arm_length: 2.5, vpi_l: 2.5, width: 0.5, wavelength: 1310 }, desc: zh ? '53Gbaud PAM4 × 4λ, 10km SMF, 含色散和损耗' : '53Gbaud PAM4 × 4λ, 10km SMF with dispersion' },
    { id: 't2', name: zh ? '800G ZR 相干 MZI 调制器' : '800G ZR Coherent MZM', icon: '⚡', category: zh ? '相干光通信' : 'Coherent', engine: 'FDTD', component: 'mzi_modulator', params: { arm_length: 4.0, vpi_l: 2.0, width: 0.5, wavelength: 1550 }, desc: zh ? 'DP-16QAM @ 96Gbaud, 硅光 MZI IQ 调制器' : 'DP-16QAM @96Gbaud SiPh MZI IQ Modulator' },
    { id: 't3', name: zh ? 'CPO 光引擎功耗分析' : 'CPO Optical Engine Power', icon: '🔌', category: 'CPO', engine: 'HEAT+MODE', component: 'mzi_modulator', params: { arm_length: 1.5, vpi_l: 1.8, width: 0.5, wavelength: 1310 }, desc: zh ? '51.2T 交换机光引擎, SerDes+Driver+Modulator+PD 全链路' : '51.2T switch optical engine full link analysis' },
    { id: 't4', name: zh ? '微环 WDM 8 通道滤波器' : 'Microring WDM 8ch Filter', icon: '🔵', category: 'WDM', engine: 'EME', component: 'ring_filter', params: { radius: 12, gap: 0.18, coupling_length: 6, n_eff: 2.45 }, desc: zh ? '200GHz 间隔 DWDM, 级联 8 环, 通道隔离 >25dB' : '200GHz DWDM, 8 cascaded rings, >25dB isolation' },
    { id: 't5', name: zh ? 'TFLN 110GHz IQ 调制器' : 'TFLN 110GHz IQ Modulator', icon: '💎', category: 'TFLN', engine: 'FDTD', component: 'tfln_iq', params: { length: 20, electrode_gap: 5, ln_thickness: 0.6, vpi_target: 1.2 }, desc: zh ? '1.6T 相干模块用 TFLN, Vπ<1.5V, BW>110GHz' : '1.6T coherent TFLN, Vπ<1.5V, BW>110GHz' },
    { id: 't6', name: zh ? 'Ge-PD 50GHz 频率响应' : 'Ge-PD 50GHz Response', icon: '📡', category: zh ? '探测器' : 'Detector', engine: 'CHARGE+FDTD', component: 'ge_pd', params: { ge_length: 20, ge_width: 6, bias: -2, wavelength: 1310 }, desc: zh ? '波导耦合 Ge PIN-PD, 目标 >50GHz, <10nA 暗电流' : 'Waveguide Ge PIN-PD, target >50GHz, <10nA dark' },
    { id: 't7', name: zh ? '边缘耦合器优化 (SSC)' : 'Edge Coupler Optimization', icon: '➡️', category: zh ? '封装' : 'Packaging', engine: 'EME', component: 'edge_coupler', params: { taper_length: 300, tip_width: 0.08, end_width: 0.5 }, desc: zh ? '倒锥 SSC, 目标耦合损耗 <1.5dB, 匹配 SMF-28' : 'Inverse taper SSC, target <1.5dB coupling to SMF' },
    { id: 't8', name: zh ? '热调谐微环波长锁定' : 'Thermal Tuning Ring Lock', icon: '🌡️', category: zh ? '热调谐' : 'Thermal', engine: 'HEAT+MODE', component: 'ring_filter', params: { radius: 8, gap: 0.2, coupling_length: 4, n_eff: 2.45 }, desc: zh ? 'TiN heater 微环调谐, 目标 Pπ<20mW, τ<5μs' : 'TiN heater ring tuning, Pπ<20mW, τ<5μs' },
    { id: 't9', name: zh ? '光栅耦合器 C-band 优化' : 'Grating Coupler C-band', icon: '📶', category: zh ? '耦合' : 'Coupling', engine: 'FDTD', component: 'grating_coupler', params: { period: 0.63, n_periods: 25, etch_depth: 70, fiber_angle: 10 }, desc: zh ? '椭圆光栅, C-band 中心, 目标 <2dB 耦合损耗' : 'Elliptical grating, C-band center, target <2dB' },
    { id: 't10', name: zh ? 'SiN 螺旋延迟线 10ns' : 'SiN Spiral 10ns Delay', icon: '🌀', category: zh ? '微波光子' : 'MWP', engine: 'BPM', component: 'spiral_delay', params: { total_length: 20000, radius: 80, n_turns: 30 }, desc: zh ? 'SiN 低损耗螺旋, 10ns 延迟, 用于微波光子链路' : 'SiN low-loss spiral, 10ns delay for MWP' },
    { id: 't11', name: zh ? '定向耦合器 3dB 设计' : '3dB Directional Coupler', icon: '🔀', category: zh ? '无源' : 'Passive', engine: 'EME', component: 'directional_coupler', params: { gap: 0.2, length: 12, width: 0.5 }, desc: zh ? '50:50 分光, 宽带 >80nm, MZI 用分束器' : '50:50 split, >80nm bandwidth for MZI' },
    { id: 't12', name: zh ? 'LiDAR OPA 相控阵' : 'LiDAR OPA Phased Array', icon: '🚗', category: 'LiDAR', engine: 'FDTD', component: 'grating_coupler', params: { period: 0.58, n_periods: 30, etch_depth: 50, fiber_angle: 0 }, desc: zh ? '1550nm OPA 发射天线, 0° 出射, ±60° 扫描' : '1550nm OPA emitter, 0° emission, ±60° scan' },
  ]

  const categories = [...new Set(templates.map((t) => t.category))]

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">{zh ? '应用案例模板' : 'Application Templates'}</h3>
        <p className="text-sm text-gray-500">{zh ? '选择预设案例，一键加载参数并提交仿真' : 'Select a template to load parameters and submit instantly'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t.category}</span>
              <span className="text-xs text-gray-400 ml-auto">{t.engine}</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{t.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{t.desc}</p>
            <button onClick={() => onSubmit({ name: t.name, component: t.component, engine: t.engine, params: t.params, priority: 'normal' })}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 flex items-center justify-center gap-1">
              <Play className="h-3 w-3" /> {zh ? '一键提交仿真' : 'Submit Simulation'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===================================================================
// Cluster Panel - 实时集群看板
// ===================================================================
function ClusterPanel() {
  const { lang } = useI18n()
  const zh = lang === 'zh'

  const nodes = [
    { id: 'gpu-cn-east-01', type: 'A100 80GB', status: 'busy', utilization: 92, jobs: 3, temp: 72 },
    { id: 'gpu-cn-east-02', type: 'A100 80GB', status: 'busy', utilization: 78, jobs: 2, temp: 68 },
    { id: 'gpu-cn-east-03', type: 'A100 80GB', status: 'idle', utilization: 5, jobs: 0, temp: 42 },
    { id: 'gpu-cn-east-04', type: 'H100 80GB', status: 'busy', utilization: 95, jobs: 4, temp: 75 },
    { id: 'gpu-cn-east-05', type: 'H100 80GB', status: 'busy', utilization: 88, jobs: 3, temp: 71 },
    { id: 'gpu-cn-east-06', type: 'H100 80GB', status: 'maintenance', utilization: 0, jobs: 0, temp: 30 },
    { id: 'cpu-cn-east-01', type: 'AMD EPYC 64C', status: 'busy', utilization: 65, jobs: 8, temp: 55 },
    { id: 'cpu-cn-east-02', type: 'AMD EPYC 64C', status: 'idle', utilization: 12, jobs: 1, temp: 40 },
  ]

  const totalGPU = nodes.filter((n) => n.type.includes('100')).length
  const busyGPU = nodes.filter((n) => n.type.includes('100') && n.status === 'busy').length
  const avgUtil = Math.round(nodes.filter((n) => n.status === 'busy').reduce((s, n) => s + n.utilization, 0) / Math.max(1, nodes.filter((n) => n.status === 'busy').length))
  const queueDepth = 7
  const avgWait = 4.2

  return (
    <div>
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center"><p className="text-2xl font-bold text-indigo-600">{nodes.length}</p><p className="text-xs text-gray-500">{zh ? '计算节点' : 'Nodes'}</p></div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center"><p className="text-2xl font-bold text-green-600">{busyGPU}/{totalGPU}</p><p className="text-xs text-gray-500">{zh ? 'GPU 活跃/总数' : 'GPU Active'}</p></div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center"><p className="text-2xl font-bold text-orange-600">{avgUtil}%</p><p className="text-xs text-gray-500">{zh ? '平均利用率' : 'Avg Utilization'}</p></div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center"><p className="text-2xl font-bold text-blue-600">{queueDepth}</p><p className="text-xs text-gray-500">{zh ? '队列深度' : 'Queue Depth'}</p></div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center"><p className="text-2xl font-bold text-purple-600">{avgWait}min</p><p className="text-xs text-gray-500">{zh ? '平均等待时间' : 'Avg Wait Time'}</p></div>
      </div>

      {/* Node List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{zh ? '节点状态' : 'Node Status'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {nodes.map((node) => (
            <div key={node.id} className={`p-4 rounded-lg border ${node.status === 'busy' ? 'border-orange-200 bg-orange-50' : node.status === 'idle' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-600">{node.id.split('-').slice(-1)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${node.status === 'busy' ? 'bg-orange-200 text-orange-800' : node.status === 'idle' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {node.status}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-900 mb-2">{node.type}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div className={`h-full rounded-full ${node.utilization > 80 ? 'bg-red-500' : node.utilization > 50 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${node.utilization}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{node.utilization}% util</span>
                <span>{node.jobs} jobs</span>
                <span>{node.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Benchmark Panel - 精度对标
// ===================================================================
function BenchmarkPanel() {
  const { lang } = useI18n()
  const zh = lang === 'zh'

  const benchmarks = [
    { component: 'MZI Modulator', metric: 'S21 @ 40GHz', photonCloud: -4.2, lumerical: -4.1, comsol: -4.3, error: 2.4 },
    { component: 'MZI Modulator', metric: 'Vπ (V)', photonCloud: 4.85, lumerical: 4.80, comsol: 4.92, error: 1.0 },
    { component: 'Ring Resonator', metric: 'Q factor (×10³)', photonCloud: 52.3, lumerical: 53.1, comsol: 51.8, error: 1.5 },
    { component: 'Ring Resonator', metric: 'FSR (nm)', photonCloud: 12.45, lumerical: 12.48, comsol: 12.42, error: 0.2 },
    { component: 'Grating Coupler', metric: zh ? '峰值效率 (%)' : 'Peak Eff (%)', photonCloud: 62.5, lumerical: 63.1, comsol: 61.8, error: 1.0 },
    { component: 'Grating Coupler', metric: '3dB BW (nm)', photonCloud: 38.2, lumerical: 39.0, comsol: 37.5, error: 2.1 },
    { component: 'Ge-PD', metric: zh ? '响应度 (A/W)' : 'Responsivity', photonCloud: 0.85, lumerical: 0.87, comsol: 0.84, error: 2.3 },
    { component: 'Ge-PD', metric: '3dB BW (GHz)', photonCloud: 48.5, lumerical: 49.2, comsol: 47.8, error: 1.4 },
    { component: 'TFLN MZM', metric: 'Vπ·L (V·cm)', photonCloud: 1.95, lumerical: 1.92, comsol: 1.98, error: 1.6 },
    { component: 'TFLN MZM', metric: 'EO BW (GHz)', photonCloud: 112, lumerical: 115, comsol: 110, error: 2.6 },
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">{zh ? '仿真精度对标' : 'Simulation Accuracy Benchmark'}</h3>
        <p className="text-sm text-gray-500">{zh ? '光芯云仿真结果与 Lumerical FDTD / COMSOL Multiphysics 的对比验证' : 'PhotonCloud results vs Lumerical FDTD / COMSOL Multiphysics'}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-5 border border-green-200 text-center">
          <p className="text-3xl font-bold text-green-700">&lt;3%</p>
          <p className="text-sm text-green-600">{zh ? '平均误差 vs Lumerical' : 'Avg Error vs Lumerical'}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 text-center">
          <p className="text-3xl font-bold text-blue-700">10×</p>
          <p className="text-sm text-blue-600">{zh ? '速度提升 (GPU 加速)' : 'Speed Improvement (GPU)'}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 text-center">
          <p className="text-3xl font-bold text-purple-700">1/5</p>
          <p className="text-sm text-purple-600">{zh ? '成本 (vs 商业软件 license)' : 'Cost (vs commercial license)'}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left font-medium text-gray-600">{zh ? '器件' : 'Component'}</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">{zh ? '指标' : 'Metric'}</th>
              <th className="py-2 px-3 text-right font-medium text-indigo-600">☁️ {zh ? '光芯云' : 'PhotonCloud'}</th>
              <th className="py-2 px-3 text-right font-medium text-gray-600">Lumerical</th>
              <th className="py-2 px-3 text-right font-medium text-gray-600">COMSOL</th>
              <th className="py-2 px-3 text-right font-medium text-gray-600">{zh ? '误差' : 'Error'}</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b, i) => (
              <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                <td className="py-2.5 px-3 font-medium text-gray-800">{b.component}</td>
                <td className="py-2.5 px-3 text-gray-600">{b.metric}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-indigo-700">{b.photonCloud}</td>
                <td className="py-2.5 px-3 text-right text-gray-600">{b.lumerical}</td>
                <td className="py-2.5 px-3 text-right text-gray-600">{b.comsol}</td>
                <td className="py-2.5 px-3 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${b.error < 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.error}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
        <p><strong>{zh ? '测试条件：' : 'Test conditions: '}</strong>{zh ? '所有仿真使用相同几何参数和材料模型。Lumerical FDTD Solutions 2025.R1, COMSOL 6.2。光芯云使用 FDTD 引擎 + A100 GPU。' : 'Same geometry & material models. Lumerical 2025.R1, COMSOL 6.2. PhotonCloud FDTD engine + A100 GPU.'}</p>
      </div>
    </div>
  )
}
