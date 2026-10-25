import type { ReactNode } from 'react'

interface SectionHeadingProps {
  index: string
  label: string
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
}

export function SectionHeading({ index, label, title, lead, action }: SectionHeadingProps) {
  return (
    <div className="section-head">
      <div className="section-index">
        <span className="section-index__num">{index}</span>
        <span>{label}</span>
        <span className="section-index__line" />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <h2 className="section-head__title">{title}</h2>
        {action}
      </div>

      {lead ? <p className="section-head__lead">{lead}</p> : null}
    </div>
  )
}
