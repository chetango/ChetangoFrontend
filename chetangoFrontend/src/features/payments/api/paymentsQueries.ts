// ============================================
// PAYMENT API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
    PaginatedPayments,
    Payment,
    PaymentDetail,
    PaymentFilters,
    PaymentMethod,
    PaymentStats,
    RegisterPaymentRequest,
    UpdatePaymentRequest,
    VerifyPaymentRequest,
} from '../types/payment.types'

// Query Keys
export const paymentsKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentsKeys.all, 'list'] as const,
  list: (filters: PaymentFilters) => [...paymentsKeys.lists(), filters] as const,
  details: () => [...paymentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
  stats: () => [...paymentsKeys.all, 'stats'] as const,
  methods: () => [...paymentsKeys.all, 'methods'] as const,
  pending: () => [...paymentsKeys.all, 'pending'] as const,
  verified: () => [...paymentsKeys.all, 'verified'] as const,
  allVerified: () => [...paymentsKeys.all, 'all-verified'] as const,
}

// GET /api/pagos - Listar pagos con filtros
export const usePaymentsQuery = (filters: PaymentFilters = {}) => {
  return useQuery({
    queryKey: paymentsKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.idAlumno) params.append('idAlumno', filters.idAlumno)
      if (filters.metodoPago) params.append('metodoPago', filters.metodoPago)
      if (filters.estado) params.append('estado', filters.estado)
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())

      const { data } = await httpClient.get<PaginatedPayments>(`/api/pagos?${params}`)
      return data
    },
  })
}

// GET /api/pagos/pendientes - Pagos pendientes de verificación
export const usePendingPaymentsQuery = () => {
  return useQuery({
    queryKey: paymentsKeys.pending(),
    queryFn: async () => {
      const { data } = await httpClient.get<Payment[]>('/api/pagos/pendientes')
      return data
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
  })
}

// GET /api/pagos/verificados-hoy - Pagos verificados hoy
export const useVerifiedPaymentsQuery = () => {
  return useQuery({
    queryKey: paymentsKeys.verified(),
    queryFn: async () => {
      const { data } = await httpClient.get<Payment[]>('/api/pagos/verificados-hoy')
      return data
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
  })
}

// GET /api/pagos/verificados - Todos los pagos verificados (historial)
export const useAllVerifiedPaymentsQuery = () => {
  return useQuery({
    queryKey: paymentsKeys.allVerified(),
    queryFn: async () => {
      const { data } = await httpClient.get<Payment[]>('/api/pagos/verificados')
      return data
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
  })
}

// GET /api/pagos/{id} - Detalle de pago
export const usePaymentDetailQuery = (id: string) => {
  return useQuery({
    queryKey: paymentsKeys.detail(id),
    queryFn: async () => {
      const { data } = await httpClient.get<PaymentDetail>(`/api/pagos/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// GET /api/pagos/estadisticas - Estadísticas
export const usePaymentStatsQuery = () => {
  return useQuery({
    queryKey: paymentsKeys.stats(),
    queryFn: async () => {
      const { data } = await httpClient.get<PaymentStats>('/api/pagos/estadisticas')
      return data
    },
  })
}

// GET /api/pagos/metodos-pago - Métodos de pago disponibles
export const usePaymentMethodsQuery = () => {
  return useQuery({
    queryKey: paymentsKeys.methods(),
    queryFn: async () => {
      const { data } = await httpClient.get<PaymentMethod[]>('/api/pagos/metodos-pago')
      return data
    },
  })
}

// GET /api/tipos-paquete - Tipos de paquetes disponibles
export const usePackageTypesQuery = () => {
  return useQuery({
    queryKey: ['packageTypes'],
    queryFn: async () => {
      const { data } = await httpClient.get('/api/tipos-paquete')
      return data
    },
  })
}

// GET /api/alumnos/{idAlumno}/paquetes-sin-pago - Paquetes sin pago del alumno
export const usePackagesWithoutPaymentQuery = (idAlumno: string | null) => {
  return useQuery({
    queryKey: ['packagesWithoutPayment', idAlumno],
    queryFn: async () => {
      if (!idAlumno) return []
      const { data } = await httpClient.get(`/api/alumnos/${idAlumno}/paquetes-sin-pago`)
      return data
    },
    enabled: !!idAlumno,
  })
}

// POST /api/pagos - Registrar nuevo pago
export const useRegisterPaymentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: RegisterPaymentRequest) => {
      const { data } = await httpClient.post('/api/pagos', request)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.stats() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.verified() })
    },
  })
}

// POST /api/pagos/{id}/verificar - Verificar/Rechazar pago
export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: VerifyPaymentRequest) => {
      const { data } = await httpClient.post(`/api/pagos/${request.idPago}/verificar`, request)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.pending() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.verified() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.allVerified() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.stats() })
    },
  })
}

// PUT /api/pagos/{id} - Actualizar pago
export const useUpdatePaymentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: UpdatePaymentRequest) => {
      const { data } = await httpClient.put(`/api/pagos/${request.idPago}`, request)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.detail(variables.idPago) })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.pending() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.verified() })
    },
  })
}

// DELETE /api/pagos/{id} - Eliminar pago
export const useDeletePaymentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await httpClient.delete(`/api/pagos/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentsKeys.stats() })
    },
  })
}
