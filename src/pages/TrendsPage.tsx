import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { photonicsChips } from '../data/photonicsData'
import { useI18n } from '../data/i18nContext'

export default function TrendsPage() {
  const { t } = useI18n()
  // Combine all chip market data into unified timeline
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
  const combinedData = years.map((year) => {
    const entry: Record<string, number> = { year }
    let total = 0
    photonicsChips.forEach((chip) => {
      const point = chip.trendData.find((d) => d.year === year)
      const val = point?.market || 0
      entry[chip.id] = val
      total += val
    })
    entry.total = parseFloat(total.toFixed(1))
    return entry
  })

  // Growth rates
  const growthData = photonicsChips.map((chip) => {
    const first = chip.trendData[0].market
    const last = chip.trendData[chip.trendData.length - 1].market
    const cagr = (Math.pow(last / first, 1 / 6) - 1) * 100
    return {
      name: chip.name,
      cagr: parseFloat(cagr.toFixed(1)),
      market2026: last,
      color: chip.color,
    }
  }).sort((a, b) => b.cagr - a.cagr)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('trends.title')}</h1>
      <p className="text-gray-500 mb-8">
        {t('trends.subtitle')}
      </p>

      {/* Stacked Area */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">市场规模总览 ($ Billion)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {photonicsChips.map((chip) => (
              <Bar key={chip.id} dataKey={chip.id} stackId="market" fill={chip.color} name={chip.name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Line */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">各技术方向增长曲线</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {photonicsChips.map((chip) => (
              <Line
                key={chip.id}
                type="monotone"
                dataKey={chip.id}
                stroke={chip.color}
                strokeWidth={2}
                name={chip.name}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CAGR Ranking */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">年均复合增长率 (CAGR 2020-2026)</h2>
        <div className="space-y-4">
          {growthData.map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">{item.name}</div>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{
                    width: `${Math.min(100, item.cagr / 1.2)}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="text-xs font-bold text-white">{item.cagr}%</span>
                </div>
              </div>
              <div className="w-20 text-right text-sm text-gray-500">${item.market2026}B</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-indigo-600">$31.4B</p>
          <p className="text-sm text-gray-500 mt-1">2026 光芯片总市场规模</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">Silicon Photonics</p>
          <p className="text-sm text-gray-500 mt-1">最大细分市场 ($9.8B)</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-pink-600">CPO</p>
          <p className="text-sm text-gray-500 mt-1">最高增长率 (CAGR ~130%)</p>
        </div>
      </div>
    </div>
  )
}
