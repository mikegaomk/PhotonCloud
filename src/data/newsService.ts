/**
 * News API client — fetches news from backend instead of localStorage.
 * Falls back to static mock data if backend is unreachable.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface NewsItemAPI {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  date: string
  category: string
  region: string
  chipTags: string[]
  importance: string
  content: string
}

export interface PaginatedNews {
  items: NewsItemAPI[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface NewsStats {
  total: number
  by_category: Record<string, number>
  by_region: Record<string, number>
}

export async function fetchNews(params: {
  category?: string
  region?: string
  tag?: string
  page?: number
  page_size?: number
} = {}): Promise<PaginatedNews> {
  const searchParams = new URLSearchParams()
  if (params.category) searchParams.set('category', params.category)
  if (params.region) searchParams.set('region', params.region)
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.page_size) searchParams.set('page_size', String(params.page_size))

  const url = `${API_BASE}/api/news?${searchParams.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function fetchNewsStats(): Promise<NewsStats> {
  const response = await fetch(`${API_BASE}/api/news/stats`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export async function fetchNewsHealth(): Promise<{
  status: string
  last_fetch: string | null
  entry_count: number
  last_cycle: Record<string, number> | null
}> {
  const response = await fetch(`${API_BASE}/api/news/health`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}
