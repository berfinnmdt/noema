const TERMS: Array<{ word: string; meaning: string }> = [
  { word: 'νόημα', meaning: 'düşüncenin nesnesi' },
  { word: 'τέχνη', meaning: 'sanat, beceri' },
  { word: 'φάντασις', meaning: 'hayal, tasavvur' },
  { word: 'μέθοδος', meaning: 'yöntem' },
  { word: 'σιωπή', meaning: 'sessizlik' },
  { word: 'ἄπορος', meaning: 'yol bulamayan' },
  { word: 'χρόνος', meaning: 'zaman' },
  { word: 'ποίησις', meaning: 'yaratım' },
  { word: 'κανών', meaning: 'ölçü' },
  { word: 'ἀλήθεια', meaning: 'gerçek' },
]

/** Ana sayfayı kesen, arşivin terminolojisini hatırlatan yavaş şerit. */
export function Marquee() {
  const group = (
    <div className="marquee__group">
      {TERMS.map((term) => (
        <span className="marquee__item" key={term.word}>
          <i>{term.word}</i>
          {term.meaning}
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee" role="img" aria-label="Noema arşivinin kelime dağarcığı">
      <div className="marquee__track" aria-hidden="true">
        {group}
        {group}
      </div>
    </div>
  )
}
