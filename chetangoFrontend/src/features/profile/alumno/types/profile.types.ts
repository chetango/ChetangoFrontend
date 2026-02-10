// ============================================
// PROFILE ALUMNO TYPES
// ============================================

/**
 * Perfil completo del alumno
 */
export interface AlumnoProfile {
  idAlumno: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  fechaInscripcion: string
  avatar?: string
  contactoEmergencia: ContactoEmergencia | null
  configuracion: ConfiguracionAlumno
}

/**
 * Contacto de emergencia
 */
export interface ContactoEmergencia {
  nombreCompleto: string
  telefono: string
  relacion: string
}

/**
 * Configuración de notificaciones y preferencias
 */
export interface ConfiguracionAlumno {
  notificacionesEmail: boolean
  recordatoriosClase: boolean
  alertasPaquete: boolean
}

/**
 * Historial de paquetes del alumno
 */
export interface PaqueteHistorial {
  idPaquete: string
  tipo: string
  clasesTotales: number
  clasesUsadas: number
  clasesRestantes: number
  fechaCompra: string
  fechaActivacion: string
  fechaVencimiento: string
  estado: 'activo' | 'agotado' | 'vencido' | 'congelado'
  monto?: number
}

/**
 * Documento descargable
 */
export interface DocumentoDescargable {
  id: string
  tipo: 'credencial' | 'recibo' | 'certificado'
  nombre: string
  descripcion: string
  fechaEmision: string
  url?: string
}

/**
 * Request para actualizar datos personales
 */
export interface UpdateDatosPersonalesRequest {
  nombreCompleto: string
  telefono: string
}

/**
 * Request para actualizar contacto de emergencia
 */
export interface UpdateContactoEmergenciaRequest {
  nombreCompleto: string
  telefono: string
  relacion: string
}

/**
 * Request para actualizar configuración
 */
export interface UpdateConfiguracionRequest {
  notificacionesEmail: boolean
  recordatoriosClase: boolean
  alertasPaquete: boolean
}
