import { useContext } from 'react'
import { JournalContext } from '../context/journal-context'
import type { JournalContextValue } from '../context/journal-context'

/** Dijital günlük verisine erişim sağlar. */
export function useJournal(): JournalContextValue {
  const context = useContext(JournalContext)

  if (context === null) {
    throw new Error('useJournal, JournalProvider bileşeni içinde kullanılmalıdır.')
  }

  return context
}
