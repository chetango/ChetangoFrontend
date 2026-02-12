// ============================================
// DASHBOARD PROFESOR TYPES
// ============================================

import type { ChartData, EventoProximo } from '../../types/dashboard.types'

/**
 * Response del endpoint /api/reportes/dashboard/profesor
 */
export interface DashboardProfesorResponse {
  nombreProfesor: string
  correo: string
  clasesHoy: ClaseHoy[]
  kpIs: KPIsProfesor
  graficaAsistencia30Dias: ChartData | null
  proximasClases: ClaseProxima[]
  eventosProximos: EventoProximo[]
}

/**
 * Clase programada para hoy
 */
export interface ClaseHoy {
  idClase: string
  nombre: string
  nivel: string
  horaInicio: string  // "18:00:00"
  horaFin: string     // "19:30:00"
  tipo: 'grupal' | 'particular'
  estado: 'programada' | 'en-curso' | 'finalizada'
  alumnosEsperados: number
  alumnosPresentes?: number
  minutosParaInicio?: number
}

/**
 * KPIs del profesor
 */
export interface KPIsProfesor {
  clasesDictadasMes: number
  promedioAsistencia30Dias: number
  alumnosUnicosMes: number
  clasesEstaSemana: number
  clasesCompletadasSemana: number
}

/**
 * Clase próxima programada
 */
export interface ClaseProxima {
  idClase: string
  fecha: string  // ISO date
  horaInicio: string  // "18:00:00"
  tipoClase: string
  nombreProfesor: string
  cupoMaximo: number
  inscritosActual: number
}

/**
 * Acción rápida del dashboard
 */
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  path: string
}

export type { ChartData }

