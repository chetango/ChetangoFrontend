// ============================================
// ROUTES WITH META-CONFIG - CHETANGO
// ============================================

import { lazy } from 'react'

const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })))
const AuthCallbackPage = lazy(() => import('@/pages').then(m => ({ default: m.AuthCallbackPage })))
const MainLayoutWrapper = lazy(() => import('@/pages/layouts/MainLayoutWrapper').then(m => ({ default: m.MainLayoutWrapper })))
const DashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.DashboardPage })))
const PaymentsPage = lazy(() => import('@/pages').then(m => ({ default: m.PaymentsPage })))
const UsersPage = lazy(() => import('@/pages').then(m => ({ default: m.UsersPage })))
const AttendancePage = lazy(() => import('@/pages').then(m => ({ default: m.AttendancePage })))
const ClassesPage = lazy(() => import('@/pages').then(m => ({ default: m.ClassesPage })))
const ReportsPage = lazy(() => import('@/pages').then(m => ({ default: m.ReportsPage })))
const NotFoundPage = lazy(() => import('@/pages').then(m => ({ default: m.NotFoundPage })))

export type Meta = {
  public?: boolean
  onlyGuests?: boolean
  auth?: boolean
  anyRole?: string[]
  allRole?: string[]
  redirectTo?: string
}

export type AppRoute = {
  path?: string
  index?: boolean
  element: React.ReactElement
  meta?: Meta
  children?: AppRoute[]
}

export const appRoutes: AppRoute[] = [
  { 
    path: '/login', 
    element: <LoginPage />, 
    meta: { public: true, onlyGuests: true, redirectTo: '/dashboard' } 
  },
  { 
    path: '/auth-callback', 
    element: <AuthCallbackPage />, 
    meta: { public: true } 
  },

  {
    path: '/',
    element: <MainLayoutWrapper />,
    meta: { auth: true },
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'attendance', element: <AttendancePage />, meta: { anyRole: ['ADMIN', 'TEACHER'] } },
      { path: 'classes', element: <ClassesPage />, meta: { anyRole: ['ADMIN', 'TEACHER'] } },
      { path: 'reports', element: <ReportsPage />, meta: { anyRole: ['ADMIN', 'TEACHER'] } },
      { path: 'payments', element: <PaymentsPage />, meta: { anyRole: ['ADMIN'] } },
      { path: 'users', element: <UsersPage />, meta: { anyRole: ['ADMIN'] } },
    ],
  },

  { path: '*', element: <NotFoundPage />, meta: { public: true } },
]