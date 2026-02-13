// ============================================
// USERS API QUERIES - REACT QUERY
// ============================================

import { httpClient as api } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
    ActivateUserRequest,
    CreateUserRequest,
    DeleteUserRequest,
    PaginatedUsers,
    PaginatedUsersBackend,
    UpdateUserRequest,
    UserDetail,
    UserFilters,
} from '../types/user.types'

// ============================================
// QUERY KEYS
// ============================================

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Get paginated users with filters
 */
export const useUsersQuery = (filters: UserFilters) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.busqueda) params.append('busqueda', filters.busqueda)
      if (filters.rol && filters.rol !== 'todos') params.append('rol', filters.rol)
      if (filters.estado && filters.estado !== 'todos') params.append('estado', filters.estado)
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString())
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())

      const response = await api.get<PaginatedUsersBackend>(`/api/usuarios?${params.toString()}`)
      
      // Transform backend response to frontend format
      return {
        items: response.data.usuarios,
        totalCount: response.data.totalItems,
        pageNumber: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      } as PaginatedUsers
    },
  })
}

/**
 * Get user detail by ID
 */
export const useUserDetailQuery = (id: string) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<UserDetail>(`/api/usuarios/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create new user
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await api.post('/api/usuarios', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

/**
 * Activate user with Azure credentials
 */
export const useActivateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ActivateUserRequest) => {
      const response = await api.post(`/api/usuarios/${data.idUsuario}/activar`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.idUsuario) })
    },
  })
}

/**
 * Update user
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await api.put(`/api/usuarios/${data.idUsuario}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.idUsuario) })
    },
  })
}

/**
 * Delete (deactivate) user
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DeleteUserRequest) => {
      const response = await api.delete(`/api/usuarios/${data.idUsuario}`, { data })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}
