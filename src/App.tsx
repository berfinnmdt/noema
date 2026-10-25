import { Grain } from './components/Grain'
import { Marquee } from './components/Marquee'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { ToastProvider } from './components/ui/ToastProvider'
import { JournalProvider } from './context/JournalProvider'
import { About } from './sections/About'
import { Explore } from './sections/Explore'
import { Hero } from './sections/Hero'
import { IdeaLab } from './sections/IdeaLab'
import { Journal } from './sections/Journal'

export default function App() {
  return (
    <ToastProvider>
      <JournalProvider>
        <a className="skip-link" href="#main">
          İçeriğe atla
        </a>

        <Grain />
        <SiteHeader />

        <main className="site-main" id="main">
          <Hero />
          <Marquee />
          <Explore />
          <IdeaLab />
          <Journal />
          <About />
        </main>

        <SiteFooter />
      </JournalProvider>
    </ToastProvider>
  )
}
