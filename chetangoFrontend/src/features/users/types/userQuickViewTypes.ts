// ============================================
// USER QUICK VIEW TYPES
// ============================================

/**
 * Tipo de usuario para Quick View
 */
export type UserType = 'alumno' | 'profesor'

/**
 * Información básica del alumno para Quick View
 */
export interface AlumnoQuickView {
  idAlumno: string
  idUsuario: string
  nombre: string
  documento: string
  correo: string
  telefono?: string
  fechaNacimiento?: string
  
  // Información contextual
  paquetesActivos: number
  proximaClase?: {
    fecha: string
    hora: string
    tipo: string
  }
  ultimoPago?: {
    fecha: string
    monto: number
  }
  asistenciasRecientes: number
}

/**
 * Información básica del profesor para Quick View
 */
export interface ProfesorQuickView {
  idProfesor: string
  idUsuario: string
  nombre: string
  documento: string
  correo: string
  telefono?: string
  
  // Información contextual
  clasesAsignadas: number
  proximaClase?: {
    fecha: string
    hora: string
    tipo: string
  }
  nominaActual?: {
    periodo: string
    totalClases: number
  }
  tipoProfesor: 'Titular' | 'Monitor'
}

/**
 * Union type para Quick View
 */
export type UserQuickViewData = AlumnoQuickView | ProfesorQuickView

/**
 * State del Quick View modal
 */
export interface UserQuickViewState {
  isOpen: boolean
  userId: string | null
  userType: UserType | null
}
