import { Link } from 'react-router-dom'
import { Cpu, Cloud, Layers, Zap, Shield, Globe, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { useI18n } from '../data/i18nContext'
import { useAuth } from '../data/authContext'

export default function HomePage() {
  const { lang } = useI18n()
  const { isAuthenticated } = useAuth()
  const zh = lang === 'zh'

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm mb-6 backdrop-blur">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{zh ? '国产光芯片设计第一云平台' : "China's #1 Photonic Chip Design Cloud"}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {zh ? '光芯云' : 'PhotonCloud'} <span className="text-indigo-300">PhotonCloud</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto mb-8">
            {zh
              ? '云原生仿真引擎 + 国产 Foundry PDK 聚合 — 从设计到流片，一站式光芯片开发平台'
              : 'Cloud-native simulation engine + domestic Foundry PDK hub — one-stop photonic chip development platform'}
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link to={isAuthenticated ? '/cloud-sim' : '/login'} className="px-8 py-3.5 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg">
              {zh ? '免费开始' : 'Start Free'} →
            </Link>
            <Link to="/pdk" className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg">
              {zh ? '浏览 PDK' : 'Explore PDKs'}
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '6', label: zh ? '国产 Foundry' : 'Foundries' },
              { value: '200+', label: zh ? '参数化器件' : 'Parametric Cells' },
              { value: '5', label: zh ? '仿真引擎' : 'Sim Engines' },
              { value: '<1¥', label: zh ? '每次仿真起' : 'per sim job' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-indigo-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{zh ? '两大核心能力' : 'Two Core Capabilities'}</h2>
            <p className="text-gray-500">{zh ? '云原生仿真 × 国产 PDK 聚合，打通光芯片设计全流程' : 'Cloud-native simulation × domestic PDK aggregation'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <Cloud className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{zh ? '☁️ 云原生仿真引擎' : '☁️ Cloud-Native Simulation'}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'FDTD / EME / BPM / 多物理场 五大引擎' : '5 engines: FDTD, EME, BPM, CHARGE, HEAT'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'GPU 集群加速，A100/H100 按需分配' : 'GPU cluster: A100/H100 on-demand'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? '3 步提交作业，异步结果推送' : '3-step submission, async results'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'S 参数自动生成 + 可视化 + .s2p 导出' : 'Auto S-param + visualization + export'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'GDSFactory 原生集成' : 'GDSFactory native integration'}</li>
              </ul>
              <Link to="/cloud-sim" className="inline-flex items-center gap-1 mt-4 text-indigo-600 font-medium text-sm hover:underline">{zh ? '开始仿真' : 'Start Simulation'} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <Layers className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{zh ? '🏭 国产 Foundry PDK 聚合' : '🏭 Domestic Foundry PDK Hub'}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? '6 家国产 Foundry PDK 一站式获取' : '6 domestic foundry PDKs in one place'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'SOI / SiN / InP / LNOI 全工艺覆盖' : 'SOI / SiN / InP / LNOI full coverage'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'GDS 在线预览，下载前可视化' : 'GDS online preview before download'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'IP 黑盒化 + NDA 追踪 + 版本控制' : 'IP blackbox + NDA tracking + versioning'}</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{zh ? 'EDA 工具链一键联动 (8 款工具)' : '8 EDA tools integrated with launch button'}</li>
              </ul>
              <Link to="/pdk" className="inline-flex items-center gap-1 mt-4 text-green-600 font-medium text-sm hover:underline">{zh ? '浏览 PDK' : 'Browse PDKs'} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Entry */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: Cloud, label: zh ? '云仿真' : 'Cloud Sim', link: '/cloud-sim', color: 'text-indigo-600' },
              { icon: Layers, label: zh ? 'PDK 聚合' : 'PDK Hub', link: '/pdk', color: 'text-green-600' },
              { icon: Cpu, label: zh ? '芯片库' : 'Chips', link: '/chips', color: 'text-blue-600' },
              { icon: Zap, label: zh ? '设计仿真' : 'Design', link: '/design', color: 'text-purple-600' },
              { icon: Globe, label: zh ? '资讯' : 'News', link: '/news', color: 'text-orange-600' },
              { icon: Shield, label: zh ? '社区' : 'Forum', link: '/forum', color: 'text-pink-600' },
            ].map((item) => (
              <Link key={item.link} to={item.link} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all">
                <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{zh ? '灵活定价' : 'Flexible Pricing'}</h2>
            <p className="text-gray-500">{zh ? '按需付费，从免费开始，随业务规模弹性扩展' : 'Pay as you go, start free, scale with your needs'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 p-8 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{zh ? '免费版' : 'Free'}</h3>
              <p className="text-gray-500 text-sm mt-1">{zh ? '个人学习和评估' : 'For learning & evaluation'}</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">¥0<span className="text-sm font-normal text-gray-500">/{zh ? '月' : 'mo'}</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '3 次/月 云仿真' : '3 sim jobs/month'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '开放 PDK 下载' : 'Open PDK download'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '社区访问' : 'Community access'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '基础器件设计工具' : 'Basic design tools'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? 'BPM/EME 引擎' : 'BPM/EME engines'}</li>
              </ul>
              <Link to="/login" className="block mt-8 py-2.5 text-center border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-indigo-300 hover:text-indigo-700 transition-colors">
                {zh ? '免费注册' : 'Sign Up Free'}
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-indigo-500 p-8 bg-indigo-50/30 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">{zh ? '最受欢迎' : 'Most Popular'}</div>
              <h3 className="text-lg font-bold text-gray-900">{zh ? '专业版' : 'Professional'}</h3>
              <p className="text-gray-500 text-sm mt-1">{zh ? '工程师和小团队' : 'Engineers & small teams'}</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">¥299<span className="text-sm font-normal text-gray-500">/{zh ? '月' : 'mo'}</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? '100 次/月 云仿真' : '100 sim jobs/month'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? '全部 5 大仿真引擎' : 'All 5 simulation engines'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? '全部 PDK 下载 (含申请类)' : 'All PDKs (including apply-type)'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? 'GDSFactory 云端调用' : 'GDSFactory cloud API'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? 'S 参数批量生成 + 导出' : 'Batch S-param generation'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? 'API 访问 (1000 次/月)' : 'API access (1000 calls/mo)'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />{zh ? '优先队列' : 'Priority queue'}</li>
              </ul>
              <Link to="/login" className="block mt-8 py-2.5 text-center bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                {zh ? '立即开通 →' : 'Get Started →'}
              </Link>
              <p className="text-xs text-center text-gray-400 mt-2">{zh ? '支持微信/支付宝/银行转账' : 'WeChat Pay / Alipay / Bank Transfer'}</p>
            </div>
            {/* Enterprise */}
            <div className="rounded-2xl border border-gray-200 p-8 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{zh ? '企业版' : 'Enterprise'}</h3>
              <p className="text-gray-500 text-sm mt-1">{zh ? '大型团队和 Foundry' : 'Large teams & foundries'}</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">{zh ? '定制' : 'Custom'}</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '无限仿真作业' : 'Unlimited sim jobs'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '专属 GPU 集群' : 'Dedicated GPU cluster'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? 'NDA PDK 全访问' : 'Full NDA PDK access'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? 'IP 黑盒化管理' : 'IP blackbox management'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '团队协同设计' : 'Team collaboration'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '私有部署选项' : 'On-premise option'}</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{zh ? '1v1 技术支持' : 'Dedicated support'}</li>
              </ul>
              <button className="block w-full mt-8 py-2.5 text-center border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-indigo-300 transition-colors">
                {zh ? '联系销售' : 'Contact Sales'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Foundry Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{zh ? '合作 Foundry 与生态伙伴' : 'Foundry & Ecosystem Partners'}</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 text-2xl opacity-80">
            <span title="CUMEC">🏭 CUMEC</span>
            <span title="SiOPT">🔬 SiOPT</span>
            <span title="LNOI">💎 LNOI</span>
            <span title="Tower/SMIC">⚙️ Tower</span>
            <span title="Accelink">🌐 光迅</span>
            <span title="CIOMP">🔭 长光辰芯</span>
            <span title="GDSFactory">🏭 GDSFactory</span>
            <span title="Lumerical">🔬 Lumerical</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">{zh ? '光芯云' : 'PhotonCloud'}</span>
            </div>
            <p className="text-sm">{zh ? '© 2026 光芯云 PhotonCloud. 国产光芯片设计第一云平台' : '© 2026 PhotonCloud. China\'s #1 Photonic Chip Design Cloud'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
