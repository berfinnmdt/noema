import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createId } from '../lib/format'
import { STORAGE_KEYS, isStorageAvailable, readStorage, writeStorage } from '../lib/storage'
import type { Note } from '../types'
import { useToast } from '../hooks/useToast'
import { JournalContext } from './journal-context'
import type { JournalContextValue, NoteInput } from './journal-context'

function isNote(value: unknown): value is Note {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every((tag) => typeof tag === 'string')
  )
}

function isNoteArray(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every(isNote)
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const { push } = useToast()
  const [notes, setNotes] = useState<Note[]>(() => readStorage(STORAGE_KEYS.journal, [], isNoteArray))
  const notesRef = useRef<Note[]>(notes)

  const storageAvailable = useMemo(() => isStorageAvailable(), [])

  const persist = useCallback(
    (next: Note[]) => {
      const ok = writeStorage(STORAGE_KEYS.journal, next)
      if (!ok) {
        push('Notlar kaydedilemedi: tarayıcı depolama alanı dolu veya erişilemiyor.', 'error')
      }
      return ok
    },
    [push],
  )

  const updateNotes = useCallback(
    (updater: (previous: Note[]) => Note[]) => {
      const next = updater(notesRef.current)
      notesRef.current = next
      setNotes(next)
      persist(next)
    },
    [persist],
  )

  const addNote = useCallback(
    (input: NoteInput): Note => {
      const timestamp = new Date().toISOString()
      const note: Note = {
        id: createId(),
        title: input.title.trim(),
        body: input.body.trim(),
        tags: input.tags,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      updateNotes((previous) => [note, ...previous])
      return note
    },
    [updateNotes],
  )

  const updateNote = useCallback(
    (id: string, input: NoteInput): boolean => {
      let updated = false

      updateNotes((previous) =>
        previous.map((note) => {
          if (note.id !== id) return note
          updated = true
          return {
            ...note,
            title: input.title.trim(),
            body: input.body.trim(),
            tags: input.tags,
            updatedAt: new Date().toISOString(),
          }
        }),
      )

      return updated
    },
    [updateNotes],
  )

  const deleteNote = useCallback(
    (id: string): boolean => {
      let removed = false

      updateNotes((previous) => {
        removed = previous.some((note) => note.id === id)
        return previous.filter((note) => note.id !== id)
      })

      return removed
    },
    [updateNotes],
  )

  const clearAll = useCallback(() => {
    updateNotes(() => [])
  }, [updateNotes])

  const value = useMemo<JournalContextValue>(
    () => ({ notes, storageAvailable, addNote, updateNote, deleteNote, clearAll }),
    [notes, storageAvailable, addNote, updateNote, deleteNote, clearAll],
  )

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}
