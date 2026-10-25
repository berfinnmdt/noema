import { createContext } from 'react'
import type { Note } from '../types'

export interface NoteInput {
  title: string
  body: string
  tags: string[]
}

export interface JournalContextValue {
  notes: Note[]
  storageAvailable: boolean
  addNote: (input: NoteInput) => Note
  updateNote: (id: string, input: NoteInput) => boolean
  deleteNote: (id: string) => boolean
  clearAll: () => void
}

export const JournalContext = createContext<JournalContextValue | null>(null)
