import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Ruler, Waves, Thermometer, Zap, Box, Cpu } from 'lucide-react'

type DesignMode = 'waveguide' | 'coupler' | 'ring-filter' | 'mzi-design' | 'grating' | 'thermal'

const designModes: { key: DesignMode; label: string; icon: typeof Ruler; desc: string }[] = [
  { key: 'waveguide', label: '波导模式求解', icon: Waves, desc: '计算单模条件和有效折射率' },
  { key: 'coupler', label: '定向耦合器', icon: Ruler, desc: '耦合长度与分光比设计' },
  { key: 'ring-filter', label: '微环滤波器', icon: Box, desc: '滤波器形状和带宽设计' },
  { key: 'mzi-design', label: 'MZI 开关/调制器', icon: Zap, desc: '干涉臂长和调制效率' },
  { key: 'grating', label: '光栅耦合器', icon: Cpu, desc: '耦合效率与角度优化' },
  { key: 'thermal', label: '热调谐器仿真', icon: Thermometer, desc: '加热功率与响应速度' },
]

export default function DesignPage() {
  const [mode, setMode] = useState<DesignMode>('waveguide')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">光芯片设计与仿真</h1>
      <p className="text-gray-500 mb-8">
        交互式光子器件设计工具 — 输入结构参数，实时计算性能指标和优化曲线
      </p>

      {/* Mode Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {designModes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`p-3 rounded-xl text-center transition-all ${
              mode === m.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:shadow'
            }`}
          >
            <m.icon className={`h-5 w-5 mx-auto mb-1.5 ${mode === m.key ? 'text-white' : 'text-indigo-500'}`} />
            <p className="text-xs font-medium">{m.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-1 mb-4">
        <p className="text-xs text-gray-400 px-3 py-1">
          {designModes.find((m) => m.key === mode)?.desc}
        </p>
      </div>

      {mode === 'waveguide' && <WaveguideDesign />}
      {mode === 'coupler' && <CouplerDesign />}
      {mode === 'ring-filter' && <RingFilterDesign />}
      {mode === 'mzi-design' && <MZIDesign />}
      {mode === 'grating' && <GratingDesign />}
      {mode === 'thermal' && <ThermalDesign />}
    </div>
  )
}

// ===================================================================
// 1. Waveguide Mode Solver
// ===================================================================
function WaveguideDesign() {
  const [width, setWidth] = useState(450)
  const [height, setHeight] = useState(220)
  const [nCore, setNCore] = useState(3.48)
  const [nClad, setNClad] = useState(1.44)
  const [wavelength, setWavelength] = useState(1550)

  const modeData = useMemo(() => {
    const points = []
    for (let w = 200; w <= 800; w += 10) {
      const V = (Math.PI * w / 1000 / (wavelength / 1000)) * Math.sqrt(nCore ** 2 - nClad ** 2)
      const neff_TE = nClad + (nCore - nClad) * (1 - Math.exp(-V * 0.8))
      const neff_TM = nClad + (nCore - nClad) * (1 - Math.exp(-V * 0.65)) * 0.95
      const numModes = Math.floor(V / Math.PI * 2) + 1
      points.push({
        width: w,
        neff_TE: parseFloat(neff_TE.toFixed(4)),
        neff_TM: parseFloat(neff_TM.toFixed(4)),
        modes: numModes,
      })
    }
    return points
  }, [nCore, nClad, wavelength])

  const V_current = (Math.PI * width / 1000 / (wavelength / 1000)) * Math.sqrt(nCore ** 2 - nClad ** 2)
  const neff = nClad + (nCore - nClad) * (1 - Math.exp(-V_current * 0.8))
  const ng = neff + wavelength * 0.001 * 0.5 // simplified group index
  const confinement = 1 - Math.exp(-V_current * 0.6)
  const singleModeMax = Math.floor((wavelength / 1000) / (Math.sqrt(nCore ** 2 - nClad ** 2)) * 1000 * 0.7)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">有效折射率 vs 波导宽度</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={modeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="width" label={{ value: 'Width (nm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis domain={[1.4, 3.5]} label={{ value: 'neff', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="neff_TE" stroke="#3b82f6" dot={false} strokeWidth={2} name="TE mode" />
            <Line type="monotone" dataKey="neff_TM" stroke="#ef4444" dot={false} strokeWidth={2} name="TM mode" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
          💡 单模条件：宽度 &lt; {singleModeMax} nm（当前平台，{wavelength}nm 波长）
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">波导参数</h3>
        <div className="space-y-4">
          <SliderParam label="波导宽度 (nm)" value={width} onChange={setWidth} min={200} max={800} step={10} />
          <SliderParam label="波导高度 (nm)" value={height} onChange={setHeight} min={100} max={400} step={10} />
          <SliderParam label="芯层折射率 ncore" value={nCore} onChange={setNCore} min={1.5} max={3.5} step={0.01} />
          <SliderParam label="包层折射率 nclad" value={nClad} onChange={setNClad} min={1.0} max={2.5} step={0.01} />
          <SliderParam label="波长 (nm)" value={wavelength} onChange={setWavelength} min={1260} max={1650} step={10} />
        </div>
        <ResultBox results={[
          { label: '有效折射率 neff', value: neff.toFixed(4) },
          { label: '群折射率 ng', value: ng.toFixed(3) },
          { label: 'V 参数', value: V_current.toFixed(2) },
          { label: '模场限制因子 Γ', value: `${(confinement * 100).toFixed(1)}%` },
          { label: '单模上限宽度', value: `${singleModeMax} nm` },
          { label: '双折射 Δn', value: (neff - (nClad + (nCore - nClad) * (1 - Math.exp(-V_current * 0.65)) * 0.95)).toFixed(4) },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// 2. Directional Coupler Design
// ===================================================================
function CouplerDesign() {
  const [gap, setGap] = useState(200)
  const [couplerLength, setCouplerLength] = useState(10)
  const [neff, setNeff] = useState(2.45)
  const [wavelength, setWavelength] = useState(1550)

  const couplerData = useMemo(() => {
    const points = []
    const kappa = 0.3 * Math.exp(-gap / 100) // simplified coupling coefficient
    for (let L = 0; L <= 50; L += 0.5) {
      const crossPower = Math.sin(kappa * L) ** 2
      const throughPower = Math.cos(kappa * L) ** 2
      points.push({
        length: L,
        cross: parseFloat((crossPower * 100).toFixed(1)),
        through: parseFloat((throughPower * 100).toFixed(1)),
      })
    }
    return points
  }, [gap])

  const kappa = 0.3 * Math.exp(-gap / 100)
  const Lc = Math.PI / (2 * kappa) // coupling length for 100% crossover
  const L_3dB = Lc / 2 // 50:50 coupling length
  const crossRatio = Math.sin(kappa * couplerLength) ** 2
  const er = crossRatio > 0.01 ? 10 * Math.log10(crossRatio / (1 - crossRatio)) : -30

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">耦合比 vs 耦合长度</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={couplerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="length" label={{ value: 'Coupler Length (μm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Power (%)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="cross" stroke="#6366f1" fill="#6366f120" strokeWidth={2} name="Cross Port (%)" />
            <Area type="monotone" dataKey="through" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} name="Through Port (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">耦合器参数</h3>
        <div className="space-y-4">
          <SliderParam label="波导间隙 (nm)" value={gap} onChange={setGap} min={100} max={500} step={10} />
          <SliderParam label="耦合区长度 (μm)" value={couplerLength} onChange={setCouplerLength} min={0} max={50} step={0.5} />
          <SliderParam label="有效折射率 neff" value={neff} onChange={setNeff} min={2.0} max={3.0} step={0.01} />
          <SliderParam label="波长 (nm)" value={wavelength} onChange={setWavelength} min={1260} max={1650} step={10} />
        </div>
        <ResultBox results={[
          { label: '耦合系数 κ', value: `${kappa.toFixed(4)} μm⁻¹` },
          { label: '完全耦合长度 Lc', value: `${Lc.toFixed(1)} μm` },
          { label: '3dB 耦合长度', value: `${L_3dB.toFixed(1)} μm` },
          { label: '交叉功率', value: `${(crossRatio * 100).toFixed(1)}%` },
          { label: '直通功率', value: `${((1 - crossRatio) * 100).toFixed(1)}%` },
          { label: '分光比 (dB)', value: er.toFixed(1) },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// 3. Microring Filter Design
// ===================================================================
function RingFilterDesign() {
  const [radius, setRadius] = useState(10)
  const [kappa1, setKappa1] = useState(0.15)
  const [kappa2, setKappa2] = useState(0.15)
  const [loss, setLoss] = useState(3)
  const [neff, setNeff] = useState(2.45)
  const [order, setOrder] = useState(1)

  const filterData = useMemo(() => {
    const points = []
    const L = 2 * Math.PI * radius * 1e-6
    const alpha = Math.exp(-loss * 100 * L / 2)
    const t1 = Math.sqrt(1 - kappa1 ** 2)
    const t2 = Math.sqrt(1 - kappa2 ** 2)

    for (let dlambda = -1.5; dlambda <= 1.5; dlambda += 0.002) {
      const lambda = 1550 + dlambda
      const phi = 2 * Math.PI * neff * L / (lambda * 1e-9)

      let dropT: number
      if (order === 1) {
        // Single ring: add-drop
        const num = -kappa1 * kappa2 * alpha // simplified (phase term dropped for power calc)
        const dropPower = (kappa1 ** 2 * kappa2 ** 2 * alpha ** 2) / ((1 - t1 * t2 * alpha) ** 2 + 4 * t1 * t2 * alpha * Math.sin(phi / 2) ** 2)
        const throughPower = (t1 ** 2 + (t2 * alpha) ** 2 - 2 * t1 * t2 * alpha * Math.cos(phi)) / ((1 - t1 * t2 * alpha) ** 2 + 4 * t1 * t2 * alpha * Math.sin(phi / 2) ** 2)
        dropT = dropPower
      } else {
        // Simplified 2nd order (cascade)
        const singleDrop = (kappa1 ** 2 * kappa2 ** 2 * alpha ** 2) / ((1 - t1 * t2 * alpha) ** 2 + 4 * t1 * t2 * alpha * Math.sin(phi / 2) ** 2)
        dropT = singleDrop ** order * (order > 1 ? 2 : 1) // approximation
      }

      points.push({
        wavelength: parseFloat(lambda.toFixed(3)),
        drop: parseFloat((10 * Math.log10(Math.max(1e-6, dropT))).toFixed(2)),
      })
    }
    return points
  }, [radius, kappa1, kappa2, loss, neff, order])

  const L = 2 * Math.PI * radius * 1e-6
  const FSR = 1550 ** 2 / (neff * L * 1e9)
  const alpha = Math.exp(-loss * 100 * L / 2)
  const t1 = Math.sqrt(1 - kappa1 ** 2)
  const t2 = Math.sqrt(1 - kappa2 ** 2)
  const finesse = Math.PI * Math.sqrt(t1 * t2 * alpha) / (1 - t1 * t2 * alpha)
  const FWHM = FSR / finesse
  const Q = 1550 / FWHM

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">微环滤波器 Drop 端响应 ({order === 1 ? '单环' : `${order} 阶级联`})</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis domain={[-40, 0]} label={{ value: 'Drop (dB)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="drop" stroke="#f97316" dot={false} strokeWidth={2} name="Drop port" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">滤波器设计</h3>
        <div className="space-y-4">
          <SliderParam label="环半径 (μm)" value={radius} onChange={setRadius} min={3} max={30} step={0.5} />
          <SliderParam label="输入耦合 κ₁" value={kappa1} onChange={setKappa1} min={0.01} max={0.5} step={0.01} />
          <SliderParam label="输出耦合 κ₂" value={kappa2} onChange={setKappa2} min={0.01} max={0.5} step={0.01} />
          <SliderParam label="传播损耗 (dB/cm)" value={loss} onChange={setLoss} min={0.5} max={10} step={0.5} />
          <SliderParam label="有效折射率" value={neff} onChange={setNeff} min={2.0} max={3.0} step={0.01} />
          <SliderParam label="级联阶数" value={order} onChange={setOrder} min={1} max={4} step={1} />
        </div>
        <ResultBox results={[
          { label: 'FSR', value: `${FSR.toFixed(2)} nm` },
          { label: '精细度 F', value: finesse.toFixed(0) },
          { label: 'FWHM (3dB 带宽)', value: `${(FWHM * 1000).toFixed(1)} pm` },
          { label: '品质因子 Q', value: `${(Q / 1000).toFixed(1)}k` },
          { label: '圆周长', value: `${(L * 1e6).toFixed(1)} μm` },
          { label: '通道间隔匹配', value: FSR > 0.8 ? `${(100 / FSR).toFixed(0)} GHz grid ✓` : '需增大 FSR' },
        ]} />
      </div>
    </div>
  )
}

// placeholder removed - not needed

// ===================================================================
// 4. MZI Switch/Modulator Design
// ===================================================================
function MZIDesign() {
  const [armLength, setArmLength] = useState(200)
  const [deltaL, setDeltaL] = useState(0)
  const [vpiL, setVpiL] = useState(2.5)
  const [voltage, setVoltage] = useState(2.0)
  const [insertionLoss, setInsertionLoss] = useState(3)

  const mziData = useMemo(() => {
    const points = []
    for (let v = 0; v <= 8; v += 0.05) {
      const phi = Math.PI * v / (vpiL / (armLength / 10000)) // Vπ = VπL / L
      const output = Math.cos(phi / 2) ** 2
      const outputDB = 10 * Math.log10(Math.max(1e-6, output)) - insertionLoss
      points.push({
        voltage: parseFloat(v.toFixed(2)),
        bar: parseFloat(outputDB.toFixed(2)),
        cross: parseFloat((10 * Math.log10(Math.max(1e-6, 1 - output)) - insertionLoss).toFixed(2)),
      })
    }
    return points
  }, [armLength, vpiL, insertionLoss])

  const vpi_device = vpiL / (armLength / 10000) // V
  const phi_current = Math.PI * voltage / vpi_device
  const barOutput = Math.cos(phi_current / 2) ** 2
  const crossOutput = 1 - barOutput
  const er = 10 * Math.log10(barOutput / Math.max(1e-6, crossOutput))
  const bandwidth = 0.7 / (armLength * 0.02) // simplified RC-limited

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">MZI 调制器/开关传输曲线</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={mziData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="voltage" label={{ value: 'Drive Voltage (V)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Output (dB)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} domain={[-40, 0]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bar" stroke="#3b82f6" dot={false} strokeWidth={2} name="Bar (Through)" />
            <Line type="monotone" dataKey="cross" stroke="#ef4444" dot={false} strokeWidth={2} name="Cross" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">MZI 设计参数</h3>
        <div className="space-y-4">
          <SliderParam label="调制臂长度 (μm)" value={armLength} onChange={setArmLength} min={50} max={5000} step={50} />
          <SliderParam label="臂长差 ΔL (nm)" value={deltaL} onChange={setDeltaL} min={0} max={500} step={10} />
          <SliderParam label="VπL (V·cm)" value={vpiL} onChange={setVpiL} min={0.5} max={5} step={0.1} />
          <SliderParam label="驱动电压 (V)" value={voltage} onChange={setVoltage} min={0} max={8} step={0.1} />
          <SliderParam label="插入损耗 (dB)" value={insertionLoss} onChange={setInsertionLoss} min={1} max={8} step={0.5} />
        </div>
        <ResultBox results={[
          { label: '器件 Vπ', value: `${vpi_device.toFixed(2)} V` },
          { label: '相移量', value: `${(phi_current / Math.PI * 180).toFixed(1)}°` },
          { label: 'Bar 输出', value: `${(barOutput * 100).toFixed(1)}%` },
          { label: '消光比', value: `${Math.abs(er).toFixed(1)} dB` },
          { label: '估算带宽', value: `~${bandwidth.toFixed(0)} GHz` },
          { label: '调制效率', value: `${vpiL.toFixed(1)} V·cm (${vpiL < 1.5 ? 'TFLN' : vpiL < 3 ? 'SiPh' : 'InP'})` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// 5. Grating Coupler Design
// ===================================================================
function GratingDesign() {
  const [period, setPeriod] = useState(600)
  const [dutyCycle, setDutyCycle] = useState(0.5)
  const [etchDepth, setEtchDepth] = useState(70)
  const [fiberAngle, setFiberAngle] = useState(10)
  const [neff_g, setNeff_g] = useState(2.8)

  const gratingData = useMemo(() => {
    const points = []
    const centerLambda = period * (neff_g - Math.sin(fiberAngle * Math.PI / 180))
    const bw3dB = centerLambda * 0.03 * (etchDepth / 70) // simplified bandwidth model

    for (let lambda = 1400; lambda <= 1700; lambda += 1) {
      const detuning = (lambda - centerLambda) / bw3dB
      const efficiency = Math.exp(-(detuning ** 2) / 2) * (0.3 + 0.4 * etchDepth / 100) * dutyCycle * 2
      points.push({
        wavelength: lambda,
        efficiency: parseFloat((Math.min(0.8, efficiency) * 100).toFixed(1)),
        loss: parseFloat((-10 * Math.log10(Math.max(0.01, Math.min(0.8, efficiency)))).toFixed(2)),
      })
    }
    return points
  }, [period, dutyCycle, etchDepth, fiberAngle, neff_g])

  const centerLambda = period * (neff_g - Math.sin(fiberAngle * Math.PI / 180))
  const bw3dB = centerLambda * 0.03 * (etchDepth / 70)
  const peakEff = Math.min(0.8, (0.3 + 0.4 * etchDepth / 100) * dutyCycle * 2)
  const couplingLoss = -10 * Math.log10(peakEff)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">光栅耦合器频谱响应</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={gratingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="efficiency" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} name="耦合效率 (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">光栅参数</h3>
        <div className="space-y-4">
          <SliderParam label="光栅周期 (nm)" value={period} onChange={setPeriod} min={400} max={800} step={5} />
          <SliderParam label="占空比" value={dutyCycle} onChange={setDutyCycle} min={0.3} max={0.7} step={0.01} />
          <SliderParam label="刻蚀深度 (nm)" value={etchDepth} onChange={setEtchDepth} min={30} max={150} step={5} />
          <SliderParam label="光纤入射角 (°)" value={fiberAngle} onChange={setFiberAngle} min={0} max={20} step={1} />
          <SliderParam label="光栅区 neff" value={neff_g} onChange={setNeff_g} min={2.0} max={3.2} step={0.01} />
        </div>
        <ResultBox results={[
          { label: '中心波长', value: `${centerLambda.toFixed(0)} nm` },
          { label: '3dB 带宽', value: `${bw3dB.toFixed(0)} nm` },
          { label: '峰值耦合效率', value: `${(peakEff * 100).toFixed(1)}%` },
          { label: '耦合损耗', value: `${couplingLoss.toFixed(1)} dB` },
          { label: 'Bragg 条件', value: `Λ·neff = ${(period * neff_g / 1000).toFixed(2)} μm` },
          { label: '目标平台', value: centerLambda > 1500 && centerLambda < 1600 ? 'C-band ✓' : centerLambda > 1260 && centerLambda < 1360 ? 'O-band ✓' : '需调整' },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// 6. Thermal Tuner Simulation
// ===================================================================
function ThermalDesign() {
  const [heaterWidth, setHeaterWidth] = useState(2)
  const [heaterLength, setHeaterLength] = useState(50)
  const [distance, setDistance] = useState(1.5)
  const [power, setPower] = useState(20)
  const [tocCoeff, setTocCoeff] = useState(1.86e-4)

  const thermalData = useMemo(() => {
    const points = []
    const Rth = 1 / (heaterWidth * heaterLength * 0.001) * distance * 0.5 // simplified thermal resistance
    for (let p = 0; p <= 50; p += 0.5) {
      const deltaT = p * Rth
      const phaseShift = 2 * Math.PI * tocCoeff * deltaT * heaterLength / 1.55
      points.push({
        power: p,
        deltaT: parseFloat(deltaT.toFixed(1)),
        phaseShift: parseFloat((phaseShift / Math.PI * 180).toFixed(1)),
      })
    }
    return points
  }, [heaterWidth, heaterLength, distance, tocCoeff])

  const Rth = 1 / (heaterWidth * heaterLength * 0.001) * distance * 0.5
  const deltaT = power * Rth
  const phaseShift = 2 * Math.PI * tocCoeff * deltaT * heaterLength / 1.55
  const pPi = Math.PI * 1.55 / (2 * Math.PI * tocCoeff * heaterLength * Rth)
  const wlShift = tocCoeff * deltaT * 1550 / 2.45 // Δλ = (dn/dT * ΔT) / ng * λ
  const timeConstant = 0.5 * heaterWidth * distance // simplified τ ~ width × distance

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">热调谐器：相移 vs 加热功率</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={thermalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="power" label={{ value: 'Heater Power (mW)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" label={{ value: 'Phase Shift (°)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'ΔT (°C)', angle: 90, position: 'insideRight' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="phaseShift" stroke="#ef4444" dot={false} strokeWidth={2} name="相移 (°)" />
            <Line yAxisId="right" type="monotone" dataKey="deltaT" stroke="#f97316" dot={false} strokeWidth={1.5} name="温升 (°C)" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">热调谐器参数</h3>
        <div className="space-y-4">
          <SliderParam label="加热器宽度 (μm)" value={heaterWidth} onChange={setHeaterWidth} min={0.5} max={5} step={0.1} />
          <SliderParam label="加热器长度 (μm)" value={heaterLength} onChange={setHeaterLength} min={10} max={200} step={5} />
          <SliderParam label="距波导距离 (μm)" value={distance} onChange={setDistance} min={0.5} max={3} step={0.1} />
          <SliderParam label="加热功率 (mW)" value={power} onChange={setPower} min={0} max={50} step={0.5} />
          <SliderParam label="TOC (×10⁻⁴ /K)" value={tocCoeff * 1e4} onChange={(v) => setTocCoeff(v * 1e-4)} min={0.5} max={3} step={0.01} />
        </div>
        <ResultBox results={[
          { label: '热阻 Rth', value: `${Rth.toFixed(1)} K/mW` },
          { label: '温升 ΔT', value: `${deltaT.toFixed(1)} °C` },
          { label: '相移', value: `${(phaseShift / Math.PI * 180).toFixed(1)}° (${(phaseShift / Math.PI).toFixed(2)}π)` },
          { label: 'Pπ (π 相移功率)', value: `${pPi.toFixed(1)} mW` },
          { label: '波长偏移', value: `${(wlShift * 1000).toFixed(1)} pm` },
          { label: '热时间常数', value: `~${timeConstant.toFixed(1)} μs` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Shared Components
// ===================================================================
function SliderParam({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{typeof value === 'number' ? (Number.isInteger(step) && step >= 1 ? value : value.toFixed(Math.max(0, -Math.floor(Math.log10(step))))) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
    </div>
  )
}

function ResultBox({ results }: { results: { label: string; value: string; warn?: boolean }[] }) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-2 font-medium">设计结果</p>
      <div className="space-y-1.5">
        {results.map((r) => (
          <div key={r.label} className={`flex justify-between text-sm ${r.warn ? 'text-red-600' : ''}`}>
            <span className="text-gray-600">{r.label}</span>
            <strong className="text-right">{r.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
