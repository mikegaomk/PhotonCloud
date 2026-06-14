import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)
let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[200] space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 flex-shrink-0" />}
            <span className="text-sm flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="p-0.5 hover:opacity-60"><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be within ToastProvider')
  return ctx
}
