import { lazy, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { getDefaultRouteForRoles } from '@/shared/lib/navigation'

// Componente simple que renderiza las rutas hijas
const AdminOutlet = () => <Outlet />
const StudentOutlet = () => <Outlet />

const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })))
const AuthCallbackPage = lazy(() => import('@/pages').then(m => ({ default: m.AuthCallbackPage })))
const MainLayoutWrapper = lazy(() => import('@/pages/layouts/MainLayoutWrapper').then(m => ({ default: m.MainLayoutWrapper })))
const DashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.DashboardPage })))
const UsersPage = lazy(() => import('@/pages').then(m => ({ default: m.UsersPage })))
const AttendancePage = lazy(() => import('@/pages').then(m => ({ default: m.AttendancePage })))
const ClassesPage = lazy(() => import('@/pages').then(m => ({ default: m.ClassesPage })))
const ReportsPage = lazy(() => import('@/pages').then(m => ({ default: m.ReportsPage })))
const NotFoundPage = lazy(() => import('@/pages').then(m => ({ default: m.NotFoundPage })))
const AdminAttendanceCorrectionPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminAttendanceCorrectionPage })))
const AdminPackagesPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminPackagesPage })))
const AdminPaymentsPage = lazy(() => import('@/pages').then(m => ({ default: m.AdminPaymentsPage })))

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
      { index: true, element: <RootRedirect /> },
      { path: 'dashboard', element: <DashboardPage /> },
      
      // RUTAS DE ADMIN
      { 
        path: 'admin', 
        element: <AdminOutlet />,
        meta: { anyRole: ['admin'] },
        children: [
          { index: true, element: <div>Admin Dashboard</div> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'attendance/correction', element: <AdminAttendanceCorrectionPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'payments', element: <AdminPaymentsPage /> },
          { path: 'classes', element: <ClassesPage /> },
          { path: 'paquetes', element: <AdminPackagesPage /> },
          { path: 'reports', element: <ReportsPage /> },
        ]
      },
      
      // RUTAS DE ESTUDIANTE
      { 
        path: 'student', 
        element: <StudentOutlet />,
        meta: { anyRole: ['alumno'] },
        children: [
          { index: true, element: <div>Student Dashboard</div> }, // TODO: Crear StudentDashboardPage
          { path: 'attendance', element: <div>My Attendance</div> }, // TODO: Crear StudentAttendancePage
          { path: 'payments', element: <div>My Payments</div> }, // TODO: Crear StudentPaymentsPage
          { path: 'profile', element: <div>My Profile</div> }, // TODO: Crear StudentProfilePage
        ]
      },
      
      // RUTAS COMPARTIDAS
      { path: 'profile', element: <div>Profile Page</div> }, // TODO: Crear ProfilePage
      { path: 'notifications', element: <div>Notifications</div> }, // TODO: Crear NotificationsPage
    ],
  },

  { path: '*', element: <NotFoundPage />, meta: { public: true } },
]