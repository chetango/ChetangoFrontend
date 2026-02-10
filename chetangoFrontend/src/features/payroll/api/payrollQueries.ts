// ============================================
// PAYROLL API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient';
import { useQuery } from '@tanstack/react-query';
import type {
    ClaseProfesor,
    ClaseRealizada,
    LiquidacionDetalle,
    ResumenProfesor,
} from '../types/payroll.types';

// Query Keys
export const payrollKeys = {
  all: ['payroll'] as const,
  clasesRealizadas: (filters?: { fechaDesde?: string; fechaHasta?: string; idProfesor?: string; estadoPago?: string }) => 
    [...payrollKeys.all, 'clases-realizadas', filters] as const,
  clasesAprobadas: (idProfesor: string, mes: number, año: number) => 
    [...payrollKeys.all, 'clases-aprobadas', idProfesor, mes, año] as const,
  resumen: (idProfesor?: string) => 
    [...payrollKeys.all, 'resumen', idProfesor] as const,
  liquidacion: (params: { idLiquidacion?: string; idProfesor?: string; mes?: number; año?: number }) => 
    [...payrollKeys.all, 'liquidacion', params] as const,
}

// GET /api/nomina/clases-realizadas - Obtener clases realizadas con información de pago
export const useClasesRealizadasQuery = (filters?: {
  fechaDesde?: string
  fechaHasta?: string
  idProfesor?: string
  estadoPago?: string
}) => {
  return useQuery({
    queryKey: payrollKeys.clasesRealizadas(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
      if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
      if (filters?.idProfesor) params.append('idProfesor', filters.idProfesor)
      if (filters?.estadoPago) params.append('estadoPago', filters.estadoPago)

      const { data } = await httpClient.get<ClaseRealizada[]>(`/api/nomina/clases-realizadas?${params}`)
      return data
    },
  })
}

// GET /api/nomina/clases-aprobadas - Obtener clases aprobadas de un profesor para un mes
export const useClasesAprobadasQuery = (idProfesor: string, mes: number, año: number, enabled = true) => {
  return useQuery({
    queryKey: payrollKeys.clasesAprobadas(idProfesor, mes, año),
    queryFn: async () => {
      const params = new URLSearchParams({
        idProfesor,
        mes: mes.toString(),
        año: año.toString(),
      })

      const { data } = await httpClient.get<ClaseProfesor[]>(`/api/nomina/clases-aprobadas?${params}`)
      return data
    },
    enabled,
  })
}

// GET /api/nomina/resumen-profesores - Obtener resumen de pagos por profesor
export const useResumenProfesoresQuery = (idProfesor?: string) => {
  return useQuery({
    queryKey: payrollKeys.resumen(idProfesor),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (idProfesor) params.append('idProfesor', idProfesor)

      const { data } = await httpClient.get<ResumenProfesor[]>(`/api/nomina/resumen-profesores?${params}`)
      return data
    },
  })
}

// GET /api/nomina/liquidaciones-por-estado - Obtener liquidaciones por estado (admin)
export const useLiquidacionesPorEstadoQuery = (estado?: string, año?: number) => {
  return useQuery({
    queryKey: [...payrollKeys.all, 'liquidaciones-estado', estado, año] as const,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (estado) params.append('estado', estado)
      if (año) params.append('año', año.toString())

      const { data } = await httpClient.get<LiquidacionMensual[]>(`/api/nomina/liquidaciones-por-estado?${params}`)
      return data
    },
  })
}

// GET /api/nomina/liquidacion - Obtener detalle de liquidación mensual
export const useLiquidacionQuery = (params: {
  idLiquidacion?: string
  idProfesor?: string
  mes?: number
  año?: number
}, enabled = true) => {
  return useQuery({
    queryKey: payrollKeys.liquidacion(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.idLiquidacion) searchParams.append('idLiquidacion', params.idLiquidacion)
      if (params.idProfesor) searchParams.append('idProfesor', params.idProfesor)
      if (params.mes) searchParams.append('mes', params.mes.toString())
      if (params.año) searchParams.append('año', params.año.toString())

      const { data } = await httpClient.get<LiquidacionDetalle>(`/api/nomina/liquidacion?${searchParams}`)
      return data
    },
    enabled,
  })
}

// ============================================
// QUERIES ESPECÍFICAS PARA PROFESORES
// Endpoints que permiten a profesores consultar SOLO sus propios datos
// ============================================

// GET /api/nomina/mi-resumen - Obtener resumen del profesor autenticado
export const useMiResumenQuery = () => {
  return useQuery({
    queryKey: [...payrollKeys.all, 'mi-resumen'] as const,
    queryFn: async () => {
      const { data } = await httpClient.get<ResumenProfesor[]>('/api/nomina/mi-resumen')
      return data
    },
  })
}

// GET /api/nomina/mis-liquidaciones - Obtener liquidaciones del profesor autenticado
export const useMisLiquidacionesQuery = (params: {
  idLiquidacion?: string
  mes?: number
  año?: number
}, enabled = true) => {
  return useQuery({
    queryKey: [...payrollKeys.all, 'mis-liquidaciones', params] as const,
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.idLiquidacion) searchParams.append('idLiquidacion', params.idLiquidacion)
      if (params.mes) searchParams.append('mes', params.mes.toString())
      if (params.año) searchParams.append('año', params.año.toString())

      const { data } = await httpClient.get<LiquidacionDetalle>(`/api/nomina/mis-liquidaciones?${searchParams}`)
      return data
    },
    enabled,
  })
}

// GET /api/nomina/mis-liquidaciones-lista - Obtener lista de liquidaciones del profesor
export const useMisLiquidacionesListaQuery = (año?: number) => {
  return useQuery({
    queryKey: [...payrollKeys.all, 'mis-liquidaciones-lista', año] as const,
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (año) searchParams.append('año', año.toString())

      const { data } = await httpClient.get<LiquidacionMensual[]>(`/api/nomina/mis-liquidaciones-lista?${searchParams}`)
      return data
    },
  })
}

// ============================================
// QUERIES PARA ADMIN - DETALLE DE PROFESORES
// ============================================

// GET /api/nomina/clases-profesor/{idProfesor} - Obtener clases de un profesor con filtros
export const useClasesPorProfesorQuery = (params: {
  idProfesor: string
  fechaDesde?: string
  fechaHasta?: string
  estadoPago?: string
}, enabled = true) => {
  return useQuery({
    queryKey: [...payrollKeys.all, 'clases-profesor', params] as const,
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.fechaDesde) searchParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) searchParams.append('fechaHasta', params.fechaHasta)
      if (params.estadoPago) searchParams.append('estadoPago', params.estadoPago)

      const { data } = await httpClient.get<ClaseProfesor[]>(
        `/api/nomina/clases-profesor/${params.idProfesor}?${searchParams}`
      )
      return data
    },
    enabled,
  })
}
