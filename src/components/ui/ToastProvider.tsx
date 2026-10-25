import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Alert, Check, Circle } from './Icons'
import { ToastContext } from './toast-context'
import type { ToastItem } from './toast-context'

const TOAST_LIFETIME = 3800

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)
  const timers = useRef<number[]>([])

  const push = useCallback((message: string, tone: ToastItem['tone'] = 'info') => {
    counter.current += 1
    const id = counter.current

    setToasts((previous) => [...previous.slice(-3), { id, message, tone }])

    const timer = window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
      timers.current = timers.current.filter((entry) => entry !== timer)
    }, TOAST_LIFETIME)

    timers.current.push(timer)
  }, [])

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current = []
    },
    [],
  )

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            <span className="toast__icon">
              {toast.tone === 'success' ? (
                <Check />
              ) : toast.tone === 'error' ? (
                <Alert />
              ) : (
                <Circle />
              )}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
