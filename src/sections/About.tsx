import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ArrowRight, Spark } from '../components/ui/Icons'
import { requestIdea, scrollToSection } from '../lib/scroll'

const PILLARS = [
  {
    num: '01',
    title: 'Fikir bir nesnedir',
    text: 'Bir düşünce, sadece zihinde kalmış bir hâl değildir. Yazıya, görüntüye ya da soruya dönüştüğünde elde tutulabilir, taşınabilir ve başkalarıyla paylaşılabilir hâle gelir.',
  },
  {
    num: '02',
    title: 'Keşif bir tesadüftür',
    text: 'NOEMA sizi bir arşivin içinde dolaştırır. Filtreleri kullanabilirsiniz, ama asıl değerli olan, sizi beklemeyen kayıtla karşılaşma anıdır.',
  },
  {
    num: '03',
    title: 'Üretim sessizdir',
    text: 'Buradaki hiçbir şey yayınlanmaz, beğenilmez, ölçülmez. Notlarınız yalnızca sizin tarayıcınızda durur; yarım kalan fikirler de tamamlananlar kadar değerlidir.',
  },
]

const MANIFESTO = [
  'Her düşünce bir adres ister; NOEMA o adresi tutar.',
  'Hazır cevaplar değil, açık uçlu sorular bizi ileri iter.',
  'Yavaşlık bir kusur değil, bir yöntemdir.',
  'Tamamlanmamış fikirler de tamamlananlar kadar değerlidir.',
  'Paylaşmak isteğe bağlıdır; saklamak da bir seçimdir.',
]

export function About() {
  return (
    <section className="section" id="hakkinda" aria-labelledby="hakkinda-title">
      <div className="shell">
        <SectionHeading
          index="04"
          label="Hakkında"
          title={
            <span id="hakkinda-title">
              NOEMA nedir?
            </span>
          }
        />

        <div className="about__grid">
          <Reveal>
            <p className="about__statement">
              NOEMA, Yunanca'da <em>düşüncenin nesnesi</em> anlamına gelir. Bir fikrin, bir sorunun
              ya da bir merakın zihinde aldığı biçim. Bu site o biçimleri toplayan bir alan: düşünce,
              kısa metin, dijital sanat ve yaratıcılık egzersizi aynı çatı altında buluşur.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="about__aside">
              <div className="panel">
                <h3 className="panel__title">Neden var?</h3>
                <p className="about__copy">
                  İnternetin büyük bölümü hâlâ hızlanma mantığıyla çalışır: daha çok içerik, daha
                  hızlı tepki, daha çok bildirim. NOEMA bunun tersini denemeyi önerir. Burada sayfa
                  sayısı değil <em>derinlik</em> önemlidir; bir kaydı okumak, onu değiştirmek ve
                  kendi notunuzu yazmak yeterlidir.
                </p>
              </div>

              <div className="panel">
                <h3 className="panel__title">Nasıl çalışır?</h3>
                <p className="about__copy">
                  Sunucu yok, hesap yok, üyelik yok. Kayıtlar bir kez hazırlanır ve tarayıcınıza
                  verilir. Günlüğünüz <code>localStorage</code> içinde yaşar; hiçbir sunucuya gönderilmez.
                </p>
              </div>

              <Button
                variant="primary"
                trailing={<ArrowRight />}
                onClick={() => {
                  scrollToSection('laboratuvar')
                  requestIdea()
                }}
              >
                Bir kayıt üret
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="pillars">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.num} delay={index * 90}>
              <div className="pillar">
                <span className="pillar__num">{pillar.num}</span>
                <h3 className="pillar__title">{pillar.title}</h3>
                <p className="pillar__text">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="manifesto">
          {MANIFESTO.map((line, index) => (
            <Reveal key={line} delay={index * 60}>
              <div className="manifesto__row">
                <span className="manifesto__num">{String(index + 1).padStart(2, '0')}</span>
                <p className="manifesto__text">{line}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginTop: 'clamp(2.4rem, 5vw, 4rem)',
              paddingTop: 'clamp(1.6rem, 3vw, 2.4rem)',
              borderTop: '1px solid var(--line)',
            }}
          >
            <p className="lead" style={{ margin: 0 }}>
              Okumak bir yön. Üretmek başka bir yön. İkisinin arasında kalan yer, NOEMA'nın
              çalıştığı yerdir.
            </p>
            <Button
              icon={<Spark />}
              onClick={() => {
                scrollToSection('laboratuvar')
                requestIdea()
              }}
            >
              Laboratuvara git
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
