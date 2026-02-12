// ============================================
// DASHBOARD PROFESOR UTILS
// ============================================

/**
 * Formatea un TimeSpan de C# (HH:mm:ss) a formato legible (HH:mm)
 * @param timeSpan - "18:00:00" | "19:30:00"
 * @returns "18:00" | "19:30"
 */
export function formatearHora(timeSpan: string): string {
  if (!timeSpan) return ''
  
  const parts = timeSpan.split(':')
  if (parts.length < 2) return timeSpan
  
  return `${parts[0]}:${parts[1]}`
}

/**
 * Obtiene el saludo apropiado según la hora del día
 * @returns "Buenos días" | "Buenas tardes" | "Buenas noches"
 */
export function obtenerSaludo(): string {
  const hora = new Date().getHours()
  
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/**
 * Formatea la fecha actual en español
 * @returns "lunes, 26 de enero de 2026"
 */
export function formatearFechaHoy(): string {
  const hoy = new Date()
  
  return hoy.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  })
}

/**
 * Obtiene el nombre del día de la semana abreviado
 * @param fechaISO - "2026-01-28"
 * @returns "MIÉ"
 */
export function obtenerDiaAbreviado(fechaISO: string): string {
  const fecha = new Date(fechaISO)
  const dia = fecha.toLocaleDateString('es-ES', { weekday: 'short' })
  return dia.toUpperCase().substring(0, 3)
}

/**
 * Obtiene el día del mes de una fecha
 * @param fechaISO - "2026-01-28"
 * @returns "28"
 */
export function obtenerDiaMes(fechaISO: string): string {
  const fecha = new Date(fechaISO)
  return fecha.getDate().toString()
}

/**
 * Obtiene el nombre del día completo
 * @param fechaISO - "2026-01-28"
 * @returns "Miércoles"
 */
export function obtenerDiaCompleto(fechaISO: string): string {
  const fecha = new Date(fechaISO)
  const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long' })
  return dia.charAt(0).toUpperCase() + dia.slice(1)
}
