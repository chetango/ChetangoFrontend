// ============================================
// LAYOUTS - CHETANGO
// ============================================

import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Header */}
      <header className="header">
        <h1>Chetango</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/attendance">Asistencia</a>
          <a href="/classes">Clases</a>
          <a href="/payments">Pagos</a>
          <a href="/users">Usuarios</a>
          <a href="/reports">Reportes</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Chetango - Sistema de Gestión</p>
      </footer>
    </div>
  )
}