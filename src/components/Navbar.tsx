import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, LogOut, User, Globe, Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../data/authContext'
import { useI18n } from '../data/i18nContext'
import GlobalSearch from './GlobalSearch'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { lang, setLang, t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/news', label: t('nav.news') },
    { path: '/chips', label: t('nav.chips') },
    { path: '/design', label: t('nav.design') },
    { path: '/cloud-sim', label: lang === 'zh' ? '云仿真' : 'Cloud Sim' },
    { path: '/pdk', label: t('nav.pdk') },
    { path: '/compare', label: t('nav.compare') },
    { path: '/trends', label: t('nav.trends') },
    { path: '/forum', label: t('nav.forum') },
    { path: '/help', label: lang === 'zh' ? '帮助' : 'Help' },
  ]

  const notifications = [
    { id: '1', text: lang === 'zh' ? 'MZI 调制器仿真已完成' : 'MZI sim completed', time: '2h', type: 'sim' },
    { id: '2', text: lang === 'zh' ? 'CUMEC PDK 申请已通过' : 'CUMEC PDK approved', time: '5h', type: 'pdk' },
    { id: '3', text: lang === 'zh' ? '张伟回复了你的帖子' : 'Zhang replied to your post', time: '1d', type: 'forum' },
    { id: '4', text: lang === 'zh' ? 'TFLN IQ 仿真失败' : 'TFLN IQ sim failed', time: '6h', type: 'sim' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              {lang === 'zh' ? '光芯云' : 'PhotonCloud'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1.5">
            <GlobalSearch />

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{lang === 'zh' ? '通知' : 'Notifications'}</span>
                      <span className="text-xs text-indigo-600 cursor-pointer">{lang === 'zh' ? '全部已读' : 'Mark all read'}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                          <p className="text-xs text-gray-800">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time} ago</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lang */}
            <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="p-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200" title={lang === 'zh' ? 'English' : '中文'}>
              <Globe className="h-3.5 w-3.5" />
            </button>

            {/* Dark Mode */}
            <DarkModeToggle />

            {/* User */}
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/dashboard" className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-indigo-50">
                  <span className="text-base">{user.avatar}</span>
                  <span className="text-xs font-medium text-gray-700 hidden md:block">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500"><LogOut className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700">
                <User className="h-3.5 w-3.5" /> {t('nav.login')}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  {user?.avatar} {lang === 'zh' ? '个人中心' : 'Dashboard'}
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false) }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
                  {lang === 'zh' ? '退出登录' : 'Logout'}
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm bg-indigo-600 text-white text-center font-medium">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
