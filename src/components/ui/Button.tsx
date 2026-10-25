import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  icon?: ReactNode
  trailing?: ReactNode
}

export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  trailing,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...rest}>
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span>{children}</span>
      {trailing ? <span className="btn__icon">{trailing}</span> : null}
    </button>
  )
}
