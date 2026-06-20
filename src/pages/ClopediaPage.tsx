import { useState } from 'react'
import { Search, BookOpen, ChevronRight, ExternalLink } from 'lucide-react'
import { clopediaEntries, clopediaCategories, type ClopediaEntry } from '../data/clopediaData'

export default function ClopediaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedEntry, setSelectedEntry] = useState<ClopediaEntry | null>(null)
  const [viewMode, setViewMode] = useState<'category' | 'alpha'>('category')

  const filteredEntries = clopediaEntries.filter((entry) => {
    const matchesSearch = searchQuery === '' ||
      entry.termEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.termZh.includes(searchQuery) ||
      (entry.abbreviation && entry.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group by first letter for alpha view
  const alphaGroups = filteredEntries.reduce((acc, entry) => {
    const letter = entry.termEn[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(entry)
    return acc
  }, {} as Record<string, ClopediaEntry[]>)

  // Group by category
  const categoryGroups = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = []
    acc[entry.category].push(entry)
    return acc
  }, {} as Record<string, ClopediaEntry[]>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          Photon-Clopedia
        </h1>
        <p className="text-gray-500 mt-1">光芯片术语百科 — 中英双语 · 分类浏览 · 互联词条</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索术语（中文/英文/缩写）..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
        />
      </div>

      {/* View Toggle & Category Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('category')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'category' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'}`}
          >
            按分类
          </button>
          <button
            onClick={() => setViewMode('alpha')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'alpha' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'}`}
          >
            按字母
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === 'all' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            全部 ({clopediaEntries.length})
          </button>
          {Object.entries(clopediaCategories).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === key ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {icon} {label} ({clopediaEntries.filter(e => e.category === key).length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {viewMode === 'category' ? (
            Object.entries(categoryGroups).map(([cat, entries]) => (
              <div key={cat} className="mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  {clopediaCategories[cat]?.icon} {clopediaCategories[cat]?.label}
                </h3>
                {entries.map((entry) => (
                  <EntryListItem key={entry.id} entry={entry} selected={selectedEntry?.id === entry.id} onClick={() => setSelectedEntry(entry)} />
                ))}
              </div>
            ))
          ) : (
            Object.entries(alphaGroups).sort().map(([letter, entries]) => (
              <div key={letter} className="mb-4">
                <h3 className="text-lg font-bold text-indigo-600 mb-1">{letter}</h3>
                {entries.map((entry) => (
                  <EntryListItem key={entry.id} entry={entry} selected={selectedEntry?.id === entry.id} onClick={() => setSelectedEntry(entry)} />
                ))}
              </div>
            ))
          )}
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-gray-400">未找到匹配的术语</div>
          )}
        </div>

        {/* Entry Detail */}
        <div className="lg:col-span-2">
          {selectedEntry ? (
            <EntryDetail entry={selectedEntry} onRelatedClick={(id) => {
              const related = clopediaEntries.find(e => e.id === id)
              if (related) setSelectedEntry(related)
            }} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">选择一个术语</h3>
              <p className="text-gray-400">从左侧列表点击术语查看详细释义</p>
              <p className="text-sm text-gray-300 mt-4">共收录 {clopediaEntries.length} 个光芯片术语</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EntryListItem({ entry, selected, onClick }: { entry: ClopediaEntry; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group ${
        selected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div>
        <span className="text-sm font-medium text-gray-900">{entry.termEn}</span>
        {entry.abbreviation && <span className="text-xs text-gray-400 ml-1">({entry.abbreviation})</span>}
        <span className="block text-xs text-gray-500">{entry.termZh}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
    </button>
  )
}

function EntryDetail({ entry, onRelatedClick }: { entry: ClopediaEntry; onRelatedClick: (id: string) => void }) {
  const cat = clopediaCategories[entry.category]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{cat?.icon}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: cat?.color, color: cat?.color }}>
            {cat?.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {entry.termEn}
          {entry.abbreviation && <span className="text-lg text-gray-400 ml-2">({entry.abbreviation})</span>}
        </h2>
        <p className="text-lg text-gray-600 mt-1">{entry.termZh}</p>
      </div>

      {/* English Definition */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">English Definition</h4>
        <p className="text-gray-700 leading-relaxed">{entry.definition}</p>
      </div>

      {/* Chinese Definition */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">中文释义</h4>
        <p className="text-gray-700 leading-relaxed">{entry.definitionZh}</p>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">标签</h4>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {/* Related Terms */}
      {entry.relatedTerms.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">相关词条</h4>
          <div className="flex flex-wrap gap-2">
            {entry.relatedTerms.map((relId) => {
              const related = clopediaEntries.find(e => e.id === relId)
              return related ? (
                <button
                  key={relId}
                  onClick={() => onRelatedClick(relId)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {related.termEn}
                </button>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
