// ============================================
// REPORT METADATA - CHETANGO
// Configuration and metadata for all reports
// ============================================

import {
    BarChart3,
    CheckSquare,
    DollarSign,
    Package,
    Users,
} from 'lucide-react'
import type { ReportMetadata, ReportType } from '../types/reportTypes'

// ============================================
// REPORTS CONFIGURATION
// ============================================

export const REPORTS_CONFIG: Record<ReportType, ReportMetadata> = {
  alumnos: {
    id: 'alumnos',
    title: 'Reporte de Alumnos',
    description: 'Estadísticas de alumnos activos, nuevos ingresos y retención',
    icon: 'Users',
    color: '#3b82f6', // blue-500
    available: true,
  },
  clases: {
    id: 'clases',
    title: 'Reporte de Clases',
    description: 'Clases programadas, completadas y tasa de ocupación',
    icon: 'BarChart3',
    color: '#8b5cf6', // violet-500
    available: true,
  },
  asistencias: {
    id: 'asistencias',
    title: 'Reporte de Asistencias',
    description: 'Asistencias, ausencias y tendencias de participación',
    icon: 'CheckSquare',
    color: '#10b981', // green-500
    available: true,
  },
  paquetes: {
    id: 'paquetes',
    title: 'Reporte de Paquetes',
    description: 'Paquetes vendidos, activos y tipos más populares',
    icon: 'Package',
    color: '#f59e0b', // amber-500
    available: true,
  },
  ingresos: {
    id: 'ingresos',
    title: 'Reporte de Ingresos',
    description: 'Ingresos totales, métodos de pago y evolución mensual',
    icon: 'DollarSign',
    color: '#c93448', // primary red
    available: true,
  },
}

// ============================================
// ICON MAPPING
// ============================================

export const REPORT_ICONS = {
  Users,
  BarChart3,
  CheckSquare,
  Package,
  DollarSign,
}

// ============================================
// HELPERS
// ============================================

export function getReportMetadata(reportType: ReportType): ReportMetadata {
  return REPORTS_CONFIG[reportType]
}

export function getAvailableReports(): ReportMetadata[] {
  return Object.values(REPORTS_CONFIG).filter((report) => report.available)
}
