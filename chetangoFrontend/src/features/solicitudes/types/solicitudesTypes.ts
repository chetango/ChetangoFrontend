// ============================================
// SOLICITUDES TYPES
// ============================================

// ============================================
// REQUEST TYPES
// ============================================

export interface SolicitarRenovacionPaqueteRequest {
  idTipoPaqueteDeseado?: string | null
  mensajeAlumno?: string | null
}

export interface SolicitarClasePrivadaRequest {
  idTipoClaseDeseado?: string | null
  fechaPreferida?: string | null // ISO 8601 date
  horaPreferida?: string | null // HH:mm:ss
  observacionesAlumno?: string | null
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface SolicitarRenovacionPaqueteResponse {
  idSolicitud: string
}

export interface SolicitarClasePrivadaResponse {
  idSolicitud: string
}

export interface SolicitudRenovacionPaqueteDTO {
  idSolicitud: string
  idAlumno: string
  nombreAlumno: string
  correoAlumno: string
  idPaqueteActual?: string | null
  tipoPaqueteActual?: string | null
  clasesRestantes?: number | null
  tipoPaqueteDeseado: string
  mensajeAlumno?: string | null
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Completada'
  fechaSolicitud: string
  fechaRespuesta?: string | null
  mensajeRespuesta?: string | null
}

export interface SolicitudClasePrivadaDTO {
  idSolicitud: string
  idAlumno: string
  nombreAlumno: string
  correoAlumno: string
  tipoClaseDeseado: string
  fechaPreferida?: string | null
  horaPreferida?: string | null
  observacionesAlumno?: string | null
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Agendada'
  fechaSolicitud: string
  fechaRespuesta?: string | null
  mensajeRespuesta?: string | null
}
