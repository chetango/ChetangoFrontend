// ============================================
// CLASS HELPERS - UTILITY FUNCTIONS
// Funciones utilitarias para evitar duplicación de código
// ============================================

import type { ProfesorClaseRequest } from '../types/classTypes'

/**
 * Calcula la duración en minutos entre dos horarios
 * @param horaInicio - Hora de inicio en formato "HH:mm"
 * @param horaFin - Hora de fin en formato "HH:mm"
 * @returns Duración en minutos
 */
export function calcularDuracionMinutos(horaInicio: string, horaFin: string): number {
  const [startHour, startMin] = horaInicio.split(':').map(Number)
  const [endHour, endMin] = horaFin.split(':').map(Number)
  return endHour * 60 + endMin - (startHour * 60 + startMin)
}

/**
 * Encuentra el profesor principal en un array de profesores
 * @param profesores - Array de profesores con sus roles
 * @returns El profesor principal o undefined si no existe
 */
export function encontrarProfesorPrincipal(
  profesores: ProfesorClaseRequest[]
): ProfesorClaseRequest | undefined {
  return profesores.find(p => p.rolEnClase === 'Principal')
}

/**
 * Cuenta cuántos profesores tienen un rol específico
 * @param profesores - Array de profesores con sus roles
 * @param rol - Rol a contar
 * @returns Cantidad de profesores con ese rol
 */
export function contarProfesoresPorRol(
  profesores: ProfesorClaseRequest[],
  rol: 'Principal' | 'Monitor'
): number {
  return profesores.filter(p => p.rolEnClase === rol).length
}

/**
 * Verifica si hay profesores duplicados en el array
 * @param profesores - Array de profesores con sus roles
 * @returns true si hay duplicados, false si no
 */
export function hayProfesoresDuplicados(profesores: ProfesorClaseRequest[]): boolean {
  const idsUnicos = new Set(profesores.map(p => p.idProfesor))
  return idsUnicos.size !== profesores.length
}

/**
 * Formatea una hora en formato HH:mm a HH:mm:ss
 * @param hora - Hora en formato "HH:mm"
 * @returns Hora en formato "HH:mm:ss"
 */
export function formatearHoraConSegundos(hora: string): string {
  return `${hora}:00`
}

/**
 * Formatea una fecha ISO a formato fecha + hora inicio
 * @param fecha - Fecha en formato "YYYY-MM-DD"
 * @param horaInicio - Hora en formato "HH:mm"
 * @returns Fecha y hora en formato ISO completo
 */
export function formatearFechaHoraISO(fecha: string, horaInicio: string): string {
  return `${fecha}T${horaInicio}:00`
}

/**
 * Formatea una fecha para el input de fecha (YYYY-MM-DD)
 * @param fecha - Fecha en formato ISO 8601
 * @returns Fecha en formato YYYY-MM-DD
 */
export function formatearFechaParaInput(fecha: string): string {
  if (!fecha) return ''
  return fecha.split('T')[0]
}

/**
 * Formatea una hora para el input de tiempo (HH:mm)
 * @param hora - Hora en formato HH:mm:ss
 * @returns Hora en formato HH:mm
 */
export function formatearHoraParaInput(hora: string): string {
  if (!hora) return ''
  return hora.substring(0, 5)
}

/**
 * Valida que los profesores cumplan con las reglas de negocio
 * @param profesores - Array de profesores a validar
 * @returns Objeto con el resultado de la validación y mensaje de error si aplica
 */
export function validarProfesores(profesores: ProfesorClaseRequest[]): {
  valido: boolean
  mensaje?: string
} {
  if (!profesores || profesores.length === 0) {
    return { valido: false, mensaje: 'Debe agregar al menos un profesor' }
  }

  const principalCount = contarProfesoresPorRol(profesores, 'Principal')
  
  if (principalCount === 0) {
    return { valido: false, mensaje: 'Debe haber al menos un profesor con rol Principal' }
  }

  if (hayProfesoresDuplicados(profesores)) {
    return { valido: false, mensaje: 'No puede agregar el mismo profesor dos veces' }
  }

  return { valido: true }
}
