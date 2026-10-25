import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Copy, Flask, Note, Spark } from '../components/ui/Icons'
import { IDEA_MODE_HINTS, IDEA_MODE_LABELS, IDEA_POOL_SIZE, generateIdea } from '../data/ideas'
import type { Idea } from '../data/ideas'
import { useJournal } from '../hooks/useJournal'
import { useToast } from '../hooks/useToast'
import { onIdeaRequested } from '../lib/scroll'
import type { IdeaMode } from '../types'

const MODES: IdeaMode[] = ['fikir', 'soru', 'egzersiz']

export function IdeaLab() {
  const [mode, setMode] = useState<IdeaMode>('fikir')
  const [idea, setIdea] = useState<Idea>(() => generateIdea('fikir'))
  const [history, setHistory] = useState<Idea[]>([])
  const [swapping, setSwapping] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)
  const { addNote } = useJournal()
  const { push } = useToast()

  const timerRef = useRef<number | null>(null)
  const ideaRef = useRef(idea)

  useEffect(() => {
    ideaRef.current = idea
  }, [idea])

  const handleGenerate = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)

    setSwapping(true)
    const next = generateIdea(mode, ideaRef.current)

    timerRef.current = window.setTimeout(() => {
      setIdea(next)
      setHistory((previous) => [next, ...previous].slice(0, 6))
      setGeneratedCount((count) => count + 1)
      setSwapping(false)
    }, 240)
  }, [mode])

  useEffect(() => {
    const off = onIdeaRequested(() => handleGenerate())
    return () => {
      off()
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [handleGenerate])

  const handleModeChange = (next: IdeaMode) => {
    if (next === mode) return
    setMode(next)
    const fresh = generateIdea(next)
    setIdea(fresh)
    setHistory((previous) => [fresh, ...previous].slice(0, 6))
    setSwapping(true)
    window.setTimeout(() => setSwapping(false), 260)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(idea.text)
      push('Kayıt panoya kopyalandı.', 'success')
    } catch {
      push('Kopyalanamadı: tarayıcı pano izni verilmedi.', 'error')
    }
  }

  const handleSave = () => {
    addNote({
      title: `Fikir Laboratuvarı — ${IDEA_MODE_LABELS[mode]}`,
      body: idea.text,
      tags: [IDEA_MODE_LABELS[mode].toLocaleLowerCase('tr'), idea.source],
    })
    push('Kayıt günlüğe eklendi.', 'success')
  }

  return (
    <section className="section" id="laboratuvar" aria-labelledby="laboratuvar-title">
      <div className="shell">
        <SectionHeading
          index="02"
          label="Fikir Laboratuvarı"
          title={
            <span id="laboratuvar-title">
              Şansa <em>teslim ol</em>
            </span>
          }
          lead="Her düğmeye bastığınızda yeni bir fikir, yeni bir soru ya da yeni bir egzersiz üretilir. Üretilen kaydı doğrudan günlüğünüze taşıyabilirsiniz."
        />

        <div className="lab">
          <div className="lab__main">
            <div className="lab__card">
              <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="lab__tabs" role="tablist" aria-label="Üretim türü">
                  {MODES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      id={`tab-${item}`}
                      aria-selected={mode === item}
                      aria-controls="lab-output"
                      tabIndex={mode === item ? 0 : -1}
                      className="lab__tab"
                      onClick={() => handleModeChange(item)}
                      onKeyDown={(event) => {
                        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
                        event.preventDefault()
                        const index = MODES.indexOf(mode)
                        const step = event.key === 'ArrowRight' ? 1 : -1
                        const nextMode = MODES[(index + step + MODES.length) % MODES.length]
                        handleModeChange(nextMode)
                        document.getElementById(`tab-${nextMode}`)?.focus()
                      }}
                    >
                      {IDEA_MODE_LABELS[item]}
                    </button>
                  ))}
                </div>

                <span className="mono" style={{ color: 'var(--paper-32)' }}>
                  üretim: {generatedCount + 1}
                </span>
              </div>

              <div
                id="lab-output"
                role="tabpanel"
                aria-labelledby={`tab-${mode}`}
                className={`lab__output${swapping ? ' is-swapping' : ''}`}
                key={mode}
              >
                {idea.text}
              </div>

              <p className="field__hint">{IDEA_MODE_HINTS[mode]}</p>

              <div className="lab__meta">
                <span>
                  kaynak: <b style={{ color: 'var(--violet-bright)' }}>{idea.source}</b>
                </span>
                <span>havuz: {IDEA_POOL_SIZE} kayıt</span>
              </div>

              <div className="lab__actions">
                <Button variant="primary" icon={<Spark />} onClick={handleGenerate}>
                  Yeni kayıt üret
                </Button>
                <Button icon={<Note width={13} height={13} />} onClick={handleSave}>
                  Günlüğe ekle
                </Button>
                <Button icon={<Copy width={13} height={13} />} onClick={handleCopy}>
                  Kopyala
                </Button>
              </div>
            </div>
          </div>

          <aside className="lab__side">
            <div className="panel">
              <h3 className="panel__title">Nasıl çalışır</h3>
              <ol>
                <li>Arşivden hazır kayıtlar ve şablonlardan derlenen kayıtlar tek havuzda durur.</li>
                <li>Her üretimde o havuzdan yeni bir kayıt seçilir; aynı kayıt arka arkaya tekrarlanmaz.</li>
                <li>Beğendiğin kaydı günlüğe taşıyarak kendi arşivinize dönüştürürsünüz.</li>
              </ol>
            </div>

            <div className="panel">
              <h3 className="panel__title">Son üretimler</h3>
              {history.length === 0 ? (
                <p className="panel__text">
                  Henüz üretim yapılmadı. “Yeni kayıt üret” düğmesine bastıkça üretimler burada
                  listelenir; birine tıklayarak tekrar açabilirsiniz.
                </p>
              ) : (
                <div className="lab__history">
                  {history.map((entry, index) => (
                    <button
                      type="button"
                      className="lab__history-item"
                      key={`${entry.text}-${index}`}
                      onClick={() => {
                        setIdea(entry)
                        setSwapping(true)
                        window.setTimeout(() => setSwapping(false), 260)
                      }}
                    >
                      {entry.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="panel" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
              <h3 className="panel__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flask width={14} height={14} />
                Not
              </h3>
              <p className="panel__text">
                Üretilen kayıtlar sunucuya gönderilmez. “Günlüğe ekle” dediğinizde yalnızca kendi
                tarayıcınızın yerel deposuna yazılır.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
