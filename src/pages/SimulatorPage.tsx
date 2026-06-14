import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ComposedChart, Bar,
} from 'recharts'

type SimMode = 'eml' | 'mzm' | 'link-budget' | 'microring' | 'pd-responsivity' | 'cpo-power' | 'photonic-mvm' | 'tfln-iq'

const simModes: { key: SimMode; label: string; color: string }[] = [
  { key: 'eml', label: 'EML 眼图仿真', color: '#ef4444' },
  { key: 'mzm', label: 'MZM 传输曲线', color: '#6366f1' },
  { key: 'tfln-iq', label: 'TFLN IQ 调制', color: '#eab308' },
  { key: 'link-budget', label: '链路预算', color: '#22c55e' },
  { key: 'microring', label: '微环谐振器', color: '#f97316' },
  { key: 'pd-responsivity', label: '光电探测器', color: '#8b5cf6' },
  { key: 'cpo-power', label: 'CPO 功耗分析', color: '#ec4899' },
  { key: 'photonic-mvm', label: '光矩阵乘法', color: '#06b6d4' },
]

export default function SimulatorPage() {
  const [mode, setMode] = useState<SimMode>('eml')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">在线仿真器</h1>
      <p className="text-gray-500 mb-8">
        交互式调节参数，实时查看光芯片性能特性。涵盖调制、传输、探测、封装和计算全链路。
      </p>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {simModes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m.key
                ? 'text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            style={mode === m.key ? { backgroundColor: m.color } : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'eml' && <EMLSimulator />}
      {mode === 'mzm' && <MZMSimulator />}
      {mode === 'tfln-iq' && <TFLNIQSimulator />}
      {mode === 'link-budget' && <LinkBudgetCalculator />}
      {mode === 'microring' && <MicroringSimulator />}
      {mode === 'pd-responsivity' && <PhotodetectorSimulator />}
      {mode === 'cpo-power' && <CPOPowerSimulator />}
      {mode === 'photonic-mvm' && <PhotonicMVMSimulator />}
    </div>
  )
}

// ===================================================================
// EML Eye Diagram Simulator
// ===================================================================
function EMLSimulator() {
  const [baudRate, setBaudRate] = useState(53)
  const [extinctionRatio, setExtinctionRatio] = useState(9)
  const [chirp, setChirp] = useState(0.5)
  const [distance, setDistance] = useState(10)
  const [modFormat, setModFormat] = useState<'nrz' | 'pam4'>('pam4')

  const eyeData = useMemo(() => {
    const points = []
    const T = 1 / baudRate
    const dispPenalty = chirp * distance * 0.017
    const levels = modFormat === 'pam4' ? 4 : 2
    for (let i = 0; i < 300; i++) {
      const t = (i / 300) * 2 * T
      const noise = (Math.random() - 0.5) * 0.08 * (1 + dispPenalty)
      const jitter = (Math.random() - 0.5) * 0.02 * T * baudRate / 50
      const phase = 2 * Math.PI * (t + jitter) / T
      const baseSignal = Math.sin(phase)
      const er_linear = Math.pow(10, extinctionRatio / 10)
      const high = 1.0
      const low = high / er_linear

      if (modFormat === 'pam4') {
        const level = Math.floor(((baseSignal + 1) / 2) * levels) / (levels - 1)
        const signal = level * (high - low) + low + noise * (1 - level * 0.3)
        points.push({ time: parseFloat((t * 1000).toFixed(2)), signal: Math.max(0, Math.min(1, signal)) })
      } else {
        const signal = ((baseSignal + 1) / 2) * (high - low) * (1 - dispPenalty * 0.5) + low + noise
        points.push({ time: parseFloat((t * 1000).toFixed(2)), signal: Math.max(0, Math.min(1, signal)) })
      }
    }
    return points
  }, [baudRate, extinctionRatio, chirp, distance, modFormat])

  const dispPenalty = chirp * distance * 0.017 * 10
  const dataRate = modFormat === 'pam4' ? baudRate * 2 : baudRate

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">EML {modFormat.toUpperCase()} 信号响应</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" name="Time" unit="ps" tick={{ fontSize: 11 }} />
            <YAxis name="Power" unit=" a.u." tick={{ fontSize: 11 }} domain={[0, 1]} />
            <Tooltip />
            <Scatter data={eyeData} fill="#ef4444" fillOpacity={0.4} r={1} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">参数调节</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">调制格式</label>
            <div className="flex gap-2">
              {(['nrz', 'pam4'] as const).map((f) => (
                <button key={f} onClick={() => setModFormat(f)}
                  className={`flex-1 py-1.5 rounded text-sm font-medium ${modFormat === f ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <SliderParam label="波特率 (Gbaud)" value={baudRate} onChange={setBaudRate} min={10} max={112} step={1} />
          <SliderParam label="消光比 (dB)" value={extinctionRatio} onChange={setExtinctionRatio} min={3} max={15} step={0.5} />
          <SliderParam label="啁啾因子 (α)" value={chirp} onChange={setChirp} min={0} max={3} step={0.1} />
          <SliderParam label="传输距离 (km)" value={distance} onChange={setDistance} min={0} max={40} step={1} />
        </div>
        <ResultBox results={[
          { label: '数据速率', value: `${dataRate} Gb/s` },
          { label: '色散代价', value: `${dispPenalty.toFixed(2)} dB` },
          { label: '3dB 带宽需求', value: `~${(baudRate * 0.7).toFixed(0)} GHz` },
          { label: 'TDECQ 估算', value: `${(1.5 + dispPenalty * 0.3).toFixed(1)} dB`, warn: dispPenalty > 3 },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// MZM Transfer Function
// ===================================================================
function MZMSimulator() {
  const [vpi, setVpi] = useState(3.5)
  const [bias, setBias] = useState(0.5)
  const [vpp, setVpp] = useState(2.0)
  const [splitRatio, setSplitRatio] = useState(50)

  const mzmData = useMemo(() => {
    const points = []
    const imbalance = (splitRatio - 50) / 100
    for (let v = -8; v <= 8; v += 0.05) {
      const phi = Math.PI * v / (2 * vpi)
      const transmission = (0.5 + imbalance) * Math.cos(phi) ** 2 + (0.5 - imbalance) * Math.sin(phi) ** 2
      points.push({ voltage: parseFloat(v.toFixed(2)), transmission: parseFloat(transmission.toFixed(4)) })
    }
    return points
  }, [vpi, splitRatio])

  const biasVoltage = bias * vpi
  const phi_bias = Math.PI * biasVoltage / (2 * vpi)
  const imbalance = (splitRatio - 50) / 100
  const opPoint = (0.5 + imbalance) * Math.cos(phi_bias) ** 2 + (0.5 - imbalance) * Math.sin(phi_bias) ** 2
  const modDepth = Math.abs(
    ((0.5 + imbalance) * Math.cos(Math.PI * (biasVoltage + vpp / 2) / (2 * vpi)) ** 2 + (0.5 - imbalance) * Math.sin(Math.PI * (biasVoltage + vpp / 2) / (2 * vpi)) ** 2) -
    ((0.5 + imbalance) * Math.cos(Math.PI * (biasVoltage - vpp / 2) / (2 * vpi)) ** 2 + (0.5 - imbalance) * Math.sin(Math.PI * (biasVoltage - vpp / 2) / (2 * vpi)) ** 2)
  )
  const er_dB = opPoint > 0.01 ? 10 * Math.log10((opPoint + modDepth / 2) / Math.max(0.001, opPoint - modDepth / 2)) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">MZM 传输函数</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={mzmData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="voltage" label={{ value: 'Drive Voltage (V)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Transmission', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="transmission" stroke="#6366f1" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">参数调节</h3>
        <div className="space-y-4">
          <SliderParam label="Vπ (V)" value={vpi} onChange={setVpi} min={0.5} max={7} step={0.1} />
          <SliderParam label="偏置点 (×Vπ)" value={bias} onChange={setBias} min={0} max={1} step={0.01} />
          <SliderParam label="驱动幅度 Vpp (V)" value={vpp} onChange={setVpp} min={0.1} max={8} step={0.1} />
          <SliderParam label="分光比 (%)" value={splitRatio} onChange={setSplitRatio} min={40} max={60} step={0.5} />
        </div>
        <ResultBox results={[
          { label: '工作点透射率', value: `${(opPoint * 100).toFixed(1)}%` },
          { label: '调制深度', value: `${(modDepth * 100).toFixed(1)}%` },
          { label: '动态消光比', value: `${er_dB.toFixed(1)} dB` },
          { label: 'SiPh Vπ 典型值', value: '5-7 V' },
          { label: 'TFLN Vπ 典型值', value: '1.0-1.5 V' },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// TFLN IQ Modulator Simulator
// ===================================================================
function TFLNIQSimulator() {
  const [vpiI, setVpiI] = useState(1.2)
  const [vpiQ, setVpiQ] = useState(1.2)
  const [phaseShift, setPhaseShift] = useState(90)
  const [modulationIndex, setModulationIndex] = useState(0.8)
  const [symbolRate, setSymbolRate] = useState(64)
  const [qamOrder, setQamOrder] = useState<16 | 64>(16)

  const constellationData = useMemo(() => {
    const points: { i: number; q: number }[] = []
    const M = Math.sqrt(qamOrder)
    const phaseErr = (phaseShift - 90) * Math.PI / 180
    const gainImbalance = vpiI / vpiQ

    for (let xi = 0; xi < M; xi++) {
      for (let xq = 0; xq < M; xq++) {
        const iIdeal = (2 * xi - (M - 1)) / (M - 1) * modulationIndex
        const qIdeal = (2 * xq - (M - 1)) / (M - 1) * modulationIndex

        // Add impairments
        for (let n = 0; n < 8; n++) {
          const noiseI = (Math.random() - 0.5) * 0.06 * (2 - modulationIndex)
          const noiseQ = (Math.random() - 0.5) * 0.06 * (2 - modulationIndex)
          const iActual = iIdeal * gainImbalance + qIdeal * Math.sin(phaseErr) + noiseI
          const qActual = qIdeal * Math.cos(phaseErr) + noiseI * 0.1 + noiseQ
          points.push({ i: parseFloat(iActual.toFixed(4)), q: parseFloat(qActual.toFixed(4)) })
        }
      }
    }
    return points
  }, [vpiI, vpiQ, phaseShift, modulationIndex, qamOrder])

  const evm = Math.sqrt(
    Math.pow((phaseShift - 90) / 90, 2) * 100 +
    Math.pow((vpiI / vpiQ - 1), 2) * 200 +
    (1 - modulationIndex) * 5
  )
  const dataRate = symbolRate * Math.log2(qamOrder) * 2 // dual-pol

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">TFLN IQ 调制器星座图 ({qamOrder}-QAM)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="i" name="In-Phase" domain={[-1.2, 1.2]} tick={{ fontSize: 11 }} label={{ value: 'In-Phase (I)', position: 'bottom', offset: -5 }} />
            <YAxis dataKey="q" name="Quadrature" domain={[-1.2, 1.2]} tick={{ fontSize: 11 }} label={{ value: 'Quadrature (Q)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Scatter data={constellationData} fill="#eab308" fillOpacity={0.6} r={2} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">IQ 调制器参数</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">QAM 阶数</label>
            <div className="flex gap-2">
              {([16, 64] as const).map((q) => (
                <button key={q} onClick={() => setQamOrder(q)}
                  className={`flex-1 py-1.5 rounded text-sm font-medium ${qamOrder === q ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {q}-QAM
                </button>
              ))}
            </div>
          </div>
          <SliderParam label="I臂 Vπ (V)" value={vpiI} onChange={setVpiI} min={0.5} max={3} step={0.05} />
          <SliderParam label="Q臂 Vπ (V)" value={vpiQ} onChange={setVpiQ} min={0.5} max={3} step={0.05} />
          <SliderParam label="IQ 相位 (°)" value={phaseShift} onChange={setPhaseShift} min={80} max={100} step={0.5} />
          <SliderParam label="调制指数" value={modulationIndex} onChange={setModulationIndex} min={0.3} max={1.0} step={0.05} />
          <SliderParam label="符号率 (Gbaud)" value={symbolRate} onChange={setSymbolRate} min={32} max={128} step={1} />
        </div>
        <ResultBox results={[
          { label: '数据速率 (DP)', value: `${dataRate} Gb/s` },
          { label: 'EVM 估算', value: `${evm.toFixed(1)}%`, warn: evm > 8 },
          { label: 'IQ 增益不平衡', value: `${((vpiI / vpiQ - 1) * 100).toFixed(1)}%` },
          { label: '相位偏差', value: `${(phaseShift - 90).toFixed(1)}°` },
          { label: 'OSNR 需求估算', value: `~${(15 + Math.log2(qamOrder) * 3).toFixed(0)} dB` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Microring Resonator Simulator
// ===================================================================
function MicroringSimulator() {
  const [radius, setRadius] = useState(10)
  const [coupling, setCoupling] = useState(0.15)
  const [loss, setLoss] = useState(3)
  const [neff, setNeff] = useState(2.45)
  const [tempShift, setTempShift] = useState(0)

  const ringData = useMemo(() => {
    const points = []
    const L = 2 * Math.PI * radius * 1e-6 // circumference in meters
    const alpha = Math.exp(-loss * 100 * L / 2) // field loss (loss in dB/cm → field attenuation)
    const t = Math.sqrt(1 - coupling ** 2) // through coupling coefficient

    const lambda0 = 1550 // center wavelength nm
    const FSR = lambda0 ** 2 / (neff * L * 1e9) // in nm
    const thermalShift = tempShift * 0.08 // ~80 pm/°C for silicon

    for (let dlambda = -2; dlambda <= 2; dlambda += 0.005) {
      const lambda = lambda0 + dlambda
      const phi = 2 * Math.PI * neff * L / (lambda * 1e-9) + thermalShift * 2 * Math.PI / FSR
      const numerator = alpha ** 2 - 2 * alpha * t * Math.cos(phi) + t ** 2
      const denominator = 1 - 2 * alpha * t * Math.cos(phi) + (alpha * t) ** 2
      const throughTransmission = numerator / denominator
      const dropTransmission = 1 - throughTransmission

      points.push({
        wavelength: parseFloat(lambda.toFixed(3)),
        through: parseFloat((10 * Math.log10(Math.max(1e-6, throughTransmission))).toFixed(2)),
        drop: parseFloat((10 * Math.log10(Math.max(1e-6, dropTransmission * coupling))).toFixed(2)),
      })
    }
    return points
  }, [radius, coupling, loss, neff, tempShift])

  const L = 2 * Math.PI * radius * 1e-6
  const FSR = 1550 ** 2 / (neff * L * 1e9)
  const alpha = Math.exp(-loss * 100 * L / 2)
  const t = Math.sqrt(1 - coupling ** 2)
  const finesse = Math.PI * Math.sqrt(alpha * t) / (1 - alpha * t)
  const Q = finesse * neff * L * 1e9 / 1550

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">微环谐振器传输谱</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={ringData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Transmission (dB)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} domain={[-30, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="through" stroke="#f97316" dot={false} strokeWidth={2} name="Through Port" />
            <Line type="monotone" dataKey="drop" stroke="#6366f1" dot={false} strokeWidth={1.5} name="Drop Port" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">微环参数</h3>
        <div className="space-y-4">
          <SliderParam label="半径 (μm)" value={radius} onChange={setRadius} min={3} max={30} step={0.5} />
          <SliderParam label="耦合系数 κ" value={coupling} onChange={setCoupling} min={0.01} max={0.5} step={0.01} />
          <SliderParam label="传播损耗 (dB/cm)" value={loss} onChange={setLoss} min={0.5} max={10} step={0.5} />
          <SliderParam label="有效折射率 neff" value={neff} onChange={setNeff} min={2.0} max={3.0} step={0.01} />
          <SliderParam label="温度偏移 (°C)" value={tempShift} onChange={setTempShift} min={-10} max={10} step={0.5} />
        </div>
        <ResultBox results={[
          { label: 'FSR', value: `${FSR.toFixed(2)} nm` },
          { label: '精细度 (Finesse)', value: `${finesse.toFixed(0)}` },
          { label: '品质因子 Q', value: `${(Q / 1000).toFixed(1)}k` },
          { label: '谐振偏移', value: `${(tempShift * 0.08).toFixed(2)} nm` },
          { label: '所需 Heater 功率', value: `~${(Math.abs(tempShift) * 2.5).toFixed(0)} mW` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Photodetector Simulator
// ===================================================================
function PhotodetectorSimulator() {
  const [wavelength, setWavelength] = useState(1310)
  const [pdType, setPdType] = useState<'pin' | 'apd'>('pin')
  const [bandwidth, setBandwidth] = useState(25)
  const [opticalPower, setOpticalPower] = useState(-10)
  const [darkCurrent, setDarkCurrent] = useState(5)
  const [gain, setGain] = useState(10)

  const spectrumData = useMemo(() => {
    const points = []
    for (let wl = 800; wl <= 1650; wl += 5) {
      // Simplified responsivity model
      let resp = 0
      if (wl >= 800 && wl <= 1100) {
        // Si photodiode region
        resp = 0.5 * Math.exp(-((wl - 900) ** 2) / (2 * 150 ** 2))
      }
      // Ge/InGaAs region
      if (wl >= 900 && wl <= 1650) {
        const geResp = 0.9 * Math.exp(-((wl - 1400) ** 2) / (2 * 200 ** 2))
        resp = Math.max(resp, geResp)
      }
      const quantumEff = resp * 1.24 / (wl / 1000)
      points.push({
        wavelength: wl,
        responsivity: parseFloat(resp.toFixed(3)),
        quantumEff: parseFloat((quantumEff * 100).toFixed(1)),
      })
    }
    return points
  }, [])

  const responsivity = wavelength < 1100 ? 0.5 * Math.exp(-((wavelength - 900) ** 2) / (2 * 150 ** 2))
    : 0.9 * Math.exp(-((wavelength - 1400) ** 2) / (2 * 200 ** 2))
  const effectiveGain = pdType === 'apd' ? gain : 1
  const photocurrent = responsivity * effectiveGain * Math.pow(10, opticalPower / 10) * 1000 // mA → μA
  const shotNoise = Math.sqrt(2 * 1.6e-19 * photocurrent * 1e-6 * bandwidth * 1e9 * effectiveGain) * 1e9 // nA
  const thermalNoise = Math.sqrt(4 * 1.38e-23 * 300 * bandwidth * 1e9 / 50) * 1e9 // nA
  const darkNoise = Math.sqrt(2 * 1.6e-19 * darkCurrent * 1e-9 * bandwidth * 1e9) * 1e9
  const totalNoise = Math.sqrt(shotNoise ** 2 + thermalNoise ** 2 + darkNoise ** 2)
  const snr = photocurrent > 0 ? 20 * Math.log10(photocurrent * 1000 / totalNoise) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">光电探测器光谱响应 (Ge/InGaAs)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={spectrumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" label={{ value: 'Responsivity (A/W)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'QE (%)', angle: 90, position: 'insideRight' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="responsivity" stroke="#8b5cf6" fill="#8b5cf620" strokeWidth={2} name="响应度 (A/W)" />
            <Line yAxisId="right" type="monotone" dataKey="quantumEff" stroke="#22c55e" dot={false} strokeWidth={1.5} name="量子效率 (%)" strokeDasharray="4 2" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">探测器参数</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">探测器类型</label>
            <div className="flex gap-2">
              {([['pin', 'PIN'], ['apd', 'APD']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setPdType(k as 'pin' | 'apd')}
                  className={`flex-1 py-1.5 rounded text-sm font-medium ${pdType === k ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <SliderParam label="波长 (nm)" value={wavelength} onChange={setWavelength} min={850} max={1600} step={10} />
          <SliderParam label="带宽 (GHz)" value={bandwidth} onChange={setBandwidth} min={1} max={70} step={1} />
          <SliderParam label="入射光功率 (dBm)" value={opticalPower} onChange={setOpticalPower} min={-25} max={3} step={0.5} />
          <SliderParam label="暗电流 (nA)" value={darkCurrent} onChange={setDarkCurrent} min={0.1} max={100} step={0.5} />
          {pdType === 'apd' && (
            <SliderParam label="APD 增益" value={gain} onChange={setGain} min={1} max={30} step={1} />
          )}
        </div>
        <ResultBox results={[
          { label: '响应度', value: `${responsivity.toFixed(3)} A/W` },
          { label: '光电流', value: `${(photocurrent * 1000).toFixed(1)} μA` },
          { label: '总噪声电流', value: `${totalNoise.toFixed(2)} nA` },
          { label: 'SNR', value: `${snr.toFixed(1)} dB`, warn: snr < 15 },
          { label: '等效灵敏度', value: `${(opticalPower - snr + 15).toFixed(1)} dBm` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// CPO Power Analysis
// ===================================================================
function CPOPowerSimulator() {
  const [switchCapacity, setSwitchCapacity] = useState(51.2)
  const [portSpeed, setPortSpeed] = useState(800)
  const [serdesStages, setSerdesStages] = useState(1)
  const [laserWPE, setLaserWPE] = useState(35)
  const [modulatorEff, setModulatorEff] = useState(1.5)
  const [driverEff, setDriverEff] = useState(3)

  const numPorts = (switchCapacity * 1000) / portSpeed
  const lanesPerPort = portSpeed / 100 // assume 100G per lane

  // Power breakdown (mW per lane)
  const pSerdes = serdesStages * 5 * portSpeed / 800
  const pDriver = driverEff
  const pModulator = modulatorEff
  const pLaser = (10 / (laserWPE / 100)) // ~10mW optical needed per lane, divided by WPE
  const pTIA = 4
  const pDSP = 8 * portSpeed / 800
  const pPerLane = pSerdes + pDriver + pModulator + pLaser + pTIA + pDSP

  const totalLanes = numPorts * lanesPerPort
  const totalOpticalPower = totalLanes * pPerLane / 1000 // W
  const pluggablePower = totalLanes * (pPerLane + 15) / 1000 // extra SerDes + connector

  const breakdownData = [
    { name: 'SerDes', cpo: pSerdes, pluggable: pSerdes + 15, unit: 'mW/lane' },
    { name: 'Driver', cpo: pDriver, pluggable: pDriver * 1.2, unit: 'mW/lane' },
    { name: 'Modulator', cpo: pModulator, pluggable: pModulator, unit: 'mW/lane' },
    { name: 'Laser', cpo: pLaser, pluggable: pLaser, unit: 'mW/lane' },
    { name: 'TIA', cpo: pTIA, pluggable: pTIA * 1.1, unit: 'mW/lane' },
    { name: 'DSP', cpo: pDSP, pluggable: pDSP * 1.3, unit: 'mW/lane' },
  ]

  const savings = ((pluggablePower - totalOpticalPower) / pluggablePower * 100)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">CPO vs 可插拔 功耗对比 (per lane)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={breakdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: 'Power (mW/lane)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cpo" fill="#ec4899" name="CPO" />
            <Bar dataKey="pluggable" fill="#94a3b8" name="可插拔" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">系统参数</h3>
        <div className="space-y-4">
          <SliderParam label="交换容量 (Tbps)" value={switchCapacity} onChange={setSwitchCapacity} min={12.8} max={102.4} step={12.8} />
          <SliderParam label="端口速率 (Gbps)" value={portSpeed} onChange={setPortSpeed} min={400} max={1600} step={200} />
          <SliderParam label="SerDes 级数" value={serdesStages} onChange={setSerdesStages} min={0} max={3} step={1} />
          <SliderParam label="激光器 WPE (%)" value={laserWPE} onChange={setLaserWPE} min={20} max={50} step={1} />
          <SliderParam label="调制器功耗 (mW/lane)" value={modulatorEff} onChange={setModulatorEff} min={0.5} max={5} step={0.1} />
          <SliderParam label="驱动器功耗 (mW/lane)" value={driverEff} onChange={setDriverEff} min={1} max={8} step={0.5} />
        </div>
        <ResultBox results={[
          { label: '总端口数', value: `${numPorts}` },
          { label: '总通道数', value: `${totalLanes}` },
          { label: 'CPO 总光功耗', value: `${totalOpticalPower.toFixed(1)} W` },
          { label: '可插拔总功耗', value: `${pluggablePower.toFixed(1)} W` },
          { label: 'CPO 功耗节省', value: `${savings.toFixed(0)}%`, warn: false },
          { label: '每通道功耗 (CPO)', value: `${pPerLane.toFixed(1)} mW` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Photonic Matrix-Vector Multiplication Simulator
// ===================================================================
function PhotonicMVMSimulator() {
  const [matrixSize, setMatrixSize] = useState(16)
  const [bitPrecision, setBitPrecision] = useState(4)
  const [clockRate, setClockRate] = useState(10)
  const [pdNoise, setPdNoise] = useState(0.5)
  const [thermalVar, setThermalVar] = useState(0.3)
  const [numWavelengths, setNumWavelengths] = useState(4)

  const mvmData = useMemo(() => {
    const points: { ideal: number; actual: number; index: number }[] = []
    // Simulate a MVM: random matrix × random vector
    const N = matrixSize
    const noiseLevel = pdNoise / 100
    const thermalError = thermalVar / 100

    for (let i = 0; i < N; i++) {
      let idealSum = 0
      let actualSum = 0
      for (let j = 0; j < N; j++) {
        const weight = Math.sin(i * j * 0.5 + i) * 0.5 // pseudo-random weights
        const input = Math.cos(j * 0.8 + 0.3) * 0.5 + 0.5
        const quantizedWeight = Math.round(weight * (2 ** bitPrecision - 1)) / (2 ** bitPrecision - 1)
        idealSum += weight * input
        actualSum += quantizedWeight * input * (1 + (Math.random() - 0.5) * thermalError) + (Math.random() - 0.5) * noiseLevel
      }
      points.push({ index: i, ideal: parseFloat(idealSum.toFixed(4)), actual: parseFloat(actualSum.toFixed(4)) })
    }
    return points
  }, [matrixSize, bitPrecision, pdNoise, thermalVar])

  // Compute accuracy metrics
  const mse = mvmData.reduce((acc, p) => acc + (p.ideal - p.actual) ** 2, 0) / mvmData.length
  const snrCalc = mvmData.reduce((acc, p) => acc + p.ideal ** 2, 0) / mvmData.reduce((acc, p) => acc + (p.ideal - p.actual) ** 2 + 1e-10, 0)

  const totalOps = matrixSize * matrixSize * clockRate * numWavelengths * 2 / 1000 // TOPS
  const energyPerOp = 0.5 + pdNoise * 0.1 + thermalVar * 0.2 // pJ/MAC estimate
  const totalPower = totalOps * energyPerOp // W (TOPS × pJ/op = W)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">光矩阵乘法结果 (理想 vs 实际)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={mvmData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="index" label={{ value: 'Output Index', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="ideal" fill="#06b6d420" stroke="#06b6d4" strokeWidth={1} name="理想值" />
            <Line type="monotone" dataKey="actual" stroke="#ef4444" dot={{ r: 3 }} strokeWidth={2} name="光计算值" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">光计算参数</h3>
        <div className="space-y-4">
          <SliderParam label="矩阵维度 N×N" value={matrixSize} onChange={setMatrixSize} min={4} max={64} step={4} />
          <SliderParam label="权重精度 (bit)" value={bitPrecision} onChange={setBitPrecision} min={2} max={8} step={1} />
          <SliderParam label="时钟频率 (GHz)" value={clockRate} onChange={setClockRate} min={1} max={25} step={1} />
          <SliderParam label="PD 噪声 (%)" value={pdNoise} onChange={setPdNoise} min={0.1} max={5} step={0.1} />
          <SliderParam label="热漂移方差 (%)" value={thermalVar} onChange={setThermalVar} min={0.1} max={3} step={0.1} />
          <SliderParam label="WDM 通道数" value={numWavelengths} onChange={setNumWavelengths} min={1} max={16} step={1} />
        </div>
        <ResultBox results={[
          { label: '等效算力', value: `${totalOps.toFixed(1)} TOPS` },
          { label: '能效', value: `${energyPerOp.toFixed(2)} pJ/MAC` },
          { label: '总功耗', value: `${totalPower.toFixed(2)} W` },
          { label: 'MSE', value: mse.toExponential(2) },
          { label: '计算 SNR', value: `${(10 * Math.log10(snrCalc)).toFixed(1)} dB`, warn: 10 * Math.log10(snrCalc) < 20 },
          { label: '等效精度', value: `~${Math.min(bitPrecision, Math.floor(10 * Math.log10(snrCalc) / 6))} bit` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Link Budget Calculator
// ===================================================================
function LinkBudgetCalculator() {
  const [txPower, setTxPower] = useState(3)
  const [rxSensitivity, setRxSensitivity] = useState(-12)
  const [fiberLoss, setFiberLoss] = useState(0.35)
  const [distance, setDistance] = useState(10)
  const [connLoss, setConnLoss] = useState(1.5)
  const [margin, setMargin] = useState(3)
  const [numSplices, setNumSplices] = useState(2)
  const [spliceLoss, setSpliceLoss] = useState(0.1)

  const totalLoss = fiberLoss * distance + connLoss + numSplices * spliceLoss
  const linkBudget = txPower - rxSensitivity
  const availableMargin = linkBudget - totalLoss - margin
  const maxDistance = (linkBudget - connLoss - numSplices * spliceLoss - margin) / fiberLoss

  const chartData = useMemo(() => {
    const points = []
    for (let d = 0; d <= 80; d += 0.5) {
      const loss = fiberLoss * d + connLoss + numSplices * spliceLoss
      points.push({
        distance: d,
        power: parseFloat((txPower - loss).toFixed(2)),
        sensitivity: rxSensitivity,
        marginLine: rxSensitivity + margin,
      })
    }
    return points
  }, [txPower, rxSensitivity, fiberLoss, connLoss, margin, numSplices, spliceLoss])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold mb-4">光功率 vs 传输距离</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="distance" label={{ value: 'Distance (km)', position: 'bottom', offset: -5 }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Power (dBm)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="power" stroke="#22c55e" dot={false} name="接收光功率" strokeWidth={2} />
            <Line type="monotone" dataKey="sensitivity" stroke="#ef4444" dot={false} name="接收灵敏度" strokeDasharray="6 3" />
            <Line type="monotone" dataKey="marginLine" stroke="#f97316" dot={false} name="含余量限制" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">链路参数</h3>
        <div className="space-y-4">
          <SliderParam label="发射光功率 (dBm)" value={txPower} onChange={setTxPower} min={-3} max={10} step={0.5} />
          <SliderParam label="接收灵敏度 (dBm)" value={rxSensitivity} onChange={setRxSensitivity} min={-25} max={-5} step={0.5} />
          <SliderParam label="光纤损耗 (dB/km)" value={fiberLoss} onChange={setFiberLoss} min={0.15} max={0.5} step={0.01} />
          <SliderParam label="传输距离 (km)" value={distance} onChange={setDistance} min={0} max={80} step={1} />
          <SliderParam label="连接器损耗 (dB)" value={connLoss} onChange={setConnLoss} min={0} max={5} step={0.1} />
          <SliderParam label="熔接点数量" value={numSplices} onChange={setNumSplices} min={0} max={10} step={1} />
          <SliderParam label="熔接损耗 (dB/个)" value={spliceLoss} onChange={setSpliceLoss} min={0.01} max={0.5} step={0.01} />
          <SliderParam label="系统余量 (dB)" value={margin} onChange={setMargin} min={0} max={6} step={0.5} />
        </div>
        <ResultBox results={[
          { label: '链路预算', value: `${linkBudget.toFixed(1)} dB` },
          { label: '总损耗', value: `${totalLoss.toFixed(2)} dB` },
          { label: '剩余余量', value: `${availableMargin.toFixed(2)} dB`, warn: availableMargin < 0 },
          { label: '判定', value: availableMargin >= 0 ? '✓ PASS' : '✗ FAIL', warn: availableMargin < 0 },
          { label: '最大传输距离', value: `${maxDistance.toFixed(1)} km` },
        ]} />
      </div>
    </div>
  )
}

// ===================================================================
// Shared Components
// ===================================================================
function SliderParam({
  label, value, onChange, min, max, step
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  )
}

function ResultBox({ results }: { results: { label: string; value: string; warn?: boolean }[] }) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-2 font-medium">计算结果</p>
      <div className="space-y-1.5">
        {results.map((r) => (
          <div key={r.label} className={`flex justify-between text-sm ${r.warn ? 'text-red-600' : ''}`}>
            <span className="text-gray-600">{r.label}</span>
            <strong>{r.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
