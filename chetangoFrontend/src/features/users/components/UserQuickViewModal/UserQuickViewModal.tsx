// ============================================
// USER QUICK VIEW MODAL - GLASS MORPHISM
// ============================================

import { GlassButton } from '@/design-system'
import { ROUTES } from '@/shared/constants/routes'
import {
    Calendar,
    CreditCard,
    ExternalLink,
    Loader2,
    Mail,
    Phone,
    User,
    X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAlumnoQuickView, useProfesorQuickView } from '../../api/userQuickViewQueries'
import { useUserQuickView } from '../../hooks/useUserQuickView'
import styles from './UserQuickViewModal.module.scss'

/**
 * Modal de vista rápida de usuario (Alumno o Profesor)
 * Se muestra cuando el admin hace clic en un avatar en cualquier parte de la app
 * 
 * Características:
 * - Glass morphism design
 * - Información contextual según tipo de usuario
 * - Acciones rápidas
 * - Navegación a perfil completo
 */
export function UserQuickViewModal() {
  const { state, closeQuickView } = useUserQuickView()
  const navigate = useNavigate()
  
  const { data: alumnoData, isLoading: loadingAlumno } = useAlumnoQuickView(
    state.userType === 'alumno' ? state.userId : null,
    state.isOpen && state.userType === 'alumno'
  )
  
  const { data: profesorData, isLoading: loadingProfesor } = useProfesorQuickView(
    state.userType === 'profesor' ? state.userId : null,
    state.isOpen && state.userType === 'profesor'
  )
  
  if (!state.isOpen) return null
  
  const isLoading = loadingAlumno || loadingProfesor
  const userData = state.userType === 'alumno' ? alumnoData : profesorData
  
  const handleViewFullProfile = () => {
    if (state.userType === 'alumno' && alumnoData) {
      navigate(`${ROUTES.ADMIN.USERS}/${alumnoData.idAlumno}?type=alumno`)
    } else if (state.userType === 'profesor' && profesorData) {
      navigate(`${ROUTES.ADMIN.USERS}/${profesorData.idProfesor}?type=profesor`)
    }
    closeQuickView()
  }
  
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop}
        onClick={closeQuickView}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modal__container}>
          {/* Header */}
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {state.userType === 'alumno' ? 'Información de Alumno' : 'Información de Profesor'}
            </h2>
            <button
              onClick={closeQuickView}
              className={styles.modal__close}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          {isLoading ? (
            <div className={styles.modal__loading}>
              <Loader2 size={32} className={styles.spinner} />
              <p>Cargando información...</p>
            </div>
          ) : userData ? (
            <div className={styles.modal__content}>
              {/* User Info Section */}
              <div className={styles.userInfo}>
                <div className={styles.userInfo__avatar}>
                  {getInitials(userData.nombre)}
                </div>
                <div className={styles.userInfo__details}>
                  <h3 className={styles.userInfo__name}>{userData.nombre}</h3>
                  <p className={styles.userInfo__document}>{userData.documento}</p>
                  {'tipoProfesor' in userData && (
                    <span className={styles.userInfo__badge}>
                      {userData.tipoProfesor}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Contact Info */}
              <div className={styles.section}>
                <h4 className={styles.section__title}>Contacto</h4>
                <div className={styles.section__content}>
                  <div className={styles.infoRow}>
                    <Mail size={16} />
                    <span>{userData.correo}</span>
                  </div>
                  {userData.telefono && (
                    <div className={styles.infoRow}>
                      <Phone size={16} />
                      <span>{userData.telefono}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contextual Info - Alumno */}
              {state.userType === 'alumno' && 'paquetesActivos' in userData && (
                <>
                  <div className={styles.section}>
                    <h4 className={styles.section__title}>Paquetes</h4>
                    <div className={styles.section__content}>
                      <div className={styles.statCard}>
                        <span className={styles.statCard__value}>{userData.paquetesActivos}</span>
                        <span className={styles.statCard__label}>Paquetes activos</span>
                      </div>
                    </div>
                  </div>
                  
                  {userData.proximaClase && (
                    <div className={styles.section}>
                      <h4 className={styles.section__title}>Próxima Clase</h4>
                      <div className={styles.section__content}>
                        <div className={styles.infoRow}>
                          <Calendar size={16} />
                          <span>{userData.proximaClase.fecha} - {userData.proximaClase.hora}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <User size={16} />
                          <span>{userData.proximaClase.tipo}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {userData.ultimoPago && (
                    <div className={styles.section}>
                      <h4 className={styles.section__title}>Último Pago</h4>
                      <div className={styles.section__content}>
                        <div className={styles.infoRow}>
                          <CreditCard size={16} />
                          <span>${userData.ultimoPago.monto.toLocaleString()}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <Calendar size={16} />
                          <span>{userData.ultimoPago.fecha}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Contextual Info - Profesor */}
              {state.userType === 'profesor' && 'clasesAsignadas' in userData && (
                <>
                  <div className={styles.section}>
                    <h4 className={styles.section__title}>Clases</h4>
                    <div className={styles.section__content}>
                      <div className={styles.statCard}>
                        <span className={styles.statCard__value}>{userData.clasesAsignadas}</span>
                        <span className={styles.statCard__label}>Clases asignadas</span>
                      </div>
                    </div>
                  </div>
                  
                  {userData.proximaClase && (
                    <div className={styles.section}>
                      <h4 className={styles.section__title}>Próxima Clase</h4>
                      <div className={styles.section__content}>
                        <div className={styles.infoRow}>
                          <Calendar size={16} />
                          <span>{userData.proximaClase.fecha} - {userData.proximaClase.hora}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {userData.nominaActual && (
                    <div className={styles.section}>
                      <h4 className={styles.section__title}>Nómina Actual</h4>
                      <div className={styles.section__content}>
                        <div className={styles.infoRow}>
                          <Calendar size={16} />
                          <span>{userData.nominaActual.periodo}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <User size={16} />
                          <span>{userData.nominaActual.totalClases} clases</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Actions */}
              <div className={styles.modal__actions}>
                <GlassButton
                  onClick={handleViewFullProfile}
                  variant="primary"
                >
                  <ExternalLink size={16} />
                  Ver perfil completo
                </GlassButton>
              </div>
            </div>
          ) : (
            <div className={styles.modal__error}>
              <p>No se pudo cargar la información del usuario</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
