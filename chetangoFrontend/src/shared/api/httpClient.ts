import axios from 'axios'
import { ENV_CONFIG } from '@/shared/constants/env'

const httpClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
})

// Request interceptor para agregar token
httpClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

// Response interceptor para manejo de errores
httpClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { httpClient }