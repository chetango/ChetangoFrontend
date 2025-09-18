// ============================================
// PAYMENTS PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

export const PaymentsPage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Pagos - Chetango</h1>
      <p className={styles['page-description']}>Gestión de pagos y paquetes</p>
    </div>
  )
}