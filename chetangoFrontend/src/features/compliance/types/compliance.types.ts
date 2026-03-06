// ============================================
// COMPLIANCE - TYPES
// ============================================
// Coinciden exactamente con los DTOs del backend

export interface DocumentoPendienteDto {
  versionId: string
  codigo: string
  nombre: string
  descripcion: string
  numeroVersion: string
  urlDocumento: string
  esObligatorio: boolean
}

export interface EstadoCumplimientoDto {
  tenantId: string
  nombreAcademia: string
  onboardingCompletado: boolean
  requiereReaceptacion: boolean
  fechaActivacion: string | null
  documentosPendientes: DocumentoPendienteDto[]
  /** Computed: !documentosPendientes.length && onboardingCompletado */
  puedeOperar: boolean
}

export interface AceptacionDocumentoDto {
  id: string
  codigoDocumento: string
  nombreDocumento: string
  numeroVersion: string
  fechaAceptacion: string
  ipOrigen: string
  contexto: string
}

export interface AceptarDocumentosRequest {
  versionesDocumentoLegalIds: string[]
  contexto?: string
}

export interface AceptarDocumentosResult {
  onboardingCompletado: boolean
  documentosRegistrados: number
}
