// ============================================
// PAYMENTS QUERIES - REACT QUERY
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type {
    MetodoPago,
    PaginatedPayments,
    PagoDetalle,
    PaymentFilters,
    PaymentStats,
} from '../types/payments.types'

// ============================================
// QUERY KEYS
// ============================================

export const paymentsKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentsKeys.all, 'list'] as const,
  list: (filters: PaymentFilters) => [...paymentsKeys.lists(), filters] as const,
  details: () => [...paymentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
  stats: () => [...paymentsKeys.all, 'stats'] as const,
  methods: () => [...paymentsKeys.all, 'methods'] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Obtiene la lista paginada de pagos del alumno autenticado
 * GET /api/mis-pagos
 */
export function useMyPaymentsQuery(filters: PaymentFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: paymentsKeys.list(filters),
    queryFn: async (): Promise<PaginatedPayments> => {
      const params = new URLSearchParams()
      
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
      if (filters.idMetodoPago) params.append('idMetodoPago', filters.idMetodoPago)
      params.append('pageNumber', filters.pageNumber.toString())
      params.append('pageSize', filters.pageSize.toString())

      const response = await httpClient.get<PaginatedPayments>(
        `/api/mis-pagos?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
  })
}

/**
 * Obtiene el detalle completo de un pago específico
 * GET /api/pagos/{id}
 */
export function usePaymentDetailQuery(idPago: string, enabled: boolean = true) {
  return useQuery({
    queryKey: paymentsKeys.detail(idPago),
    queryFn: async (): Promise<PagoDetalle> => {
      const response = await httpClient.get<PagoDetalle>(`/api/pagos/${idPago}`)
      return response.data
    },
    enabled: enabled && !!idPago,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  })
}

/**
 * Obtiene los métodos de pago disponibles
 * GET /api/pagos/metodos-pago
 */
export function useMetodosPagoQuery() {
  return useQuery({
    queryKey: paymentsKeys.methods(),
    queryFn: async (): Promise<MetodoPago[]> => {
      const response = await httpClient.get<MetodoPago[]>('/api/pagos/metodos-pago')
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutos (catálogo estático)
    retry: 1,
  })
}

/**
 * Calcula estadísticas de pagos del alumno
 * (calculado del lado del cliente con los datos de la lista)
 */
export function usePaymentStats(payments: PaginatedPayments | undefined): PaymentStats {
  if (!payments || payments.items.length === 0) {
    return {
      totalPagado: 0,
      cantidadPagos: 0,
      promedioMonto: 0,
    }
  }

  const totalPagado = payments.items.reduce((sum, pago) => sum + pago.montoTotal, 0)
  const cantidadPagos = payments.totalCount // Total real, no solo de la página actual
  const promedioMonto = cantidadPagos > 0 ? totalPagado / payments.items.length : 0

  return {
    totalPagado,
    cantidadPagos,
    promedioMonto,
  }
}
