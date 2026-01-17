// ============================================
// UNIT TESTS - CLASS QUERIES
// ============================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { httpClient } from '@/shared/api/httpClient'
import {
  classKeys,
  useTiposClaseQuery,
  useProfesoresQuery,
} from '../api/classQueries'
import type { TipoClaseDTO, ProfesorDTO } from '../types/classTypes'

// Mock httpClient
vi.mock('@/shared/api/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  })
}

// Wrapper component for React Query
function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('classKeys', () => {
  it('should generate correct query keys for tiposClase', () => {
    const key = classKeys.tiposClase()
    expect(key).toEqual(['classes', 'tipos-clase'])
  })

  it('should generate correct query keys for profesores', () => {
    const key = classKeys.profesores()
    expect(key).toEqual(['classes', 'profesores'])
  })

  it('should generate correct query keys for clasesByProfesor', () => {
    const params = { fechaDesde: '2024-01-01', pagina: 1 }
    const key = classKeys.clasesByProfesor('profesor-123', params)
    expect(key).toEqual(['classes', 'by-profesor', 'profesor-123', params])
  })

  it('should generate correct query keys for claseDetail', () => {
    const key = classKeys.claseDetail('clase-456')
    expect(key).toEqual(['classes', 'detail', 'clase-456'])
  })
})

describe('useTiposClaseQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch tipos de clase from /api/tipos-clase', async () => {
    const mockTiposClase: TipoClaseDTO[] = [
      { id: '1', nombre: 'Tango' },
      { id: '2', nombre: 'Milonga' },
    ]

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockTiposClase })

    const { result } = renderHook(() => useTiposClaseQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(httpClient.get).toHaveBeenCalledWith('/api/tipos-clase')
    expect(result.current.data).toEqual(mockTiposClase)
  })

  it('should handle empty response', async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useTiposClaseQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('should handle API error', async () => {
    const error = new Error('Network error')
    vi.mocked(httpClient.get).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useTiposClaseQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })
})

describe('useProfesoresQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch profesores from /api/profesores', async () => {
    const mockProfesores: ProfesorDTO[] = [
      { idProfesor: '1', nombreCompleto: 'Juan Pérez', tipoProfesor: 'Titular' },
      { idProfesor: '2', nombreCompleto: 'María García', tipoProfesor: 'Monitor' },
    ]

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockProfesores })

    const { result } = renderHook(() => useProfesoresQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(httpClient.get).toHaveBeenCalledWith('/api/profesores')
    expect(result.current.data).toEqual(mockProfesores)
  })

  it('should return profesores with correct tipoProfesor values', async () => {
    const mockProfesores: ProfesorDTO[] = [
      { idProfesor: '1', nombreCompleto: 'Juan Pérez', tipoProfesor: 'Titular' },
      { idProfesor: '2', nombreCompleto: 'María García', tipoProfesor: 'Monitor' },
    ]

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockProfesores })

    const { result } = renderHook(() => useProfesoresQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    result.current.data?.forEach((profesor) => {
      expect(['Titular', 'Monitor']).toContain(profesor.tipoProfesor)
    })
  })

  it('should handle empty response', async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: [] })

    const { result } = renderHook(() => useProfesoresQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('should handle API error', async () => {
    const error = new Error('Network error')
    vi.mocked(httpClient.get).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useProfesoresQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })
})
