// ============================================
// RUTAS Y ENDPOINTS - CHETANGO
// ============================================

// RUTAS DEL FRONTEND
export const ROUTES = {
  // PÚBLICAS
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  
  // AUTENTICACIÓN MSAL
  AUTH_CALLBACK: '/auth/callback',
  AUTH_LOGOUT: '/auth/logout',
  
  // DASHBOARD COMÚN
  DASHBOARD: '/dashboard',
  
  // RUTAS DE ADMIN
  ADMIN: {
    ROOT: '/admin',
    ATTENDANCE: '/admin/attendance',
    ATTENDANCE_CORRECTION: '/admin/attendance/correction',
    ATTENDANCE_LIST: '/admin/attendance/list',
    ATTENDANCE_REGISTER: '/admin/attendance/register',
    ATTENDANCE_REPORTS: '/admin/attendance/reports',
    
    USERS: '/admin/users',
    USERS_LIST: '/admin/users/list',
    USERS_CREATE: '/admin/users/create',
    USERS_EDIT: (id: string) => `/admin/users/${id}/edit`,
    
    PAYMENTS: '/admin/payments',
    PAYMENTS_LIST: '/admin/payments/list',
    PAYMENTS_CREATE: '/admin/payments/create',
    PAYMENTS_HISTORY: '/admin/payments/history',
    
    CLASSES: '/admin/classes',
    CLASSES_LIST: '/admin/classes/list',
    CLASSES_CREATE: '/admin/classes/create',
    CLASSES_SCHEDULE: '/admin/classes/schedule',
    
    PACKAGES: '/admin/paquetes',
    
    PAYROLL: '/admin/payroll',
    
    REPORTS: '/admin/reports',
    REPORTS_ATTENDANCE: '/admin/reports/attendance',
    REPORTS_PAYMENTS: '/admin/reports/payments',
    REPORTS_USERS: '/admin/reports/users',
    
    SETTINGS: '/admin/settings',
    SETTINGS_SYSTEM: '/admin/settings/system',
    SETTINGS_ROLES: '/admin/settings/roles',
    
    PROFILE: '/admin/profile',
    NOTIFICATIONS: '/admin/notifications',
  },
  
  // RUTAS DE ESTUDIANTE
  STUDENT: {
    ROOT: '/student',
    ATTENDANCE: '/student/attendance',
    ATTENDANCE_HISTORY: '/student/attendance/history',
    
    PAYMENTS: '/student/payments',
    PAYMENTS_HISTORY: '/student/payments/history',
    
    CLASSES: '/student/classes',
    CLASSES_SCHEDULE: '/student/classes/schedule',
    
    PROFILE: '/student/profile',
    PROFILE_EDIT: '/student/profile/edit',
  },
  
  // RUTAS DE PROFESOR
  TEACHER: {
    ROOT: '/profesor',
    ATTENDANCE: '/profesor/attendance',
    ATTENDANCE_REGISTER: '/profesor/attendance/register',
    
    CLASSES: '/profesor/classes',
    CLASSES_MY: '/profesor/classes/my',
    CLASSES_SCHEDULE: '/profesor/classes/schedule',
    
    PAYMENTS: '/profesor/payments',
    
    REPORTS: '/profesor/reports',
    REPORTS_MY_CLASSES: '/profesor/reports/my-classes',
    
    PROFILE: '/profesor/profile',
  },
  
  // RUTAS COMPARTIDAS (ACCESO SEGÚN ROL)
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
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
    '/admin',
    '/admin/*',
  ],
  STUDENT_ONLY: [
    '/student',
    '/student/*',
  ],
  TEACHER_ONLY: [
    '/profesor',
    '/profesor/*',
  ],
  ALL_AUTHENTICATED: [
    ROUTES.DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.NOTIFICATIONS,
  ],
} as const

// HELPER PARA VERIFICAR ACCESO A RUTAS
export const ROUTE_ACCESS = {
  // Rutas que requieren rol específico
  requiresRole: (path: string): string[] | null => {
    if (path.startsWith('/admin')) return ['admin']
    if (path.startsWith('/student')) return ['alumno']
    if (path.startsWith('/profesor')) return ['profesor']
    return null
  },
  
  // Rutas accesibles para cualquier usuario autenticado
  isPublicAuthenticated: (path: string): boolean => {
    return PROTECTED_ROUTES.ALL_AUTHENTICATED.includes(path as any)
  },
  
  // Obtener ruta por defecto según rol
  getDefaultRoute: (roles: string[]): string => {
    if (roles.includes('admin')) return ROUTES.ADMIN.ROOT
    if (roles.includes('alumno')) return ROUTES.STUDENT.ROOT
    if (roles.includes('profesor')) return ROUTES.TEACHER.ROOT
    return ROUTES.DASHBOARD
  },
} as const