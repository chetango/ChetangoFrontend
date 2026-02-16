// ============================================
// STUDENT DASHBOARD PAGE - CHETANGO
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import {
    TangoShoeNotification,
    useAsistenciasPendientes,
    useConfirmarAsistencia
} from '@/features/alumno'
import { EventosCarousel } from '@/features/dashboard'
import {
    AlertasImportantes,
    AlumnoHeader,
    CredencialDigitalCard,
    LogrosSection,
    MiAsistenciaCard,
    MiPaqueteCard,
    ProximaClaseCard,
    RecomendadosSection,
    useAlumnoDashboard
} from '@/features/dashboard/alumno'
import { useState } from 'react'

const StudentDashboardPage = () => {
  const { data: dashboard, isLoading, isError, error, refetch } = useAlumnoDashboard()
  const { data: asistenciasPendientes } = useAsistenciasPendientes()
  const { mutate: confirmarAsistencia } = useConfirmarAsistencia()
  const [showNotification, setShowNotification] = useState(true)

  const handleConfirm = (idAsistencia: string) => {
    confirmarAsistencia(idAsistencia)
    setShowNotification(false)
  }

  const handleDismiss = () => {
    setShowNotification(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        <AmbientGlows variant="warm" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#c93448] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#9ca3af] text-lg">Cargando tu dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        <AmbientGlows variant="warm" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(239,68,68,0.15)] border-2 border-[#ef4444] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#ef4444] text-2xl">⚠</span>
                </div>
                <h3 className="text-[#f9fafb] text-xl font-bold mb-2">Error al cargar el dashboard</h3>
                <p className="text-[#9ca3af] mb-4">
                  {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-[#c93448] text-white rounded-lg hover:bg-[#b32d40] transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!dashboard) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        <AmbientGlows variant="warm" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-[#9ca3af] text-lg">No hay datos disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Imagen de fondo JorgePeliculas como silueta */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] bg-no-repeat bg-contain"
        style={{ 
          backgroundImage: 'url(/JorgePeliculas.jpeg)',
          backgroundPosition: 'center -150px',
          mixBlendMode: 'screen',
          filter: 'grayscale(100%) contrast(1.2)'
        }}
      />
      
      {/* Ambient Background */}
      <AmbientGlows variant="warm" />

      {/* Notificación de Zapato Bailarín */}
      {asistenciasPendientes && asistenciasPendientes.length > 0 && showNotification && (
        <TangoShoeNotification
          asistencia={asistenciasPendientes[0]}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Responsive container: padding mobile-first */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">

          {/* Header Section */}
          <AlumnoHeader alumno={dashboard} />

          {/* Alertas Importantes */}
          <AlertasImportantes paquete={dashboard.paqueteActivo} />

          {/* Main Grid: QR + Próxima Clase - Stack en móvil, 2 columnas en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            <CredencialDigitalCard alumno={dashboard} />
            <ProximaClaseCard clase={dashboard.proximaClase} />
          </div>

          {/* Progreso del Alumno - Stack en movil, 2 columnas en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            <MiPaqueteCard paquete={dashboard.paqueteActivo} />
            <MiAsistenciaCard asistencia={dashboard.asistencia} />
          </div>

          {/* Logros / Gamificacion */}
          <LogrosSection logros={dashboard.logros} />

          {/* Eventos Proximos - Carrusel */}
          <EventosCarousel key="student-eventos" eventos={dashboard.eventosProximos} />

          {/* CTA Comercial - Recomendaciones */
          <RecomendadosSection paquete={dashboard.paqueteActivo} />

        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage
