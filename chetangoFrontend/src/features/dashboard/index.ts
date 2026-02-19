// ============================================
// DASHBOARD FEATURE - Index
// ============================================

export * from './api/dashboardQueries'
export * from './components'
export * from './hooks/useDashboard'
export * from './types/dashboard.types'

// Explicit exports for better IDE support
export { FinancialDesgloseSede } from './components/FinancialDesgloseSede'
export { TabsSedeFilter } from './components/TabsSedeFilter'
export type { SedeFilter } from './components/TabsSedeFilter'

