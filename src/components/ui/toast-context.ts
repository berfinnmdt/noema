import { createContext } from 'react'

export type ToastTone = 'info' | 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

export const ToastContext = createContext<{ push: (message: string, tone?: ToastTone) => void } | null>(null)
