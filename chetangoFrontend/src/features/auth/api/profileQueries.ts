// ============================================
// USER PROFILE QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'

// ============================================
// TYPES
// ============================================

/**
 * Response from GET /api/auth/me
 * Contains the authenticated user's profile information
 */
export interface UserProfileResponse {
  idUsuario: string
  nombre: string
  correo: string
  telefono: string
  roles: string[]
  idProfesor?: string | null
  idAlumno?: string | null
}

/**
 * Extended user profile with role-specific IDs
 * The backend now returns idProfesor and idAlumno directly
 */
export interface UserProfile {
  idUsuario: string
  nombre: string
  correo: string
  telefono: string
  roles: string[]
  /** ID to use when making alumno-specific API calls */
  idAlumno: string | null
  /** ID to use when making profesor-specific API calls */
  idProfesor: string | null
}

// ============================================
// QUERY KEYS
// ============================================

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Transforms API response to UserProfile
 * The backend now returns idProfesor and idAlumno directly
 */
function transformToUserProfile(response: UserProfileResponse): UserProfile {
  return {
    ...response,
    idAlumno: response.idAlumno ?? null,
    idProfesor: response.idProfesor ?? null,
  }
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches the authenticated user's profile
 * GET /api/auth/me
 * 
 * @param enabled - Whether the query should run (default: true)
 * @returns User profile with role-specific IDs
 * 
 * Requirements: 6.1 (Authorization header included via interceptor)
 */
export function useUserProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async (): Promise<UserProfile> => {
      const response = await httpClient.get<UserProfileResponse>('/api/auth/me')
      return transformToUserProfile(response.data)
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - profile doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: (failureCount, error) => {
      // Don't retry on 401 (will redirect to login) or 404 (user not found)
      const status = (error as { status?: number })?.status
      if (status === 401 || status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}
