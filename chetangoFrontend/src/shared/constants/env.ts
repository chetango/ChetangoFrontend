function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue
  
  if (!value) {
    throw new Error(`Variable de entorno requerida no encontrada: ${key}`)
  }
  
  return value
}

function getEnvVarOptional(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue
}

function getEnvVarBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const ENV_CONFIG = {
  // API
  API_URL: getEnvVar('VITE_API_BASE_URL'),
  API_TIMEOUT: getEnvVarNumber('VITE_API_TIMEOUT', 10000),
  
  // AUTENTICACIÓN (MSAL maneja tokens automáticamente)
  TOKEN_EXPIRY: getEnvVarOptional('VITE_TOKEN_EXPIRY', '24h'),
  
  // APLICACIÓN
  APP_NAME: getEnvVarOptional('VITE_APP_NAME', 'Chetango'),
  APP_VERSION: getEnvVarOptional('VITE_APP_VERSION', '1.0.0'),
  APP_ENVIRONMENT: getEnvVarOptional('VITE_APP_ENVIRONMENT', 'development'),
  
  // FEATURES FLAGS
  ENABLE_DEVTOOLS: getEnvVarBoolean('VITE_ENABLE_DEVTOOLS', true),
  ENABLE_ANALYTICS: getEnvVarBoolean('VITE_ENABLE_ANALYTICS', false),
  ENABLE_NOTIFICATIONS: getEnvVarBoolean('VITE_ENABLE_NOTIFICATIONS', true),
  
  // LÍMITES
  MAX_FILE_SIZE: getEnvVarNumber('VITE_MAX_FILE_SIZE', 5242880), // 5MB
  PAGINATION_SIZE: getEnvVarNumber('VITE_PAGINATION_SIZE', 20),
  SESSION_TIMEOUT: getEnvVarNumber('VITE_SESSION_TIMEOUT', 1800000), // 30min
  
  // INTEGRACIÓN EXTERNA (Futuro)
  PAYMENT_GATEWAY_URL: getEnvVarOptional('VITE_PAYMENT_GATEWAY_URL'),
  EMAIL_SERVICE_URL: getEnvVarOptional('VITE_EMAIL_SERVICE_URL'),
  STORAGE_URL: getEnvVarOptional('VITE_STORAGE_URL'),
} as const

// ============================================
// VALIDACIONES DE ENTORNO
// ============================================

export function validateEnvironment(): void {
  const requiredVars = [
    'VITE_API_BASE_URL',
  ]
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0) {
    throw new Error(
      `Variables de entorno requeridas faltantes: ${missing.join(', ')}\n` +
      'Asegúrate de tener un archivo .env.local con todas las variables necesarias.'
    )
  }
}

// ============================================
// HELPERS DE ENTORNO
// ============================================

export const IS_DEVELOPMENT = ENV_CONFIG.APP_ENVIRONMENT === 'development'
export const IS_PRODUCTION = ENV_CONFIG.APP_ENVIRONMENT === 'production'
export const IS_TEST = ENV_CONFIG.APP_ENVIRONMENT === 'test'

// Validar entorno al importar este módulo
if (IS_DEVELOPMENT || IS_PRODUCTION) {
  validateEnvironment()
}