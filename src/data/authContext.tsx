import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  avatar: string
  role: 'engineer' | 'researcher' | 'manager' | 'student'
  organization: string
  joinedAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
}

interface RegisterData {
  username: string
  password: string
  displayName: string
  email: string
  role: User['role']
  organization: string
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock user database (in production, this would be a backend API)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    username: 'zhangwei',
    password: 'demo123',
    displayName: '张伟',
    email: 'zhangwei@photonics.com',
    avatar: '👨‍🔬',
    role: 'engineer',
    organization: 'MFLEX 光电事业部',
    joinedAt: '2024-03-15',
  },
  {
    id: '2',
    username: 'lina',
    password: 'demo123',
    displayName: '李娜',
    email: 'lina@university.edu',
    avatar: '👩‍🎓',
    role: 'researcher',
    organization: '清华大学光电工程系',
    joinedAt: '2024-06-01',
  },
  {
    id: '3',
    username: 'wangming',
    password: 'demo123',
    displayName: '王明',
    email: 'wangming@silicon.io',
    avatar: '👨‍💻',
    role: 'engineer',
    organization: 'SiPh Technologies',
    joinedAt: '2025-01-10',
  },
]

const STORAGE_KEY = 'photonics_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500))
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      const { password: _, ...userData } = found
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500))
    // Check if username exists
    if (MOCK_USERS.find((u) => u.username === data.username)) {
      return false
    }
    const newUser: User = {
      id: String(Date.now()),
      username: data.username,
      displayName: data.displayName,
      email: data.email,
      avatar: '🧑‍🔬',
      role: data.role,
      organization: data.organization,
      joinedAt: new Date().toISOString().split('T')[0],
    }
    MOCK_USERS.push({ ...newUser, password: data.password })
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
