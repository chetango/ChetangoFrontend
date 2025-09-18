import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.scss'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
}

export function Input({ 
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  ...props 
}: InputProps) {
  const classes = [
    styles.input,
    styles[`input--${variant}`],
    styles[`input--${size}`],
    leftIcon && styles['input--has-left-icon'],
    rightIcon && styles['input--has-right-icon'],
    isLoading && styles['input--loading'],
    disabled && styles['input--disabled'],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles['input-wrapper']}>
      {leftIcon && (
        <div className={styles['input__icon-left']}>
          {leftIcon}
        </div>
      )}
      
      <input 
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      />
      
      {rightIcon && (
        <div className={styles['input__icon-right']}>
          {rightIcon}
        </div>
      )}
      
      {isLoading && (
        <div className={styles['input__spinner']}>
          <div className={styles['spinner']} />
        </div>
      )}
    </div>
  )
}