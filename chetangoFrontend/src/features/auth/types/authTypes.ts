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
  accessToken: string | null
  expiresAt: number | null
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

// UTILIDAD PARA CONVERTIR ACCOUNT INFO
export const mapAccountToUser = (account: AccountInfo): UserType => ({
  id: account.localAccountId,
  email: account.username,
  name: account.name || account.username,
  givenName: account.idTokenClaims?.given_name as string,
  familyName: account.idTokenClaims?.family_name as string,
  roles: (account.idTokenClaims?.roles as string[]) || [],
})