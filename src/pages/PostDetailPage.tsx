import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, Tag, Send } from 'lucide-react'
import { useAuth } from '../data/authContext'
import { getForumPosts, addReply, likePost, categoryLabels, type ForumPost, type ForumReply } from '../data/forumData'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    const posts = getForumPosts()
    const found = posts.find((p) => p.id === id)
    if (found) {
      found.views++
      setPost({ ...found })
    }
  }, [id])

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">帖子不存在</p>
        <Link to="/forum" className="text-indigo-600 hover:underline mt-4 inline-block">
          返回社区
        </Link>
      </div>
    )
  }

  const cat = categoryLabels[post.category] || categoryLabels.general

  const handleLike = () => {
    const posts = likePost(post.id)
    const updated = posts.find((p) => p.id === post.id)
    if (updated) setPost({ ...updated })
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !user) return
    const reply: ForumReply = {
      id: String(Date.now()),
      content: replyContent.trim(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    const posts = addReply(post.id, reply)
    const updated = posts.find((p) => p.id === post.id)
    if (updated) setPost({ ...updated })
    setReplyContent('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/forum" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回社区
      </Link>

      {/* Post */}
      <article className="card mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{post.authorAvatar}</span>
          <div>
            <p className="font-medium text-gray-900">{post.authorName}</p>
            <p className="text-xs text-gray-500">{post.authorOrg} · {new Date(post.createdAt).toLocaleDateString('zh-CN')}</p>
          </div>
          <span
            className="chip-tag ml-auto"
            style={{ backgroundColor: cat.color + '20', color: cat.color }}
          >
            {cat.label}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <Tag className="h-4 w-4 text-gray-400" />
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" /> {post.likes}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <MessageSquare className="h-4 w-4" /> {post.replies.length} 回复
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Eye className="h-4 w-4" /> {post.views} 浏览
          </span>
        </div>
      </article>

      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          回复 ({post.replies.length})
        </h2>
        {post.replies.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            暂无回复，来发表你的观点吧
          </div>
        ) : (
          <div className="space-y-4">
            {post.replies.map((reply) => (
              <div key={reply.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{reply.authorAvatar}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{reply.authorName}</p>
                    <p className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString('zh-CN')}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <ThumbsUp className="h-3 w-3" /> {reply.likes}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pl-11">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Input */}
      {isAuthenticated ? (
        <form onSubmit={handleReply} className="card">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{user?.avatar}</span>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="分享你的观点或经验..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" /> 发送回复
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="card text-center">
          <p className="text-gray-500 mb-3">登录后即可参与讨论</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block">
            去登录
          </Link>
        </div>
      )}
    </div>
  )
}
