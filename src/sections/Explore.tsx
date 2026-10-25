import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ArrowRight, Close, Grid, Note, Search, Spark } from '../components/ui/Icons'
import { EXPLORE_CATEGORIES, EXPLORE_ITEMS, EXPLORE_KINDS } from '../data/explore'
import { useJournal } from '../hooks/useJournal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'
import { STORAGE_KEYS } from '../lib/storage'
import type { CardSize, ExploreCategory, ExploreItem } from '../types'

type Filter = 'hepsi' | 'begenilenler' | ExploreCategory

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function sizeClass(size: CardSize): string {
  return size === 'md' ? '' : ` explore__cell--${size}`
}

const KIND_LABELS = new Map(EXPLORE_KINDS.map((kind) => [kind.id, kind.label]))
const CATEGORY_LABELS = new Map(EXPLORE_CATEGORIES.map((category) => [category.id, category.label]))

export function Explore() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('hepsi')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [likes, setLikes] = useLocalStorage<string[]>(STORAGE_KEYS.likes, [], isStringArray)
  const { addNote } = useJournal()
  const { push } = useToast()

  const categoryCounts = useMemo(() => {
    const counts = new Map<ExploreCategory, number>()
    for (const item of EXPLORE_ITEMS) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
    }
    return counts
  }, [])

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr')

    return EXPLORE_ITEMS.filter((item) => {
      if (filter === 'begenilenler' && !likes.includes(item.id)) return false
      if (filter !== 'hepsi' && filter !== 'begenilenler' && item.category !== filter) return false
      if (!needle) return true

      const haystack = [item.title, item.excerpt, item.body, item.author, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('tr')

      return haystack.includes(needle)
    })
  }, [query, filter, likes])

  const toggleLike = (id: string) => {
    const liked = likes.includes(id)
    setLikes((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id],
    )
    push(liked ? 'Beğeni kaldırıldı.' : 'Kayıt beğenildi.', liked ? 'info' : 'success')
  }

  const moveToJournal = (item: ExploreItem) => {
    addNote({
      title: item.title,
      body: `${item.excerpt}\n\n${item.body}`,
      tags: [KIND_LABELS.get(item.kind) ?? 'kayıt', CATEGORY_LABELS.get(item.category) ?? '', ...item.tags]
        .filter(Boolean)
        .slice(0, 4),
    })
    push('Kayıt günlüğe taşındı.', 'success')
  }

  const resetFilters = () => {
    setQuery('')
    setFilter('hepsi')
    setExpandedId(null)
  }

  return (
    <section className="section" id="kesif" aria-labelledby="kesif-title">
      <div className="shell">
        <SectionHeading
          index="01"
          label="Keşfet"
          title={
            <span id="kesif-title">
              Arşivden rastgele bir <em>parça</em>
            </span>
          }
          lead="Fikirler, kısa metinler, dijital sanat çalışmaları ve yaratıcılık egzersizleri. Kategoriye göre süz, aramayla daralt, beğendiklerini ayır."
        />

        <div className="explore__toolbar">
          <div className="search explore__search">
            <Search className="search__icon" />
            <input
              type="search"
              value={query}
              placeholder="Kayıtlarda ara…"
              aria-label="Keşfet kayıtlarında ara"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button type="button" className="search__clear" aria-label="Aramayı temizle" onClick={() => setQuery('')}>
                <Close width={14} height={14} />
              </button>
            ) : null}
          </div>

          <p className="explore__count" aria-live="polite">
            <b>{results.length}</b> kayıt gösteriliyor
          </p>
        </div>

        <div className="chips" role="group" aria-label="Kategori filtreleri">
          <Chip active={filter === 'hepsi'} count={EXPLORE_ITEMS.length} onClick={() => setFilter('hepsi')}>
            Tümü
          </Chip>
          <Chip
            active={filter === 'begenilenler'}
            count={likes.length}
            onClick={() => setFilter('begenilenler')}
          >
            Beğenilenler
          </Chip>
          {EXPLORE_CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              active={filter === category.id}
              count={categoryCounts.get(category.id) ?? 0}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </Chip>
          ))}
        </div>

        <div style={{ height: 'clamp(1.4rem, 3vw, 2.4rem)' }} />

        {results.length === 0 ? (
          <EmptyState
            glyph={<Grid width={24} height={24} />}
            title="Bu ölçüde bir kayıt yok"
            text="Arama sözcüğünü sadeleştirin ya da kategori filtresini kaldırın. Arşivde henüz keşfetmediğiniz kayıtlar var."
            action={
              <Button onClick={resetFilters} icon={<Spark />}>
                Filtreleri sıfırla
              </Button>
            }
          />
        ) : (
          <div className="explore__grid">
            {results.map((item, index) => {
              const expanded = expandedId === item.id
              const liked = likes.includes(item.id)

              return (
                <Reveal
                  key={item.id}
                  className={`explore__cell${sizeClass(item.size)}`}
                  delay={Math.min(index, 6) * 70}
                >
                  <article className="card">
                    <span className="card__corner" />

                    <div className="card__meta">
                      <span className="card__kind">{KIND_LABELS.get(item.kind)}</span>
                      <span aria-hidden="true">/</span>
                      <span>{CATEGORY_LABELS.get(item.category)}</span>
                      <span aria-hidden="true">/</span>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>

                    <h3 className="card__title">{item.title}</h3>
                    <p className="card__excerpt">{item.excerpt}</p>

                    {expanded ? <p className="card__body">{item.body}</p> : null}

                    <div className="card__tags">
                      {item.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="card__foot">
                      <span className="card__author">{item.author}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-pressed={liked}
                          aria-label={liked ? `${item.title} beğenisini kaldır` : `${item.title} kaydını beğen`}
                          title={liked ? 'Beğeniyi kaldır' : 'Beğen'}
                          onClick={() => toggleLike(item.id)}
                        >
                          <Spark width={15} height={15} />
                        </button>

                        <button
                          type="button"
                          className="icon-btn"
                          aria-expanded={expanded}
                          aria-label={expanded ? `${item.title} kaydını daralt` : `${item.title} kaydının tamamını oku`}
                          title={expanded ? 'Daralt' : 'Tamamını oku'}
                          onClick={() => setExpandedId(expanded ? null : item.id)}
                        >
                          {expanded ? <Close width={15} height={15} /> : <ArrowRight width={15} height={15} />}
                        </button>

                        <Button size="sm" icon={<Note width={13} height={13} />} onClick={() => moveToJournal(item)}>
                          Günlüğe taşı
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
