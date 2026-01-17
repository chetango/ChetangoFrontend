import type { AccountInfo } from '@azure/msal-browser'

// TIPOS DE USUARIO
export interface UserType {
  id: string
  email: string
  name: string
  givenName?: string
  familyName?: string
  roles: string[]
}

// TIPOS DE SESIÓN
export interface SessionType {
  user: UserType | null
  isAuthenticated: boolean
}

// ESTADO DE AUTENTICACIÓN
export interface AuthStateType {
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

// CONTEXTO DE AUTENTICACIÓN
export interface AuthContextType {
  session: SessionType
  authState: AuthStateType
  status: 'unknown' | 'unauthenticated' | 'authenticated'
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string | null>
}

// Decodificar JWT para obtener claims (sin verificar firma)
const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// Obtener roles del access token en sessionStorage
const getRolesFromAccessToken = (clientId: string): string[] => {
  try {
    // Buscar el access token en sessionStorage
    const keys = Object.keys(sessionStorage)
    const accessTokenKey = keys.find(
      (key) => key.includes('accesstoken') && key.includes(clientId)
    )
    
    if (!accessTokenKey) return []
    
    const tokenData = JSON.parse(sessionStorage.getItem(accessTokenKey) || '{}')
    if (!tokenData.secret) return []
    
    const decoded = decodeJwt(tokenData.secret)
    return (decoded?.roles as string[]) || []
  } catch {
    return []
  }
}

// UTILIDAD PARA CONVERTIR ACCOUNT INFO
export const mapAccountToUser = (account: AccountInfo): UserType => {
  try {
    // Intentar obtener roles del idToken primero, luego del accessToken
    let roles = (account.idTokenClaims?.roles as string[]) || []
    
    // Si no hay roles en el idToken, buscar en el accessToken
    if (roles.length === 0) {
      // El clientId está en el environment
      const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID || ''
      roles = getRolesFromAccessToken(clientId)
    }
    
    return {
      id: account.localAccountId,
      email: account.username,
      name: account.name || account.username,
      givenName: account.idTokenClaims?.given_name as string,
      familyName: account.idTokenClaims?.family_name as string,
      roles,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth] Error mapping account to user:', errorMessage)
    }
    throw new Error(`Failed to map account to user: ${errorMessage}`)
  }
}
