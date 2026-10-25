import { useContext } from 'react'
import { ToastContext } from '../components/ui/toast-context'

/** Kısa kullanıcı geri bildirimi üretir. */
export function useToast() {
  const context = useContext(ToastContext)

  if (context === null) {
    throw new Error('useToast, ToastProvider bileşeni içinde kullanılmalıdır.')
  }

  return context
}
