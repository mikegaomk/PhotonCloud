import { useState } from 'react'
import { Layers, Cpu, Radio, ChevronRight } from 'lucide-react'
import ChipCard from '../components/ChipCard'
import { photonicsChips } from '../data/photonicsData'

type CategoryLevel = 'all' | 'materials' | 'chips' | 'systems'

interface TechTreeNode {
  id: string
  label: string
  level: CategoryLevel
  icon: typeof Layers
  color: string
  description: string
  chipIds: string[]
  subItems: { name: string; desc: string }[]
}

const techTree: TechTreeNode[] = [
  {
    id: 'materials',
    label: '光芯片基础材料',
    level: 'materials',
    icon: Layers,
    color: '#8b5cf6',
    description: '构成光芯片的核心材料体系，决定器件的光学、电学和热学性能',
    chipIds: [],
    subItems: [
      { name: 'InP (磷化铟)', desc: '直接带隙 III-V 族半导体，1.3/1.55μm 光源和调制器的基础材料' },
      { name: 'InGaAsP / InGaAlAs', desc: '量子阱有源层材料，通过组分调节覆盖 1.0-1.65μm 波段' },
      { name: 'Si (硅)', desc: '间接带隙，CMOS 兼容，波导和调制器平台（SOI）' },
      { name: 'Ge (锗)', desc: '窄带隙 (0.67eV)，1310/1550nm 光探测器吸收材料' },
      { name: 'LiNbO₃ (铌酸锂)', desc: '强 Pockels 电光效应 (r₃₃=31pm/V)，超高速调制器材料' },
      { name: 'Si₃N₄ (氮化硅)', desc: '超低损耗波导 (<0.01 dB/cm)，无源光学和外腔激光器' },
      { name: 'SiO₂ (二氧化硅)', desc: '包层和绝缘层材料，光纤和平面波导基础' },
      { name: 'InAs 量子点', desc: '零维量子限制结构，确定性单光子源和片上激光器' },
      { name: 'Er³⁺ (铒离子)', desc: '稀土掺杂离子，1.55μm 光放大的增益介质' },
      { name: 'NbN / WSi', desc: '超导薄膜材料，超导纳米线单光子探测器 (SNSPD)' },
      { name: 'PPLN / PPKTP', desc: '准相位匹配非线性晶体，参量下转换光子对源' },
      { name: 'PCM (相变材料)', desc: 'Ge₂Sb₂Te₅ 等相变材料，非易失光子器件和光计算权重存储' },
    ],
  },
  {
    id: 'chips',
    label: '光芯片',
    level: 'chips',
    icon: Cpu,
    color: '#3b82f6',
    description: '基于各类材料制造的功能性光子集成芯片，包括光源、调制、探测、放大和计算',
    chipIds: ['eml', 'cw-laser', 'tfln', 'silicon-photonics', 'photonic-computing', 'optical-amplifier', 'quantum-photonics'],
    subItems: [
      { name: 'EML (电吸收调制激光器)', desc: 'InP 单片集成 DFB+EAM，100G/400G 直调方案' },
      { name: 'CW Laser (连续波激光器)', desc: '外调制方案的稳定光源，硅光/CPO 核心组件' },
      { name: 'TFLN (薄膜铌酸锂调制器)', desc: '超高带宽 (>110GHz)、低 Vπ 的下一代调制器' },
      { name: 'Silicon Photonics (硅光)', desc: 'CMOS 兼容的大规模光电集成平台' },
      { name: 'Ge-PD (锗光电探测器)', desc: '硅光平台上的高速光电转换器件' },
      { name: 'SOA (半导体光放大器)', desc: 'InP 基片上光放大，可集成' },
      { name: 'EDFA (掺铒光纤放大器)', desc: 'C/L-band 光纤通信的核心放大器件' },
      { name: 'Photonic Computing (光计算)', desc: 'MZI/微环实现矩阵乘法，AI 推理加速' },
      { name: 'Quantum PIC (量子光子芯片)', desc: '单光子源+干涉网络+探测的量子处理器' },
      { name: 'AWG (阵列波导光栅)', desc: '波分复用/解复用核心无源器件' },
      { name: 'Microring Resonator', desc: '高 Q 谐振器，用于滤波/调制/传感' },
    ],
  },
  {
    id: 'systems',
    label: '系统应用',
    level: 'systems',
    icon: Radio,
    color: '#059669',
    description: '将光芯片集成为完整系统方案，面向通信、计算、传感等场景',
    chipIds: ['cpo'],
    subItems: [
      { name: 'CPO (光电共封装)', desc: '光引擎与 ASIC 同基板封装，AI/交换机互连' },
      { name: '相干光模块 (400G/800G/1.6T)', desc: 'DP-16QAM/64QAM，DSP+硅光/TFLN PIC' },
      { name: '直检光模块 (DR/FR/LR)', desc: 'PAM4 直接检测，EML/SiPh MZM 方案' },
      { name: 'DWDM 传输系统', desc: 'C+L band 多通道复用，EDFA 级联，海底/长途' },
      { name: 'AI 集群光互连', desc: 'GPU/TPU 间全光互连，CPO+光交换' },
      { name: 'LiDAR (激光雷达)', desc: '硅光/InP OPA 芯片化固态扫描' },
      { name: '光纤传感系统', desc: '分布式温度/应变/振动传感 (DTS/DAS)' },
      { name: 'QKD 系统 (量子密钥分发)', desc: '基于单光子和纠缠的安全通信' },
      { name: '光量子计算机', desc: 'FBQC/玻色采样等光子架构量子计算' },
      { name: '微波光子系统', desc: '光载射频信号处理，5G/雷达/电子战' },
      { name: '生物光子传感', desc: '片上光学检测，即时诊断 (POC)' },
    ],
  },
]

export default function ChipsPage() {
  const [activeLevel, setActiveLevel] = useState<CategoryLevel>('all')
  const [expandedNode, setExpandedNode] = useState<string | null>(null)

  const activeNode = techTree.find((n) => n.id === activeLevel)
  const visibleChips = activeLevel === 'all'
    ? photonicsChips
    : photonicsChips.filter((c) => (activeNode?.chipIds || []).includes(c.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">光芯片技术库</h1>
      <p className="text-gray-500 mb-8">
        从基础材料到系统应用，涵盖光芯片全产业链技术知识
      </p>

      {/* Three-level Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveLevel('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLevel === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            全部技术
          </button>
          {techTree.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveLevel(node.level)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLevel === node.level ? 'text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              style={activeLevel === node.level ? { backgroundColor: node.color } : undefined}
            >
              <node.icon className="h-4 w-4" />
              {node.label}
            </button>
          ))}
        </div>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          <span className="text-gray-600 font-medium">技术库</span>
          <ChevronRight className="h-3 w-3" />
          <span className={`font-medium ${activeLevel === 'materials' ? 'text-purple-600' : activeLevel === 'chips' ? 'text-blue-600' : activeLevel === 'systems' ? 'text-green-600' : 'text-gray-600'}`}>
            {activeLevel === 'all' ? '全部技术' : activeNode?.label}
          </span>
        </div>
      </div>

      {/* Tech Tree Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {techTree.map((node) => (
          <div
            key={node.id}
            className={`card cursor-pointer transition-all ${activeLevel === node.level ? 'ring-2 ring-offset-2' : 'hover:shadow-lg'}`}
            style={activeLevel === node.level ? { borderColor: node.color } : undefined}
            onClick={() => { setActiveLevel(node.level); setExpandedNode(expandedNode === node.id ? null : node.id) }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: node.color }}>
                <node.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{node.label}</h3>
                <p className="text-xs text-gray-500">{node.subItems.length} 个子类</p>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-400 ml-auto transition-transform ${expandedNode === node.id ? 'rotate-90' : ''}`} />
            </div>
            <p className="text-sm text-gray-600 mb-3">{node.description}</p>

            {expandedNode === node.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 max-h-64 overflow-y-auto">
                {node.subItems.map((item) => (
                  <div key={item.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: node.color }} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flow Arrow */}
      <div className="hidden lg:flex items-center justify-center gap-4 mb-10 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
            <Layers className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">基础材料</span>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">光芯片</span>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            <Radio className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">系统应用</span>
          </div>
        </div>
      </div>

      {/* Chip Cards */}
      {visibleChips.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {activeLevel === 'all' ? '全部光芯片技术' : `${activeNode?.label}相关芯片`}
            <span className="text-sm font-normal text-gray-400 ml-2">({visibleChips.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleChips.map((chip) => (
              <ChipCard key={chip.id} chip={chip} />
            ))}
          </div>
        </>
      )}

      {activeLevel === 'materials' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">材料体系详解</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techTree[0].subItems.map((item) => (
              <div key={item.name} className="card !p-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLevel === 'systems' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">系统应用方向</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techTree[2].subItems.map((item) => (
              <div key={item.name} className="card !p-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
