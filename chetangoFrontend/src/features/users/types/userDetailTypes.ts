// ============================================
// USER DETAIL TYPES - FULL PROFILE DATA
// ============================================

/**
 * Tipos para el detalle completo de alumno
 * GET /api/alumnos/{id}/detail
 */
export interface AlumnoDetailDTO {
  idAlumno: string
  idUsuario: string
  nombre: string
  correo: string
  telefono: string | null
  documento: string
  tipoDocumento: string
  direccion: string | null
  fechaNacimiento: string | null
  estado: string
  fechaRegistro: string
  paquetesActivos: number
  clasesTomadas: number
  asistenciaPromedio: number
  ultimoPago: AlumnoDetailUltimoPagoDTO | null
  paquetesActivosDetalle: PaqueteActivoDTO[]
}

export interface AlumnoDetailUltimoPagoDTO {
  idPago: string
  monto: number
  fecha: string
  concepto: string
  metodoPago: string
}

export interface PaqueteActivoDTO {
  idPaquete: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaVencimiento: string | null
}

/**
 * Tipos para el detalle completo de profesor
 * GET /api/profesores/{id}/detail
 */
export interface ProfesorDetailDTO {
  idProfesor: string
  idUsuario: string
  nombre: string
  correo: string
  telefono: string | null
  documento: string
  tipoDocumento: string
  direccion: string | null
  fechaNacimiento: string | null
  tipoProfesor: string
  estado: string
  fechaRegistro: string
  clasesAsignadas: number
  clasesImpartidas: number
  ultimaNomina: ProfesorDetailUltimaNominaDTO | null
  proximasClases: ProfesorDetailClaseProximaDTO[]
}

export interface ProfesorDetailUltimaNominaDTO {
  idNomina: string
  montoTotal: number
  periodo: string
  estado: string
}

export interface ProfesorDetailClaseProximaDTO {
  idClase: string
  fecha: string
  horaInicio: string
  horaFin: string
  tipoClase: string
  alumnosInscritos: number
}
