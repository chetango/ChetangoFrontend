// ============================================
// ALUMNO TYPES - CONFIRMACIÓN DE ASISTENCIA
// ============================================

export interface AsistenciaPendiente {
  idAsistencia: string
  idClase: string
  nombreClase: string
  fechaClase: string
  horaInicio: string
  horaFin: string
  profesores: string[]
}
