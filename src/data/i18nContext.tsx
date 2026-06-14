import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'photonics_lang'

// Translation dictionary
const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.news': { zh: '资讯', en: 'News' },
  'nav.chips': { zh: '芯片库', en: 'Chips' },
  'nav.design': { zh: '设计仿真', en: 'Design & Sim' },
  'nav.pdk': { zh: 'PDK', en: 'PDK' },
  'nav.compare': { zh: '对比', en: 'Compare' },
  'nav.trends': { zh: '趋势', en: 'Trends' },
  'nav.forum': { zh: '社区', en: 'Forum' },
  'nav.login': { zh: '登录', en: 'Login' },
  'nav.logout': { zh: '退出', en: 'Logout' },

  // Home page
  'home.title': { zh: '光芯片互动平台', en: 'Photonics Interactive Platform' },
  'home.subtitle': { zh: '探索下一代光电子芯片技术：从 EML 到 CPO，从硅光到光计算。交互式学习、参数仿真、技术对比，一站式了解光芯片生态。', en: 'Explore next-gen photonic chip technologies: from EML to CPO, from silicon photonics to optical computing. Interactive learning, simulation, and comparison — all in one place.' },
  'home.feature.chips': { zh: '八大光芯片技术', en: '8 Photonic Chip Technologies' },
  'home.feature.chips.desc': { zh: 'EML、CW Laser、TFLN、Silicon Photonics、光计算、CPO、量子光子、光放大 全覆盖', en: 'EML, CW Laser, TFLN, SiPh, Photonic Computing, CPO, Quantum Photonics, Optical Amplifier' },
  'home.feature.compare': { zh: '多维对比分析', en: 'Multi-Dimensional Comparison' },
  'home.feature.compare.desc': { zh: '带宽、功耗、集成度、成本等核心指标横向对比', en: 'Compare bandwidth, power, integration, cost and more across technologies' },
  'home.feature.sim': { zh: '在线仿真器', en: 'Online Simulators' },
  'home.feature.sim.desc': { zh: '交互式参数调节，实时查看光芯片性能曲线', en: 'Interactive parameter tuning with real-time performance curves' },
  'home.feature.trends': { zh: '市场趋势', en: 'Market Trends' },
  'home.feature.trends.desc': { zh: '2020-2026 市场规模预测与增长趋势', en: '2020-2026 market size forecast and growth trends' },
  'home.overview': { zh: '光芯片技术总览', en: 'Technology Overview' },

  // Chips page
  'chips.title': { zh: '光芯片技术库', en: 'Photonics Technology Library' },
  'chips.subtitle': { zh: '从基础材料到系统应用，涵盖光芯片全产业链技术知识', en: 'From materials to system applications — full photonics supply chain knowledge' },
  'chips.all': { zh: '全部技术', en: 'All Technologies' },
  'chips.materials': { zh: '光芯片基础材料', en: 'Base Materials' },
  'chips.chips': { zh: '光芯片', en: 'Photonic Chips' },
  'chips.systems': { zh: '系统应用', en: 'System Applications' },

  // Design page
  'design.title': { zh: '光芯片设计与仿真', en: 'Photonic Chip Design & Simulation' },
  'design.subtitle': { zh: '交互式光子器件设计工具 — 输入结构参数，实时计算性能指标和优化曲线', en: 'Interactive photonic device design tools — input parameters, get real-time performance results' },
  'design.tab.design': { zh: '器件设计', en: 'Device Design' },
  'design.tab.sim': { zh: '系统仿真', en: 'System Simulation' },
  'design.tab.sparam': { zh: 'S参数可视化', en: 'S-Parameter Visualization' },

  // Simulator page
  'sim.title': { zh: '在线仿真器', en: 'Online Simulators' },
  'sim.subtitle': { zh: '交互式调节参数，实时查看光芯片性能特性。涵盖调制、传输、探测、封装和计算全链路。', en: 'Interactive parameter tuning — covering modulation, transmission, detection, packaging and computing.' },

  // Compare page
  'compare.title': { zh: '对比分析', en: 'Comparative Analysis' },
  'compare.subtitle': { zh: '六大光芯片技术核心指标横向对比', en: 'Cross-technology comparison of key metrics' },

  // Trends page
  'trends.title': { zh: '市场趋势', en: 'Market Trends' },
  'trends.subtitle': { zh: '2020-2026 光芯片各技术方向市场规模预测', en: '2020-2026 market size forecast by technology segment' },

  // News page
  'news.title': { zh: '资讯与动态', en: 'News & Updates' },
  'news.subtitle': { zh: '全球光芯片产业最新动态追踪', en: 'Latest photonics industry updates worldwide' },
  'news.tab.news': { zh: '深度资讯', en: 'In-Depth News' },
  'news.tab.updates': { zh: '快讯动态', en: 'Quick Updates' },
  'news.tab.timeline': { zh: '时间线', en: 'Timeline' },
  'news.filter.region': { zh: '地区：', en: 'Region:' },
  'news.filter.type': { zh: '类型：', en: 'Type:' },
  'news.filter.all': { zh: '全部', en: 'All' },

  // PDK page
  'pdk.title': { zh: '国产 Foundry PDK 聚合平台', en: 'Domestic Foundry PDK Hub' },
  'pdk.subtitle': { zh: 'PDK 上传管理、GDSFactory 集成、自动 S 参数生成、IP 黑盒化与 NDA 追踪、版本控制', en: 'PDK management, GDSFactory integration, auto S-param generation, IP blackbox & NDA tracking, version control' },
  'pdk.tab.browse': { zh: 'Foundry 详情', en: 'Foundry Details' },
  'pdk.tab.devices': { zh: '器件库', en: 'Device Library' },
  'pdk.tab.eda': { zh: 'EDA 工具', en: 'EDA Tools' },
  'pdk.tab.download': { zh: '下载/申请', en: 'Download/Apply' },
  'pdk.tab.gdsfactory': { zh: 'GDSFactory', en: 'GDSFactory' },
  'pdk.tab.manage': { zh: '上传/管理', en: 'Upload/Manage' },
  'pdk.tab.sparam': { zh: 'S参数生成', en: 'S-Param Gen' },
  'pdk.tab.ip': { zh: 'IP & NDA', en: 'IP & NDA' },
  'pdk.tab.versions': { zh: '版本控制', en: 'Version Control' },

  // Forum page
  'forum.title': { zh: '技术交流社区', en: 'Technical Forum' },
  'forum.subtitle': { zh: '与光电子工程师分享经验、讨论技术难题', en: 'Share experience and discuss technical challenges with photonics engineers' },
  'forum.newpost': { zh: '发起讨论', en: 'New Discussion' },
  'forum.login-to-post': { zh: '登录后发帖', en: 'Login to Post' },

  // Login page
  'login.title': { zh: '登录光芯片互动平台', en: 'Login to Photonics Platform' },
  'login.register.title': { zh: '注册新账号', en: 'Create Account' },
  'login.subtitle': { zh: '与全球光电子工程师交流技术', en: 'Connect with photonics engineers worldwide' },
  'login.username': { zh: '用户名', en: 'Username' },
  'login.password': { zh: '密码', en: 'Password' },
  'login.submit': { zh: '登录', en: 'Login' },
  'login.register': { zh: '注册', en: 'Register' },
  'login.switch-register': { zh: '没有账号？点击注册', en: "Don't have an account? Register" },
  'login.switch-login': { zh: '已有账号？点击登录', en: 'Already have an account? Login' },

  // Common
  'common.back': { zh: '返回', en: 'Back' },
  'common.download': { zh: '下载', en: 'Download' },
  'common.apply': { zh: '申请', en: 'Apply' },
  'common.submit': { zh: '提交', en: 'Submit' },
  'common.cancel': { zh: '取消', en: 'Cancel' },
  'common.search': { zh: '搜索', en: 'Search' },
  'common.all': { zh: '全部', en: 'All' },
  'common.details': { zh: '查看详情', en: 'View Details' },
  'common.loading': { zh: '加载中...', en: 'Loading...' },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored === 'zh' || stored === 'en') return stored
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase()
      return browserLang.startsWith('zh') ? 'zh' : 'en'
    }
    return 'zh'
  })

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem(STORAGE_KEY, newLang)
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en'
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const t = (key: string): string => {
    const entry = translations[key]
    if (!entry) return key
    return entry[lang] || entry['zh'] || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
