// ============================================
// DASHBOARD PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

const DashboardPage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Dashboard - Chetango</h1>
      <p className={styles['page-description']}>Panel principal del usuario</p>
    </div>
  )
}

export default DashboardPage