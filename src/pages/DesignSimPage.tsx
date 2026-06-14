import { useState } from 'react'
import { PenTool, Activity, BarChart3 } from 'lucide-react'
import { useI18n } from '../data/i18nContext'
import DesignPanel from './DesignPage'
import SimulatorPanel from './SimulatorPage'
import SParamVizPanel from './SParamVizPage'

type TopTab = 'design' | 'simulator' | 'sparam-viz'

export default function DesignSimPage() {
  const [tab, setTab] = useState<TopTab>('design')
  const { t } = useI18n()

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <button onClick={() => setTab('design')}
              className={`flex items-center gap-1.5 h-full border-b-2 px-1 text-sm font-medium transition-colors ${tab === 'design' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <PenTool className="h-4 w-4" /> {t('design.tab.design')}
            </button>
            <button onClick={() => setTab('simulator')}
              className={`flex items-center gap-1.5 h-full border-b-2 px-1 text-sm font-medium transition-colors ${tab === 'simulator' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Activity className="h-4 w-4" /> {t('design.tab.sim')}
            </button>
            <button onClick={() => setTab('sparam-viz')}
              className={`flex items-center gap-1.5 h-full border-b-2 px-1 text-sm font-medium transition-colors ${tab === 'sparam-viz' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <BarChart3 className="h-4 w-4" /> {t('design.tab.sparam')}
            </button>
          </div>
        </div>
      </div>
      {tab === 'design' && <DesignPanel />}
      {tab === 'simulator' && <SimulatorPanel />}
      {tab === 'sparam-viz' && <SParamVizPanel />}
    </div>
  )
}
