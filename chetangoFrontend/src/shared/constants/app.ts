// ============================================
// CONSTANTES DE APLICACIÓN - CHETANGO
// ============================================

// INFORMACIÓN DE LA APP
export const APP_CONFIG = {
  NAME: 'Chetango',
  DESCRIPTION: 'Sistema de gestión para academia de tango',
  VERSION: '1.0.0',
  AUTHOR: 'Chetango Team',
} as const

// ROLES DE USUARIO (unificados)
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER', 
  STUDENT: 'STUDENT',
} as const

// CONFIGURACIÓN MSAL (movido desde authConstants)
export const MSAL_CONFIG = {
  TENANT_ID: import.meta.env.VITE_ENTRA_TENANT_ID,
  CLIENT_ID: import.meta.env.VITE_ENTRA_CLIENT_ID,
  AUTHORITY: import.meta.env.VITE_ENTRA_AUTHORITY,
  REDIRECT_URI: import.meta.env.VITE_ENTRA_REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI: import.meta.env.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI,
  SCOPES: import.meta.env.VITE_ENTRA_SCOPES?.split(',') || ['openid', 'profile', 'email'],
} as const

// CLAIMS Y ROLES (movido desde authConstants)
export const AUTH_CLAIMS = {
  EMAIL: 'email',
  NAME: 'name',
  GIVEN_NAME: 'given_name',
  FAMILY_NAME: 'family_name',
  OBJECT_ID: 'oid',
  ROLES: 'roles',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// ESTADOS DE ASISTENCIA
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
} as const

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]

// ESTADOS DE PAGO
export const PAYMENT_STATUS = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]

// TIPOS DE ALERTA
export const ALERT_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const

export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES]

// FORMATOS DE FECHA
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
} as const

// LÍMITES DE ARCHIVO
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
} as const

// PAGINACIÓN
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const

// TIMEOUTS Y DURACIONES
export const TIMEOUTS = {
  API_REQUEST: 10000,        // 10 segundos
  SESSION: 30 * 60 * 1000,   // 30 minutos
  TOAST_DURATION: 5000,      // 5 segundos
  DEBOUNCE_SEARCH: 300,      // 300ms
} as const