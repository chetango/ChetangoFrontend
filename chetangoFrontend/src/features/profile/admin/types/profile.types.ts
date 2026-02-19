// ============================================
// PROFILE ADMIN TYPES
// ============================================

/**
 * Perfil completo del administrador
 */
export interface AdminProfile {
  idAdministrador: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  direccionPersonal: string | null
  fechaNacimiento: string | null
  fechaIngreso: string
  cargo: string
  departamento: string
  permisos: string[]
  ultimaActividad: string
  sede: 1 | 2 // 1 = Medellín, 2 = Manizales
  sedeNombre: string
  datosAcademia: DatosAcademia
  configuracion: ConfiguracionAdmin
}

/**
 * Datos de la academia
 */
export interface DatosAcademia {
  nombreAcademia: string
  direccion: string
  telefono: string
  emailInstitucional: string
  instagram: string | null
  facebook: string | null
  whatsapp: string | null
}

/**
 * Configuración de notificaciones y alertas
 */
export interface ConfiguracionAdmin {
  notificacionesEmail: boolean
  alertasPagosPendientes: boolean
  reportesAutomaticos: boolean
  alertasPaquetesVencer: boolean
  alertasAsistenciaBaja: boolean
  notificacionesNuevosRegistros: boolean
}

/**
 * Información de seguridad
 */
export interface SeguridadInfo {
  ultimoCambioPassword: string
  sesionesActivas: number
  historialAccesos: HistorialAcceso[]
}

export interface HistorialAcceso {
  fecha: string
  dispositivo: string
  navegador: string
  ip: string
}

/**
 * Request para actualizar datos personales
 */
export interface UpdateDatosPersonalesAdminRequest {
  nombreCompleto: string
  telefono: string
  direccionPersonal: string | null
  fechaNacimiento: string | null
}

/**
 * Request para actualizar datos de la academia
 */
export interface UpdateDatosAcademiaRequest {
  nombreAcademia: string
  direccion: string
  telefono: string
  emailInstitucional: string
  instagram: string | null
  facebook: string | null
  whatsapp: string | null
}

/**
 * Request para actualizar configuración
 */
export interface UpdateConfiguracionAdminRequest {
  notificacionesEmail: boolean
  alertasPagosPendientes: boolean
  reportesAutomaticos: boolean
  alertasPaquetesVencer: boolean
  alertasAsistenciaBaja: boolean
  notificacionesNuevosRegistros: boolean
}

/**
 * Request para cambiar contraseña
 */
export interface CambiarPasswordRequest {
  passwordActual: string
  passwordNuevo: string
  confirmarPassword: string
}
