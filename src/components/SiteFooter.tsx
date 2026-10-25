import { Button } from './ui/Button'
import { Mark } from './ui/Icons'
import { scrollToSection } from '../lib/scroll'

const FOOTER_LINKS = [
  { id: 'kesif', label: 'Keşfet' },
  { id: 'laboratuvar', label: 'Fikir Laboratuvarı' },
  { id: 'gunluk', label: 'Dijital Günlük' },
  { id: 'hakkinda', label: 'Hakkında' },
]

const COPYRIGHT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <div>
            <p className="ftr__word">
              NOEMA
              <span style={{ color: 'var(--violet-bright)' }}>.</span>
            </p>
            <p className="ftr__tagline">
              Düşüncelerin, kısa metinlerin ve dijital sanatın toplandığı etkileşimli alan. Sunucu
              yok, hesap yok; yalnızca sizin tarayıcınız ve sizin kayıtlarınız.
            </p>
          </div>

          <div>
            <h2 className="ftr__heading">Bölümler</h2>
            <nav className="ftr__links" aria-label="Alt bölümler">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(link.id)
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="ftr__heading">Veri</h2>
            <p className="ftr__tagline" style={{ maxWidth: 'none' }}>
              Notlar ve beğeniler yalnızca <code>localStorage</code> içinde saklanır. Sunucuya hiçbir
              veri gönderilmez; tarayıcı verilerinizi temizlediğinizde kayıtlar da silinir.
            </p>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>
            <span style={{ color: 'var(--violet-bright)' }}>
              <Mark width={13} height={13} />
            </span>{' '}
            © {COPYRIGHT_YEAR} NOEMA — arşiv örneği
          </span>

          <span>React · TypeScript · Vite</span>

          <Button size="sm" onClick={() => scrollToSection('top')}>
            Başa dön
          </Button>
        </div>
      </div>
    </footer>
  )
}
