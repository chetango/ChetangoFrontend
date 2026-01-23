// ============================================
// DATE UTILITIES FOR CLASSES MODULE
// Requirements: 11.1
// ============================================

/**
 * Checks if a date string represents today
 * @param fecha - ISO 8601 date string
 */
export function esHoy(fecha: string): boolean {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaDate = new Date(fecha.split('T')[0])
  fechaDate.setHours(0, 0, 0, 0)
  return fechaDate.getTime() === hoy.getTime()
}

/**
 * Checks if a date string represents tomorrow
 * @param fecha - ISO 8601 date string
 */
export function esMañana(fecha: string): boolean {
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  mañana.setHours(0, 0, 0, 0)
  const fechaDate = new Date(fecha.split('T')[0])
  fechaDate.setHours(0, 0, 0, 0)
  return fechaDate.getTime() === mañana.getTime()
}

/**
 * Gets the day of the week in Spanish
 * @param fecha - ISO 8601 date string
 */
export function getDiaSemana(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', { weekday: 'long' })
}

/**
 * Formats a date with "Hoy"/"Mañana" support
 * @param fecha - ISO 8601 date string
 * @param includeYear - Whether to include the year
 */
export function formatearFecha(fecha: string, includeYear = false): string {
  if (esHoy(fecha)) return 'Hoy'
  if (esMañana(fecha)) return 'Mañana'

  const date = new Date(fecha)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }
  if (includeYear) {
    options.year = 'numeric'
  }
  return date.toLocaleDateString('es-ES', options)
}

/**
 * Formats a date for display with capitalized weekday
 * @param fecha - ISO 8601 date string
 */
export function formatearFechaCompleta(fecha: string): string {
  const date = new Date(fecha)
  const formatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

/**
 * Formats time from HH:mm:ss to 12h format with AM/PM
 * @param time - Time string in HH:mm:ss or HH:mm format
 */
export function formatearHora12(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Formats time from HH:mm:ss to HH:mm
 * @param time - Time string in HH:mm:ss format
 */
export function formatearHora24(time: string): string {
  return time.substring(0, 5)
}

/**
 * Calculates duration string from start and end times
 * @param horaInicio - Start time in HH:mm:ss format
 * @param horaFin - End time in HH:mm:ss format
 */
export function calcularDuracion(horaInicio: string, horaFin: string): string {
  const [startH, startM] = horaInicio.split(':').map(Number)
  const [endH, endM] = horaFin.split(':').map(Number)

  const totalMinutes = endH * 60 + endM - (startH * 60 + startM)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`
  if (hours > 0) return `${hours}h`
  return `${minutes}min`
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getHoyISO(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Gets the current time in HH:mm format
 */
export function getHoraActual(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

/**
 * Checks if current time is within a time range
 * @param horaInicio - Start time in HH:mm:ss format
 * @param horaFin - End time in HH:mm:ss format
 */
export function estaEnCurso(horaInicio: string, horaFin: string): boolean {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [startH, startM] = horaInicio.split(':').map(Number)
  const [endH, endM] = horaFin.split(':').map(Number)

  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes
}

/**
 * Calculates minutes until a class starts
 * @param fecha - ISO 8601 date string
 * @param horaInicio - Start time in HH:mm:ss format
 */
export function minutosParaInicio(fecha: string, horaInicio: string): number {
  const now = new Date()
  const [hours, minutes] = horaInicio.split(':').map(Number)
  const claseDate = new Date(fecha.split('T')[0])
  claseDate.setHours(hours, minutes, 0, 0)

  const diffMs = claseDate.getTime() - now.getTime()
  return Math.floor(diffMs / (1000 * 60))
}

/**
 * Gets date range for filter options
 * @param filter - Filter type
 */
export function getDateRangeForFilter(
  filter: 'ultimos_7' | 'ultimos_30' | 'este_mes'
): { desde: string; hasta: string } {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hasta = hoy.toISOString().split('T')[0]

  let desde: Date

  switch (filter) {
    case 'ultimos_7':
      desde = new Date(hoy)
      desde.setDate(desde.getDate() - 7)
      break
    case 'ultimos_30':
      desde = new Date(hoy)
      desde.setDate(desde.getDate() - 30)
      break
    case 'este_mes':
      desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      break
    default:
      desde = new Date(hoy)
      desde.setDate(desde.getDate() - 7)
  }

  return {
    desde: desde.toISOString().split('T')[0],
    hasta,
  }
}
