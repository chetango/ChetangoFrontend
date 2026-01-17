// ============================================
// ROOT REDUCER - CHETANGO
// ============================================

import { combineReducers } from '@reduxjs/toolkit'

// Importar slices cuando se implementen
import { authSlice } from '@/features/auth'
import roleReducer from '@/features/auth/store/roleSlice'
import { attendanceReducer } from '@/features/attendance/store'
import { classesReducer } from '@/features/classes/store'
import { packagesReducer } from '@/features/packages/store'
import { paymentsReducer } from '@/features/payments/store'
// import { schedulesSlice } from '@/features/schedules'
// import { usersSlice } from '@/features/users'
// import { alertsSlice } from '@/features/alerts'
// import { reportsSlice } from '@/features/reports'

export const rootReducer = combineReducers({
  // TODO: Agregar slices cuando se implementen
  auth: authSlice.reducer,
  role: roleReducer,
  attendance: attendanceReducer,
  classes: classesReducer,
  packages: packagesReducer,
  payments: paymentsReducer,
  // schedules: schedulesSlice.reducer,
  // users: usersSlice.reducer,
  // alerts: alertsSlice.reducer,
  // reports: reportsSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>