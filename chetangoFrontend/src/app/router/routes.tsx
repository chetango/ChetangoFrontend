// ============================================
// ROUTES DEFINITION - CHETANGO
// ============================================

import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import {
  LoginPage,
  DashboardPage,
  AttendancePage,
  ClassesPage,
  PaymentsPage,
  UsersPage,
  ReportsPage,
  NotFoundPage,
} from '@/pages'
import { AuthLayout } from '@/app/router/layouts'
import { ProtectedRoute } from '@/app/router/guards'

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  
  // Rutas protegidas
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ATTENDANCE,
        element: (
          <ProtectedRoute roles={['ADMIN', 'TEACHER']}>
            <AttendancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CLASSES,
        element: (
          <ProtectedRoute roles={['ADMIN', 'TEACHER']}>
            <ClassesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PAYMENTS,
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <PaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USERS,
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS,
        element: (
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  
  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])