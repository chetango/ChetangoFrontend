import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { UserType } from '@/features/auth/types/authTypes'

// QUERY KEYS
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
  session: ['auth', 'session'] as const,
} as const

// API ENDPOINTS
const AUTH_ENDPOINTS = {
  PROFILE: '/auth/profile',
  SESSION: '/auth/session',
} as const

// TYPES
interface ProfileResponse {
  user: UserType
  permissions: string[]
}

interface SessionResponse {
  isValid: boolean
  expiresAt: string
}

// QUERIES
export const useProfileQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async (): Promise<ProfileResponse> => {
      const response = await httpClient.get(AUTH_ENDPOINTS.PROFILE)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

export const useSessionQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: async (): Promise<SessionResponse> => {
      const response = await httpClient.get(AUTH_ENDPOINTS.SESSION)
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  })
}

// MUTATIONS
export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await httpClient.post('/auth/logout')
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })
}