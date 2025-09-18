// ============================================
// ATTENDANCE PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

export const AttendancePage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Asistencia - Chetango</h1>
      <p className={styles['page-description']}>Registro y consulta de asistencia</p>
    </div>
  )
}