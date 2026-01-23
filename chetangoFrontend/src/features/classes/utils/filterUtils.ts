// ============================================
// FILTER UTILITIES FOR CLASSES MODULE
// Requirements: 11.2
// ============================================

import type { ClaseListItemDTO } from '../types/classTypes'

/**
 * Filters classes by search term (matches nombre/tipo or profesor)
 * @param clases - Array of classes
 * @param searchTerm - Search term to filter by
 */
export function filterClasesBySearch<T extends { tipoClase?: string; nombre?: string; profesor?: string }>(
  clases: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return clases

  const term = searchTerm.toLowerCase().trim()
  return clases.filter((clase) => {
    const matchTipo = clase.tipoClase?.toLowerCase().includes(term)
    const matchNombre = clase.nombre?.toLowerCase().includes(term)
    const matchProfesor = clase.profesor?.toLowerCase().includes(term)
    return matchTipo || matchNombre || matchProfesor
  })
}

/**
 * Filters classes by profesor ID
 * @param clases - Array of classes
 * @param profesorId - Profesor ID to filter by ('todos' for all)
 * @param profesorMap - Map of profesor IDs to names (optional)
 */
export function filterClasesByProfesor<T extends { idProfesor?: string; profesor?: string }>(
  clases: T[],
  profesorId: string,
  profesorMap?: Map<string, string>
): T[] {
  if (profesorId === 'todos' || !profesorId) return clases

  return clases.filter((clase) => {
    if (clase.idProfesor) {
      return clase.idProfesor === profesorId
    }
    if (clase.profesor && profesorMap) {
      const profesorName = profesorMap.get(profesorId)
      return clase.profesor === profesorName
    }
    return true
  })
}

/**
 * Filters classes by tipo de clase
 * @param clases - Array of classes
 * @param tipo - Tipo de clase to filter by ('todos' for all)
 */
export function filterClasesByTipo<T extends { tipoClase?: string; tipo?: string }>(
  clases: T[],
  tipo: string
): T[] {
  if (tipo === 'todos' || !tipo) return clases

  return clases.filter((clase) => {
    return clase.tipoClase === tipo || clase.tipo === tipo
  })
}

/**
 * Filters classes by fecha
 * @param clases - Array of classes
 * @param fecha - Date string in YYYY-MM-DD format ('' for all)
 */
export function filterClasesByFecha<T extends { fecha: string }>(
  clases: T[],
  fecha: string
): T[] {
  if (!fecha) return clases

  return clases.filter((clase) => {
    return clase.fecha.startsWith(fecha)
  })
}

/**
 * Groups classes by fecha
 * @param clases - Array of classes
 * @returns Record with date keys and arrays of classes
 */
export function groupClasesByFecha<T extends { fecha: string; horaInicio?: string }>(
  clases: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}

  clases.forEach((clase) => {
    const date = clase.fecha.split('T')[0]
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(clase)
  })

  // Sort by time within each date
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      const timeA = a.horaInicio || '00:00:00'
      const timeB = b.horaInicio || '00:00:00'
      return timeA.localeCompare(timeB)
    })
  })

  return grouped
}

/**
 * Gets sorted date keys from grouped classes
 * @param groupedClases - Record of grouped classes
 * @param ascending - Sort order (true for ascending, false for descending)
 */
export function getSortedDateKeys(
  groupedClases: Record<string, unknown[]>,
  ascending = true
): string[] {
  const dates = Object.keys(groupedClases)
  return dates.sort((a, b) => {
    const comparison = new Date(a).getTime() - new Date(b).getTime()
    return ascending ? comparison : -comparison
  })
}

/**
 * Applies all filters to a list of ClaseListItemDTO
 * @param clases - Array of classes
 * @param filters - Filter options
 */
export function applyAllFilters(
  clases: ClaseListItemDTO[],
  filters: {
    searchTerm: string
    filterTipo: string
    filterFecha: string
  }
): ClaseListItemDTO[] {
  let result = clases

  if (filters.searchTerm) {
    result = filterClasesBySearch(result, filters.searchTerm)
  }

  if (filters.filterTipo && filters.filterTipo !== 'todos') {
    result = filterClasesByTipo(result, filters.filterTipo)
  }

  if (filters.filterFecha) {
    result = filterClasesByFecha(result, filters.filterFecha)
  }

  return result
}

/**
 * Separates classes into today, upcoming, and past
 * @param clases - Array of classes
 */
export function separateClasesByTime<T extends { fecha: string }>(
  clases: T[]
): {
  clasesHoy: T[]
  proximasClases: T[]
  clasesAnteriores: T[]
} {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]

  const clasesHoy: T[] = []
  const proximasClases: T[] = []
  const clasesAnteriores: T[] = []

  clases.forEach((clase) => {
    const fechaStr = clase.fecha.split('T')[0]
    if (fechaStr === hoyStr) {
      clasesHoy.push(clase)
    } else if (fechaStr > hoyStr) {
      proximasClases.push(clase)
    } else {
      clasesAnteriores.push(clase)
    }
  })

  // Sort upcoming by date ascending
  proximasClases.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  // Sort past by date descending
  clasesAnteriores.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return { clasesHoy, proximasClases, clasesAnteriores }
}

/**
 * Filters historical classes by date range
 * @param clases - Array of classes
 * @param filter - Filter type
 */
export function filterClasesAnteriores<T extends { fecha: string }>(
  clases: T[],
  filter: 'ultimos_7' | 'ultimos_30' | 'este_mes'
): T[] {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

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

  return clases.filter((clase) => {
    const fechaClase = new Date(clase.fecha.split('T')[0])
    return fechaClase >= desde && fechaClase < hoy
  })
}
