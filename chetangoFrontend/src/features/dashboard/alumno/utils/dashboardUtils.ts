// ============================================
// DASHBOARD ALUMNO UTILITIES
// ============================================

import type { PaqueteActivo } from '../types/dashboardAlumno.types'

/**
 * Obtiene el saludo según la hora del día
 */
export const obtenerSaludo = (): string => {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/**
 * Formatea la fecha de hoy en español
 * @returns "Lunes 27 de enero de 2025"
 */
export const formatearFechaHoy = (): string => {
  const hoy = new Date()
  const opciones: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const fecha = hoy.toLocaleDateString('es-ES', opciones)
  // Capitalizar primera letra
  return fecha.charAt(0).toUpperCase() + fecha.slice(1)
}

/**
 * Obtiene el badge de estado del paquete con estilos
 */
export const getEstadoPaqueteBadge = (estado: PaqueteActivo['estado']) => {
  const estados = {
    activo: { 
      bg: 'rgba(52, 211, 153, 0.15)', 
      border: 'rgba(52, 211, 153, 0.3)', 
      text: '#6ee7b7', 
      label: 'Activo' 
    },
    agotado: { 
      bg: 'rgba(239, 68, 68, 0.15)', 
      border: 'rgba(239, 68, 68, 0.3)', 
      text: '#fca5a5', 
      label: 'Agotado' 
    },
    congelado: { 
      bg: 'rgba(59, 130, 246, 0.15)', 
      border: 'rgba(59, 130, 246, 0.3)', 
      text: '#93c5fd', 
      label: 'Congelado' 
    },
    vencido: { 
      bg: 'rgba(156, 163, 175, 0.15)', 
      border: 'rgba(156, 163, 175, 0.3)', 
      text: '#d1d5db', 
      label: 'Vencido' 
    }
  }
  return estados[estado]
}

/**
 * Obtiene el badge de asistencia según el porcentaje
 */
export const getAsistenciaBadge = (porcentaje: number) => {
  if (porcentaje >= 80) {
    return { 
      color: '#34d399', 
      label: '🟢 Excelente', 
      bg: 'rgba(52, 211, 153, 0.15)' 
    }
  }
  if (porcentaje >= 60) {
    return { 
      color: '#f59e0b', 
      label: '🟡 Regular', 
      bg: 'rgba(245, 158, 11, 0.15)' 
    }
  }
  return { 
    color: '#ef4444', 
    label: '🔴 Mejorable', 
    bg: 'rgba(239, 68, 68, 0.15)' 
  }
}

/**
 * Calcula el tiempo restante hasta una clase
 */
export const getTiempoRestante = (minutosParaInicio: number): string => {
  if (minutosParaInicio < 60) {
    return `Empieza en ${minutosParaInicio} min`
  }
  const horas = Math.floor(minutosParaInicio / 60)
  if (horas < 24) {
    const minutos = minutosParaInicio % 60
    return `Empieza en ${horas}h ${minutos}min`
  }
  const dias = Math.floor(horas / 24)
  return `En ${dias} día${dias > 1 ? 's' : ''}`
}

/**
 * Formatea una fecha ISO a formato legible
 * @param fecha "2026-01-27"
 * @returns "Lun 27 Ene"
 */
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha)
  const opciones: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  }
  const formateada = date.toLocaleDateString('es-ES', opciones)
  // Capitalizar y eliminar puntos
  return formateada.replace(/\./g, '').split(' ').map(s => 
    s.charAt(0).toUpperCase() + s.slice(1)
  ).join(' ')
}

/**
 * Formatea un TimeSpan de C# (HH:mm:ss) a formato legible
 * @param hora "18:00:00"
 * @returns "18:00"
 */
export const formatearHora = (hora: string): string => {
  return hora.substring(0, 5) // "HH:mm"
}

/**
 * Formatea el precio
 * @param precio 25000
 * @returns "$25.000"
 */
export const formatearPrecio = (precio: number | null): string => {
  if (precio === null || precio === 0) return 'Gratis'
  return `$${precio.toLocaleString('es-AR')}`
}

/**
 * Obtiene las iniciales del nombre
 * @param nombre "María Rodríguez"
 * @returns "MR"
 */
export const obtenerIniciales = (nombre: string): string => {
  const palabras = nombre.split(' ')
  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[1][0]).toUpperCase()
  }
  return nombre.substring(0, 2).toUpperCase()
}
