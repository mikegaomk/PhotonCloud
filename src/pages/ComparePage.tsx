import { photonicsChips, comparisonMetrics } from '../data/photonicsData'
import { useI18n } from '../data/i18nContext'

export default function ComparePage() {
  const { t } = useI18n()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('compare.title')}</h1>
      <p className="text-gray-500 mb-8">
        {t('compare.subtitle')}
      </p>

      {/* Comparison Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">指标</th>
              {photonicsChips.map((chip) => (
                <th key={chip.id} className="text-center py-3 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: chip.color }}
                    >
                      {chip.name.slice(0, 2)}
                    </div>
                    <span className="text-xs font-medium text-gray-600">{chip.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonMetrics.map((row, i) => (
              <tr key={row.metric} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-4 font-medium text-gray-700">{row.metric}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.eml}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.cw}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.tfln}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.siph}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.computing}</td>
                <td className="py-3 px-4 text-center text-gray-600">{row.cpo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Radar-like visual comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {photonicsChips.map((chip) => (
          <div key={chip.id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: chip.color }}
              >
                {chip.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{chip.name}</h3>
                <p className="text-xs text-gray-500">{chip.category}</p>
              </div>
            </div>
            <div className="space-y-2">
              {chip.keySpecs.slice(0, 4).map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{spec.label}</span>
                  <span className="font-medium text-gray-800">{spec.value} {spec.unit}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">2026 市场规模</span>
                <span className="font-bold" style={{ color: chip.color }}>
                  ${chip.trendData[chip.trendData.length - 1].market}B
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
