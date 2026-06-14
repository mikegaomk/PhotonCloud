import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, ThumbsUp, Eye, Plus, Tag } from 'lucide-react'
import { useAuth } from '../data/authContext'
import { useI18n } from '../data/i18nContext'
import { getForumPosts, addPost, categoryLabels, type ForumPost } from '../data/forumData'

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
