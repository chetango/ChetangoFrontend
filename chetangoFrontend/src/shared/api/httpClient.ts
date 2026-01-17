import axios from 'axios'
import { ENV_CONFIG } from '@/shared/constants/env'

// HTTP CLIENT BASE CONFIGURATION (Interceptors will be added by AuthProvider)
const httpClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { httpClient }