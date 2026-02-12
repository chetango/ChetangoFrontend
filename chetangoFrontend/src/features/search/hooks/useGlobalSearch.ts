// ============================================
// GLOBAL SEARCH HOOK
// ============================================

import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  navigate: (query: string) => void
}

type UserRole = 'admin' | 'profesor' | 'alumno'

/**
 * Hook para manejar búsqueda global en el sistema
 * Detecta el tipo de búsqueda y navega a la sección correspondiente según el rol
 */
export const useGlobalSearch = (userRole?: UserRole): SearchResult => {
  const navigate = useNavigate()

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase()
    
    if (!trimmedQuery) return

    // Lógica específica según rol
    if (userRole === 'profesor') {
      handleProfesorSearch(trimmedQuery, query, navigate)
    } else if (userRole === 'alumno') {
      handleAlumnoSearch(trimmedQuery, query, navigate)
    } else {
      // Admin por defecto
      handleAdminSearch(trimmedQuery, query, navigate)
    }
  }

  return {
    navigate: handleSearch
  }
}

/**
 * Búsqueda para rol Admin
 */
function handleAdminSearch(trimmedQuery: string, originalQuery: string, navigate: ReturnType<typeof useNavigate>) {
  // Búsqueda de números (posible ID de pago o paquete)
  if (/^\d+$/.test(trimmedQuery)) {
    navigate(`${ROUTES.ADMIN.PAYMENTS}?search=${encodeURIComponent(trimmedQuery)}`)
    return
  }

  // Palabras clave específicas
  if (trimmedQuery.includes('pago') || trimmedQuery.includes('payment')) {
    navigate(`${ROUTES.ADMIN.PAYMENTS}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('clase') || trimmedQuery.includes('class')) {
    navigate(`${ROUTES.ADMIN.CLASSES}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('paquete') || trimmedQuery.includes('package')) {
    navigate(`${ROUTES.ADMIN.PACKAGES}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('asistencia') || trimmedQuery.includes('attendance')) {
    navigate(`${ROUTES.ADMIN.ATTENDANCE}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('nomina') || trimmedQuery.includes('payroll')) {
    navigate(`${ROUTES.ADMIN.PAYROLL}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('reporte') || trimmedQuery.includes('report')) {
    navigate(`${ROUTES.ADMIN.REPORTS}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  // Por defecto, buscar en usuarios (alumnos/profesores)
  navigate(`${ROUTES.ADMIN.USERS}?search=${encodeURIComponent(originalQuery)}`)
}

/**
 * Búsqueda para rol Profesor
 */
function handleProfesorSearch(trimmedQuery: string, originalQuery: string, navigate: ReturnType<typeof useNavigate>) {
  // Búsqueda de números (posible alumno por ID)
  if (/^\d+$/.test(trimmedQuery)) {
    navigate(`${ROUTES.TEACHER.CLASSES}?search=${encodeURIComponent(trimmedQuery)}`)
    return
  }

  // Palabras clave específicas
  if (trimmedQuery.includes('clase') || trimmedQuery.includes('class')) {
    navigate(`${ROUTES.TEACHER.CLASSES}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('asistencia') || trimmedQuery.includes('attendance')) {
    navigate(`${ROUTES.TEACHER.ATTENDANCE}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('reporte') || trimmedQuery.includes('report')) {
    navigate(`${ROUTES.TEACHER.REPORTS}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('pago') || trimmedQuery.includes('payment')) {
    navigate(`${ROUTES.TEACHER.PAYMENTS}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  // Por defecto, buscar en mis clases
  navigate(`${ROUTES.TEACHER.CLASSES}?search=${encodeURIComponent(originalQuery)}`)
}

/**
 * Búsqueda para rol Alumno
 */
function handleAlumnoSearch(trimmedQuery: string, originalQuery: string, navigate: ReturnType<typeof useNavigate>) {
  // Búsqueda de números (posible pago o clase)
  if (/^\d+$/.test(trimmedQuery)) {
    navigate(`${ROUTES.STUDENT.PAYMENTS}?search=${encodeURIComponent(trimmedQuery)}`)
    return
  }

  // Palabras clave específicas
  if (trimmedQuery.includes('pago') || trimmedQuery.includes('payment')) {
    navigate(`${ROUTES.STUDENT.PAYMENTS}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('clase') || trimmedQuery.includes('class')) {
    navigate(`${ROUTES.STUDENT.CLASSES}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('asistencia') || trimmedQuery.includes('attendance')) {
    navigate(`${ROUTES.STUDENT.ATTENDANCE}?search=${encodeURIComponent(originalQuery)}`)
    return
  }

  if (trimmedQuery.includes('horario') || trimmedQuery.includes('schedule')) {
    navigate(`${ROUTES.STUDENT.CLASSES_SCHEDULE}`)
    return
  }

  // Por defecto, buscar en clases
  navigate(`${ROUTES.STUDENT.CLASSES}?search=${encodeURIComponent(originalQuery)}`)
}
