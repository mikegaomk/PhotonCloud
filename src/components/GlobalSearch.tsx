import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Cpu, Layers, Building2, FileText, Zap } from 'lucide-react'
import { photonicsChips } from '../data/photonicsData'
import { useI18n } from '../data/i18nContext'

interface SearchResult {
  id: string
  type: 'chip' | 'foundry' | 'device' | 'article' | 'news'
  title: string
  subtitle: string
  link: string
  icon: typeof Cpu
  color: string
}

// Foundry data for search (mirrors PDKPage data)
const foundrySearchData = [
  { id: 'cumec', name: 'CUMEC 联合微电子', location: '重庆', platforms: 'SOI 180nm SiPh SiN 400nm 硅光', keywords: '8英寸 MPW 量产 PN调制器 Ge-PD 热调谐 光栅耦合器 边缘耦合器' },
  { id: 'siopt', name: 'SiOPT 上海微系统所', location: '上海', platforms: 'SOI 220nm SiN 800nm 氮化硅 低损耗', keywords: 'MPW 科研 微环 AWG 延迟线' },
  { id: 'ciomp', name: '长光辰芯 微纳中心', location: '长春', platforms: 'InP MOCVD III-V', keywords: 'EML DFB SOA PD 外延 有源芯片' },
  { id: 'zhongke-lnoi', name: '济南量子 LNOI 铌酸锂', location: '济南', platforms: 'LNOI TFLN 薄膜铌酸锂 600nm X-cut', keywords: '调制器 IQ MZM 电光 Pockels 量子' },
  { id: 'tower-cn', name: '绍兴中芯 Tower PH18', location: '绍兴', platforms: 'SOI 180nm Tower PH18 硅光', keywords: '8英寸 Tower PDK 量产 国际接轨' },
  { id: 'accelink', name: '光迅科技 Accelink', location: '武汉', platforms: 'SOI 130nm 硅光 IDM', keywords: '相干 400G 800G ZR 模块 量产' },
]

// Device search data
const deviceSearchData = [
  { name: 'Strip Waveguide 条形波导', pdk: 'CUMEC-SiPh180', category: 'Waveguide', keywords: 'Si 单模 传输 220nm' },
  { name: 'Rib Waveguide 脊形波导', pdk: 'CUMEC-SiPh180', category: 'Waveguide', keywords: 'Si 调制器 有源区 90nm slab' },
  { name: 'Euler Bend 欧拉弯曲', pdk: 'CUMEC-SiPh180', category: 'Waveguide', keywords: '弯曲 低损耗 紧凑' },
  { name: 'MMI 1x2 分束器', pdk: 'CUMEC-SiPh180', category: 'Coupler', keywords: '分光 多模干涉 3dB' },
  { name: 'MMI 2x2 耦合器', pdk: 'CUMEC-SiPh180', category: 'Coupler', keywords: 'MZI 干涉仪 耦合' },
  { name: 'Directional Coupler 定向耦合器', pdk: 'CUMEC-SiPh180', category: 'Coupler', keywords: '耦合 分光比 可调' },
  { name: 'MZI Modulator PN调制器', pdk: 'CUMEC-SiPh180', category: 'Modulator', keywords: '载流子耗尽 高速 50GHz PAM4' },
  { name: 'TiN Thermal Heater 热调谐器', pdk: 'CUMEC-SiPh180', category: 'Modulator', keywords: '相位调谐 25mW 波长锁定' },
  { name: 'Ge Photodetector 锗光电探测器', pdk: 'CUMEC-SiPh180', category: 'Detector', keywords: 'PIN PD 50GHz 0.8A/W 1310nm 1550nm' },
  { name: 'Grating Coupler 光栅耦合器', pdk: 'CUMEC-SiPh180', category: 'IO', keywords: '垂直耦合 光纤 40nm带宽' },
  { name: 'Edge Coupler SSC 边缘耦合器', pdk: 'CUMEC-SiPh180', category: 'IO', keywords: '模斑转换 宽带 低损耗 1.5dB' },
  { name: 'Microring Resonator 微环谐振器', pdk: 'CUMEC-SiPh180', category: 'Filter', keywords: '滤波 Q值 FSR 传感 WDM' },
  { name: 'AWG 阵列波导光栅', pdk: 'CUMEC-SiPh180', category: 'Filter', keywords: '波分复用 DWDM 8通道' },
  { name: 'SiN High-Q Microring 氮化硅微环', pdk: 'SiOPT-SiN800', category: 'Filter', keywords: '超高Q 百万 外腔 传感 kerr' },
  { name: 'SiN Spiral 螺旋延迟线', pdk: 'SiOPT-SiN800', category: 'Waveguide', keywords: '延迟 缓存 微波光子 低损耗' },
  { name: 'TFLN MZI Modulator 铌酸锂调制器', pdk: 'LNOI-Photonics', category: 'Modulator', keywords: '110GHz Vpi 1.5V 超高带宽 800G 1.6T 相干' },
  { name: 'TFLN IQ Modulator 铌酸锂IQ调制器', pdk: 'LNOI-Photonics', category: 'Modulator', keywords: '16QAM 64QAM 相干 DP 双偏振' },
  { name: 'DFB Laser 分布反馈激光器', pdk: 'InP-EPI', category: 'Source', keywords: 'CW 单模 光栅 SMSR 窄线宽' },
  { name: 'EML 电吸收调制激光器', pdk: 'InP-EPI', category: 'Source', keywords: 'DFB+EAM 100G 400G 啁啾 PAM4' },
  { name: 'SOA 半导体光放大器', pdk: 'InP-EPI', category: 'Amplifier', keywords: '增益 InP 片上放大 前置' },
  { name: 'CW Laser 连续波激光器', pdk: 'InP-EPI', category: 'Source', keywords: '外腔 窄线宽 硅光 光源 ECL ITLA' },
]

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { t, lang } = useI18n()

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const out: SearchResult[] = []

    // Search chips
    photonicsChips.forEach((chip) => {
      const searchable = `${chip.name} ${chip.fullName} ${chip.category} ${chip.description} ${chip.applications.join(' ')} ${chip.keyMaterials.join(' ')}`.toLowerCase()
      if (searchable.includes(q)) {
        out.push({ id: `chip-${chip.id}`, type: 'chip', title: `${chip.name} — ${chip.fullName}`, subtitle: chip.category, link: `/chips/${chip.id}`, icon: Cpu, color: chip.color })
      }
    })

    // Search foundries
    foundrySearchData.forEach((f) => {
      const searchable = `${f.name} ${f.location} ${f.platforms} ${f.keywords}`.toLowerCase()
      if (searchable.includes(q)) {
        out.push({ id: `foundry-${f.id}`, type: 'foundry', title: f.name, subtitle: `${f.location} · ${f.platforms.split(' ').slice(0, 3).join(' ')}`, link: '/pdk', icon: Building2, color: '#3b82f6' })
      }
    })

    // Search devices
    deviceSearchData.forEach((d) => {
      const searchable = `${d.name} ${d.pdk} ${d.category} ${d.keywords}`.toLowerCase()
      if (searchable.includes(q)) {
        out.push({ id: `device-${d.name}`, type: 'device', title: d.name, subtitle: `${d.pdk} · ${d.category}`, link: '/pdk', icon: Layers, color: '#8b5cf6' })
      }
    })

    // Search chip articles
    photonicsChips.forEach((chip) => {
      chip.articles.forEach((article) => {
        const searchable = `${article.title} ${article.summary} ${article.tags.join(' ')} ${article.content}`.toLowerCase()
        if (searchable.includes(q)) {
          out.push({ id: `article-${article.id}`, type: 'article', title: article.title, subtitle: `${chip.name} · ${article.summary.slice(0, 40)}`, link: `/chips/${chip.id}`, icon: FileText, color: '#f97316' })
        }
      })
    })

    return out.slice(0, 12) // Limit results
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    navigate(result.link)
  }

  const typeLabels: Record<string, Record<string, string>> = {
    chip: { zh: '芯片技术', en: 'Chip Tech' },
    foundry: { zh: 'Foundry', en: 'Foundry' },
    device: { zh: '器件', en: 'Device' },
    article: { zh: '文章', en: 'Article' },
    news: { zh: '资讯', en: 'News' },
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 100) }}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden md:inline">{lang === 'zh' ? '搜索...' : 'Search...'}</span>
        <kbd className="hidden md:inline text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">⌘K</kbd>
      </button>

      {/* Search Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Search Panel */}
          <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'zh' ? '搜索芯片、Foundry、器件、工艺...' : 'Search chips, foundries, devices, process...'}
                className="flex-1 text-sm outline-none placeholder-gray-400"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-400">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {query && results.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  {lang === 'zh' ? '未找到相关结果' : 'No results found'}
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: result.color + '15' }}>
                        <result.icon className="h-4 w-4" style={{ color: result.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded flex-shrink-0">
                        {typeLabels[result.type]?.[lang] || result.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <div className="py-4 px-4">
                  <p className="text-xs text-gray-400 mb-3">{lang === 'zh' ? '快速跳转' : 'Quick links'}</p>
                  <div className="flex flex-wrap gap-2">
                    {['EML', 'TFLN', 'Silicon Photonics', 'CPO', 'CUMEC', '微环', 'Ge-PD', '光栅', '量子'].map((tag) => (
                      <button key={tag} onClick={() => setQuery(tag)}
                        className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
