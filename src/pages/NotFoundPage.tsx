import { Link } from 'react-router-dom'
import { useI18n } from '../data/i18nContext'

export default function NotFoundPage() {
  const { lang } = useI18n()
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-indigo-200">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          {lang === 'zh' ? '页面未找到' : 'Page Not Found'}
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          {lang === 'zh' ? '您访问的页面不存在或已移除' : 'The page you are looking for does not exist'}
        </p>
        <Link to="/" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}
