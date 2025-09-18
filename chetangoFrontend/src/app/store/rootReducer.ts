// ============================================
// ROOT REDUCER - CHETANGO
// ============================================

import { combineReducers } from '@reduxjs/toolkit'

// Importar slices cuando se implementen
import { authSlice } from '@/features/auth'
// import { attendanceSlice } from '@/features/attendance'
// import { classesSlice } from '@/features/classes'
// import { packagesSlice } from '@/features/packages'
// import { paymentsSlice } from '@/features/payments'
// import { schedulesSlice } from '@/features/schedules'
// import { usersSlice } from '@/features/users'
// import { alertsSlice } from '@/features/alerts'
// import { reportsSlice } from '@/features/reports'

export const rootReducer = combineReducers({
  // TODO: Agregar slices cuando se implementen
  auth: authSlice.reducer,
  // attendance: attendanceSlice.reducer,
  // classes: classesSlice.reducer,
  // packages: packagesSlice.reducer,
  // payments: paymentsSlice.reducer,
  // schedules: schedulesSlice.reducer,
  // users: usersSlice.reducer,
  // alerts: alertsSlice.reducer,
  // reports: reportsSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>