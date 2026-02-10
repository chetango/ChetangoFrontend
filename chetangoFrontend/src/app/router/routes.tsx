import { useAuth } from '@/features/auth'
import { getDefaultRouteForRoles } from '@/shared/lib/navigation'
import { lazy, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { RootLayout } from './RootLayout'

// Componente simple que renderiza las rutas hijas
const AdminOutlet = () => <Outlet />
const StudentOutlet = () => <Outlet />
const ProfesorOutlet = () => <Outlet />

const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })))
const AuthCallbackPage = lazy(() => import('@/pages').then(m => ({ default: m.AuthCallbackPage })))
const MainLayoutWrapper = lazy(() => import('@/pages/layouts/MainLayoutWrapper').then(m => ({ default: m.MainLayoutWrapper })))
const DashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.DashboardPage })))
const UsersPage = lazy(() => import('@/pages').then(m => ({ default: m.UsersPage })))
const ClassesPage = lazy(() => import('@/pages').then(m => ({ default: m.ClassesPage })))
const ReportsPage = lazy(() => import('@/pages').then(m => ({ default: m.ReportsPage })))
const NotFoundPage = lazy(() => import('@/pages').then(m => ({ default: m.NotFoundPage })))
const AdminAttendancePage = lazy(() => import('@/pages').then(m => ({ default: m.AdminAttendancePage })))
const AdminPackagesPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminPackagesPage })))
const AdminPaymentsPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminPaymentsPage })))
const AdminPayrollPage = lazy(() => import('@/pages/admin/AdminPayrollPage').then(m => ({ default: m.default })))
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage').then(m => ({ default: m.default })))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage').then(m => ({ default: m.default })))
const UserDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.UserDetailPage })))
const ProfesorDashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorDashboardPage })))
const ProfesorAttendancePage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorAttendancePage })))
const ProfesorClassesPage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorClassesPage })))
const ProfesorPaymentsPage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorPaymentsPage })))
const ProfesorProfilePage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorProfilePage })))
const ProfesorReportsPage = lazy(() => import('@/pages').then(m => ({ default: m.ProfesorReportsPage })))
const StudentDashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.StudentDashboardPage })))
const StudentAttendancePage = lazy(() => import('@/pages').then(m => ({ default: m.StudentAttendancePage })))
const StudentClassesPage = lazy(() => import('@/pages').then(m => ({ default: m.StudentClassesPage })))
const StudentProfilePage = lazy(() => import('@/pages').then(m => ({ default: m.StudentProfilePage })))
const StudentPaymentsPage = lazy(() => import('@/pages').then(m => ({ default: m.StudentPaymentsPage })))

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

// Componente para redirect automático desde la raíz
const RootRedirect = () => {
  const { session } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (session.user?.roles) {
      const defaultRoute = getDefaultRouteForRoles(session.user.roles)
      navigate(defaultRoute, { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }, [session.user?.roles, navigate])
  
  return <div>Redirigiendo...</div>
}

// Componente para redirect desde /dashboard según rol
const DashboardRedirect = () => {
  const { session } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (session.user?.roles) {
      const defaultRoute = getDefaultRouteForRoles(session.user.roles)
      navigate(defaultRoute, { replace: true })
    }
  }, [session.user?.roles, navigate])
  
  return <div>Redirigiendo...</div>
}

export const appRoutes: AppRoute[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { 
        path: 'login', 
        element: <LoginPage />, 
        meta: { public: true, onlyGuests: true, redirectTo: '/dashboard' } 
      },
      { 
        path: 'auth-callback', 
        element: <AuthCallbackPage />, 
        meta: { public: true } 
      },

      {
        path: '/',
        element: <MainLayoutWrapper />,
        meta: { auth: true },
        children: [
          { index: true, element: <RootRedirect /> },
          { path: 'dashboard', element: <DashboardRedirect /> },
      
      // RUTAS DE ADMIN
      { 
        path: 'admin', 
        element: <AdminOutlet />,
        meta: { anyRole: ['admin'] },
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'attendance', element: <AdminAttendancePage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'users/:id', element: <UserDetailPage /> },
          { path: 'payments', element: <AdminPaymentsPage /> },
          { path: 'payroll', element: <AdminPayrollPage /> },
          { path: 'classes', element: <ClassesPage /> },
          { path: 'paquetes', element: <AdminPackagesPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'profile', element: <AdminProfilePage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ]
      },
      
      // RUTAS DE PROFESOR
      { 
        path: 'profesor', 
        element: <ProfesorOutlet />,
        meta: { anyRole: ['profesor'] },
        children: [
          { index: true, element: <ProfesorDashboardPage /> },
          { path: 'attendance', element: <ProfesorAttendancePage /> },
          { path: 'classes', element: <ProfesorClassesPage /> },
          { path: 'payments', element: <ProfesorPaymentsPage /> },
          { path: 'reports', element: <ProfesorReportsPage /> },
          { path: 'profile', element: <ProfesorProfilePage /> },
        ]
      },
      
      // RUTAS DE ESTUDIANTE
      { 
        path: 'student', 
        element: <StudentOutlet />,
        meta: { anyRole: ['alumno'] },
        children: [
          { index: true, element: <StudentDashboardPage /> },
          { path: 'attendance', element: <StudentAttendancePage /> },
          { path: 'classes', element: <StudentClassesPage /> },
          { path: 'payments', element: <StudentPaymentsPage /> },
          { path: 'profile', element: <StudentProfilePage /> },
        ]
      },
      
      // RUTAS COMPARTIDAS
      { path: 'profile', element: <div>Profile Page</div> }, // TODO: Crear ProfilePage
      { path: 'notifications', element: <div>Notifications</div> }, // TODO: Crear NotificationsPage
        ],
      },

      { path: '*', element: <NotFoundPage />, meta: { public: true } },
    ]
  }
]