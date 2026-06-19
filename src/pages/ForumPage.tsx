import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, ThumbsUp, Eye, Plus, Tag } from 'lucide-react'
import { useAuth } from '../data/authContext'
import { useI18n } from '../data/i18nContext'
import { getForumPosts, addPost, categoryLabels, type ForumPost } from '../data/forumData'
import Giscus from '../components/Giscus'

export default function ForumPage() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useI18n()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNewPost, setShowNewPost] = useState(false)

  useEffect(() => {
    setPosts(getForumPosts())
  }, [])

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('forum.title')}</h1>
          <p className="text-gray-500 mt-1">{t('forum.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://discord.gg/WUFhGagN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            加入 Discord
          </a>
          {isAuthenticated ? (
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> {t('forum.newpost')}
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('forum.login-to-post')}
          </Link>
        )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {Object.entries(categoryLabels).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === key
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={selectedCategory === key ? { backgroundColor: color } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {/* New Post Form */}
      {showNewPost && user && (
        <NewPostForm
          user={user}
          onClose={() => setShowNewPost(false)}
          onSubmit={(post) => {
            setPosts(addPost(post))
            setShowNewPost(false)
          }}
        />
      )}

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            该分类下暂无帖子，来发布第一个讨论吧！
          </div>
        )}
      </div>

      {/* GitHub Discussions 社区讨论 */}
      <Giscus term="PhotonCloud Forum" />
    </div>
  )
}

function PostCard({ post }: { post: ForumPost }) {
  const cat = categoryLabels[post.category] || categoryLabels.general

  return (
    <Link to={`/forum/${post.id}`} className="card block hover:border-indigo-200">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{post.authorAvatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="chip-tag text-xs"
              style={{ backgroundColor: cat.color + '20', color: cat.color }}
            >
              {cat.label}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{post.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MessageSquare className="h-3.5 w-3.5" /> {post.replies.length}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="h-3.5 w-3.5" /> {post.views}
            </span>
            <span className="text-xs text-gray-400">
              {post.authorName} · {post.authorOrg}
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Tag className="h-3 w-3 text-gray-300" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-400">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function NewPostForm({
  user,
  onClose,
  onSubmit,
}: {
  user: { id: string; displayName: string; avatar: string; organization: string }
  onClose: () => void
  onSubmit: (post: ForumPost) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<ForumPost['category']>('general')
  const [tagsInput, setTagsInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    const post: ForumPost = {
      id: String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatar,
      authorOrg: user.organization,
      category,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      views: 0,
    }
    onSubmit(post)
  }

  return (
    <div className="card mb-8 border-2 border-indigo-200">
      <h3 className="text-lg font-semibold mb-4">发起新讨论</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="帖子标题"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ForumPost['category'])}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            {Object.entries(categoryLabels).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="详细描述你的问题或观点..."
            required
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
          />
        </div>
        <div>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="标签（逗号分隔，如：400G, PAM4, 硅光）"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-900">
            取消
          </button>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            发布
          </button>
        </div>
      </form>
    </div>
  )
}
