// ============================================
// NOT FOUND PAGE - CHETANGO
// ============================================

import styles from './PageStyles.module.scss'

const NotFoundPage = () => {
  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>404 - Página no encontrada</h1>
      <p className={styles['page-description']}>La página que buscas no existe</p>
    </div>
  )
}

export default NotFoundPage