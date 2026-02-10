// ============================================
// DASHBOARD ALUMNO TYPES
// ============================================

import type { EventoProximo } from '../../types/dashboard.types'

/**
 * Response del endpoint /api/reportes/dashboard/alumno
 * Mapea exactamente el DTO del backend: DashboardAlumnoDTO.cs
 */
export interface DashboardAlumnoResponse {
  nombreAlumno: string
  correo: string
  telefono: string
  codigo: string // Para QR
  fechaIngreso: string // ISO date
  paqueteActivo: PaqueteActivo | null
  proximaClase: ProximaClase | null
  asistencia: AsistenciaAlumno
  logros: Logro[]
  eventosProximos: EventoProximo[]
}

/**
 * Información del paquete activo del alumno
 */
export interface PaqueteActivo {
  idPaquete: string
  tipo: string
  clasesRestantes: number
  clasesTotales: number
  estado: 'activo' | 'agotado' | 'congelado' | 'vencido'
  fechaVencimiento: string // ISO date
  diasParaVencer: number
}

/**
 * Próxima clase del alumno
 */
export interface ProximaClase {
  idClase: string
  nombre: string
  nivel: string
  fecha: string // ISO date
  hora: string // "18:00:00"
  profesor: string
  minutosParaInicio: number
  ubicacion: string
}

/**
 * Estadísticas de asistencia del alumno
 */
export interface AsistenciaAlumno {
  porcentaje: number
  clasesTomadas: number
  rachaSemanas: number
}

/**
 * Logro del alumno
 */
export interface Logro {
  id: string
  nombre: string
  descripcion: string
  icono: 'flame' | 'trophy' | 'target' | 'star' | 'gift' | 'zap'
  color: string
  desbloqueado: boolean
}

/**
 * CTA Card para recomendaciones
 */
export interface CTACard {
  id: string
  titulo: string
  descripcion: string
  icono: string
  color: string
  bgColor: string
  ctaText: string
  accion: () => void
  prioridad: 'alta' | 'media' | 'baja'
}
