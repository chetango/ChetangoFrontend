// ============================================
// COMPLIANCE - API MUTATIONS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMPLIANCE_QUERY_KEYS } from './complianceQueries'
import type { AceptarDocumentosRequest, AceptarDocumentosResult } from '../types/compliance.types'

// ============================================
// MUTATION: Aceptar documentos legales
// ============================================
export const useAceptarDocumentosMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: AceptarDocumentosRequest) => {
      const { data } = await httpClient.post<AceptarDocumentosResult>(
        '/api/compliance/aceptar',
        request
      )
      return data
    },
    onSuccess: () => {
      // Invalidar el estado para que se recargue y refleje los documentos aceptados
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.estado })
      queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.historial })
    },
  })
}
