// ============================================
// RUTAS Y ENDPOINTS - CHETANGO
// ============================================

// RUTAS DEL FRONTEND
export const ROUTES = {
  // PÚBLICAS
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  
  // DASHBOARD
  DASHBOARD: '/dashboard',
  
  // ASISTENCIA
  ATTENDANCE: '/attendance',
  ATTENDANCE_LIST: '/attendance/list',
  ATTENDANCE_REGISTER: '/attendance/register',
  ATTENDANCE_REPORTS: '/attendance/reports',
  
  // PAGOS
  PAYMENTS: '/payments',
  PAYMENTS_LIST: '/payments/list',
  PAYMENTS_CREATE: '/payments/create',
  PAYMENTS_HISTORY: '/payments/history',
  
  // USUARIOS
  USERS: '/users',
  USERS_LIST: '/users/list',
  USERS_CREATE: '/users/create',
  USERS_PROFILE: '/users/profile',
  
  // ALERTAS
  ALERTS: '/alerts',
  ALERTS_LIST: '/alerts/list',
  ALERTS_CREATE: '/alerts/create',
  
  // REPORTES
  REPORTS: '/reports',
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_PAYMENTS: '/reports/payments',
  REPORTS_USERS: '/reports/users',
  
  // CONFIGURACIÓN
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
} as const

// ENDPOINTS DEL BACKEND API
export const API_ENDPOINTS = {
  // AUTENTICACIÓN
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/verify',
  },
  
  // USUARIOS
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  
  // ASISTENCIA
  ATTENDANCE: {
    LIST: '/attendance',
    CREATE: '/attendance',
    GET_BY_ID: (id: string) => `/attendance/${id}`,
    UPDATE: (id: string) => `/attendance/${id}`,
    DELETE: (id: string) => `/attendance/${id}`,
    BY_USER: (userId: string) => `/attendance/user/${userId}`,
    BY_DATE: (date: string) => `/attendance/date/${date}`,
  },
  
  // PAGOS
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    GET_BY_ID: (id: string) => `/payments/${id}`,
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
    BY_USER: (userId: string) => `/payments/user/${userId}`,
    HISTORY: '/payments/history',
  },
  
  // ALERTAS
  ALERTS: {
    LIST: '/alerts',
    CREATE: '/alerts',
    GET_BY_ID: (id: string) => `/alerts/${id}`,
    UPDATE: (id: string) => `/alerts/${id}`,
    DELETE: (id: string) => `/alerts/${id}`,
    MARK_READ: (id: string) => `/alerts/${id}/read`,
  },
  
  // REPORTES
  REPORTS: {
    ATTENDANCE: '/reports/attendance',
    PAYMENTS: '/reports/payments',
    USERS: '/reports/users',
    EXPORT_PDF: '/reports/export/pdf',
    EXPORT_EXCEL: '/reports/export/excel',
  },
} as const

// PARÁMETROS DE QUERY COMUNES
export const QUERY_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SEARCH: 'search',
  SORT: 'sort',
  ORDER: 'order',
  FILTER: 'filter',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
} as const

// RUTAS PROTEGIDAS POR ROL
export const PROTECTED_ROUTES = {
  ADMIN_ONLY: [
    ROUTES.USERS_CREATE,
    ROUTES.SETTINGS,
    ROUTES.REPORTS,
  ],
  TEACHER_AND_ADMIN: [
    ROUTES.ATTENDANCE_REGISTER,
    ROUTES.PAYMENTS_CREATE,
    ROUTES.ALERTS_CREATE,
  ],
  ALL_AUTHENTICATED: [
    ROUTES.DASHBOARD,
    ROUTES.ATTENDANCE_LIST,
    ROUTES.PAYMENTS_LIST,
    ROUTES.USERS_PROFILE,
  ],
} as const