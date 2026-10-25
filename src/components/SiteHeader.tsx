import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from './ui/Button'
import { Mark } from './ui/Icons'
import { useActiveSection } from '../hooks/useActiveSection'
import { requestIdea, scrollToSection } from '../lib/scroll'

interface NavItem {
  id: string
  label: string
  num: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'kesif', label: 'Keşfet', num: '01' },
  { id: 'laboratuvar', label: 'Fikir Lab.', num: '02' },
  { id: 'gunluk', label: 'Günlük', num: '03' },
  { id: 'hakkinda', label: 'Hakkında', num: '04' },
]

const NAV_IDS = NAV_ITEMS.map((item) => item.id)

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(NAV_IDS)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const bodyOverflowRef = useRef<string>('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    bodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>('a')
    firstLink?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = bodyOverflowRef.current
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavigate = (id: string) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  const handleGenerate = () => {
    setMenuOpen(false)
    scrollToSection('laboratuvar')
    requestIdea()
  }

  return (
    <>
      <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
        <div className="shell hdr__inner">
          <a
            className="hdr__brand"
            href="#top"
            aria-label="NOEMA — başa dön"
            onClick={(event) => {
              event.preventDefault()
              scrollToSection('top')
            }}
          >
            <span className="hdr__mark spin-slow">
              <Mark width={30} height={30} />
            </span>
            <span className="hdr__word">NOEMA</span>
          </a>

          <nav className="hdr__nav" aria-label="Bölümler">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                className={`hdr__link${activeSection === item.id ? ' is-active' : ''}`}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  handleNavigate(item.id)
                }}
              >
                <span className="hdr__num">{item.num}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="hdr__actions">
            <span className="hdr__cta">
              <Button variant="primary" size="sm" onClick={handleGenerate}>
                Fikir üret
              </Button>
            </span>
            <button
              ref={burgerRef}
              type="button"
              className={`hdr__burger${menuOpen ? ' is-open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mmenu${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menüsü"
        inert={!menuOpen}
      >
        <nav className="mmenu__nav" aria-label="Mobil bölümler">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              className="mmenu__link"
              href={`#${item.id}`}
              style={{ '--delay': `${120 + index * 70}ms` } as CSSProperties}
              onClick={(event) => {
                event.preventDefault()
                handleNavigate(item.id)
              }}
            >
              <span className="mmenu__num">{item.num}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mmenu__foot">
          <Button variant="primary" onClick={handleGenerate}>
            Rastgele fikir üret
          </Button>
          <p className="mono">Fikir, bir yerde bekliyor.</p>
        </div>
      </div>
    </>
  )
}
