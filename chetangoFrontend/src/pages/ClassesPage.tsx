// ============================================
// CLASSES PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

const ClassesPage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Clases - Chetango</h1>
      <p className={styles['page-description']}>Gestión de clases y horarios</p>
    </div>
  )
}

export default ClassesPage