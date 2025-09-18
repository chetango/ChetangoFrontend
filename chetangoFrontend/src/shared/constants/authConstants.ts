// ============================================
// CONSTANTES DE AUTENTICACIÓN - MICROSOFT ENTRA
// ============================================

// CONFIGURACIÓN MSAL
export const MSAL_CONFIG = {
  TENANT_ID: import.meta.env.VITE_ENTRA_TENANT_ID,
  CLIENT_ID: import.meta.env.VITE_ENTRA_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_ENTRA_REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI: import.meta.env.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI,
  SCOPES: import.meta.env.VITE_ENTRA_SCOPES?.split(',') || ['openid', 'profile', 'email'],
} as const

// RUTAS DE AUTENTICACIÓN
export const AUTH_ROUTES = {
  LOGIN: '/login',
  CALLBACK: '/auth/callback',
  LOGOUT: '/auth/logout',
  DASHBOARD: '/dashboard',
} as const

// CLAIMS Y ROLES
export const AUTH_CLAIMS = {
  EMAIL: 'email',
  NAME: 'name',
  GIVEN_NAME: 'given_name',
  FAMILY_NAME: 'family_name',
  OBJECT_ID: 'oid',
  ROLES: 'roles',
} as const

// ROLES DE USUARIO
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const