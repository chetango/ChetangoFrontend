import type { AxiosInstance } from 'axios'
import { setupAuthInterceptor } from './authInterceptor'
import { setupErrorInterceptor } from './errorInterceptor'

interface InterceptorsConfig {
  msalInstance: any
  accounts: any
  tokenRequest: any
}

export const setupInterceptors = (
  httpClient: AxiosInstance,
  config: InterceptorsConfig
) => {
  const cleanups = [
    setupAuthInterceptor(httpClient, config),
    setupErrorInterceptor(httpClient),
  ]

  return () => {
    cleanups.forEach((cleanup) => cleanup())
  }
}

export { setupAuthInterceptor } from './authInterceptor'
export { 
  setupErrorInterceptor,
  ERROR_MESSAGES,
  CONTEXT_404_MESSAGES,
  get404Message,
  getErrorMessage,
  createApiError,
  type ApiError,
} from './errorInterceptor'
