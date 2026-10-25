import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Alert } from './Icons'

interface BaseFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

function FieldMessages({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p className="field__error" id={`${id}-error`} role="alert">
        <Alert width={14} height={14} />
        <span>{error}</span>
      </p>
    )
  }

  if (hint) {
    return (
      <p className="field__hint" id={`${id}-hint`}>
        {hint}
      </p>
    )
  }

  return null
}

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  className = '',
  ...rest
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`field${error ? ' field--invalid' : ''}${className ? ` ${className}` : ''}`}>
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {optional ? <span className="field__optional">isteğe bağlı</span> : null}
      </label>
      <input
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}

export function TextArea({
  id,
  label,
  error,
  hint,
  optional,
  className = '',
  ...rest
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`field${error ? ' field--invalid' : ''}${className ? ` ${className}` : ''}`}>
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {optional ? <span className="field__optional">isteğe bağlı</span> : null}
      </label>
      <textarea
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}
