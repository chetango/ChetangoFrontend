// ============================================
// DATE HELPERS - CHETANGO
// Utility functions for date handling in reports
// ============================================

import type { DatePreset } from '../types/reportTypes'

// ============================================
// DATE RANGE CALCULATIONS
// ============================================

export function getDateRangeForPreset(preset: DatePreset): {
  fechaDesde?: string
  fechaHasta?: string
} {
  const today = new Date()
  const todayStr = formatDateForAPI(today)

  switch (preset) {
    case 'today':
      return {
        fechaDesde: todayStr,
        fechaHasta: todayStr,
      }

    case 'week': {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay()) // Domingo
      return {
        fechaDesde: formatDateForAPI(weekStart),
        fechaHasta: todayStr,
      }
    }

    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return {
        fechaDesde: formatDateForAPI(monthStart),
        fechaHasta: todayStr,
      }
    }

    case 'quarter': {
      const quarterStart = new Date(today)
      quarterStart.setMonth(today.getMonth() - 3)
      return {
        fechaDesde: formatDateForAPI(quarterStart),
        fechaHasta: todayStr,
      }
    }

    case 'year': {
      const yearStart = new Date(today.getFullYear(), 0, 1)
      return {
        fechaDesde: formatDateForAPI(yearStart),
        fechaHasta: todayStr,
      }
    }

    case 'custom':
      return {}

    default:
      return {}
  }
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date for display (DD/MM/YYYY)
 */
export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format date for display with time (DD/MM/YYYY HH:mm)
 */
export function formatDateTimeForDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Get month name in Spanish
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  return months[monthIndex]
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateStr: string): Date {
  return new Date(dateStr)
}

/**
 * Format currency in Colombian pesos
 */
export function formatCurrency(value: number | undefined): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0)
}

/**
 * Format date for display (dd/MM/yyyy)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
