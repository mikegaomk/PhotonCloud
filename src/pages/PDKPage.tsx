import { useState } from 'react'
import { Building2, Cpu, Layers, FileText, ExternalLink, CheckCircle, AlertCircle, Search, Upload, GitBranch, Shield, Zap, Settings, Lock, Eye, EyeOff, Plus, RefreshCw, Download, Clock, ChevronRight } from 'lucide-react'

interface Foundry {
  id: string
  name: string
  fullName: string
  location: string
  logo: string
  website: string
  description: string
  platforms: Platform[]
  capabilities: string[]
  certifications: string[]
  contact: string
  status: 'active' | 'beta' | 'planned'
}

interface Platform {
  name: string
  node: string
  waveguideType: string
  features: string[]
  specs: { label: string; value: string }[]
  pdkStatus: 'released' | 'beta' | 'development'
  edaTools: string[]
}

const foundries: Foundry[] = [
  {
    id: 'siopt',
    name: '上海微系统所 (SiOPT)',
    fullName: '中国科学院上海微系统与信息技术研究所',
    location: '上海',
    logo: '🔬',
    website: 'http://www.sim.cas.cn',
    description: '国内最早建立硅光工艺线的科研机构，提供 SOI 硅光和 SiN 低损耗两个平台，面向科研和产业用户开放 MPW 流片。',
    platforms: [
      {
        name: 'SiOPT-Si220',
        node: '180nm SOI',
        waveguideType: 'Si 条形/脊形 (220nm)',
        features: ['PN/PIN 调制器', 'Ge PD', '热调谐器', 'MMI/Y分支', '光栅耦合器', '边缘耦合器'],
        specs: [
          { label: '波导损耗', value: '<2 dB/cm' },
          { label: 'PD 带宽', value: '>40 GHz' },
          { label: '调制效率 VπL', value: '~2.5 V·cm' },
          { label: '光栅耦合损耗', value: '<3 dB' },
        ],
        pdkStatus: 'released',
        edaTools: ['Lumerical', 'IPKISS', 'Synopsys OptoDesigner'],
      },
      {
        name: 'SiOPT-SiN800',
        node: 'SiN (800nm core)',
        waveguideType: 'Si₃N₄ 低损耗 (800nm)',
        features: ['超低损耗波导', '微环谐振器', 'AWG', 'MZI', '耦合器', '延迟线'],
        specs: [
          { label: '波导损耗', value: '<0.1 dB/cm' },
          { label: '弯曲半径', value: '>50 μm' },
          { label: '微环 Q 值', value: '>10⁶' },
          { label: 'FSR 可选', value: '自由设计' },
        ],
        pdkStatus: 'released',
        edaTools: ['Lumerical', 'IPKISS'],
      },
    ],
    capabilities: ['MPW 多项目晶圆', '全定制流片', '封装测试', '可靠性验证', '混合集成'],
    certifications: ['ISO 9001', '国家重点实验室'],
    contact: 'pdk@sim.cas.cn',
    status: 'active',
  },
  {
    id: 'cumec',
    name: '联合微电子 (CUMEC)',
    fullName: '重庆联合微电子中心有限责任公司',
    location: '重庆',
    logo: '🏭',
    website: 'http://www.cumec.cn',
    description: '国内首个面向产业化的硅光代工平台，具备 8 英寸 SOI 晶圆产线，提供从设计到封装的一站式服务。已服务 100+ 国内外客户。',
    platforms: [
      {
        name: 'CUMEC-SiPh180',
        node: '180nm SOI',
        waveguideType: 'Si (220nm) + SiN (双层)',
        features: ['高速 PN 调制器 (50G+)', 'Ge PD (>50 GHz)', '热调谐 MRR', 'SiN 低损耗层', '3D 波导交叉', 'Edge/Grating Coupler'],
        specs: [
          { label: '波导损耗', value: '<1.5 dB/cm' },
          { label: 'Ge-PD 响应度', value: '>0.8 A/W' },
          { label: '调制器带宽', value: '>50 GHz' },
          { label: '热调谐效率', value: '~25 mW/π' },
        ],
        pdkStatus: 'released',
        edaTools: ['Synopsys OptoDesigner', 'Lumerical INTERCONNECT', 'IPKISS', 'KLayout'],
      },
      {
        name: 'CUMEC-SiN400',
        node: 'SiN (400nm core)',
        waveguideType: 'Si₃N₄ 中等限制 (400nm)',
        features: ['低损耗波导', 'AWG MUX/DEMUX', 'MZI 开关', '模斑转换器', '微环滤波器'],
        specs: [
          { label: '波导损耗', value: '<0.5 dB/cm' },
          { label: 'AWG 通道隔离', value: '>25 dB' },
          { label: '弯曲半径', value: '>100 μm' },
          { label: '耦合损耗', value: '<1.5 dB' },
        ],
        pdkStatus: 'released',
        edaTools: ['Lumerical', 'IPKISS'],
      },
    ],
    capabilities: ['8 英寸产线', 'MPW 流片', '全定制量产', '晶圆级测试', '混合集成封装', 'CoWoS 转接板'],
    certifications: ['ISO 9001', 'IATF 16949', '国家集成电路产业基金投资'],
    contact: 'foundry@cumec.cn',
    status: 'active',
  },
  {
    id: 'simit-ciomp',
    name: '长光辰芯 / 微纳中心',
    fullName: '中国科学院长春光学精密机械与物理研究所',
    location: '长春/苏州',
    logo: '🔭',
    website: 'http://www.ciomp.cas.cn',
    description: '专注于 InP 和 III-V 族光芯片代工，提供 EML、DFB、SOA、PD 等有源芯片的 MPW 和小批量流片服务。',
    platforms: [
      {
        name: 'InP-EPI',
        node: 'InP MOCVD',
        waveguideType: 'InP 脊波导 (BH/Ridge)',
        features: ['DFB 激光器', 'EAM/EML', 'SOA', 'PIN-PD', 'MQW 外延', '光栅制作'],
        specs: [
          { label: 'EML 带宽', value: '>60 GHz' },
          { label: 'DFB SMSR', value: '>50 dB' },
          { label: 'PD 响应度', value: '>0.9 A/W' },
          { label: '外延均匀性', value: '<±1% (2寸)' },
        ],
        pdkStatus: 'beta',
        edaTools: ['PICWave', 'RSoft', '定制设计'],
      },
    ],
    capabilities: ['MOCVD 外延生长', 'E-beam 光栅', '端面镀膜', '芯片测试分选', '管芯级封装'],
    certifications: ['国家重点研发计划', '军工三级保密'],
    contact: 'info@ciomp.cas.cn',
    status: 'active',
  },
  {
    id: 'zhongke-lnoi',
    name: '济南量子/中科 LNOI',
    fullName: '济南量子技术研究院 / TFLN 代工平台',
    location: '济南/天津',
    logo: '💎',
    website: 'http://www.jqt.sdu.edu.cn',
    description: '国内 TFLN（薄膜铌酸锂）工艺平台，提供 LNOI 晶圆制备、波导刻蚀、电极制作的全流程代工服务。服务量子光子和高速通信两大方向。',
    platforms: [
      {
        name: 'LNOI-Photonics',
        node: 'LNOI (X-cut, 600nm)',
        waveguideType: 'LiNbO₃ 脊波导 (600nm)',
        features: ['MZM 调制器', 'IQ 调制器', '微环谐振器', '周期极化 (PPLN)', '模斑转换器', 'CPW 电极'],
        specs: [
          { label: '波导损耗', value: '<0.1 dB/cm' },
          { label: 'Vπ·L', value: '~2 V·cm' },
          { label: 'EO 带宽', value: '>100 GHz' },
          { label: '消光比', value: '>30 dB' },
        ],
        pdkStatus: 'beta',
        edaTools: ['Lumerical MODE/FDTD', 'COMSOL', '定制设计'],
      },
    ],
    capabilities: ['LNOI 晶圆供应 (3-6 英寸)', 'ICP-RIE 干法刻蚀', '电极光刻', '端面抛光', '光纤阵列对准封装'],
    certifications: ['山东省重点实验室', '国家重大专项支撑'],
    contact: 'lnoi@jqt.sdu.edu.cn',
    status: 'active',
  },
  {
    id: 'tower-cn',
    name: '绍兴中芯 (Tower/SMIC JV)',
    fullName: '绍兴中芯集成电路制造有限公司 (硅光代工)',
    location: '绍兴',
    logo: '⚙️',
    website: 'http://www.smics.com',
    description: '中芯国际绍兴基地引入 Tower Semiconductor 硅光工艺，提供与国际接轨的硅光代工服务。8 英寸 SOI 产线，兼容 Tower PH18 PDK。',
    platforms: [
      {
        name: 'PH18-CN',
        node: '180nm SOI (Tower PH18)',
        waveguideType: 'Si (220nm) + SiN',
        features: ['高速调制器', 'Ge-PD', 'SiN 无源层', '光电混合', 'TiN heater', '多金属层'],
        specs: [
          { label: '波导损耗', value: '<1 dB/cm' },
          { label: '调制器带宽', value: '>67 GHz' },
          { label: 'PD 暗电流', value: '<5 nA' },
          { label: '晶圆口径', value: '8 英寸' },
        ],
        pdkStatus: 'released',
        edaTools: ['Synopsys OptoDesigner', 'Cadence Virtuoso', 'Lumerical', 'IPKISS'],
      },
    ],
    capabilities: ['8 英寸量产线', 'MPW + 量产', 'Tower PDK 兼容', '设计服务 (Turnkey)', '晶圆测试', 'IP 库'],
    certifications: ['ISO 9001', 'Tower Semiconductor 技术授权'],
    contact: 'photonics@smics.com',
    status: 'active',
  },
  {
    id: 'catarc-siph',
    name: '光迅科技 IDM',
    fullName: '武汉光迅科技股份有限公司 (硅光 IDM)',
    location: '武汉',
    logo: '🌐',
    website: 'http://www.accelink.com',
    description: '国内光通信龙头企业，具备从芯片设计到模块的 IDM 能力。硅光产线可支持内部和有限外部流片。',
    platforms: [
      {
        name: 'Accelink-SiPh',
        node: '130nm SOI',
        waveguideType: 'Si (220nm)',
        features: ['相干接收 PIC', 'IQ 调制器', 'VOA', 'Ge-PD', 'AWG', '偏振旋转器'],
        specs: [
          { label: '产品验证', value: '400G ZR 模块量产' },
          { label: '调制器速率', value: '64 Gbaud+' },
          { label: '集成度', value: '相干收发一体' },
          { label: '产能', value: '万片/年级' },
        ],
        pdkStatus: 'released',
        edaTools: ['内部 EDA', 'Lumerical', 'Synopsys'],
      },
    ],
    capabilities: ['IDM (设计+制造+封装+模块)', '400G/800G 相干硅光', '量产能力', '可靠性认证', '有限外部代工'],
    certifications: ['ISO 9001', '电信设备入网许可', '上市公司 (002281)'],
    contact: 'siph@accelink.com',
    status: 'active',
  },
]

const edaToolsList = [
  { name: 'Lumerical (Ansys)', type: '光学仿真', desc: 'FDTD/MODE/INTERCONNECT 全流程光学仿真', compatibility: '全平台' },
  { name: 'Synopsys OptoDesigner', type: 'PIC 版图', desc: '光子集成电路版图设计和验证', compatibility: 'SiPh/SiN' },
  { name: 'IPKISS (Luceda)', type: 'PDK 框架', desc: 'Python 驱动的参数化 PIC 设计框架', compatibility: '全平台' },
  { name: 'KLayout', type: '版图编辑', desc: '开源 GDS 版图编辑器，支持 PDK 插件', compatibility: '全平台' },
  { name: 'Cadence Virtuoso', type: '混合设计', desc: '光电混合 IC 设计，驱动/TIA 电路协同', compatibility: 'SiPh' },
  { name: 'COMSOL Multiphysics', type: '多物理场', desc: '热-光-电-力耦合仿真', compatibility: '全平台' },
  { name: 'RSoft (Synopsys)', type: '器件仿真', desc: 'BPM/FDTD 光波导和光栅仿真', compatibility: 'InP/SiPh' },
  { name: 'PICWave (Photon Design)', type: 'InP 设计', desc: 'III-V 光子集成电路专用设计工具', compatibility: 'InP' },
]

type PDKTab = 'browse' | 'devices' | 'matrix' | 'mpw-calendar' | 'download' | 'gdsfactory' | 'eda' | 'manage' | 'sparam' | 'ip-nda' | 'versions'

export default function PDKPage() {
  const [activeTab, setActiveTab] = useState<PDKTab>('browse')

  const tabs: { key: PDKTab; label: string; icon: typeof Search }[] = [
    { key: 'browse', label: 'Foundry', icon: Search },
    { key: 'devices', label: '器件库', icon: Layers },
    { key: 'matrix', label: '兼容矩阵', icon: CheckCircle },
    { key: 'mpw-calendar', label: 'MPW 日历', icon: Clock },
    { key: 'download', label: '下载/申请', icon: Download },
    { key: 'gdsfactory', label: 'GDSFactory', icon: Cpu },
    { key: 'eda', label: 'EDA', icon: Zap },
    { key: 'manage', label: '管理', icon: Upload },
    { key: 'sparam', label: 'S参数', icon: Settings },
    { key: 'ip-nda', label: 'IP & NDA', icon: Shield },
    { key: 'versions', label: '版本', icon: GitBranch },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">国产 Foundry PDK 聚合平台</h1>
      <p className="text-gray-500 mb-6">
        PDK 上传管理、GDSFactory 集成、自动 S 参数生成、IP 黑盒化与 NDA 追踪、版本控制
      </p>

      {/* Top Tabs */}
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

      {activeTab === 'browse' && <BrowsePanel />}
      {activeTab === 'devices' && <DeviceLibraryPanel />}
      {activeTab === 'matrix' && <CompatibilityMatrixPanel />}
      {activeTab === 'mpw-calendar' && <MPWCalendarPanel />}
      {activeTab === 'eda' && <EDAToolsPanel />}
      {activeTab === 'download' && <DownloadPanel />}
      {activeTab === 'gdsfactory' && <GDSFactoryPanel />}
      {activeTab === 'manage' && <ManagePanel />}
      {activeTab === 'sparam' && <SParamPanel />}
      {activeTab === 'ip-nda' && <IPNDAPanel />}
      {activeTab === 'versions' && <VersionsPanel />}
    </div>
  )
}

// ===================================================================
// Foundry Detail Panel (Browse → Click → Detail page)
// ===================================================================
function BrowsePanel() {
  const [selectedFoundry, setSelectedFoundry] = useState<string | null>(null)
  const [foundryTab, setFoundryTab] = useState<'overview' | 'versions' | 'process' | 'mpw' | 'apply'>('overview')

  const selected = foundries.find((f) => f.id === selectedFoundry)

  if (selected) {
    return (
      <div>
        {/* Back button */}
        <button onClick={() => setSelectedFoundry(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          ← 返回 Foundry 列表
        </button>

        {/* Foundry Header */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selected.logo}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-500">{selected.fullName}</p>
              <p className="text-xs text-gray-400 mt-1">📍 {selected.location} · 📧 {selected.contact}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${selected.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              {selected.status === 'active' ? '🟢 运营中' : '🟡 测试中'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-4">{selected.description}</p>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'overview', label: '概览' },
            { key: 'versions', label: 'PDK 版本' },
            { key: 'process', label: '工艺参数' },
            { key: 'mpw', label: 'MPW 时间表' },
            { key: 'apply', label: '下载申请' },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setFoundryTab(t.key)}
              className="">
              {t.label}
            </button>
          ))}
        </div>

        {/* Sub-tab content */}
        {foundryTab === 'overview' && <FoundryOverview foundry={selected} />}
        {foundryTab === 'versions' && <FoundryVersions foundry={selected} />}
        {foundryTab === 'process' && <FoundryProcess foundry={selected} />}
        {foundryTab === 'mpw' && <FoundryMPW foundry={selected} />}
        {foundryTab === 'apply' && <FoundryApply foundry={selected} />}
      </div>
    )
  }

  // Foundry List View
  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">选择一个 Foundry 查看详细信息、PDK 版本和 MPW 时间表</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foundries.map((foundry) => (
          <div key={foundry.id} onClick={() => setSelectedFoundry(foundry.id)}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{foundry.logo}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{foundry.name}</h3>
                <p className="text-xs text-gray-500">{foundry.location}</p>
              </div>
              <span className="">
                {foundry.status === 'active' ? '运营中' : '测试中'}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">{foundry.description}</p>
            <div className="flex flex-wrap gap-1">
              {foundry.platforms.map((p) => (
                <span key={p.name} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{p.name}</span>
              ))}
            </div>
            <p className="text-xs text-indigo-600 mt-3 font-medium">查看详情 →</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FoundryOverview({ foundry }: { foundry: any }) {
  return (
    <div className="space-y-6">
      {/* Platforms */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">工艺平台</h3>
        <div className="space-y-4">
          {foundry.platforms.map((p: any) => (
            <div key={p.name} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.node} · {p.waveguideType}</p>
                </div>
                <span className="">
                  PDK: {p.pdkStatus === 'released' ? '已发布' : 'Beta'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                {p.specs.map((s: any) => (
                  <div key={s.label} className="text-center p-2 bg-white rounded">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-sm font-semibold text-indigo-700">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {p.features.map((f: string) => (
                  <span key={f} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border border-gray-200">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">服务能力</h3>
          <div className="flex flex-wrap gap-2">
            {foundry.capabilities.map((c: string) => (
              <span key={c} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">{c}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">认证资质</h3>
          <div className="flex flex-wrap gap-2">
            {foundry.certifications.map((c: string) => (
              <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FoundryVersions({ foundry }: { foundry: any }) {
  const versions = [
    { version: 'v3.2.1', date: '2026-06-01', status: 'stable', changes: '+12 组件，修复 Ge-PD S21 模型', downloads: 342 },
    { version: 'v3.2.0', date: '2026-05-15', status: 'stable', changes: '新增 TiN heater compact model，更新 DRC', downloads: 287 },
    { version: 'v3.1.0', date: '2026-04-20', status: 'stable', changes: '添加 SiN 层器件库，光栅耦合器更新', downloads: 456 },
    { version: 'v3.0.0', date: '2026-03-01', status: 'major', changes: '大版本：新工艺参数，重构调制器模型', downloads: 891 },
    { version: 'v2.5.0', date: '2025-12-10', status: 'legacy', changes: '最终 v2 版本，维护模式', downloads: 1203 },
  ]
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">PDK 版本列表 — {foundry.platforms[0]?.name}</h3>
      <div className="space-y-3">
        {versions.map((v) => (
          <div key={v.version} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <code className="text-sm font-mono font-bold text-gray-900 w-16">{v.version}</code>
            <span className="">
              {v.status}
            </span>
            <p className="text-sm text-gray-600 flex-1">{v.changes}</p>
            <span className="text-xs text-gray-400">{v.date}</span>
            <span className="text-xs text-gray-400">⬇️ {v.downloads}</span>
            <button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">下载</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FoundryProcess({ foundry }: { foundry: any }) {
  const processParams = [
    { category: '波导层', params: [{ name: 'Si 厚度', value: '220 ± 2 nm' }, { name: 'BOX 厚度', value: '2000 ± 50 nm' }, { name: '最小宽度', value: '350 nm' }, { name: '最小间距', value: '150 nm' }] },
    { category: '刻蚀', params: [{ name: '全蚀深度', value: '220 nm' }, { name: '浅蚀深度', value: '70 / 130 nm' }, { name: '侧壁角度', value: '85-90°' }, { name: '粗糙度', value: '<2 nm RMS' }] },
    { category: '掺杂', params: [{ name: 'N 浓度', value: '5×10¹⁷ cm⁻³' }, { name: 'N+ 浓度', value: '1×10¹⁹ cm⁻³' }, { name: 'P 浓度', value: '3×10¹⁷ cm⁻³' }, { name: 'P+ 浓度', value: '1×10¹⁹ cm⁻³' }] },
    { category: 'Ge 工艺', params: [{ name: 'Ge 厚度', value: '400 ± 20 nm' }, { name: '暗电流', value: '<10 nA (@ -1V)' }, { name: '截止波长', value: '~1600 nm' }, { name: '位错密度', value: '<10⁷ cm⁻²' }] },
    { category: '金属层', params: [{ name: 'M1 厚度', value: '750 nm Al' }, { name: 'M2 厚度', value: '2000 nm Al' }, { name: 'Via 尺寸', value: '2×2 μm' }, { name: 'Heater (TiN)', value: '100 nm' }] },
    { category: '设计规则', params: [{ name: '最小 Via', value: '2 μm' }, { name: '金属间距', value: '3 μm' }, { name: 'Heater-WG 距离', value: '>1.5 μm' }, { name: '芯片最大面积', value: '25 mm²' }] },
  ]
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">工艺参数 — {foundry.platforms[0]?.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processParams.map((cat) => (
          <div key={cat.category} className="p-4 border border-gray-100 rounded-lg">
            <h4 className="text-sm font-semibold text-indigo-700 mb-2">{cat.category}</h4>
            <div className="space-y-1.5">
              {cat.params.map((p) => (
                <div key={p.name} className="flex justify-between text-xs">
                  <span className="text-gray-600">{p.name}</span>
                  <span className="font-mono font-medium text-gray-900">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FoundryMPW({ foundry }: { foundry: any }) {
  const mpwSchedule = [
    { run: 'MPW-2026-Q3', deadline: '2026-07-15', tapeout: '2026-08-01', delivery: '2026-10-15', status: 'open', slots: '8/12 已预定', price: '¥15,000/mm²' },
    { run: 'MPW-2026-Q4', deadline: '2026-10-15', tapeout: '2026-11-01', delivery: '2027-01-15', status: 'upcoming', slots: '3/12 已预定', price: '¥15,000/mm²' },
    { run: 'MPW-2027-Q1', deadline: '2027-01-15', tapeout: '2027-02-01', delivery: '2027-04-15', status: 'planned', slots: '0/12', price: 'TBD' },
    { run: 'MPW-2026-Q2', deadline: '2026-04-15', tapeout: '2026-05-01', delivery: '2026-07-15', status: 'fabricating', slots: '12/12', price: '¥15,000/mm²' },
    { run: 'MPW-2026-Q1', deadline: '2026-01-15', tapeout: '2026-02-01', delivery: '2026-04-15', status: 'delivered', slots: '12/12', price: '¥12,000/mm²' },
  ]
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">MPW 多项目晶圆时间表 — {foundry.name}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 px-3 font-medium text-gray-600">批次</th>
              <th className="py-2 px-3 font-medium text-gray-600">截止日期</th>
              <th className="py-2 px-3 font-medium text-gray-600">Tape-out</th>
              <th className="py-2 px-3 font-medium text-gray-600">预计交付</th>
              <th className="py-2 px-3 font-medium text-gray-600">状态</th>
              <th className="py-2 px-3 font-medium text-gray-600">名额</th>
              <th className="py-2 px-3 font-medium text-gray-600">价格</th>
              <th className="py-2 px-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {mpwSchedule.map((m) => (
              <tr key={m.run} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 px-3 font-medium text-gray-900">{m.run}</td>
                <td className="py-2.5 px-3 text-gray-600">{m.deadline}</td>
                <td className="py-2.5 px-3 text-gray-600">{m.tapeout}</td>
                <td className="py-2.5 px-3 text-gray-600">{m.delivery}</td>
                <td className="py-2.5 px-3">
                  <span className="">
                    {m.status === 'open' ? '🟢 接受投片' : m.status === 'upcoming' ? '🔵 即将开放' : m.status === 'fabricating' ? '🟠 制造中' : m.status === 'delivered' ? '⚪ 已交付' : '🟣 规划中'}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-gray-600 text-xs">{m.slots}</td>
                <td className="py-2.5 px-3 text-gray-600 text-xs">{m.price}</td>
                <td className="py-2.5 px-3">
                  {m.status === 'open' && <button className="text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">预定名额</button>}
                  {m.status === 'upcoming' && <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">预登记</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800"><strong>说明：</strong>MPW 价格按芯片面积计费。提交截止日期前需完成 DRC clean 的 GDS。首次用户享 20% 折扣。</p>
      </div>
    </div>
  )
}

function FoundryApply({ foundry }: { foundry: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">PDK 下载申请 — {foundry.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">选择平台/版本</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              {foundry.platforms.map((p: any) => (
                <option key={p.name}>{p.name} (latest)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">申请人姓名</label>
            <input type="text" placeholder="姓名" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">所在机构</label>
            <input type="text" placeholder="公司/高校名称" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">邮箱</label>
            <input type="email" placeholder="工作邮箱" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">使用目的</label>
            <textarea placeholder="简述 PDK 使用场景和项目背景..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-y" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agree-terms" className="rounded" />
            <label htmlFor="agree-terms" className="text-xs text-gray-600">我已阅读并同意 PDK 使用条款和保密协议</label>
          </div>
          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">提交申请</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">审批流程</h3>
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
          {['提交申请', 'Foundry 审核', '签署协议', '开通下载', '技术支持'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">{s}</div>
              {i < 4 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">通常审批周期: 开放类 1 天 / 申请类 3 天 / NDA 类 1-2 周</p>
      </div>
    </div>
  )
}


// ===================================================================
// Device Library Panel - 器件库浏览
// ===================================================================
function DeviceLibraryPanel() {
  const [selectedPdk, setSelectedPdk] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null)

  interface Device {
    id: string
    name: string
    category: string
    pdk: string
    description: string
    params: { name: string; desc: string; typical: string }[]
    specs: { label: string; value: string }[]
    ports: number
    gdsFactory: string
    material: string
  }

  const devices: Device[] = [
    // CUMEC SOI
    { id: 'cumec-strip-wg', name: 'Strip Waveguide', category: 'Waveguide', pdk: 'CUMEC-SiPh180', description: 'Si 条形波导，单模传输 TE/TM', params: [{ name: 'width', desc: '波导宽度', typical: '450-500 nm' }, { name: 'length', desc: '长度', typical: '任意' }], specs: [{ label: '损耗', value: '<1.5 dB/cm' }, { label: '弯曲半径', value: '>5 μm' }, { label: '群折射率', value: '~4.2' }], ports: 2, gdsFactory: 'straight', material: 'Si (220nm SOI)' },
    { id: 'cumec-rib-wg', name: 'Rib Waveguide', category: 'Waveguide', pdk: 'CUMEC-SiPh180', description: 'Si 脊形波导，适合调制器有源区', params: [{ name: 'width', desc: '脊宽度', typical: '400-600 nm' }, { name: 'slab_height', desc: '平板厚度', typical: '90 nm' }], specs: [{ label: '损耗', value: '<2 dB/cm' }, { label: '弯曲半径', value: '>10 μm' }], ports: 2, gdsFactory: 'straight_rib', material: 'Si (220nm SOI)' },
    { id: 'cumec-bend', name: 'Euler Bend', category: 'Waveguide', pdk: 'CUMEC-SiPh180', description: '欧拉曲线弯曲，最小化模式失配损耗', params: [{ name: 'radius', desc: '等效半径', typical: '5-20 μm' }, { name: 'angle', desc: '弯曲角度', typical: '90°' }], specs: [{ label: '弯曲损耗', value: '<0.01 dB/90°' }, { label: '最小半径', value: '5 μm' }], ports: 2, gdsFactory: 'bend_euler', material: 'Si (220nm SOI)' },
    { id: 'cumec-mmi1x2', name: 'MMI 1×2 Splitter', category: 'Coupler', pdk: 'CUMEC-SiPh180', description: '多模干涉 1 入 2 出分束器，宽带 3dB 分光', params: [{ name: 'width_mmi', desc: 'MMI 宽度', typical: '6 μm' }, { name: 'length_mmi', desc: 'MMI 长度', typical: '11.2 μm' }], specs: [{ label: '分光均匀性', value: '<0.2 dB' }, { label: '带宽', value: '>100 nm' }, { label: '插入损耗', value: '<0.3 dB' }], ports: 3, gdsFactory: 'mmi1x2', material: 'Si (220nm SOI)' },
    { id: 'cumec-mmi2x2', name: 'MMI 2×2 Coupler', category: 'Coupler', pdk: 'CUMEC-SiPh180', description: '2 入 2 出 MMI，MZI 干涉仪核心组件', params: [{ name: 'width_mmi', desc: 'MMI 宽度', typical: '6 μm' }, { name: 'length_mmi', desc: 'MMI 长度', typical: '14.5 μm' }], specs: [{ label: '分光比', value: '50:50 ±1%' }, { label: '相位差', value: '<2°' }], ports: 4, gdsFactory: 'mmi2x2', material: 'Si (220nm SOI)' },
    { id: 'cumec-dc', name: 'Directional Coupler', category: 'Coupler', pdk: 'CUMEC-SiPh180', description: '定向耦合器，可调分光比', params: [{ name: 'gap', desc: '波导间距', typical: '200 nm' }, { name: 'length', desc: '耦合长度', typical: '5-20 μm' }], specs: [{ label: '耦合系数 κ', value: '0.01-0.5' }, { label: '波长敏感性', value: '中等' }], ports: 4, gdsFactory: 'coupler', material: 'Si (220nm SOI)' },
    { id: 'cumec-mzm', name: 'MZI 调制器 (PN depletion)', category: 'Modulator', pdk: 'CUMEC-SiPh180', description: 'PN 结载流子耗尽型 MZI 调制器，高速调制', params: [{ name: 'arm_length', desc: '调制臂长度', typical: '2-4 mm' }, { name: 'vpi_l', desc: '效率 VπL', typical: '~2.5 V·cm' }], specs: [{ label: '带宽', value: '>50 GHz' }, { label: 'Vπ', value: '5-7 V (2mm)' }, { label: '插入损耗', value: '<5 dB' }, { label: '消光比', value: '>25 dB' }], ports: 4, gdsFactory: 'mzi', material: 'Si (220nm SOI)' },
    { id: 'cumec-heater', name: 'TiN Thermal Heater', category: 'Modulator', pdk: 'CUMEC-SiPh180', description: '氮化钛热调谐器，用于相位微调和波长锁定', params: [{ name: 'length', desc: '加热器长度', typical: '50-200 μm' }, { name: 'width', desc: '加热器宽度', typical: '2-3 μm' }], specs: [{ label: 'Pπ', value: '~25 mW' }, { label: '响应时间', value: '~10 μs' }, { label: '热串扰', value: '<5%' }], ports: 2, gdsFactory: 'phase_shifter_heater', material: 'TiN on SOI' },
    { id: 'cumec-ge-pd', name: 'Ge Photodetector', category: 'Detector', pdk: 'CUMEC-SiPh180', description: 'Ge-on-Si PIN 光电探测器，波导耦合', params: [{ name: 'length', desc: 'Ge 吸收长度', typical: '20-40 μm' }, { name: 'width', desc: 'Ge 宽度', typical: '5-10 μm' }], specs: [{ label: '响应度', value: '>0.8 A/W @ 1310nm' }, { label: '带宽', value: '>50 GHz' }, { label: '暗电流', value: '<10 nA' }, { label: '量子效率', value: '>80%' }], ports: 2, gdsFactory: 'ge_detector_straight_si_contacts', material: 'Ge on Si' },
    { id: 'cumec-gc', name: 'Grating Coupler', category: 'IO', pdk: 'CUMEC-SiPh180', description: '光栅耦合器，光纤-波导垂直耦合', params: [{ name: 'period', desc: '光栅周期', typical: '600-640 nm' }, { name: 'n_periods', desc: '周期数', typical: '20-30' }], specs: [{ label: '耦合损耗', value: '<2.5 dB' }, { label: '3dB 带宽', value: '~40 nm' }, { label: '中心波长', value: '1310/1550 nm' }], ports: 2, gdsFactory: 'grating_coupler_elliptical', material: 'Si (220nm SOI)' },
    { id: 'cumec-edge', name: 'Edge Coupler (SSC)', category: 'IO', pdk: 'CUMEC-SiPh180', description: '模斑转换器 + 边缘耦合，低损耗宽带耦合', params: [{ name: 'taper_length', desc: '锥形长度', typical: '200-500 μm' }, { name: 'tip_width', desc: '尖端宽度', typical: '80-180 nm' }], specs: [{ label: '耦合损耗', value: '<1.5 dB' }, { label: '带宽', value: '>200 nm' }, { label: '偏振相关', value: '<0.5 dB' }], ports: 2, gdsFactory: 'taper', material: 'Si + SiOx' },
    { id: 'cumec-ring', name: 'Microring Resonator', category: 'Filter', pdk: 'CUMEC-SiPh180', description: '微环谐振器，可做滤波/调制/传感', params: [{ name: 'radius', desc: '环半径', typical: '5-20 μm' }, { name: 'gap', desc: '耦合间隙', typical: '150-300 nm' }], specs: [{ label: 'Q 值', value: '>50,000' }, { label: 'FSR', value: '5-20 nm' }, { label: '消光比', value: '>15 dB' }], ports: 4, gdsFactory: 'ring_single', material: 'Si (220nm SOI)' },
    { id: 'cumec-awg', name: 'AWG 8ch DWDM', category: 'Filter', pdk: 'CUMEC-SiPh180', description: '阵列波导光栅，8 通道波分复用', params: [{ name: 'channels', desc: '通道数', typical: '8' }, { name: 'spacing', desc: '通道间隔', typical: '200 GHz' }], specs: [{ label: '通道隔离', value: '>25 dB' }, { label: '插入损耗', value: '<3 dB' }, { label: '平坦度', value: '<1 dB' }], ports: 9, gdsFactory: 'awg', material: 'Si (220nm SOI)' },
    // SiOPT SiN
    { id: 'siopt-sin-wg', name: 'SiN Waveguide (Low-loss)', category: 'Waveguide', pdk: 'SiOPT-SiN800', description: 'Si₃N₄ 超低损耗波导，适合延迟线和高 Q 谐振', params: [{ name: 'width', desc: '波导宽度', typical: '1.0-1.5 μm' }, { name: 'height', desc: '核心厚度', typical: '800 nm' }], specs: [{ label: '损耗', value: '<0.05 dB/cm' }, { label: '弯曲半径', value: '>50 μm' }], ports: 2, gdsFactory: 'straight', material: 'Si₃N₄ (800nm)' },
    { id: 'siopt-sin-ring', name: 'SiN High-Q Microring', category: 'Filter', pdk: 'SiOPT-SiN800', description: '超高 Q 氮化硅微环，适合外腔激光和传感', params: [{ name: 'radius', desc: '环半径', typical: '50-200 μm' }, { name: 'gap', desc: '耦合间隙', typical: '300-800 nm' }], specs: [{ label: 'Q 值', value: '>10⁶' }, { label: 'FSR', value: '1-5 nm' }, { label: '损耗', value: '<0.01 dB/cm' }], ports: 4, gdsFactory: 'ring_single', material: 'Si₃N₄ (800nm)' },
    { id: 'siopt-sin-spiral', name: 'SiN Spiral Delay Line', category: 'Waveguide', pdk: 'SiOPT-SiN800', description: 'SiN 螺旋延迟线，用于光缓存和微波光子', params: [{ name: 'length', desc: '总光路长度', typical: '1-50 cm' }, { name: 'N', desc: '圈数', typical: '10-100' }], specs: [{ label: '延迟', value: '0.1-10 ns' }, { label: '总损耗', value: '<1 dB/cm' }], ports: 2, gdsFactory: 'spiral', material: 'Si₃N₄ (800nm)' },
    // LNOI
    { id: 'lnoi-mzm', name: 'TFLN MZI Modulator', category: 'Modulator', pdk: 'LNOI-Photonics', description: '薄膜铌酸锂 Mach-Zehnder 调制器，超高带宽', params: [{ name: 'length', desc: '电极长度', typical: '10-25 mm' }, { name: 'electrode_gap', desc: '电极间距', typical: '3-8 μm' }], specs: [{ label: 'Vπ', value: '<1.5 V' }, { label: 'EO 带宽', value: '>110 GHz' }, { label: '插入损耗', value: '<2 dB' }, { label: '消光比', value: '>35 dB' }], ports: 4, gdsFactory: 'mzi', material: 'LiNbO₃ (X-cut, 600nm)' },
    { id: 'lnoi-iq', name: 'TFLN IQ Modulator', category: 'Modulator', pdk: 'LNOI-Photonics', description: '铌酸锂 IQ 调制器，相干通信核心器件', params: [{ name: 'length', desc: '调制长度', typical: '15-20 mm' }, { name: 'bias_electrodes', desc: '偏置电极', typical: 'DC + RF' }], specs: [{ label: 'IQ 相位精度', value: '<2°' }, { label: '带宽 (each arm)', value: '>100 GHz' }, { label: 'Vπ', value: '~1.2 V' }], ports: 6, gdsFactory: 'mzi', material: 'LiNbO₃ (X-cut, 600nm)' },
    { id: 'lnoi-ring', name: 'TFLN Microring', category: 'Filter', pdk: 'LNOI-Photonics', description: '铌酸锂微环，EO 可调滤波器', params: [{ name: 'radius', desc: '环半径', typical: '30-100 μm' }, { name: 'gap', desc: '耦合间隙', typical: '300-600 nm' }], specs: [{ label: 'Q 值', value: '>10⁵' }, { label: 'EO 调谐', value: '~3 pm/V' }], ports: 4, gdsFactory: 'ring_single', material: 'LiNbO₃ (X-cut, 600nm)' },
    // InP
    { id: 'inp-dfb', name: 'DFB Laser', category: 'Source', pdk: 'InP-EPI', description: '分布反馈激光器，单模 CW 输出', params: [{ name: 'cavity_length', desc: '腔长', typical: '200-500 μm' }, { name: 'grating_period', desc: '光栅周期', typical: '~240 nm' }], specs: [{ label: '输出功率', value: '10-40 mW' }, { label: 'SMSR', value: '>50 dB' }, { label: '线宽', value: '1-5 MHz' }], ports: 2, gdsFactory: 'N/A (III-V)', material: 'InGaAsP/InP' },
    { id: 'inp-eml', name: 'EML (DFB+EAM)', category: 'Source', pdk: 'InP-EPI', description: 'DFB 激光器 + 电吸收调制器单片集成', params: [{ name: 'eam_length', desc: 'EAM 长度', typical: '100-200 μm' }, { name: 'isolation', desc: '隔离区', typical: '50-100 μm' }], specs: [{ label: '调制带宽', value: '>67 GHz' }, { label: '消光比', value: '>9 dB' }, { label: '啁啾 α', value: '<1.0' }, { label: '输出功率', value: '2-6 dBm' }], ports: 2, gdsFactory: 'N/A (III-V)', material: 'InGaAsP/InP MQW' },
    { id: 'inp-soa', name: 'SOA (Semiconductor Optical Amplifier)', category: 'Amplifier', pdk: 'InP-EPI', description: '半导体光放大器，片上光增益', params: [{ name: 'length', desc: '有源区长度', typical: '0.5-2 mm' }, { name: 'current', desc: '注入电流', typical: '100-500 mA' }], specs: [{ label: '增益', value: '15-25 dB' }, { label: '饱和功率', value: '10-15 dBm' }, { label: 'NF', value: '5-8 dB' }], ports: 2, gdsFactory: 'N/A (III-V)', material: 'InGaAsP/InP' },
    { id: 'inp-cw', name: 'CW Laser (ECL)', category: 'Source', pdk: 'InP-EPI', description: '外腔连续波激光器，超窄线宽', params: [{ name: 'cavity_length', desc: '外腔长度', typical: '10-50 mm' }, { name: 'grating_type', desc: '光栅类型', typical: 'FBG / SiN' }], specs: [{ label: '线宽', value: '<100 kHz' }, { label: '输出功率', value: '20-200 mW' }, { label: 'RIN', value: '<-155 dB/Hz' }], ports: 2, gdsFactory: 'N/A (III-V)', material: 'InP + SiN 外腔' },
    // Accelink SiPh
    { id: 'acc-coherent-rx', name: 'Coherent Receiver PIC', category: 'System', pdk: 'Accelink-SiPh', description: '相干接收机 PIC：90° Hybrid + Balanced PD', params: [{ name: 'channels', desc: '通道数 (X/Y pol)', typical: '2' }], specs: [{ label: 'CMRR', value: '>20 dB' }, { label: 'PD 响应度', value: '>0.7 A/W' }, { label: '带宽', value: '>40 GHz' }], ports: 6, gdsFactory: 'N/A (Custom)', material: 'Si (220nm SOI) + Ge' },
    { id: 'acc-voa', name: 'Variable Optical Attenuator', category: 'Modulator', pdk: 'Accelink-SiPh', description: '可变光衰减器，用于功率均衡', params: [{ name: 'type', desc: '类型', typical: 'PIN 注入 / MZI' }], specs: [{ label: '衰减范围', value: '0-30 dB' }, { label: '响应速度', value: '<1 μs' }], ports: 2, gdsFactory: 'N/A (Custom)', material: 'Si (220nm SOI)' },
  ]

  const pdkOptions = ['all', ...new Set(devices.map((d) => d.pdk))]
  const categoryOptions = ['all', ...new Set(devices.map((d) => d.category))]

  const filtered = devices.filter((d) => {
    if (selectedPdk !== 'all' && d.pdk !== selectedPdk) return false
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false
    return true
  })

  const categoryColors: Record<string, string> = {
    Waveguide: '#3b82f6', Coupler: '#8b5cf6', Modulator: '#ef4444', Detector: '#f97316',
    Filter: '#22c55e', IO: '#06b6d4', Source: '#eab308', Amplifier: '#059669', System: '#ec4899',
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <span className="text-xs text-gray-500 mr-2">PDK:</span>
          <select value={selectedPdk} onChange={(e) => setSelectedPdk(e.target.value)}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg">
            {pdkOptions.map((p) => <option key={p} value={p}>{p === 'all' ? '全部 PDK' : p}</option>)}
          </select>
        </div>
        <div>
          <span className="text-xs text-gray-500 mr-2">类别:</span>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg">
            {categoryOptions.map((c) => <option key={c} value={c}>{c === 'all' ? '全部类别' : c}</option>)}
          </select>
        </div>
        <span className="text-sm text-gray-400 self-center ml-auto">{filtered.length} 个器件</span>
      </div>

      {/* Device Grid */}
      <div className="space-y-3">
        {filtered.map((device) => (
          <div key={device.id} className="card !p-4">
            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpandedDevice(expandedDevice === device.id ? null : device.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: categoryColors[device.category] || '#6b7280' }}>
                    {device.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{device.name}</h4>
                  <code className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{device.pdk}</code>
                </div>
                <p className="text-xs text-gray-600">{device.description}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>🔌 {device.ports} ports</span>
                  <span>🧪 {device.material}</span>
                  {device.gdsFactory !== 'N/A (III-V)' && device.gdsFactory !== 'N/A (Custom)' && (
                    <span className="text-orange-500">gf.c.{device.gdsFactory}</span>
                  )}
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${expandedDevice === device.id ? 'rotate-90' : ''}`} />
            </div>

            {expandedDevice === device.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">设计参数</p>
                  <div className="space-y-1">
                    {device.params.map((p) => (
                      <div key={p.name} className="flex justify-between text-xs">
                        <span className="text-gray-600">{p.name} — {p.desc}</span>
                        <span className="font-mono text-indigo-700">{p.typical}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">性能指标</p>
                  <div className="space-y-1">
                    {device.specs.map((s) => (
                      <div key={s.label} className="flex justify-between text-xs">
                        <span className="text-gray-600">{s.label}</span>
                        <span className="font-semibold text-gray-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ===================================================================
// EDA Tools Panel - 工具联动、启动、集成教程
// ===================================================================
function EDAToolsPanel() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  interface EDATool {
    id: string
    name: string
    vendor: string
    logo: string
    type: string
    description: string
    launchUrl: string | null
    localCmd: string | null
    pdkSupport: string[]
    integration: 'native' | 'plugin' | 'script' | 'manual'
    status: 'connected' | 'available' | 'not-installed'
    tutorial: { title: string; steps: string[] }
  }

  const edaTools: EDATool[] = [
    {
      id: 'klayout',
      name: 'KLayout',
      vendor: 'Matthias Köfferlein (开源)',
      logo: '📐',
      type: '版图编辑/查看',
      description: '开源 GDS 版图编辑器，支持 Python 脚本和 PDK 插件，社区活跃。GDSFactory 原生输出 KLayout 兼容格式。',
      launchUrl: null,
      localCmd: 'klayout',
      pdkSupport: ['CUMEC-SiPh180', 'SiOPT-SiN800', 'PH18-CN', 'LNOI-Photonics'],
      integration: 'native',
      status: 'available',
      tutorial: {
        title: 'KLayout + PDK 集成教程',
        steps: [
          '1. 安装 KLayout: brew install klayout (macOS) 或官网下载',
          '2. 安装 PDK 插件: 菜单 → Tools → Manage Packages → 搜索 SiEPIC',
          '3. 导入 PDK 层定义: File → Load Technology → 选择 .lyp 文件',
          '4. 打开 GDS 文件: File → Open → 选择 .gds 文件',
          '5. DRC 检查: Tools → DRC → 选择 PDK DRC 脚本 → Run',
          '6. Python 脚本: Macros → Python → 编写自动化版图脚本',
        ],
      },
    },
    {
      id: 'lumerical',
      name: 'Lumerical (Ansys)',
      vendor: 'Ansys / Lumerical',
      logo: '🔬',
      type: '光学仿真 (FDTD/MODE/INTERCONNECT)',
      description: 'FDTD 全波仿真、MODE 模式求解、INTERCONNECT 电路级仿真。支持所有主流硅光 PDK 的 compact model。',
      launchUrl: 'https://www.lumerical.com/products/',
      localCmd: 'lumerical-interconnect',
      pdkSupport: ['CUMEC-SiPh180', 'SiOPT-SiN800', 'PH18-CN', 'LNOI-Photonics', 'InP-EPI'],
      integration: 'native',
      status: 'available',
      tutorial: {
        title: 'Lumerical INTERCONNECT + PDK 仿真',
        steps: [
          '1. 启动 INTERCONNECT → File → New Project',
          '2. 加载 PDK: Element Library → Import CML (Compact Model Library)',
          '3. 导入 PDK CML 文件: 选择 PDK 目录下 .cml 文件',
          '4. 拖入器件: 从 Library 拖拽器件到 canvas',
          '5. 配置参数: 双击器件设置几何/材料参数',
          '6. 连接端口: 用 waveguide 连接器件 optical ports',
          '7. 添加光源和探测器: Source → CW Laser, Monitor → Power',
          '8. 运行仿真: Simulation → Run → 查看 S 参数和频谱',
        ],
      },
    },
    {
      id: 'optodesigner',
      name: 'Synopsys OptoDesigner',
      vendor: 'Synopsys',
      logo: '🏗️',
      type: 'PIC 版图设计',
      description: '专业光子集成电路版图设计和验证工具，支持参数化 PCell、DRC/LVS、与 Synopsys 仿真工具链集成。',
      launchUrl: 'https://www.synopsys.com/photonic-solutions/pic-design.html',
      localCmd: 'optodesigner',
      pdkSupport: ['CUMEC-SiPh180', 'PH18-CN', 'Accelink-SiPh'],
      integration: 'native',
      status: 'available',
      tutorial: {
        title: 'OptoDesigner PDK 设计流程',
        steps: [
          '1. 启动 OptoDesigner → New Design → 选择 PDK Technology',
          '2. 导入 PDK: Technology → Load → 选择 Foundry 提供的 .oa 技术库',
          '3. 放置器件: Component → Insert → 从 PDK 库选择器件',
          '4. 参数化设计: Properties 面板中调整器件参数',
          '5. 布线路由: Route → Auto Route → 选择波导类型',
          '6. DRC: Verification → DRC → 检查设计规则违规',
          '7. LVS: Verification → LVS → 版图-原理图一致性检查',
          '8. 导出 GDS: File → Export → GDSII',
        ],
      },
    },
    {
      id: 'ipkiss',
      name: 'IPKISS (Luceda Photonics)',
      vendor: 'Luceda Photonics',
      logo: '🐍',
      type: 'Python PDK 框架',
      description: 'Python 驱动的参数化 PIC 设计框架。通过代码定义器件和电路，自动生成版图和仿真。与 GDSFactory 互补。',
      launchUrl: 'https://www.lucedaphotonics.com/ipkiss',
      localCmd: 'python -c "import ipkiss3"',
      pdkSupport: ['CUMEC-SiPh180', 'SiOPT-SiN800', 'PH18-CN'],
      integration: 'script',
      status: 'available',
      tutorial: {
        title: 'IPKISS Python 设计流程',
        steps: [
          '1. 安装: pip install ipkiss3 (需要 license)',
          '2. 导入 PDK: from pdk_cumec import technology',
          '3. 创建器件: my_ring = pdk.RingResonator(radius=10, gap=0.2)',
          '4. 设置参数: my_ring.Layout()',
          '5. 组合电路: circuit = i3.Circuit(insts={...}, specs=[...])',
          '6. 生成版图: circuit.Layout().write_gdsii("output.gds")',
          '7. 仿真: circuit.CircuitModel() → S-parameters',
          '8. DRC: circuit.Layout().visualize() + pdk.drc_check()',
        ],
      },
    },
    {
      id: 'cadence',
      name: 'Cadence Virtuoso',
      vendor: 'Cadence Design Systems',
      logo: '⚡',
      type: '光电混合 IC 设计',
      description: '业界标准 IC 设计平台。用于硅光芯片的驱动器/TIA 电路设计，支持光电协同仿真。',
      launchUrl: 'https://www.cadence.com/en_US/home/tools/custom-ic-analog-rf-design/virtuoso-studio.html',
      localCmd: 'virtuoso',
      pdkSupport: ['PH18-CN', 'Accelink-SiPh'],
      integration: 'plugin',
      status: 'not-installed',
      tutorial: {
        title: 'Cadence + 硅光 PDK 电路设计',
        steps: [
          '1. 安装 Foundry PDK: 按 Foundry 指引安装 Technology File (.tf)',
          '2. 启动 Virtuoso: virtuoso &',
          '3. 新建 Library: Library Manager → New Library → Attach Technology',
          '4. 原理图设计: Schematic Editor → 放置光电器件',
          '5. TIA/Driver 设计: 使用 PDK 中的 transistor model',
          '6. 光电协仿: 与 Lumerical 通过 .lib 文件交换 S 参数',
          '7. 版图: Layout XL → Place & Route',
          '8. Signoff: DRC → LVS → PEX',
        ],
      },
    },
    {
      id: 'comsol',
      name: 'COMSOL Multiphysics',
      vendor: 'COMSOL Inc.',
      logo: '🌊',
      type: '多物理场仿真',
      description: '热-光-电-力耦合仿真，用于热调谐器设计、应力分析、光纤耦合优化等多物理场问题。',
      launchUrl: 'https://www.comsol.com/products',
      localCmd: 'comsol',
      pdkSupport: ['通用（材料参数导入）'],
      integration: 'manual',
      status: 'available',
      tutorial: {
        title: 'COMSOL 光子器件多物理场仿真',
        steps: [
          '1. 启动 COMSOL → Model Wizard → 2D/3D',
          '2. 添加物理场: Wave Optics + Heat Transfer',
          '3. 导入几何: 从 GDS 导入器件截面 (DXF export)',
          '4. 定义材料: Si, SiO2, TiN... 从 Material Library 选择',
          '5. 设置边界条件: Port (光输入), Temperature (热边界)',
          '6. 网格划分: Physics-controlled mesh → Fine',
          '7. 求解: Study → Frequency Domain + Stationary',
          '8. 后处理: Results → S-parameters, Temperature distribution',
        ],
      },
    },
    {
      id: 'gdsfactory-py',
      name: 'GDSFactory (Python)',
      vendor: '开源社区',
      logo: '🏭',
      type: 'Python 版图生成',
      description: '开源光子芯片版图设计框架，200+ 参数化器件，与本平台后端直接集成。pip install gdsfactory。',
      launchUrl: 'https://gdsfactory.github.io/gdsfactory/',
      localCmd: 'python -c "import gdsfactory; print(gdsfactory.__version__)"',
      pdkSupport: ['generic', 'CUMEC-SiPh180', 'SiOPT-SiN800', 'LNOI-Photonics', 'SiEPIC', 'AMF'],
      integration: 'native',
      status: 'connected',
      tutorial: {
        title: 'GDSFactory 快速上手',
        steps: [
          '1. 安装: pip install "gdsfactory[full]"  (需要 Python>=3.10)',
          '2. 基本使用: import gdsfactory as gf',
          '3. 创建器件: c = gf.components.mzi(delta_length=10)',
          '4. 可视化: c.show() 或 c.plot()',
          '5. 组合电路: from gdsfactory import routing',
          '6. 加载 PDK: from gdsfactory.generic_tech import get_generic_pdk',
          '7. 导出 GDS: c.write_gds("my_circuit.gds")',
          '8. 仿真: gf.simulation.get_sparameters(c) → S-params',
        ],
      },
    },
    {
      id: 'mentor-calibre',
      name: 'Siemens Calibre',
      vendor: 'Siemens EDA',
      logo: '🔍',
      type: 'DRC/LVS 签核',
      description: '业界标准的物理验证工具，用于最终 tape-out 前的设计规则检查和版图-原理图一致性验证。',
      launchUrl: 'https://eda.sw.siemens.com/en-US/ic/calibre/',
      localCmd: 'calibre -drc',
      pdkSupport: ['PH18-CN', 'CUMEC-SiPh180'],
      integration: 'native',
      status: 'not-installed',
      tutorial: {
        title: 'Calibre DRC/LVS for Photonics',
        steps: [
          '1. 获取 Foundry rule deck (.cal 文件)',
          '2. 准备 GDS: 确保层名与 PDK 层映射一致',
          '3. DRC: calibre -drc -hier runset_file',
          '4. 查看结果: calibre -rve (Results Viewing Environment)',
          '5. 修复违规: 根据 DRC markers 修改版图',
          '6. LVS: calibre -lvs runset_file',
          '7. 比对: 检查 netlist match / mismatch',
          '8. Signoff: DRC clean + LVS clean → Tape-out ready',
        ],
      },
    },
  ]

  const handleLaunch = (tool: EDATool) => {
    if (tool.launchUrl) {
      window.open(tool.launchUrl, '_blank')
    } else if (tool.localCmd) {
      alert(`请在终端运行:\n\n${tool.localCmd}\n\n或确认该工具已安装在本机。`)
    }
  }

  const statusColors = { connected: 'bg-green-50 text-green-700', available: 'bg-blue-50 text-blue-700', 'not-installed': 'bg-gray-100 text-gray-500' }
  const statusLabels = { connected: '✓ 已连接', available: '可用', 'not-installed': '未安装' }
  const integrationLabels = { native: '原生集成', plugin: '插件集成', script: '脚本调用', manual: '手动导入' }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-600">管理和启动 EDA 工具，查看 PDK 集成教程，实现设计到流片全流程联动。</p>
      </div>

      {/* Tool Cards */}
      <div className="space-y-4">
        {edaTools.map((tool) => (
          <div key={tool.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center gap-4">
              <span className="text-3xl">{tool.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[tool.status]}`}>
                    {statusLabels[tool.status]}
                  </span>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{integrationLabels[tool.integration]}</span>
                </div>
                <p className="text-xs text-gray-500">{tool.vendor} · {tool.type}</p>
                <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tool.pdkSupport.map((pdk) => (
                    <span key={pdk} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{pdk}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handleLaunch(tool)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                    tool.status === 'connected' ? 'bg-green-600 text-white hover:bg-green-700' :
                    tool.status === 'available' ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                    'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {tool.status === 'connected' ? '启动' : tool.status === 'available' ? '打开' : '获取'}
                </button>
                <button
                  onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  📖 教程
                </button>
              </div>
            </div>

            {/* Expanded Tutorial */}
            {expandedTool === tool.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{tool.tutorial.title}</h4>
                <div className="space-y-2">
                  {tool.tutorial.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
                {tool.localCmd && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">本地启动命令:</p>
                    <code className="text-sm text-green-400 font-mono">{tool.localCmd}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Integration Architecture */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">EDA 工具链集成架构</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {[
            { label: 'GDSFactory', sub: '版图生成', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'KLayout', sub: '版图查看/DRC', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'Lumerical', sub: '器件仿真', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'INTERCONNECT', sub: '电路仿真', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'Cadence', sub: '光电混合', color: 'bg-green-100 text-green-700 border-green-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'Calibre', sub: 'Sign-off', color: 'bg-red-100 text-red-700 border-red-200' },
            { label: '→', sub: '', color: 'text-gray-300 text-lg' },
            { label: 'Tape-out', sub: '流片', color: 'bg-gray-800 text-white border-gray-800' },
          ].map((item, i) => (
            item.sub === '' ? <span key={i} className={item.color}>→</span> : (
              <div key={i} className={`px-3 py-2 rounded-lg border ${item.color} text-center`}>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs opacity-75">{item.sub}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Download/Apply Panel - PDK 下载与申请
// ===================================================================
function DownloadPanel() {
  const [applications, setApplications] = useState([
    { id: 'a1', pdk: 'CUMEC-SiPh180 v3.2.1', date: '2026-06-05', status: 'approved', purpose: '800G DR8 硅光模块设计' },
    { id: 'a2', pdk: 'LNOI-Photonics v1.3.0-beta', date: '2026-06-03', status: 'pending', purpose: 'TFLN IQ 调制器评估' },
    { id: 'a3', pdk: 'InP-EPI (长光辰芯)', date: '2026-05-28', status: 'nda_required', purpose: 'EML 芯片定制设计' },
  ])
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applyPdk, setApplyPdk] = useState('')
  const [applyPurpose, setApplyPurpose] = useState('')
  const [applyOrg, setApplyOrg] = useState('')

  const pdkPackages = [
    { id: 'cumec-siph180', name: 'CUMEC-SiPh180', version: 'v3.2.1', foundry: 'CUMEC', access: 'open', size: '245 MB', components: 128, format: 'GDS + Compact Model + DRC', license: '免费（注册即下载）', downloads: 342 },
    { id: 'siopt-sin800', name: 'SiOPT-SiN800', version: 'v2.1.0', foundry: 'SiOPT', access: 'open', size: '89 MB', components: 56, format: 'GDS + Lumerical Model', license: '免费（注册即下载）', downloads: 187 },
    { id: 'cumec-sin400', name: 'CUMEC-SiN400', version: 'v1.5.0', foundry: 'CUMEC', access: 'open', size: '52 MB', components: 34, format: 'GDS + IPKISS cells', license: '免费（注册即下载）', downloads: 98 },
    { id: 'ph18-cn', name: 'PH18-CN (Tower)', version: 'v4.0.0', foundry: '绍兴中芯', access: 'apply', size: '312 MB', components: 156, format: 'GDS + OptoDesigner + DRC + LVS', license: '需签署使用协议', downloads: 45 },
    { id: 'lnoi-photonics', name: 'LNOI-Photonics', version: 'v1.3.0-beta', foundry: '济南量子', access: 'apply', size: '67 MB', components: 34, format: 'GDS + Lumerical FDTD', license: '需 NDA（Beta 阶段）', downloads: 23 },
    { id: 'inp-epi', name: 'InP-EPI', version: 'v0.9.0', foundry: '长光辰芯', access: 'nda', size: '38 MB', components: 18, format: 'Epitaxy + Mask + PICWave', license: '需签署 NDA + 合作协议', downloads: 8 },
    { id: 'accelink-siph', name: 'Accelink-SiPh', version: 'v2.0.0', foundry: '光迅科技', access: 'nda', size: '180 MB', components: 72, format: 'Internal EDA + GDS', license: '仅限战略合作伙伴', downloads: 3 },
  ]

  const handleApply = () => {
    if (!applyPdk || !applyPurpose || !applyOrg) return
    const newApp = {
      id: `a${Date.now()}`,
      pdk: applyPdk,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      purpose: applyPurpose,
    }
    setApplications([newApp, ...applications])
    setShowApplyForm(false)
    setApplyPdk('')
    setApplyPurpose('')
    setApplyOrg('')
  }

  return (
    <div>
      {/* PDK Packages Available */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">可用 PDK 包</h3>
        <div className="space-y-3">
          {pdkPackages.map((pkg) => (
            <div key={pkg.id} className="card !p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{pkg.name}</h4>
                  <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{pkg.version}</code>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    pkg.access === 'open' ? 'bg-green-50 text-green-700' :
                    pkg.access === 'apply' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {pkg.access === 'open' ? '🟢 开放下载' : pkg.access === 'apply' ? '🟡 需申请' : '🔴 需 NDA'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>📦 {pkg.size}</span>
                  <span>🧩 {pkg.components} 组件</span>
                  <span>🏭 {pkg.foundry}</span>
                  <span>⬇️ {pkg.downloads} 次下载</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">格式：{pkg.format} · 许可：{pkg.license}</p>
              </div>
              <div className="flex-shrink-0">
                {pkg.access === 'open' ? (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> 下载
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowApplyForm(true); setApplyPdk(pkg.name + ' ' + pkg.version) }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" /> 申请
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div className="card mb-8 border-2 border-indigo-200">
          <h3 className="font-semibold text-gray-900 mb-4">PDK 使用申请</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">申请 PDK</label>
              <input type="text" value={applyPdk} onChange={(e) => setApplyPdk(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">所在机构</label>
              <input type="text" value={applyOrg} onChange={(e) => setApplyOrg(e.target.value)}
                placeholder="公司/高校/研究所名称"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">使用目的</label>
              <textarea value={applyPurpose} onChange={(e) => setApplyPurpose(e.target.value)}
                placeholder="请简要说明您申请 PDK 的项目背景和使用目的..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-y" />
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              <p className="font-medium mb-1">申请说明</p>
              <ul className="space-y-0.5">
                <li>• 开放类 PDK 注册后即可直接下载</li>
                <li>• 申请类 PDK 需 Foundry 审批，通常 1-3 个工作日</li>
                <li>• NDA 类 PDK 需签署保密协议，审批周期约 1-2 周</li>
                <li>• 学术用户通常有更快的审批通道</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowApplyForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">取消</button>
              <button onClick={handleApply} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Applications */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-500" /> 我的申请记录
        </h3>
        {applications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">暂无申请记录</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-3 font-medium text-gray-600">PDK</th>
                  <th className="py-2 px-3 font-medium text-gray-600">申请日期</th>
                  <th className="py-2 px-3 font-medium text-gray-600">用途</th>
                  <th className="py-2 px-3 font-medium text-gray-600">状态</th>
                  <th className="py-2 px-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{app.pdk}</td>
                    <td className="py-2.5 px-3 text-gray-500">{app.date}</td>
                    <td className="py-2.5 px-3 text-gray-600 max-w-[200px] truncate">{app.purpose}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        app.status === 'approved' ? 'bg-green-50 text-green-700' :
                        app.status === 'pending' ? 'bg-blue-50 text-blue-700' :
                        app.status === 'nda_required' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {app.status === 'approved' ? '✓ 已通过' :
                         app.status === 'pending' ? '⏳ 审批中' :
                         app.status === 'nda_required' ? '📋 需签 NDA' : '✗ 已拒绝'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {app.status === 'approved' && (
                        <button className="text-xs text-green-600 hover:underline flex items-center gap-1">
                          <Download className="h-3 w-3" /> 下载
                        </button>
                      )}
                      {app.status === 'nda_required' && (
                        <button className="text-xs text-orange-600 hover:underline">签署 NDA →</button>
                      )}
                      {app.status === 'pending' && (
                        <span className="text-xs text-gray-400">等待中</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download Guide */}
      <div className="card mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">下载流程说明</h3>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { step: '1', label: '注册/登录', desc: '创建平台账号' },
            { step: '2', label: '选择 PDK', desc: '浏览并选择目标 PDK' },
            { step: '3', label: '提交申请', desc: '填写用途和机构信息' },
            { step: '4', label: 'Foundry 审批', desc: '等待 Foundry 确认' },
            { step: '5', label: '签署协议', desc: 'NDA/使用协议（如需）' },
            { step: '6', label: '下载 PDK', desc: '获取完整 PDK 包' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mx-auto mb-1">{s.step}</div>
                <p className="text-xs font-medium text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              {i < 5 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// GDSFactory Panel - 调用 GDSFactory 生成器件
// ===================================================================
function GDSFactoryPanel() {
  const [selectedComponent, setSelectedComponent] = useState('straight')
  const [params, setParams] = useState<Record<string, number | string>>({})
  const [apiBase, setApiBase] = useState('http://localhost:8000')
  const [output, setOutput] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gdsComponents = [
    { id: 'straight', name: '直波导 (Straight)', category: 'Waveguide', params: [{ key: 'length', label: '长度 (μm)', default: 100, min: 1, max: 5000 }, { key: 'width', label: '宽度 (μm)', default: 0.5, min: 0.1, max: 5 }] },
    { id: 'bend_euler', name: '欧拉弯曲 (Bend Euler)', category: 'Waveguide', params: [{ key: 'radius', label: '半径 (μm)', default: 10, min: 1, max: 100 }, { key: 'angle', label: '角度 (°)', default: 90, min: 1, max: 180 }] },
    { id: 'mmi1x2', name: 'MMI 1×2', category: 'Coupler', params: [{ key: 'width_mmi', label: 'MMI 宽度 (μm)', default: 6, min: 2, max: 20 }, { key: 'length_mmi', label: 'MMI 长度 (μm)', default: 10, min: 3, max: 50 }] },
    { id: 'mmi2x2', name: 'MMI 2×2', category: 'Coupler', params: [{ key: 'width_mmi', label: 'MMI 宽度 (μm)', default: 6, min: 2, max: 20 }, { key: 'length_mmi', label: 'MMI 长度 (μm)', default: 12, min: 3, max: 50 }] },
    { id: 'coupler', name: '定向耦合器 (Coupler)', category: 'Coupler', params: [{ key: 'gap', label: '间隙 (μm)', default: 0.2, min: 0.05, max: 1 }, { key: 'length', label: '耦合长度 (μm)', default: 10, min: 1, max: 100 }] },
    { id: 'mzi', name: 'MZI 干涉仪', category: 'Modulator', params: [{ key: 'delta_length', label: '臂长差 ΔL (μm)', default: 10, min: 0, max: 500 }, { key: 'length_x', label: '臂长 (μm)', default: 200, min: 50, max: 5000 }] },
    { id: 'ring_single', name: '单环谐振器 (Ring)', category: 'Ring', params: [{ key: 'radius', label: '半径 (μm)', default: 10, min: 3, max: 100 }, { key: 'gap', label: '间隙 (μm)', default: 0.2, min: 0.05, max: 1 }, { key: 'length_x', label: '耦合长度 (μm)', default: 5, min: 0, max: 50 }] },
    { id: 'ring_double', name: '双环谐振器 (Ring Double)', category: 'Ring', params: [{ key: 'radius', label: '半径 (μm)', default: 10, min: 3, max: 100 }, { key: 'gap', label: '间隙 (μm)', default: 0.2, min: 0.05, max: 1 }] },
    { id: 'grating_coupler_elliptical', name: '椭圆光栅耦合器', category: 'Grating', params: [{ key: 'period', label: '周期 (μm)', default: 0.63, min: 0.4, max: 0.8 }, { key: 'n_periods', label: '周期数', default: 20, min: 5, max: 80 }, { key: 'taper_length', label: '锥形长度 (μm)', default: 200, min: 50, max: 500 }] },
    { id: 'taper', name: '锥形过渡 (Taper)', category: 'Waveguide', params: [{ key: 'length', label: '长度 (μm)', default: 50, min: 5, max: 500 }, { key: 'width1', label: '入口宽度 (μm)', default: 0.5, min: 0.1, max: 5 }, { key: 'width2', label: '出口宽度 (μm)', default: 2.0, min: 0.1, max: 10 }] },
    { id: 'disk', name: '微盘谐振器 (Disk)', category: 'Ring', params: [{ key: 'radius', label: '半径 (μm)', default: 5, min: 2, max: 50 }, { key: 'gap', label: '间隙 (μm)', default: 0.2, min: 0.05, max: 1 }] },
    { id: 'spiral', name: '螺旋延迟线 (Spiral)', category: 'Waveguide', params: [{ key: 'length', label: '总长度 (mm)', default: 1, min: 0.1, max: 100 }, { key: 'N', label: '圈数', default: 6, min: 2, max: 50 }] },
  ]

  const currentComp = gdsComponents.find((c) => c.id === selectedComponent)

  // Initialize params when component changes
  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id)
    setOutput(null)
    setError(null)
    const comp = gdsComponents.find((c) => c.id === id)
    if (comp) {
      const newParams: Record<string, number> = {}
      comp.params.forEach((p) => { newParams[p.key] = p.default })
      setParams(newParams)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setOutput(null)
    try {
      const res = await fetch(`${apiBase}/api/gds/custom?component_name=${selectedComponent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || data.message || `HTTP ${res.status}`)
      }
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await res.json()
        setOutput(JSON.stringify(data, null, 2))
      } else {
        setOutput(`✓ GDS 文件已生成 (${selectedComponent}.gds)\n下载中...`)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedComponent}.gds`
        a.click()
      }
    } catch (e: any) {
      setError(e.message || '连接后端失败。请确认后端运行在 ' + apiBase)
    }
    setLoading(false)
  }

  const categories = [...new Set(gdsComponents.map((c) => c.category))]

  return (
    <div>
      {/* Header */}
      <div className="card mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">gf</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">GDSFactory 集成</h3>
            <p className="text-sm text-gray-600 mt-1">
              直接调用 <a href="https://github.com/gdsfactory/gdsfactory" target="_blank" className="text-orange-600 hover:underline font-medium">gdsfactory</a> 的 200+ 参数化光子器件 (PCell)，
              在线配置参数并生成 GDS-II 版图文件。与 GDSFactory PDK 生态无缝对接。
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">后端地址:</span>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded w-48"
                />
              </div>
              <a href="https://gdsfactory.github.io/gdsfactory/" target="_blank" className="text-xs text-orange-600 hover:underline">📖 GDSFactory 文档</a>
              <a href="https://github.com/gdsfactory/gdsfactory" target="_blank" className="text-xs text-gray-500 hover:underline">GitHub ↗</a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Selector */}
        <div className="card max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3 sticky top-0 bg-white pb-2">选择器件 ({gdsComponents.length})</h3>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase mb-1">{cat}</p>
              <div className="space-y-1">
                {gdsComponents.filter((c) => c.category === cat).map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectComponent(comp.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedComponent === comp.id
                        ? 'bg-orange-50 border border-orange-300 text-orange-800'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{comp.name}</span>
                    <span className="text-xs text-gray-400 ml-1">gf.c.{comp.id}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Parameters */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">
            参数配置 — <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-sm">{selectedComponent}</code>
          </h3>
          {currentComp && (
            <div className="space-y-4">
              {currentComp.params.map((p) => (
                <div key={p.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="text-gray-600">{p.label}</label>
                    <span className="font-mono font-semibold text-gray-900">{params[p.key] ?? p.default}</span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={(p.max - p.min) / 100}
                    value={Number(params[p.key] ?? p.default)}
                    onChange={(e) => setParams({ ...params, [p.key]: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>{p.min}</span><span>{p.max}</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-mono">Python 等效代码:</p>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto">
{`import gdsfactory as gf

c = gf.components.${selectedComponent}(
${currentComp.params.map((p) => `    ${p.key}=${params[p.key] ?? p.default},`).join('\n')}
)
c.show()  # 可视化
c.write_gds("${selectedComponent}.gds")`}
                </pre>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> 生成中...</>
                ) : (
                  <><Download className="h-4 w-4" /> 生成 GDS 文件</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">输出</h3>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700 font-medium mb-1">⚠️ 连接错误</p>
              <p className="text-xs text-red-600">{error}</p>
              <div className="mt-3 p-3 bg-red-100 rounded text-xs text-red-800">
                <p className="font-medium mb-1">请确认后端已启动:</p>
                <pre className="font-mono">cd backend{'\n'}pip install -r requirements.txt{'\n'}uvicorn main:app --reload --port 8000</pre>
              </div>
            </div>
          )}

          {output && (
            <div className="p-4 bg-gray-900 rounded-lg font-mono text-xs text-green-400 whitespace-pre-wrap max-h-48 overflow-auto">
              {output}
            </div>
          )}

          {!output && !error && (
            <div className="text-center py-12 text-gray-400">
              <Cpu className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">选择器件并调整参数后<br />点击「生成 GDS 文件」</p>
            </div>
          )}

          {/* GDSFactory Info */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h4 className="text-sm font-medium text-orange-800 mb-2">GDSFactory 集成说明</h4>
            <ul className="text-xs text-orange-700 space-y-1">
              <li>• 后端通过 <code className="bg-orange-100 px-1 rounded">gdsfactory.components</code> 调用所有 PCell</li>
              <li>• 支持 200+ 预定义器件（波导、耦合器、环、光栅、MZI...）</li>
              <li>• 输出标准 GDS-II 格式，可直接导入 KLayout/Cadence</li>
              <li>• 兼容 GDSFactory PDK 生态（generic_tech、SiEPIC、AMF...）</li>
              <li>• 通过 <code className="bg-orange-100 px-1 rounded">/api/gds/custom</code> 接口可调用任意器件</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-gray-500">快速链接</p>
            {[
              { label: 'GDSFactory 组件库文档', url: 'https://gdsfactory.github.io/gdsfactory/components.html' },
              { label: 'PDK 开发指南', url: 'https://gdsfactory.github.io/gdsfactory/notebooks/08_pdk.html' },
              { label: 'SiEPIC PDK (UBC)', url: 'https://github.com/gdsfactory/SiEPIC' },
              { label: 'GDSFactory GitHub', url: 'https://github.com/gdsfactory/gdsfactory' },
            ].map((link) => (
              <a key={link.label} href={link.url} target="_blank" className="flex items-center gap-2 text-xs text-indigo-600 hover:underline">
                <ExternalLink className="h-3 w-3" /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Manage Panel - PDK Upload & Management
// ===================================================================
function ManagePanel() {
  const [uploads] = useState([
    { id: '1', name: 'CUMEC-SiPh180-v3.2.1', foundry: 'CUMEC', platform: 'SOI 180nm', uploadDate: '2026-06-01', size: '245 MB', status: 'published', components: 128, downloads: 342 },
    { id: '2', name: 'SiOPT-SiN800-v2.1.0', foundry: 'SiOPT', platform: 'SiN 800nm', uploadDate: '2026-05-20', size: '89 MB', status: 'published', components: 56, downloads: 187 },
    { id: '3', name: 'LNOI-Photonics-v1.3.0-beta', foundry: '济南量子', platform: 'LNOI 600nm', uploadDate: '2026-05-15', size: '67 MB', status: 'beta', components: 34, downloads: 45 },
    { id: '4', name: 'PH18-CN-v4.0.0-rc1', foundry: '绍兴中芯', platform: 'SOI 180nm', uploadDate: '2026-06-05', size: '312 MB', status: 'review', components: 156, downloads: 0 },
  ])

  return (
    <div>
      {/* Upload Area */}
      <div className="card mb-8 border-2 border-dashed border-indigo-200 bg-indigo-50/30">
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">上传 PDK 包</h3>
          <p className="text-sm text-gray-500 mb-4">支持 .zip / .tar.gz / .pdk 格式，最大 500MB</p>
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            选择文件上传
          </button>
          <p className="text-xs text-gray-400 mt-3">上传后将自动解析组件库、DRC 规则、工艺参数</p>
        </div>
      </div>

      {/* Upload Requirements */}
      <div className="card mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">PDK 包结构要求</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { folder: '/cells/', desc: 'GDS 器件单元库', required: true },
            { folder: '/models/', desc: 'Compact Model (.lib/.spi)', required: true },
            { folder: '/drc/', desc: '设计规则文件', required: true },
            { folder: '/docs/', desc: 'PDK 文档 (.pdf/.md)', required: false },
            { folder: '/tech/', desc: '工艺参数文件 (.tf/.lef)', required: true },
            { folder: '/sparam/', desc: 'S-Parameter 数据', required: false },
            { folder: '/scripts/', desc: 'EDA 工具脚本', required: false },
            { folder: '/examples/', desc: '设计示例', required: false },
          ].map((item) => (
            <div key={item.folder} className="p-3 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{item.folder}</code>
                {item.required && <span className="text-xs text-red-500">*必须</span>}
              </div>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PDK List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">已上传 PDK 管理</h3>
          <span className="text-sm text-gray-400">{uploads.length} 个 PDK</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 px-3 font-medium text-gray-600">PDK 名称</th>
                <th className="py-2 px-3 font-medium text-gray-600">Foundry</th>
                <th className="py-2 px-3 font-medium text-gray-600">组件数</th>
                <th className="py-2 px-3 font-medium text-gray-600">状态</th>
                <th className="py-2 px-3 font-medium text-gray-600">上传日期</th>
                <th className="py-2 px-3 font-medium text-gray-600">下载</th>
                <th className="py-2 px-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{u.name}</td>
                  <td className="py-2.5 px-3 text-gray-600">{u.foundry}</td>
                  <td className="py-2.5 px-3 text-gray-600">{u.components}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.status === 'published' ? 'bg-green-50 text-green-700' :
                      u.status === 'beta' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {u.status === 'published' ? '已发布' : u.status === 'beta' ? 'Beta' : '审核中'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{u.uploadDate}</td>
                  <td className="py-2.5 px-3 text-gray-600">{u.downloads}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-indigo-600 hover:underline">编辑</button>
                      <button className="text-xs text-gray-400 hover:text-red-500">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-tool Mapping */}
      <div className="card mt-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-indigo-500" /> 多工具映射配置
        </h3>
        <p className="text-sm text-gray-500 mb-4">将 PDK 组件自动映射到不同 EDA 工具的格式，确保跨工具设计兼容性</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left font-medium text-gray-600">PDK 组件</th>
                <th className="py-2 px-3 text-center font-medium text-gray-600">Lumerical</th>
                <th className="py-2 px-3 text-center font-medium text-gray-600">OptoDesigner</th>
                <th className="py-2 px-3 text-center font-medium text-gray-600">IPKISS</th>
                <th className="py-2 px-3 text-center font-medium text-gray-600">KLayout</th>
                <th className="py-2 px-3 text-center font-medium text-gray-600">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Strip Waveguide', tools: [true, true, true, true, false] },
                { name: 'PN Phase Shifter', tools: [true, true, true, true, true] },
                { name: 'Ge Photodetector', tools: [true, true, true, false, true] },
                { name: 'Grating Coupler', tools: [true, true, true, true, false] },
                { name: 'Microring Filter', tools: [true, true, true, true, false] },
                { name: 'MMI 1×2', tools: [true, true, true, true, false] },
                { name: 'Thermal Heater', tools: [true, false, true, true, true] },
                { name: 'Edge Coupler', tools: [true, true, true, true, false] },
              ].map((row) => (
                <tr key={row.name} className="border-b border-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{row.name}</td>
                  {row.tools.map((supported, i) => (
                    <td key={i} className="py-2 px-3 text-center">
                      {supported ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// S-Parameter Generation Panel
// ===================================================================
function SParamPanel() {
  const [selectedComponent, setSelectedComponent] = useState('mzi-modulator')
  const [freqStart, setFreqStart] = useState(1)
  const [freqEnd, setFreqEnd] = useState(67)
  const [points, setPoints] = useState(1000)
  const [portCount, setPortCount] = useState(4)

  const components = [
    { id: 'mzi-modulator', name: 'MZI 调制器', ports: 4, desc: '2×2 MZI with phase shifters' },
    { id: 'ring-filter', name: '微环滤波器', ports: 4, desc: 'Add-drop ring resonator' },
    { id: 'grating-coupler', name: '光栅耦合器', ports: 2, desc: 'Fiber-to-waveguide coupler' },
    { id: 'mmi-splitter', name: 'MMI 分束器', ports: 3, desc: '1×2 multimode interference' },
    { id: 'directional-coupler', name: '定向耦合器', ports: 4, desc: '2×2 directional coupler' },
    { id: 'phase-shifter', name: '相移器 (PN)', ports: 2, desc: 'Carrier-depletion phase shifter' },
    { id: 'ge-pd', name: 'Ge 光电探测器', ports: 2, desc: 'Waveguide-coupled Ge PD' },
    { id: 'edge-coupler', name: '边缘耦合器', ports: 2, desc: 'Spot-size converter' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Component Selection */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">选择器件</h3>
          <div className="space-y-2">
            {components.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedComponent(c.id); setPortCount(c.ports) }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedComponent === c.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.desc} · {c.ports} 端口</p>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">S 参数配置</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">频率范围 (GHz)</label>
              <div className="flex gap-2">
                <input type="number" value={freqStart} onChange={(e) => setFreqStart(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="起始" />
                <span className="py-2 text-gray-400">~</span>
                <input type="number" value={freqEnd} onChange={(e) => setFreqEnd(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="终止" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">频率点数</label>
              <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">端口数</label>
              <input type="number" value={portCount} readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">输出格式</label>
              <div className="flex gap-2">
                {['Touchstone (.s4p)', 'CSV', 'MATLAB (.mat)'].map((fmt) => (
                  <span key={fmt} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{fmt}</span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">仿真引擎</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>FDTD (Lumerical)</option>
                <option>EME (eigenmode expansion)</option>
                <option>BPM (beam propagation)</option>
                <option>Compact Model (解析)</option>
              </select>
            </div>
            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" /> 生成 S 参数
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">预览 & 导出</h3>
          <div className="p-4 bg-gray-900 rounded-lg mb-4 font-mono text-xs text-green-400 h-48 overflow-auto">
            <p>! Touchstone Format</p>
            <p># GHz S MA R 50</p>
            <p>! Component: {components.find(c => c.id === selectedComponent)?.name}</p>
            <p>! Ports: {portCount}</p>
            <p>! Freq Range: {freqStart}-{freqEnd} GHz</p>
            <p>! Points: {points}</p>
            <p>! Generated: {new Date().toISOString().split('T')[0]}</p>
            <p>!</p>
            <p>{freqStart.toFixed(3)}  0.95  -2.3  0.02  87.1  0.02  87.1  0.95  -2.3</p>
            <p>{(freqStart + (freqEnd-freqStart)/4).toFixed(3)}  0.89  -8.7  0.05  82.4  0.05  82.4  0.89  -8.7</p>
            <p>{(freqStart + (freqEnd-freqStart)/2).toFixed(3)}  0.78  -15.2  0.12  76.8  0.12  76.8  0.78  -15.2</p>
            <p>{(freqStart + 3*(freqEnd-freqStart)/4).toFixed(3)}  0.63  -22.1  0.21  68.3  0.21  68.3  0.63  -22.1</p>
            <p>{freqEnd.toFixed(3)}  0.45  -31.5  0.35  55.7  0.35  55.7  0.45  -31.5</p>
            <p>...</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-green-700">
              <Download className="h-3.5 w-3.5" /> .s{portCount}p
            </button>
            <button className="flex-1 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-700">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">S 参数自动根据 PDK compact model 参数和仿真引擎生成，可直接导入 INTERCONNECT 或 ADS 进行系统级仿真。</p>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// IP Blackbox & NDA Tracking Panel
// ===================================================================
function IPNDAPanel() {
  const [ipBlocks] = useState([
    { id: '1', name: 'High-Speed MZM (50G+)', owner: 'CUMEC', level: 'blackbox', nda: 'Tier-1 NDA', expiry: '2027-12-31', accessors: 12, lastAccess: '2026-06-05' },
    { id: '2', name: 'Ge-PD Array (4ch)', owner: 'SiOPT', level: 'greybox', nda: 'Academic NDA', expiry: '2026-12-31', accessors: 45, lastAccess: '2026-06-04' },
    { id: '3', name: 'Polarization Rotator', owner: '光迅科技', level: 'blackbox', nda: 'Strategic NDA', expiry: '2028-06-30', accessors: 3, lastAccess: '2026-05-20' },
    { id: '4', name: 'IQ Modulator (TFLN)', owner: '铌奥光电', level: 'blackbox', nda: 'Evaluation NDA', expiry: '2026-09-30', accessors: 8, lastAccess: '2026-06-01' },
    { id: '5', name: 'AWG 8ch DWDM', owner: 'CUMEC', level: 'whitebox', nda: 'Open PDK', expiry: 'N/A', accessors: 234, lastAccess: '2026-06-06' },
    { id: '6', name: 'TiN Heater (低功耗)', owner: '绍兴中芯', level: 'greybox', nda: 'Tier-2 NDA', expiry: '2027-06-30', accessors: 28, lastAccess: '2026-05-28' },
  ])

  return (
    <div>
      {/* IP Protection Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { level: 'Blackbox', icon: Lock, color: '#ef4444', desc: '仅提供端口 S 参数和性能指标，不暴露内部结构', count: 3 },
          { level: 'Greybox', icon: EyeOff, color: '#f97316', desc: '提供参数化模型和部分结构信息，几何细节隐藏', count: 2 },
          { level: 'Whitebox', icon: Eye, color: '#22c55e', desc: '完整 GDS + 仿真模型开放，适合 Open PDK', count: 1 },
        ].map((item) => (
          <div key={item.level} className="card">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="h-5 w-5" style={{ color: item.color }} />
              <h4 className="font-semibold text-gray-900">{item.level}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-auto">{item.count} 个 IP</span>
            </div>
            <p className="text-xs text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* IP Block Table */}
      <div className="card mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" /> IP 黑盒管理 & NDA 追踪
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 px-3 font-medium text-gray-600">IP 名称</th>
                <th className="py-2 px-3 font-medium text-gray-600">所有者</th>
                <th className="py-2 px-3 font-medium text-gray-600">保护级别</th>
                <th className="py-2 px-3 font-medium text-gray-600">NDA 类型</th>
                <th className="py-2 px-3 font-medium text-gray-600">到期日</th>
                <th className="py-2 px-3 font-medium text-gray-600">访问者</th>
                <th className="py-2 px-3 font-medium text-gray-600">最近访问</th>
              </tr>
            </thead>
            <tbody>
              {ipBlocks.map((ip) => (
                <tr key={ip.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{ip.name}</td>
                  <td className="py-2.5 px-3 text-gray-600">{ip.owner}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ip.level === 'blackbox' ? 'bg-red-50 text-red-700' :
                      ip.level === 'greybox' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {ip.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{ip.nda}</td>
                  <td className="py-2.5 px-3 text-gray-500">{ip.expiry}</td>
                  <td className="py-2.5 px-3 text-gray-600">{ip.accessors} 人</td>
                  <td className="py-2.5 px-3 text-gray-400">{ip.lastAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NDA Workflow */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">NDA 审批流程</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            { step: '1', label: '申请访问', desc: '提交 NDA 申请表' },
            { step: '2', label: 'Foundry 审批', desc: 'IP 所有者确认' },
            { step: '3', label: 'NDA 签署', desc: '在线电子签约' },
            { step: '4', label: '权限开通', desc: '有限期限访问' },
            { step: '5', label: '审计追踪', desc: '使用记录存证' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mx-auto mb-1">{s.step}</div>
                <p className="text-xs font-medium text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              {i < 4 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Version Control Panel
// ===================================================================
function VersionsPanel() {
  const [versions] = useState([
    { version: 'v3.2.1', pdk: 'CUMEC-SiPh180', date: '2026-06-01', author: '张工', changes: '+12 components, bug fix: Ge-PD model S21', tag: 'stable', commits: 8 },
    { version: 'v3.2.0', pdk: 'CUMEC-SiPh180', date: '2026-05-15', author: '李工', changes: '新增 TiN heater compact model, 更新 DRC 规则', tag: 'stable', commits: 15 },
    { version: 'v3.1.0', pdk: 'CUMEC-SiPh180', date: '2026-04-20', author: '王工', changes: '添加 SiN 层器件库, 更新光栅耦合器模型', tag: 'stable', commits: 23 },
    { version: 'v3.0.0', pdk: 'CUMEC-SiPh180', date: '2026-03-01', author: '张工', changes: '大版本升级: 新工艺节点参数, 重构调制器模型', tag: 'major', commits: 67 },
    { version: 'v2.1.0', pdk: 'SiOPT-SiN800', date: '2026-05-20', author: '陈工', changes: '新增高 Q 微环模型, AWG 16ch 组件', tag: 'stable', commits: 11 },
    { version: 'v1.3.0-beta', pdk: 'LNOI-Photonics', date: '2026-05-15', author: '刘工', changes: 'Beta: IQ 调制器模型, 波导损耗更新', tag: 'beta', commits: 6 },
  ])

  const [diffView, setDiffView] = useState(false)

  return (
    <div>
      {/* Version Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">4</p>
          <p className="text-xs text-gray-500">活跃 PDK 仓库</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">23</p>
          <p className="text-xs text-gray-500">总版本数</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">130</p>
          <p className="text-xs text-gray-500">总提交数</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-600">5</p>
          <p className="text-xs text-gray-500">贡献者</p>
        </div>
      </div>

      {/* Version Timeline */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-indigo-500" /> 版本历史
          </h3>
          <button
            onClick={() => setDiffView(!diffView)}
            className="text-xs text-indigo-600 hover:underline"
          >
            {diffView ? '隐藏 Diff' : '显示 Diff 视图'}
          </button>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {versions.map((v) => (
              <div key={`${v.pdk}-${v.version}`} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white z-10 flex-shrink-0 ${
                  v.tag === 'major' ? 'bg-purple-500' :
                  v.tag === 'beta' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  {v.tag === 'major' ? 'M' : v.tag === 'beta' ? 'β' : '✓'}
                </div>
                <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-bold text-gray-900">{v.version}</code>
                    <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{v.pdk}</span>
                    <span className="text-xs text-gray-400 ml-auto">{v.date} · {v.author}</span>
                  </div>
                  <p className="text-xs text-gray-600">{v.changes}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{v.commits} commits</span>
                    <button className="text-xs text-indigo-600 hover:underline">查看详情</button>
                    <button className="text-xs text-indigo-600 hover:underline">下载</button>
                  </div>
                  {diffView && (
                    <div className="mt-2 p-2 bg-gray-900 rounded text-xs font-mono text-gray-300 max-h-20 overflow-auto">
                      <p className="text-green-400">+ cells/heater_low_power.gds</p>
                      <p className="text-green-400">+ models/heater_compact.lib</p>
                      <p className="text-yellow-400">~ drc/min_spacing.rules (updated)</p>
                      <p className="text-red-400">- cells/deprecated_coupler_v1.gds</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Policy */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">分支策略 & 发布规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">main (稳定版)</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• 经过完整 DRC/LVS 验证</li>
              <li>• 所有 compact model 已校准</li>
              <li>• 通过 Foundry 签核 (sign-off)</li>
              <li>• 语义化版本号 (SemVer)</li>
            </ul>
          </div>
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h4 className="font-medium text-yellow-800 mb-2">develop (开发版)</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• 新器件/模型持续集成</li>
              <li>• 自动化仿真回归测试</li>
              <li>• 每周自动构建</li>
              <li>• 内部测试用户可访问</li>
            </ul>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h4 className="font-medium text-purple-800 mb-2">feature/* (功能分支)</h4>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• 单个器件/功能开发</li>
              <li>• 合并前需 Code Review</li>
              <li>• 自动 S-parameter 回归</li>
              <li>• CI/CD Pipeline 验证</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


// ===================================================================
// Compatibility Matrix Panel - 器件 × Foundry × EDA 三维对照表
// ===================================================================
function CompatibilityMatrixPanel() {
  const devices = ['Strip WG', 'Rib WG', 'MMI 1×2', 'MZM (PN)', 'Ge-PD', 'Grating Coupler', 'Edge Coupler', 'Microring', 'AWG', 'TiN Heater', 'TFLN MZM', 'DFB Laser', 'EML', 'SOA']
  const foundryList = ['CUMEC SOI', 'SiOPT SiN', 'PH18 Tower', 'LNOI', 'InP-EPI', 'Accelink']
  const edaList = ['Lumerical', 'OptoDesigner', 'IPKISS', 'KLayout', 'Cadence', 'COMSOL', 'GDSFactory']

  // Foundry compatibility (1=available)
  const foundryMatrix: Record<string, number[]> = {
    'Strip WG':        [1,0,1,0,0,1],
    'Rib WG':          [1,0,1,0,0,1],
    'MMI 1×2':         [1,1,1,0,0,1],
    'MZM (PN)':        [1,0,1,0,0,1],
    'Ge-PD':           [1,0,1,0,0,1],
    'Grating Coupler': [1,1,1,0,0,1],
    'Edge Coupler':    [1,1,1,1,0,1],
    'Microring':       [1,1,1,1,0,1],
    'AWG':             [1,1,1,0,0,0],
    'TiN Heater':      [1,0,1,0,0,1],
    'TFLN MZM':        [0,0,0,1,0,0],
    'DFB Laser':       [0,0,0,0,1,0],
    'EML':             [0,0,0,0,1,0],
    'SOA':             [0,0,0,0,1,0],
  }

  // EDA compatibility
  const edaMatrix: Record<string, number[]> = {
    'Strip WG':        [1,1,1,1,0,1,1],
    'Rib WG':          [1,1,1,1,0,1,1],
    'MMI 1×2':         [1,1,1,1,0,0,1],
    'MZM (PN)':        [1,1,1,1,1,1,1],
    'Ge-PD':           [1,1,1,0,1,1,1],
    'Grating Coupler': [1,1,1,1,0,1,1],
    'Edge Coupler':    [1,1,1,1,0,0,1],
    'Microring':       [1,1,1,1,0,1,1],
    'AWG':             [1,1,1,1,0,0,1],
    'TiN Heater':      [1,0,1,1,1,1,1],
    'TFLN MZM':        [1,0,0,1,0,1,0],
    'DFB Laser':       [1,0,0,0,0,0,0],
    'EML':             [1,0,0,0,0,0,0],
    'SOA':             [1,0,0,0,1,0,0],
  }

  const [view, setView] = useState<'foundry' | 'eda'>('foundry')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">PDK 兼容性矩阵</h3>
          <p className="text-sm text-gray-500">器件 × Foundry × EDA 三维兼容性对照</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('foundry')} className={`px-3 py-1.5 rounded text-xs font-medium ${view === 'foundry' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>器件 × Foundry</button>
          <button onClick={() => setView('eda')} className={`px-3 py-1.5 rounded text-xs font-medium ${view === 'eda' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>器件 × EDA</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {foundryList.map((f, i) => (
          <div key={f} className="bg-white rounded-lg p-3 border text-center">
            <p className="text-lg font-bold text-indigo-600">{Object.values(foundryMatrix).filter((r) => r[i]).length}</p>
            <p className="text-xs text-gray-500">{f}</p>
            <p className="text-xs text-gray-400">器件数</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-2 px-3 text-left font-medium text-gray-700 sticky left-0 bg-gray-50">器件</th>
              {(view === 'foundry' ? foundryList : edaList).map((h) => (
                <th key={h} className="py-2 px-2 text-center font-medium text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-3 font-medium text-gray-800 sticky left-0 bg-white">{d}</td>
                {(view === 'foundry' ? foundryMatrix[d] : edaMatrix[d])?.map((v, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    {v ? <span className="text-green-500">✓</span> : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDK Usage Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">PDK 使用统计</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'CUMEC-SiPh180', downloads: 2341, users: 456, tapeouts: 23 },
            { name: 'SiOPT-SiN800', downloads: 1287, users: 234, tapeouts: 12 },
            { name: 'PH18-CN', downloads: 876, users: 145, tapeouts: 8 },
            { name: 'LNOI-Photonics', downloads: 543, users: 98, tapeouts: 3 },
            { name: 'InP-EPI', downloads: 234, users: 45, tapeouts: 5 },
            { name: 'Accelink', downloads: 123, users: 28, tapeouts: 15 },
          ].map((p) => (
            <div key={p.name} className="p-3 border border-gray-100 rounded-lg text-center">
              <p className="text-xs font-medium text-gray-700 mb-2">{p.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-gray-400">下载</span><span className="font-medium">{p.downloads}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">活跃用户</span><span className="font-medium">{p.users}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">流片数</span><span className="font-medium text-green-600">{p.tapeouts}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// MPW Calendar Panel - 日历视图 + 邮件提醒
// ===================================================================
function MPWCalendarPanel() {
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const mpwEvents = [
    { foundry: 'CUMEC', run: 'MPW-2026-Q3', deadline: '2026-07-15', tapeout: '2026-08-01', delivery: '2026-10-15', status: 'open', color: '#3b82f6' },
    { foundry: 'SiOPT', run: 'MPW-2026-Q3', deadline: '2026-07-20', tapeout: '2026-08-10', delivery: '2026-10-20', status: 'open', color: '#8b5cf6' },
    { foundry: 'Tower/SMIC', run: 'MPW-2026-Q3', deadline: '2026-07-30', tapeout: '2026-08-15', delivery: '2026-11-01', status: 'open', color: '#059669' },
    { foundry: 'LNOI', run: 'MPW-2026-Q3', deadline: '2026-08-01', tapeout: '2026-08-20', delivery: '2026-10-30', status: 'upcoming', color: '#eab308' },
    { foundry: 'CUMEC', run: 'MPW-2026-Q4', deadline: '2026-10-15', tapeout: '2026-11-01', delivery: '2027-01-15', status: 'planned', color: '#3b82f6' },
    { foundry: 'SiOPT', run: 'MPW-2026-Q4', deadline: '2026-10-20', tapeout: '2026-11-10', delivery: '2027-01-20', status: 'planned', color: '#8b5cf6' },
    { foundry: 'CUMEC', run: 'MPW-2026-Q2', deadline: '2026-04-15', tapeout: '2026-05-01', delivery: '2026-07-15', status: 'fabricating', color: '#3b82f6' },
    { foundry: 'SiOPT', run: 'MPW-2026-Q2', deadline: '2026-04-20', tapeout: '2026-05-10', delivery: '2026-07-20', status: 'delivered', color: '#8b5cf6' },
  ]

  const months = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']
  const monthNames = ['6月', '7月', '8月', '9月', '10月', '11月']

  const handleSubscribe = () => {
    if (subscribeEmail.includes('@')) { setSubscribed(true) }
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">MPW 多项目晶圆日历</h3>
          <p className="text-sm text-gray-500">各 Foundry MPW 时间轴总览，订阅截止日期提醒</p>
        </div>
      </div>

      {/* Timeline Calendar */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month headers */}
          <div className="flex border-b border-gray-200 pb-2 mb-4">
            <div className="w-28 flex-shrink-0" />
            {monthNames.map((m) => (
              <div key={m} className="flex-1 text-center text-xs font-medium text-gray-500">{m}</div>
            ))}
          </div>
          {/* Foundry rows */}
          {['CUMEC', 'SiOPT', 'Tower/SMIC', 'LNOI'].map((foundry) => {
            const events = mpwEvents.filter((e) => e.foundry === foundry)
            return (
              <div key={foundry} className="flex items-center mb-3">
                <div className="w-28 flex-shrink-0 text-xs font-medium text-gray-700">{foundry}</div>
                <div className="flex-1 relative h-8 bg-gray-50 rounded">
                  {events.map((evt) => {
                    const startMonth = parseInt(evt.deadline.split('-')[1]) - 6
                    const endMonth = parseInt(evt.delivery.split('-')[1]) - 6
                    const left = Math.max(0, startMonth / 6 * 100)
                    const width = Math.max(8, (endMonth - startMonth + 1) / 6 * 100)
                    return (
                      <div key={evt.run} className="absolute top-1 h-6 rounded-md flex items-center px-2 text-xs text-white font-medium overflow-hidden"
                        style={{ left: `${left}%`, width: `${width}%`, backgroundColor: evt.color, opacity: evt.status === 'delivered' ? 0.4 : 0.85 }}
                        title={`${evt.run}: ${evt.deadline} → ${evt.delivery}`}>
                        {evt.run.split('-').slice(-1)[0]}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event List */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">即将到来的截止日期</h4>
        <div className="space-y-2">
          {mpwEvents.filter((e) => e.status === 'open' || e.status === 'upcoming').sort((a, b) => a.deadline.localeCompare(b.deadline)).map((evt) => (
            <div key={evt.foundry + evt.run} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: evt.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{evt.foundry} — {evt.run}</p>
                <p className="text-xs text-gray-500">截止: {evt.deadline} · Tape-out: {evt.tapeout} · 交付: {evt.delivery}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${evt.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {evt.status === 'open' ? '🟢 接受投片' : '🔵 即将开放'}
              </span>
              <button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">预定</button>
            </div>
          ))}
        </div>
      </div>

      {/* Email Subscription */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="font-semibold text-gray-900 mb-3">📧 MPW 截止日期邮件提醒</h4>
        <p className="text-sm text-gray-500 mb-4">订阅后将在截止日期前 7 天、3 天、1 天收到邮件提醒</p>
        {subscribed ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ 已订阅！提醒将发送到 {subscribeEmail}
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="email" value={subscribeEmail} onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="输入邮箱地址" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm" />
            <button onClick={handleSubscribe} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              订阅提醒
            </button>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {['CUMEC', 'SiOPT', 'Tower/SMIC', 'LNOI', 'InP'].map((f) => (
            <label key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
              <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />{f}
            </label>
          ))}
        </div>
      </div>

      {/* Foundry Admin Notice */}
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-800 font-medium mb-1">🏭 Foundry 管理端</p>
        <p className="text-xs text-orange-700">Foundry 方可通过后台管理入口 (/admin/foundry) 更新 MPW 时间表和 PDK 版本。如需开通 Foundry 管理权限，请联系 admin@photoncloud.cn。</p>
      </div>
    </div>
  )
}
