// ============================================
// PROFILE PROFESOR TYPES
// ============================================

/**
 * Perfil completo del profesor
 */
export interface ProfesorProfile {
  idProfesor: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  tipoProfesor: string
  fechaIngreso: string
  biografia: string | null
  especialidades: string[]
  configuracion: ConfiguracionProfesor
}

/**
 * Configuración de notificaciones y preferencias
 */
export interface ConfiguracionProfesor {
  notificacionesEmail: boolean
  recordatoriosClase: boolean
  alertasCambios: boolean
}

/**
 * Request para actualizar datos personales
 */
export interface UpdateDatosPersonalesProfesorRequest {
  nombreCompleto: string
  telefono: string
}

/**
 * Request para actualizar perfil profesional
 */
export interface UpdatePerfilProfesionalRequest {
  biografia: string | null
  especialidades: string[]
}

/**
 * Request para actualizar configuración
 */
export interface UpdateConfiguracionProfesorRequest {
  notificacionesEmail: boolean
  recordatoriosClase: boolean
  alertasCambios: boolean
}
