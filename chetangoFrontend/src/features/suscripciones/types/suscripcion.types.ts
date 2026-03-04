// ============================================
// SUSCRIPCIONES - TYPES
// ============================================

export interface EstadoSuscripcionDto {
  tenantId: string
  nombreAcademia: string
  plan: 'Basico' | 'Profesional' | 'Enterprise'
  estado: 'Activo' | 'Suspendido' | 'Cancelado'
  fechaRegistro: string
  fechaVencimiento: string | null
  diasRestantes: number | null
  maxSedes: number
  maxAlumnos: number
  maxProfesores: number
  maxStorageMB: number
  sedesActuales: number
  alumnosActivos: number
  profesoresActivos: number
  storageMBUsado: number
  progresoCuotas: {
    sedes: number
    alumnos: number
    profesores: number
    storage: number
  }
}

export interface ConfiguracionPagoDto {
  banco: string
  tipoCuenta: string
  numeroCuenta: string
  titular: string
  nit: string | null
}

export interface PagoSuscripcionDto {
  id: string
  tenantId: string
  fechaPago: string
  monto: number
  referencia: string
  metodoPago: string
  comprobanteUrl: string | null
  nombreArchivo: string | null
  tamanoArchivo: number | null
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado'
  aprobadoPor: string | null
  fechaAprobacion: string | null
  observaciones: string | null
}

export interface SubirComprobanteRequest {
  referencia: string
  metodoPago: string
  monto: number
  archivo: File
}

export interface AprobarPagoRequest {
  observaciones?: string
}

export interface RechazarPagoRequest {
  motivoRechazo: string
}

export interface CrearAcademiaConAdminRequest {
  nombreTenant: string
  subdomain: string
  dominioCompleto: string
  plan: string
  maxSedes: number
  maxAlumnos: number
  maxProfesores: number
  maxStorageMB: number
  nombreUsuario: string
  correoAdmin: string
  idTipoDocumento: string
  numeroDocumento: string
  telefono: string
}

// Planes disponibles
export const PLANES_SUSCRIPCION = {
  Basico: {
    nombre: 'Básico',
    precio: 150000,
    maxSedes: 1,
    maxAlumnos: 50,
    maxProfesores: 3,
    maxStorageMB: 500,
    caracteristicas: [
      'Gestión de asistencias',
      'Control de pagos',
      'Perfiles de alumnos',
      'Reportes básicos',
      'Soporte por email',
    ],
  },
  Profesional: {
    nombre: 'Profesional',
    precio: 350000,
    maxSedes: 3,
    maxAlumnos: 200,
    maxProfesores: 15,
    maxStorageMB: 2000,
    caracteristicas: [
      'Todo lo del plan Básico',
      'Múltiples sedes',
      'Gestión de nómina',
      'Reportes avanzados',
      'Personalización de marca',
      'Soporte prioritario',
    ],
  },
  Enterprise: {
    nombre: 'Enterprise',
    precio: 750000,
    maxSedes: 99999,
    maxAlumnos: 99999,
    maxProfesores: 99999,
    maxStorageMB: 999999,
    caracteristicas: [
      'Todo lo del plan Profesional',
      'Sedes ilimitadas',
      'Alumnos ilimitados',
      'Almacenamiento ampliado',
      'Integraciones personalizadas',
      'Soporte 24/7',
      'Gestor de cuenta dedicado',
    ],
  },
} as const

export type PlanType = keyof typeof PLANES_SUSCRIPCION
