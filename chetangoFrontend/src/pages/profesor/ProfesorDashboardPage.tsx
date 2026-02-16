// ============================================
// PROFESOR DASHBOARD PAGE - CHETANGO
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import { EventosCarousel } from '@/features/dashboard'
import {
    AsistenciaChart,
    ClasesHoySection,
    ProfesorHeader,
    ProfesorKPIs,
    ProximasClasesSection,
    QuickActionsProfesor,
    useProfesorDashboard
} from '@/features/dashboard/profesor'
import { useNavigate } from 'react-router-dom'

const ProfesorDashboardPage = () => {
  const navigate = useNavigate()
  const { data: dashboard, isLoading, isError, error, refetch } = useProfesorDashboard()

  // Loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        <AmbientGlows variant="cool" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#7c5af8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#9ca3af] text-lg">Cargando dashboard...</p>
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
        <AmbientGlows variant="cool" />
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
                  className="px-4 py-2 bg-[#7c5af8] text-white rounded-lg hover:bg-[#6845e8] transition-colors"
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
        <AmbientGlows variant="cool" />
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

  const handleRegistrarAsistencia = (claseId: string) => {
    navigate(`/profesor/attendance?claseId=${claseId}`)
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
      <AmbientGlows variant="cool" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          
          {/* Header Section */}
          <ProfesorHeader 
            nombreProfesor={dashboard.nombreProfesor}
            correo={dashboard.correo}
          />
          
          {/* Clases de Hoy - SECCIÓN PRINCIPAL */}
          <ClasesHoySection 
            clases={dashboard.clasesHoy}
            onRegistrarAsistencia={handleRegistrarAsistencia}
          />
          
          {/* KPIs del Profesor */}
          <ProfesorKPIs kpis={dashboard.kpIs} />
          
          {/* Grid: Acciones + Gráfica */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 md:mb-10">
            <QuickActionsProfesor />
            <AsistenciaChart grafica={dashboard.graficaAsistencia30Dias} />
          </div>
          
          {/* Próximas Clases */}
          <ProximasClasesSection clases={dashboard.proximasClases} />
          
          {/* NotiChetango - Contenido Informativo */}
          <EventosCarousel eventos={dashboard.eventosProximos} />
          
        </div>
      </div>
    </div>
  )
}

export default ProfesorDashboardPage
