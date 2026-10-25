import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '../components/ui/Button'
import { ArrowRight, Spark } from '../components/ui/Icons'
import { NoemaField } from '../components/NoemaField'
import { EXPLORE_ITEMS } from '../data/explore'
import { IDEA_POOL_SIZE } from '../data/ideas'
import { useJournal } from '../hooks/useJournal'
import { requestIdea, scrollToSection } from '../lib/scroll'

export function Hero() {
  const { notes } = useJournal()
  const coordsRef = useRef<HTMLSpanElement>(null)

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = coordsRef.current
    if (!element) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100

    element.textContent = `x ${x.toFixed(2)}  y ${y.toFixed(2)}`
  }

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow enter" style={{ '--delay': '60ms' } as CSSProperties}>
            <span className="hero__dot" />
            Etkileşimli düşünce alanı
          </p>

          <h1 className="hero__title" id="hero-title">
            <span className="line">
              <span className="enter" style={{ '--delay': '160ms' } as CSSProperties}>
                Fikir,
              </span>
            </span>
            <span className="line">
              <span className="enter" style={{ '--delay': '280ms' } as CSSProperties}>
                bir yerde
              </span>
            </span>
            <span className="line">
              <span className="enter" style={{ '--delay': '400ms' } as CSSProperties}>
                <em>bekliyor.</em>
              </span>
            </span>
          </h1>

          <p className="hero__slogan enter" style={{ '--delay': '560ms' } as CSSProperties}>
            NOEMA; düşüncelerin, kısa metinlerin ve dijital sanatın toplandığı canlı bir alan.
            Oku, üret, şansa teslim ol — buradaki hiçbir şey sunum değil, hepsi deneyim.
          </p>

          <div className="hero__cta enter" style={{ '--delay': '680ms' } as CSSProperties}>
            <Button variant="primary" trailing={<ArrowRight />} onClick={() => scrollToSection('kesif')}>
              Keşfe başla
            </Button>
            <Button
              icon={<Spark />}
              onClick={() => {
                scrollToSection('laboratuvar')
                requestIdea()
              }}
            >
              Rastgele fikir üret
            </Button>
          </div>

          <dl className="hero__stats enter" style={{ '--delay': '800ms' } as CSSProperties}>
            <div className="hero__stat">
              <dt>arşiv kaydı</dt>
              <dd>
                <b>{EXPLORE_ITEMS.length}</b>
              </dd>
            </div>
            <div className="hero__stat">
              <dt>üretim havuzu</dt>
              <dd>
                <b>{IDEA_POOL_SIZE}</b>
              </dd>
            </div>
            <div className="hero__stat">
              <dt>günlük notu</dt>
              <dd>
                <b>{notes.length}</b>
              </dd>
            </div>
          </dl>
        </div>

        <div className="hero__stage enter" style={{ '--delay': '320ms' } as CSSProperties}>
          <div className="stage" onPointerMove={handlePointer}>
            <NoemaField />
            <span className="stage__ring" />
            <span className="stage__ring stage__ring--2" />
            <span className="stage__core" />

            <div className="stage__hud stage__hud--top">
              <span>
                noema / alan <b>01</b>
              </span>
              <span>
                durum <b>canlı</b>
              </span>
            </div>

            <div className="stage__hud stage__hud--bottom">
              <span ref={coordsRef}>x 0.00 y 0.00</span>
              <span>
                alan <b>noema</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
