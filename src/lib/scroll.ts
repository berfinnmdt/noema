/** Bölümlere yumuşak kaydırma ve global olay yardımcıları. */

export const GENERATE_EVENT = 'noema:generate'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (!element) return

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

  // İki kare bekle: açılır menünün kapanışı ve düzen yeniden hesabı bitsin,
  // sonra kaydır. Aksi hâlde kilitli bir "overflow: hidden" kaydırmayı iptal eder.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior, block: 'start' })
    })
  })
}

/** Fikir laboratuvarına "yeni kayıt üret" isteği gönderir. */
export function requestIdea(): void {
  window.dispatchEvent(new Event(GENERATE_EVENT))
}

export function onIdeaRequested(handler: () => void): () => void {
  window.addEventListener(GENERATE_EVENT, handler)
  return () => window.removeEventListener(GENERATE_EVENT, handler)
}
