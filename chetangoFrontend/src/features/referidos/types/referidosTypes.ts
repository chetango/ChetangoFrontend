// ============================================
// REFERIDOS TYPES - Programa "Invita un Amigo"
// ============================================

// ============================================
// RESPONSE TYPES
// ============================================

export interface CodigoReferidoDTO {
  idCodigo: string
  codigo: string // Formato: NOMBRE2026XX (ej: JUAN2645)
  activo: boolean
  vecesUsado: number
  beneficioReferidor: string // "1 clase gratis"
  beneficioNuevoAlumno: string // "10% descuento en primer paquete"
  fechaCreacion: string
}

export interface GenerarCodigoReferidoResponse {
  idCodigo: string
  codigo: string
  activo: boolean
  vecesUsado: number
  beneficioReferidor: string
  beneficioNuevoAlumno: string
  fechaCreacion: string
}
