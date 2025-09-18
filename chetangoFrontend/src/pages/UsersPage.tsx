// ============================================
// USERS PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

export const UsersPage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Usuarios - Chetango</h1>
      <p className={styles['page-description']}>Gestión de usuarios y roles</p>
    </div>
  )
}