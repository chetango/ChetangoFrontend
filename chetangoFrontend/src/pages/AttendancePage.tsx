// ============================================
// ATTENDANCE PAGE - CHETANGO (Admin)
// ============================================

import { Link } from 'react-router-dom'
import styles from './PageStyles.module.scss'

const AttendancePage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Gestión de Asistencias</h1>
      <p className={styles['page-description']}>
        Administra y corrige las asistencias de los alumnos
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {/* Card: Corrección de Asistencias */}
        <Link 
          to="/admin/attendance/correction"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#fff' }}>
            Corrección de Asistencias
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            Revisa y corrige las asistencias por fecha y clase. Marca presentes/ausentes y agrega observaciones.
          </p>
        </Link>

        {/* Card: Reportes (placeholder) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            opacity: 0.6,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#fff' }}>
            Reportes de Asistencia
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            Genera reportes de asistencia por período, clase o alumno.
          </p>
          <span style={{ 
            display: 'inline-block',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            Próximamente
          </span>
        </div>

        {/* Card: Historial (placeholder) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            opacity: 0.6,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#fff' }}>
            Historial de Cambios
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            Consulta el historial de modificaciones en las asistencias.
          </p>
          <span style={{ 
            display: 'inline-block',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            Próximamente
          </span>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage