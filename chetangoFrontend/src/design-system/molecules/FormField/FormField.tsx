import type { ReactNode } from 'react'
import { Input } from '@/design-system/atoms/Input'
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
  rightIcon,
  isRequired = false,
  isLoading = false,
  size = 'md',
  className = '',
  id,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const hasError = Boolean(error)
  const variant = hasError ? 'error' : 'default'

  const wrapperClasses = [
    styles['form-field'],
    hasError && styles['form-field--error'],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      {label && (
        <label 
          htmlFor={fieldId}
          className={styles['form-field__label']}
        >
          {label}
          {isRequired && (
            <span className={styles['form-field__required']}>*</span>
          )}
        </label>
      )}
      
      <div className={styles['form-field__input-wrapper']}>
        <Input
          id={fieldId}
          variant={variant}
          size={size}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          isLoading={isLoading}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : 
            helperText ? `${fieldId}-help` : undefined
          }
          {...inputProps}
        />
      </div>
      
      {error && (
        <div 
          id={`${fieldId}-error`}
          className={styles['form-field__error']}
          role="alert"
        >
          {error}
        </div>
      )}
      
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