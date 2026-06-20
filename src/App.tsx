import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './data/authContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'

// Lazy-loaded pages (code splitting)
const HomePage = lazy(() => import('./pages/HomePage'))
const ChipsPage = lazy(() => import('./pages/ChipsPage'))
const ChipDetailPage = lazy(() => import('./pages/ChipDetailPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const DesignSimPage = lazy(() => import('./pages/DesignSimPage'))
const CloudSimPage = lazy(() => import('./pages/CloudSimPage'))
const TrendsPage = lazy(() => import('./pages/TrendsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForumPage = lazy(() => import('./pages/ForumPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const PDKPage = lazy(() => import('./pages/PDKPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const ClopediaPage = lazy(() => import('./pages/ClopediaPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chips" element={<ChipsPage />} />
              <Route path="/chips/:id" element={<ChipDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/design" element={<DesignSimPage />} />
              <Route path="/cloud-sim" element={<CloudSimPage />} />
              <Route path="/pdk" element={<PDKPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:id" element={<PostDetailPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/clopedia" element={<ClopediaPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
