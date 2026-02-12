// ============================================
// USER DETAIL PAGE - ADMIN (CONNECTED TO API)
// ============================================

import { GlassButton } from '@/design-system'
import { useAlumnoDetail, useProfesorDetail } from '@/features/users'
import {
    ArrowLeft,
    Calendar,
    ClipboardList,
    Clock,
    CreditCard,
    DollarSign,
    Edit,
    Loader2,
    Mail,
    Package,
    Phone,
    UserCircle2
} from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styles from './UserDetailPage.module.scss'

/**
 * Página de detalle completo de usuario (Alumno o Profesor)
 * Conectada a la API real
 */
export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const userType = searchParams.get('type') || 'alumno'
  const navigate = useNavigate()
  
  const { data: alumnoData, isLoading: loadingAlumno } = useAlumnoDetail(
    userType === 'alumno' ? id : null
  )
  
  const { data: profesorData, isLoading: loadingProfesor } = useProfesorDetail(
    userType === 'profesor' ? id : null
  )
  
  const isLoading = loadingAlumno || loadingProfesor
  const userData = userType === 'alumno' ? alumnoData : profesorData
  
  const handleBack = () => navigate(-1)
  const handleEdit = () => {
    // Usar idUsuario en lugar del id de alumno/profesor
    const userId = userData?.idUsuario
    if (userId) {
      navigate('/admin/users', { state: { editUserId: userId } })
    }
  }
  
  // Handlers para alumnos - usar rutas que existen
  const handleRegisterPayment = () => navigate('/admin/payments', { state: { alumnoId: id, alumnoNombre: userData?.nombre } })
  const handleAssignPackage = () => navigate('/admin/paquetes', { state: { alumnoId: id } })
  const handleRegisterAttendance = () => navigate('/admin/attendance', { state: { alumnoId: id } })
  
  // Handlers para profesores - usar rutas que existen
  const handleAssignClass = () => navigate('/admin/classes', { state: { profesorId: id, profesorNombre: userData?.nombre } })
  const handleViewPayroll = () => navigate('/admin/payroll')
  const handleViewSchedule = () => navigate('/admin/classes', { state: { profesorId: id } })
  
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loader2 size={48} className={styles.spinner} />
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>No se pudo cargar la información del usuario</p>
          <GlassButton onClick={handleBack}>Volver</GlassButton>
        </div>
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__top}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          
          <div className={styles.header__actions}>
            <GlassButton variant="secondary" size="md" onClick={handleEdit} icon={<Edit size={18} />}>
              Editar
            </GlassButton>
          </div>
        </div>
        
        <h1 className={styles.header__title}>
          {userType === 'alumno' ? 'Perfil de Alumno' : 'Perfil de Profesor'}
        </h1>
      </div>
      
      <div className={styles.grid}>
        {/* Columna izquierda */}
        <div className={styles.leftColumn}>
          {/* Información personal */}
          <div className={styles.card}>
            <div className={styles.card__header}>
              <UserCircle2 size={20} />
              <h2>Información Personal</h2>
            </div>
            
            <div className={styles.userProfile}>
              <div className={styles.userProfile__avatar}>
                {getInitials(userData.nombre)}
              </div>
              <div className={styles.userProfile__info}>
                <h3 className={styles.userProfile__name}>{userData.nombre}</h3>
                <p className={styles.userProfile__document}>{userData.tipoDocumento} {userData.documento}</p>
                <span className={`${styles.badge} ${styles['badge--success']}`}>
                  {userData.estado}
                </span>
              </div>
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoItem__icon}><Mail size={18} /></div>
                <div className={styles.infoItem__content}>
                  <span className={styles.infoItem__label}>Correo electrónico</span>
                  <span className={styles.infoItem__value}>{userData.correo}</span>
                </div>
              </div>
              
              {userData.telefono && (
                <div className={styles.infoItem}>
                  <div className={styles.infoItem__icon}><Phone size={18} /></div>
                  <div className={styles.infoItem__content}>
                    <span className={styles.infoItem__label}>Teléfono</span>
                    <span className={styles.infoItem__value}>{userData.telefono}</span>
                  </div>
                </div>
              )}
              
              <div className={styles.infoItem}>
                <div className={styles.infoItem__icon}><Clock size={18} /></div>
                <div className={styles.infoItem__content}>
                  <span className={styles.infoItem__label}>Miembro desde</span>
                  <span className={styles.infoItem__value}>{formatDate(userData.fechaRegistro)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estadísticas (solo alumno) */}
          {userType === 'alumno' && 'paquetesActivos' in userData && (
            <div className={styles.card}>
              <div className={styles.card__header}>
                <ClipboardList size={20} />
                <h2>Estadísticas</h2>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statCard__icon}><Package size={24} /></div>
                  <div className={styles.statCard__content}>
                    <span className={styles.statCard__value}>{userData.paquetesActivos}</span>
                    <span className={styles.statCard__label}>Paquetes activos</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statCard__icon}><Calendar size={24} /></div>
                  <div className={styles.statCard__content}>
                    <span className={styles.statCard__value}>{userData.clasesTomadas}</span>
                    <span className={styles.statCard__label}>Clases tomadas</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statCard__icon}><ClipboardList size={24} /></div>
                  <div className={styles.statCard__content}>
                    <span className={styles.statCard__value}>{userData.asistenciaPromedio}%</span>
                    <span className={styles.statCard__label}>Asistencia</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Estadísticas (solo profesor) */}
          {userType === 'profesor' && 'clasesAsignadas' in userData && (
            <div className={styles.card}>
              <div className={styles.card__header}>
                <ClipboardList size={20} />
                <h2>Estadísticas</h2>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statCard__icon}><Calendar size={24} /></div>
                  <div className={styles.statCard__content}>
                    <span className={styles.statCard__value}>{userData.clasesAsignadas}</span>
                    <span className={styles.statCard__label}>Clases asignadas</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statCard__icon}><ClipboardList size={24} /></div>
                  <div className={styles.statCard__content}>
                    <span className={styles.statCard__value}>{userData.clasesImpartidas}</span>
                    <span className={styles.statCard__label}>Clases impartidas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Columna derecha */}
        <div className={styles.rightColumn}>
          {/* Acciones rápidas */}
          <div className={styles.card}>
            <div className={styles.card__header}>
              <h2>Acciones Rápidas</h2>
            </div>
            
            <div className={styles.actionsGrid}>
              {userType === 'alumno' && (
                <>
                  <GlassButton variant="primary" size="md" onClick={handleRegisterPayment} icon={<DollarSign size={18} />}>
                    Registrar Pago
                  </GlassButton>
                  <GlassButton variant="secondary" size="md" onClick={handleAssignPackage} icon={<Package size={18} />}>
                    Asignar Paquete
                  </GlassButton>
                  <GlassButton variant="secondary" size="md" onClick={handleRegisterAttendance} icon={<ClipboardList size={18} />}>
                    Registrar Asistencia
                  </GlassButton>
                </>
              )}
              
              {userType === 'profesor' && (
                <>
                  <GlassButton variant="primary" size="md" onClick={handleAssignClass} icon={<Calendar size={18} />}>
                    Asignar Clase
                  </GlassButton>
                  <GlassButton variant="secondary" size="md" onClick={handleViewPayroll} icon={<DollarSign size={18} />}>
                    Ver Nómina
                  </GlassButton>
                  <GlassButton variant="secondary" size="md" onClick={handleViewSchedule} icon={<Clock size={18} />}>
                    Ver Horario
                  </GlassButton>
                </>
              )}
            </div>
          </div>
          
          {/* Último pago (solo alumno) */}
          {userType === 'alumno' && 'ultimoPago' in userData && userData.ultimoPago && (
            <div className={styles.card}>
              <div className={styles.card__header}>
                <CreditCard size={20} />
                <h2>Último Pago</h2>
              </div>
              
              <div className={styles.paymentInfo}>
                <div className={styles.paymentInfo__amount}>
                  ${userData.ultimoPago.monto.toLocaleString('es-CO')}
                </div>
                <div className={styles.paymentInfo__details}>
                  <div className={styles.infoRow}>
                    <Calendar size={16} />
                    <span>{formatDate(userData.ultimoPago.fecha)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Package size={16} />
                    <span>{userData.ultimoPago.concepto}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <CreditCard size={16} />
                    <span>{userData.ultimoPago.metodoPago}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Paquetes activos (solo alumno) */}
          {userType === 'alumno' && 'paquetesActivosDetalle' in userData && userData.paquetesActivosDetalle.length > 0 && (
            <div className={styles.card}>
              <div className={styles.card__header}>
                <Package size={20} />
                <h2>Paquetes Activos</h2>
              </div>
              
              <div className={styles.packagesList}>
                {userData.paquetesActivosDetalle.map(pkg => (
                  <div key={pkg.idPaquete} className={styles.packageItem}>
                    <div className={styles.packageItem__info}>
                      <span className={styles.packageItem__name}>{pkg.nombreTipoPaquete}</span>
                      <span className={styles.packageItem__status}>
                        {pkg.clasesRestantes} de {pkg.clasesDisponibles} clases restantes
                      </span>
                    </div>
                    <div className={styles.packageItem__progress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressBar__fill} 
                          style={{ width: `${(pkg.clasesUsadas / pkg.clasesDisponibles) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
