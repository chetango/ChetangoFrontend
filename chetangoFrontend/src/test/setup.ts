// ============================================
// SETUP DE TESTING - CHETANGO
// ============================================

import '@testing-library/jest-dom'

// Mock de variables de entorno para testing
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'http://localhost:3000/api',
    VITE_JWT_SECRET_KEY: 'test-secret',
    VITE_APP_ENVIRONMENT: 'test',
    VITE_ENABLE_DEVTOOLS: 'false',
  },
  writable: true,
})

// Mock de ResizeObserver (necesario para algunos componentes)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock de matchMedia (necesario para responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})