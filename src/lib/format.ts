/** Küçük biçimlendirme yardımcıları. */

const RELATIVE_UNITS: Array<[limit: number, divisor: number, unit: string]> = [
  [60_000, 1000, 'sn'],
  [3_600_000, 60_000, 'dk'],
  [86_400_000, 3_600_000, 'sa'],
]

export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const timestamp = Date.parse(iso)
  if (Number.isNaN(timestamp)) return '—'

  const diff = now.getTime() - timestamp
  if (diff < 45_000) return 'az önce'
  if (diff < 0) return 'az önce'

  for (const [limit, divisor, unit] of RELATIVE_UNITS) {
    if (diff < limit) {
      const value = Math.max(1, Math.floor(diff / divisor))
      return `${value} ${unit} önce`
    }
  }

  const days = Math.floor(diff / 86_400_000)
  if (days < 30) return `${days} gün önce`

  return formatDate(iso)
}

export function formatDate(iso: string): string {
  const timestamp = Date.parse(iso)
  if (Number.isNaN(timestamp)) return '—'

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
