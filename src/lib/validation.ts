/** Günlük notu form doğrulama kuralları. */

export interface NoteDraft {
  title: string
  body: string
  tags: string
}

export type NoteField = keyof NoteDraft

export type NoteErrors = Partial<Record<NoteField, string>>

export const NOTE_LIMITS = {
  titleMin: 3,
  titleMax: 80,
  bodyMin: 10,
  bodyMax: 2000,
  tagMax: 24,
  tagCount: 6,
} as const

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter((tag) => tag.length > 0)
    .slice(0, NOTE_LIMITS.tagCount)
}

export function validateNote(draft: NoteDraft): NoteErrors {
  const errors: NoteErrors = {}
  const title = draft.title.trim()
  const body = draft.body.trim()

  if (title.length === 0) {
    errors.title = 'Başlık boş bırakılamaz.'
  } else if (title.length < NOTE_LIMITS.titleMin) {
    errors.title = `Başlık en az ${NOTE_LIMITS.titleMin} karakter olmalı.`
  } else if (title.length > NOTE_LIMITS.titleMax) {
    errors.title = `Başlık en fazla ${NOTE_LIMITS.titleMax} karakter olabilir.`
  }

  if (body.length === 0) {
    errors.body = 'Notunuz boş bırakılamaz.'
  } else if (body.length < NOTE_LIMITS.bodyMin) {
    errors.body = `Not en az ${NOTE_LIMITS.bodyMin} karakter olmalı.`
  } else if (body.length > NOTE_LIMITS.bodyMax) {
    errors.body = `Not en fazla ${NOTE_LIMITS.bodyMax} karakter olabilir.`
  }

  const tags = parseTags(draft.tags)
  if (tags.some((tag) => tag.length > NOTE_LIMITS.tagMax)) {
    errors.tags = `Etiketler en fazla ${NOTE_LIMITS.tagMax} karakter olabilir.`
  }

  return errors
}

export function hasErrors(errors: NoteErrors): boolean {
  return Object.keys(errors).length > 0
}
