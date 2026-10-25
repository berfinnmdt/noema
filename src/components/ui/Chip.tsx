import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  count?: number
  children: ReactNode
}

export function Chip({ active = false, count, className = '', children, ...rest }: ChipProps) {
  const classes = ['chip', active ? 'is-active' : '', className].filter(Boolean).join(' ')

  return (
    <button type="button" className={classes} aria-pressed={active} {...rest}>
      <span>{children}</span>
      {typeof count === 'number' ? <span className="chip__count">{count}</span> : null}
    </button>
  )
}
