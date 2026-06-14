import { useState, useEffect } from 'react'
import { Newspaper, Zap, Globe, Filter, ChevronDown, ChevronRight, Clock, Tag } from 'lucide-react'
import { useI18n } from '../data/i18nContext'
import { getNews, getUpdates, categoryLabelsNews, regionLabels, type NewsItem, type TechUpdate } from '../data/newsData'

type ViewMode = 'news' | 'updates' | 'timeline'

export default function NewsPage() {
  const [view, setView] = useState<ViewMode>('news')
  const [news, setNews] = useState<NewsItem[]>([])
  const [updates, setUpdates] = useState<TechUpdate[]>([])
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedNews, setExpandedNews] = useState<string | null>(null)
  const { t } = useI18n()

  useEffect(() => {
    setNews(getNews())
    setUpdates(getUpdates())
  }, [])

  const filteredNews = news.filter((n) => {
    if (selectedRegion !== 'all' && n.region !== selectedRegion) return false
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false
    return true
  })

  const filteredUpdates = updates.filter((u) => {
    if (selectedRegion !== 'all' && u.region !== selectedRegion) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('news.title')}</h1>
          <p className="text-gray-500 mt-1">{t('news.subtitle')}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'news' as ViewMode, label: t('news.tab.news'), icon: Newspaper },
          { key: 'updates' as ViewMode, label: t('news.tab.updates'), icon: Zap },
          { key: 'timeline' as ViewMode, label: t('news.tab.timeline'), icon: Clock },
        ].map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <v.icon className="h-4 w-4" /> {v.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">地区：</span>
          <div className="flex gap-1">
            <FilterBtn label="全部" active={selectedRegion === 'all'} onClick={() => setSelectedRegion('all')} />
            {Object.entries(regionLabels).map(([key, { label, flag }]) => (
              <FilterBtn key={key} label={`${flag} ${label}`} active={selectedRegion === key} onClick={() => setSelectedRegion(key)} />
            ))}
          </div>
        </div>
        {view === 'news' && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">类型：</span>
            <div className="flex gap-1 flex-wrap">
              <FilterBtn label="全部" active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
              {Object.entries(categoryLabelsNews).map(([key, { label }]) => (
                <FilterBtn key={key} label={label} active={selectedCategory === key} onClick={() => setSelectedCategory(key)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {view === 'news' && (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} expanded={expandedNews === item.id} onToggle={() => setExpandedNews(expandedNews === item.id ? null : item.id)} />
          ))}
          {filteredNews.length === 0 && <EmptyState />}
        </div>
      )}

      {view === 'updates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
          {filteredUpdates.length === 0 && <EmptyState />}
        </div>
      )}

      {view === 'timeline' && <TimelineView news={filteredNews} updates={filteredUpdates} />}
    </div>
  )
}

function NewsCard({ item, expanded, onToggle }: { item: NewsItem; expanded: boolean; onToggle: () => void }) {
  const cat = categoryLabelsNews[item.category]
  const region = regionLabels[item.region]

  return (
    <div className="card">
      <div className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2 mb-2">
          <span className="chip-tag text-xs" style={{ backgroundColor: cat.color + '15', color: cat.color }}>
            {cat.label}
          </span>
          <span className="text-xs text-gray-400">{region.flag} {region.label}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{item.date}</span>
          {item.importance === 'high' && (
            <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">重要</span>
          )}
          <div className="ml-auto">
            {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.summary}</p>
        <div className="flex items-center gap-2 mt-3">
          <Tag className="h-3 w-3 text-gray-300" />
          {item.chipTags.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{tag}</span>
          ))}
          <span className="ml-auto text-xs text-gray-400">来源：{item.source}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {item.content}
          </div>
        </div>
      )}
    </div>
  )
}

function UpdateCard({ update }: { update: TechUpdate }) {
  const region = regionLabels[update.region]
  const typeColors: Record<string, string> = {
    breakthrough: '#8b5cf6',
    'product-launch': '#22c55e',
    partnership: '#3b82f6',
    funding: '#f97316',
    standard: '#6366f1',
    milestone: '#ec4899',
  }
  const typeLabels: Record<string, string> = {
    breakthrough: '🔬 突破',
    'product-launch': '🚀 产品',
    partnership: '🤝 合作',
    funding: '💰 融资',
    standard: '📋 标准',
    milestone: '🏆 里程碑',
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: typeColors[update.type] + '15', color: typeColors[update.type] }}>
          {typeLabels[update.type]}
        </span>
        <span className="text-xs text-gray-400">{region.flag} {update.date}</span>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1 text-sm">{update.title}</h4>
      <p className="text-xs text-gray-600">{update.description}</p>
      <div className="flex gap-1 mt-2">
        {update.relatedChips.map((chip) => (
          <span key={chip} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{chip}</span>
        ))}
      </div>
    </div>
  )
}

function TimelineView({ news, updates }: { news: NewsItem[]; updates: TechUpdate[] }) {
  // Merge and sort by date
  const allItems = [
    ...news.map((n) => ({ type: 'news' as const, date: n.date, title: n.title, data: n })),
    ...updates.map((u) => ({ type: 'update' as const, date: u.date, title: u.title, data: u })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {allItems.map((item, i) => (
          <div key={i} className="flex items-start gap-4 relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg z-10 flex-shrink-0 ${
              item.type === 'news' ? 'bg-indigo-100' : 'bg-green-100'
            }`}>
              {item.type === 'news' ? '📰' : '⚡'}
            </div>
            <div className="flex-1 card !py-3 !px-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">{item.date}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  item.type === 'news' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                }`}>
                  {item.type === 'news' ? '深度' : '快讯'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-400 col-span-2">
      该筛选条件下暂无内容
    </div>
  )
}
