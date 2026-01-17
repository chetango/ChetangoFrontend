import type { ReactNode } from 'react'
import { GlassInput } from '@/design-system/atoms/GlassInput/GlassInput'
import type { InputHTMLAttributes } from 'react'
import styles from './FormField.module.scss'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isRequired?: boolean
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function FormField({
  label,
  error,
  helperText,
  leftIcon,
  isRequired = false,
  size: _size,
  rightIcon: _rightIcon,
  isLoading: _isLoading,
  className = '',
  id,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const hasError = Boolean(error)

  const wrapperClasses = [
    styles['form-field'],
    hasError && styles['form-field--error'],
    className
  ].filter(Boolean).join(' ')

  // Build label with required indicator
  const labelText = label && isRequired ? `${label} *` : label

  return (
    <div className={wrapperClasses}>
      <GlassInput
        id={fieldId}
        label={labelText}
        icon={leftIcon}
        error={error}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${fieldId}-error` : 
          helperText ? `${fieldId}-help` : undefined
        }
        {...inputProps}
      />
      
      {helperText && !error && (
        <div 
          id={`${fieldId}-help`}
          className={styles['form-field__help']}
        >
          {helperText}
        </div>
      )}
    </div>
  )
}