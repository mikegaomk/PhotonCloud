import { useState } from 'react'
import { BookOpen, HelpCircle, Code, ChevronDown, ChevronRight } from 'lucide-react'
import { useI18n } from '../data/i18nContext'

export default function HelpPage() {
  const { lang } = useI18n()
  const zh = lang === 'zh'
  const [tab, setTab] = useState<'guide' | 'faq' | 'api'>('guide')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const guides = [
    { title: zh ? '快速开始' : 'Quick Start', steps: [zh ? '注册账号并选择套餐（免费版即可开始）' : 'Register and choose plan', zh ? '浏览 Foundry PDK 并下载所需 PDK' : 'Browse and download a PDK', zh ? '进入"设计仿真"页配置器件参数' : 'Configure device params in Design page', zh ? '提交云仿真作业，等待 GPU 计算完成' : 'Submit cloud sim job', zh ? '查看 S 参数结果并导出 .s2p / PDF 报告' : 'View results, export .s2p / PDF'] },
    { title: zh ? 'PDK 下载与使用' : 'PDK Download & Usage', steps: [zh ? '进入 PDK 页面 → Foundry 标签 → 选择目标 Foundry' : 'Go to PDK → Foundry tab → Select foundry', zh ? '查看工艺参数和 MPW 时间表' : 'Check process params & MPW schedule', zh ? '点击"下载/申请"提交 PDK 申请' : 'Click Download/Apply', zh ? '开放类 PDK 即时下载，申请类等待审批' : 'Open PDKs download instantly', zh ? '下载后在 EDA 工具中加载 PDK' : 'Load PDK in your EDA tool'] },
    { title: zh ? '云仿真使用' : 'Cloud Simulation', steps: [zh ? '进入"云仿真"页 → 点击"提交作业"' : 'Go to Cloud Sim → Submit Job', zh ? 'Step 1: 选择器件类型和 PDK' : 'Step 1: Select component & PDK', zh ? 'Step 2: 配置参数、选择引擎、设置精度' : 'Step 2: Configure params & engine', zh ? 'Step 3: 确认并提交（预估费用和时间）' : 'Step 3: Confirm & submit', zh ? '在作业列表查看进度，完成后查看结果' : 'Track in Jobs tab, view results'] },
    { title: zh ? 'GDSFactory 集成' : 'GDSFactory Integration', steps: [zh ? '进入 PDK → GDSFactory 标签' : 'Go to PDK → GDSFactory tab', zh ? '选择器件类型（如 MZI、微环等）' : 'Select component type', zh ? '调整参数滑块，实时预览 GDS 版图' : 'Adjust params, preview GDS layout', zh ? '点击"生成 GDS 文件"下载（需后端运行）' : 'Click Generate to download GDS', zh ? '或复制 Python 代码在本地运行 gdsfactory' : 'Or copy Python code to run locally'] },
  ]

  const faqs = [
    { q: zh ? '免费版有什么限制？' : 'What are free plan limits?', a: zh ? '免费版每月 3 次云仿真，仅支持 BPM/EME 引擎，只能下载开放类 PDK。升级专业版可获得 100 次/月仿真和全部 5 个引擎。' : 'Free plan: 3 sims/month, BPM/EME only, open PDKs only. Upgrade to Pro for 100/month and all 5 engines.' },
    { q: zh ? '仿真结果精度如何？' : 'How accurate are simulations?', a: zh ? '我们的 FDTD 引擎与 Lumerical 对标误差 <3%，速度快 10 倍（GPU 加速）。详见 Benchmark 页。' : 'Our FDTD engine benchmarks <3% error vs Lumerical, 10x faster (GPU). See Benchmark tab.' },
    { q: zh ? '支持哪些 Foundry PDK？' : 'Which Foundry PDKs are supported?', a: zh ? '目前支持 6 家国产 Foundry：CUMEC、SiOPT、绍兴中芯(Tower)、LNOI 济南量子、长光辰芯(InP)、光迅科技。持续扩展中。' : '6 domestic foundries: CUMEC, SiOPT, Tower/SMIC, LNOI, CIOMP InP, Accelink. Expanding.' },
    { q: zh ? '如何申请 NDA 类 PDK？' : 'How to apply for NDA PDKs?', a: zh ? '在 PDK 下载/申请页填写机构信息和使用目的，Foundry 审核通过后签署 NDA，通常 1-2 周。' : 'Fill application form with org info & purpose, Foundry reviews, sign NDA. Usually 1-2 weeks.' },
    { q: zh ? '数据安全如何保障？' : 'How is data secured?', a: zh ? '所有仿真数据加密存储，IP 黑盒化保护，NDA 追踪审计。服务器位于国内（阿里云/华为云），符合数据主权要求。' : 'Encrypted storage, IP blackbox protection, NDA audit trail. Servers in China, data sovereignty compliant.' },
    { q: zh ? '是否支持团队协作？' : 'Is team collaboration supported?', a: zh ? '企业版支持团队空间、共享设计文件、权限管理和审核流程。专业版支持基本的个人项目管理。' : 'Enterprise plan supports team spaces, shared files, permissions. Pro supports basic project management.' },
    { q: zh ? 'API 如何使用？' : 'How to use the API?', a: zh ? '在 Dashboard → API Keys 生成密钥，使用 Bearer Token 认证调用 REST API。详见下方 API 参考。' : 'Generate key in Dashboard → API Keys, use Bearer Token auth. See API reference below.' },
    { q: zh ? '如何获得技术支持？' : 'How to get support?', a: zh ? '免费版通过社区论坛，专业版享优先邮件支持（24h 响应），企业版 1v1 专属技术经理。' : 'Free: community forum. Pro: priority email (24h). Enterprise: dedicated technical manager.' },
  ]

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/login/json', desc: zh ? '用户登录' : 'Login' },
    { method: 'POST', path: '/api/sim/submit', desc: zh ? '提交仿真作业' : 'Submit sim job' },
    { method: 'GET', path: '/api/sim/jobs', desc: zh ? '获取作业列表' : 'List jobs' },
    { method: 'GET', path: '/api/sim/jobs/:id/result', desc: zh ? '获取仿真结果' : 'Get job result' },
    { method: 'POST', path: '/api/gds/custom', desc: zh ? '生成 GDS 文件' : 'Generate GDS' },
    { method: 'POST', path: '/api/sparam/generate', desc: zh ? '生成 S 参数' : 'Generate S-params' },
    { method: 'GET', path: '/api/pdk/list', desc: zh ? '获取 PDK 列表' : 'List PDKs' },
    { method: 'GET', path: '/api/pdk/:name/layers', desc: zh ? '获取层定义' : 'Get layer defs' },
    { method: 'POST', path: '/api/pdk/upload', desc: zh ? '上传 PDK' : 'Upload PDK' },
    { method: 'GET', path: '/api/pdk/components', desc: zh ? '获取器件库' : 'List components' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{zh ? '帮助文档' : 'Help & Documentation'}</h1>
      <p className="text-gray-500 mb-8">{zh ? '平台使用指南、常见问题和 API 参考' : 'Platform guides, FAQ, and API reference'}</p>

      <div className="flex gap-2 mb-8">
        {[
          { key: 'guide' as const, label: zh ? '📖 使用指南' : '📖 Guides', icon: BookOpen },
          { key: 'faq' as const, label: zh ? '❓ 常见问题' : '❓ FAQ', icon: HelpCircle },
          { key: 'api' as const, label: '🔗 API', icon: Code },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'guide' && (
        <div className="space-y-6">
          {guides.map((g) => (
            <div key={g.title} className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{g.title}</h3>
              <div className="space-y-2">
                {g.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-700 pt-0.5">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'faq' && (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                {expandedFaq === faq.q ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
              </button>
              {expandedFaq === faq.q && (
                <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">API {zh ? '认证' : 'Authentication'}</h3>
            <p className="text-sm text-gray-600 mb-3">{zh ? '所有 API 请求需要在 Header 中携带 Bearer Token：' : 'All requests require Bearer Token in header:'}</p>
            <pre className="p-3 bg-gray-900 rounded-lg text-xs text-green-400 font-mono">Authorization: Bearer pc_live_your_api_key_here</pre>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">API Endpoints</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="py-2 px-3 text-left text-gray-600">Method</th><th className="py-2 px-3 text-left text-gray-600">Endpoint</th><th className="py-2 px-3 text-left text-gray-600">{zh ? '说明' : 'Description'}</th></tr></thead>
                <tbody>
                  {apiEndpoints.map((e) => (
                    <tr key={e.path} className="border-b border-gray-50">
                      <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${e.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{e.method}</span></td>
                      <td className="py-2 px-3 font-mono text-xs text-gray-800">{e.path}</td>
                      <td className="py-2 px-3 text-gray-600 text-xs">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{zh ? '示例请求' : 'Example Request'}</h3>
            <pre className="p-3 bg-gray-900 rounded-lg text-xs text-green-400 font-mono overflow-x-auto whitespace-pre">{`curl -X POST https://api.photoncloud.cn/v1/sim/submit \\
  -H "Authorization: Bearer pc_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"component":"mzi_modulator","engine":"FDTD","params":{"arm_length":3.0}}'`}</pre>
          </div>
        </div>
      )}

      {/* Onboarding Section */}
      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{zh ? '🚀 3 步开始使用光芯云' : '🚀 3 Steps to Get Started'}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">{zh ? '从零到第一次仿真只需 5 分钟' : 'From zero to first simulation in 5 minutes'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: zh ? '选择 Foundry' : 'Choose Foundry', desc: zh ? '浏览 6 家国产 Foundry，查看工艺参数和 PDK 信息' : 'Browse 6 foundries, check process & PDK info', link: '/pdk', btn: zh ? '浏览 Foundry →' : 'Browse →' },
            { step: '2', title: zh ? '下载 PDK' : 'Download PDK', desc: zh ? '申请并下载 PDK 包，在 EDA 工具中加载设计套件' : 'Apply & download PDK, load in EDA tools', link: '/pdk', btn: zh ? '下载 PDK →' : 'Download →' },
            { step: '3', title: zh ? '提交仿真' : 'Submit Simulation', desc: zh ? '选择器件、配置参数、一键提交到 GPU 云集群' : 'Select device, configure, submit to GPU cluster', link: '/cloud-sim', btn: zh ? '开始仿真 →' : 'Start Sim →' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">{s.step}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500 mb-3">{s.desc}</p>
              <a href={s.link} className="text-xs text-indigo-600 font-medium hover:underline">{s.btn}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
