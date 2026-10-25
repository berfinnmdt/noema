import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TextArea, TextField } from '../components/ui/Field'
import { Alert, Close, Note as NoteIcon, Pencil, Plus, Search, Trash } from '../components/ui/Icons'
import { useJournal } from '../hooks/useJournal'
import { useToast } from '../hooks/useToast'
import { formatDate, formatRelativeDate } from '../lib/format'
import { NOTE_LIMITS, hasErrors, parseTags, validateNote } from '../lib/validation'
import type { NoteErrors, NoteDraft } from '../lib/validation'
import type { Note } from '../types'

type SortMode = 'newest' | 'oldest' | 'title'

const SORT_LABELS: Record<SortMode, string> = {
  newest: 'En yeni',
  oldest: 'En eski',
  title: 'Başlığa göre',
}

const EMPTY_DRAFT: NoteDraft = { title: '', body: '', tags: '' }

export function Journal() {
  const { notes, addNote, updateNote, deleteNote, clearAll, storageAvailable } = useJournal()
  const { push } = useToast()

  const [draft, setDraft] = useState<NoteDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<NoteErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('newest')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    for (const note of notes) {
      for (const tag of note.tags) tags.add(tag)
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'tr'))
  }, [notes])

  const visibleNotes = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('tr')

    const filtered = notes.filter((note) => {
      if (activeTag && !note.tags.includes(activeTag)) return false
      if (!needle) return true

      return [note.title, note.body, ...note.tags]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(needle)
    })

    return filtered.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, 'tr')
      const delta = Date.parse(b.createdAt) - Date.parse(a.createdAt)
      return sort === 'newest' ? delta : -delta
    })
  }, [notes, search, sort, activeTag])

  const updateDraft = (field: keyof NoteDraft, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: undefined }))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validateNote(draft)
    setErrors(validation)

    if (hasErrors(validation)) {
      const firstField = (['title', 'body', 'tags'] as const).find((field) => validation[field])
      if (firstField) document.getElementById(`journal-${firstField}`)?.focus()
      push('Lütfen işaretli alanları düzeltin.', 'error')
      return
    }

    const tags = parseTags(draft.tags)

    if (editingId) {
      updateNote(editingId, { title: draft.title, body: draft.body, tags })
      push('Not güncellendi.', 'success')
      setEditingId(null)
    } else {
      addNote({ title: draft.title, body: draft.body, tags })
      push('Not kaydedildi.', 'success')
    }

    setDraft(EMPTY_DRAFT)
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setDraft({ title: note.title, body: note.body, tags: note.tags.join(', ') })
    setErrors({})

    document.getElementById('journal-title')?.focus()
    document.getElementById('gunluk-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setErrors({})
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    const removed = deleteNote(pendingDelete.id)
    if (removed) push('Not silindi.', 'info')
    setPendingDelete(null)
  }

  const confirmClearAll = () => {
    clearAll()
    setConfirmClear(false)
    push('Günlük temizlendi.', 'info')
  }

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `noema-gunluk-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      push('Günlük JSON olarak indirildi.', 'success')
    } catch {
      push('Dışa aktarma başarısız oldu.', 'error')
    }
  }

  return (
    <section className="section" id="gunluk" aria-labelledby="gunluk-title">
      <div className="shell">
        <SectionHeading
          index="03"
          label="Dijital Günlük"
          title={
            <span id="gunluk-title">
              Kendi <em>arşivin</em>
            </span>
          }
          lead="Kısa notlarınızı yazın, düzenleyin, silin. Her şey yalnızca bu tarayıcının yerel deposunda tutulur; sunucuya hiçbir şey gönderilmez."
        />

        {!storageAvailable ? (
          <div className="panel" style={{ marginBottom: '1.5rem', borderColor: 'rgba(232,155,155,0.4)' }}>
            <h3 className="panel__title" style={{ color: 'var(--alert)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Alert width={14} height={14} />
              Depolama kullanılamıyor
            </h3>
            <p className="panel__text">
              Tarayıcınız yerel depolamayı engelliyor olabilir (özel sekme ayarları gibi). Notlarınız
              sayfa kapandığında kaybolur.
            </p>
          </div>
        ) : null}

        <div className="journal">
          <div className="journal__aside">
            <form className="journal__form" id="gunluk-form" onSubmit={handleSubmit} noValidate>
              <h3 className="journal__form-title">
                {editingId ? 'Notu düzenle' : 'Yeni not ekle'}
              </h3>

              <TextField
                id="journal-title"
                label="Başlık"
                placeholder="Örn. Sabahın ilk fikri"
                value={draft.title}
                maxLength={NOTE_LIMITS.titleMax}
                error={errors.title}
                onChange={(event) => updateDraft('title', event.target.value)}
              />

              <div>
                <TextArea
                  id="journal-body"
                  label="Not"
                  placeholder="Aklınızdan geçeni birkaç cümleyle yazın…"
                  value={draft.body}
                  maxLength={NOTE_LIMITS.bodyMax}
                  error={errors.body}
                  onChange={(event) => updateDraft('body', event.target.value)}
                />
                <p
                  className={`journal__counter${draft.body.length >= NOTE_LIMITS.bodyMax ? ' is-over' : ''}`}
                  aria-live="polite"
                >
                  {draft.body.length} / {NOTE_LIMITS.bodyMax} karakter
                </p>
              </div>

              <TextField
                id="journal-tags"
                label="Etiketler"
                optional
                placeholder="fikir, deneme, okuma"
                value={draft.tags}
                error={errors.tags}
                hint={`Virgülle ayırın · en fazla ${NOTE_LIMITS.tagCount} etiket`}
                onChange={(event) => updateDraft('tags', event.target.value)}
              />

              <div className="journal__form-actions">
                <Button type="submit" variant="primary" icon={editingId ? <Pencil width={13} height={13} /> : <Plus width={13} height={13} />}>
                  {editingId ? 'Değişikliği kaydet' : 'Notu kaydet'}
                </Button>
                {editingId ? (
                  <Button icon={<Close width={13} height={13} />} onClick={cancelEditing}>
                    Vazgeç
                  </Button>
                ) : null}
              </div>
            </form>

            <div className="panel">
              <h3 className="panel__title">Gizlilik</h3>
              <p className="panel__text">
                Notlarınız <code>localStorage</code> içinde <code>noema.journal.v1</code> anahtarıyla
                saklanır. Tarayıcı verilerini temizlediğinizde notlar da silinir.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <Button size="sm" onClick={handleExport} disabled={notes.length === 0}>
                  JSON indir
                </Button>
                <Button size="sm" variant="danger" onClick={() => setConfirmClear(true)} disabled={notes.length === 0}>
                  Günlüğü temizle
                </Button>
              </div>
            </div>
          </div>

          <div className="journal__main">
            <div className="journal__toolbar">
              <div className="search" style={{ flex: '1 1 240px', maxWidth: '340px' }}>
                <Search className="search__icon" />
                <input
                  type="search"
                  value={search}
                  placeholder="Notlarda ara…"
                  aria-label="Notlarda ara"
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search ? (
                  <button type="button" className="search__clear" aria-label="Aramayı temizle" onClick={() => setSearch('')}>
                    <Close width={14} height={14} />
                  </button>
                ) : null}
              </div>

              <div className="journal__tools">
                {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className="chip"
                    aria-pressed={sort === mode}
                    onClick={() => setSort(mode)}
                  >
                    {SORT_LABELS[mode]}
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 ? (
              <div className="chips" style={{ marginBottom: '1.4rem' }}>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={activeTag === null}
                  onClick={() => setActiveTag(null)}
                >
                  Tüm etiketler
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="chip"
                    aria-pressed={activeTag === tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            ) : null}

            <p className="explore__count" aria-live="polite" style={{ marginBottom: '0.8rem' }}>
              <b>{visibleNotes.length}</b> not gösteriliyor
            </p>

            {visibleNotes.length === 0 ? (
              <EmptyState
                glyph={<NoteIcon width={24} height={24} />}
                title={notes.length === 0 ? 'Günlüğün henüz boş' : 'Bu ölçüde not yok'}
                text={
                  notes.length === 0
                    ? 'Soldaki formu doldurup ilk notunuzu ekleyin. Notlarınız yalnızca bu tarayıcıda saklanır.'
                    : 'Arama sözcüğünü veya etiket filtresini değiştirerek diğer notlara ulaşabilirsiniz.'
                }
                action={
                  notes.length === 0 ? (
                    <Button
                      variant="primary"
                      icon={<Plus width={13} height={13} />}
                      onClick={() => document.getElementById('journal-title')?.focus()}
                    >
                      İlk notu yaz
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSearch('')
                        setActiveTag(null)
                      }}
                    >
                      Filtreleri sıfırla
                    </Button>
                  )
                }
              />
            ) : (
              <div>
                {visibleNotes.map((note) => (
                  <Reveal key={note.id} delay={40}>
                    <article className="note">
                      <div className="note__head">
                        <h3 className="note__title">{note.title}</h3>
                        <div className="note__actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`${note.title} notunu düzenle`}
                            title="Düzenle"
                            onClick={() => startEditing(note)}
                          >
                            <Pencil width={14} height={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`${note.title} notunu sil`}
                            title="Sil"
                            onClick={() => setPendingDelete(note)}
                          >
                            <Trash width={14} height={14} />
                          </button>
                        </div>
                      </div>

                      <p className="note__body">{note.body}</p>

                      <div className="note__foot">
                        <div className="note__meta">
                          <span title={formatDate(note.createdAt)}>{formatRelativeDate(note.createdAt)}</span>
                          {note.updatedAt !== note.createdAt ? <span>güncellendi</span> : null}
                          {note.tags.map((tag) => (
                            <span className="tag" key={tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="note__meta">{formatDate(note.createdAt)}</span>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Bu not silinsin mi?"
        text={pendingDelete ? `"${pendingDelete.title}" notu tarayıcınızdan kalıcı olarak silinecek.` : ''}
        confirmLabel="Sil"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Tüm günlük temizlensin mi?"
        text={`${notes.length} not kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Temizle"
        onConfirm={confirmClearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </section>
  )
}
