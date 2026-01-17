// ============================================
// DATE UTILITIES - CHETANGO
// ============================================

/**
 * Formats a Date object to YYYY-MM-DD string for API requests
 * @param date - Date object to format
 * @returns String in YYYY-MM-DD format
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a YYYY-MM-DD string to a Date object
 * @param dateStr - String in YYYY-MM-DD format
 * @returns Date object (at midnight local time)
 */
export function parseAPIDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Formats a time string from HH:mm:ss to HH:mm for display
 * @param timeStr - String in HH:mm:ss format
 * @returns String in HH:mm format
 */
export function formatTimeForDisplay(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  return `${hours}:${minutes}`
}
