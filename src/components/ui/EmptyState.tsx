import type { ReactNode } from 'react'

interface EmptyStateProps {
  glyph?: ReactNode
  title: string
  text: string
  action?: ReactNode
}

export function EmptyState({ glyph, title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      {glyph ? <div className="empty__glyph">{glyph}</div> : null}
      <h3 className="empty__title">{title}</h3>
      <p className="empty__text">{text}</p>
      {action}
    </div>
  )
}
