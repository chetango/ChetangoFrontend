/**
 * Helper para manejar fechas y horas en la zona horaria de Bogotá, Colombia (UTC-5)
 */

const BOGOTA_OFFSET_HOURS = -5

/**
 * Obtiene la fecha y hora actual en la zona horaria de Bogotá, Colombia
 */
export const getNow = (): Date => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + BOGOTA_OFFSET_HOURS * 3600000)
}

/**
 * Obtiene solo la fecha actual en formato YYYY-MM-DD en la zona horaria de Bogotá
 */
export const getToday = (): string => {
  const bogotaDate = getNow()
  const year = bogotaDate.getFullYear()
  const month = String(bogotaDate.getMonth() + 1).padStart(2, '0')
  const day = String(bogotaDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Convierte una fecha a formato ISO en zona horaria de Bogotá
 */
export const toLocalISOString = (date: Date = getNow()): string => {
  const bogotaDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (BOGOTA_OFFSET_HOURS * 3600000))
  return bogotaDate.toISOString()
}

/**
 * Convierte una fecha a formato YYYY-MM-DD en zona horaria de Bogotá
 */
export const toLocalDateString = (date: Date = getNow()): string => {
  const bogotaDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (BOGOTA_OFFSET_HOURS * 3600000))
  const year = bogotaDate.getFullYear()
  const month = String(bogotaDate.getMonth() + 1).padStart(2, '0')
  const day = String(bogotaDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
