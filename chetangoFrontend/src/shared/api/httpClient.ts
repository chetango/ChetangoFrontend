import axios from 'axios'
import { ENV_CONFIG } from '@/shared/constants/env'

// HTTP CLIENT BASE CONFIGURATION
const httpClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Basic error handling (auth interceptor will be added by AuthProvider)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging with sanitization
    if (process.env.NODE_ENV === 'development') {
      const errorData = error.response?.data || error.message || 'Unknown error'
    }
    return Promise.reject(error)
  }
)

export { httpClient }