// ============================================
// DASHBOARD PAGE - CHETANGO
// Admin Dashboard Only
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import { useAuth } from '@/features/auth'
import { useCreateClaseMutation } from '@/features/classes/api/classMutations'
import { useProfesoresQuery, useTiposClaseQuery } from '@/features/classes/api/classQueries'
import { ClaseFormModal } from '@/features/classes/components'
import type { ClaseFormData, CrearClaseRequest } from '@/features/classes/types/classTypes'
import { formatearFechaHoraISO, formatearFechaParaInput, formatearHoraConSegundos, formatearHoraParaInput } from '@/features/classes/utils/claseHelpers'
import {
    ActivityTimeline,
    AlertsPanel,
    ChartsSection,
    DashboardHeader,
    KPIGrid,
    QuickActionsSection,
    useDashboard
} from '@/features/dashboard'
import { FinancialDesgloseSede } from '@/features/dashboard/components/FinancialDesgloseSede'
import type { SedeFilter } from '@/features/dashboard/components/TabsSedeFilter'
import { TabsSedeFilter } from '@/features/dashboard/components/TabsSedeFilter'
import { RegisterPaymentModal } from '@/features/payments/components/RegisterPaymentModal'
import { SolicitudesNotifications } from '@/features/solicitudes'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { useMemo, useState } from 'react'

const DashboardPage = () => {
  const { session } = useAuth()
  const { data: dashboard, isLoading, isError, error, refetch } = useDashboard()
  const { data: tiposClase = [], isLoading: loadingTiposClase } = useTiposClaseQuery()
  const { data: profesores = [], isLoading: loadingProfesores } = useProfesoresQuery()
  const createClaseMutation = useCreateClaseMutation()
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false)
  const [isClasePrivadaModalOpen, setIsClasePrivadaModalOpen] = useState(false)
  const [renovacionSeleccionada, setRenovacionSeleccionada] = useState<SolicitudRenovacionPaqueteDTO | null>(null)
  const [clasePrivadaSeleccionada, setClasePrivadaSeleccionada] = useState<SolicitudClasePrivadaDTO | null>(null)
  const [sedeFilter, setSedeFilter] = useState<SedeFilter>('all')
  const isCatalogsLoading = loadingTiposClase || loadingProfesores

  const notaRenovacion = useMemo(() => {
    if (!renovacionSeleccionada) return undefined

    const parts = [`Renovación solicitada por ${renovacionSeleccionada.nombreAlumno}`]
    if (renovacionSeleccionada.tipoPaqueteDeseado) {
      parts.push(`Desea: ${renovacionSeleccionada.tipoPaqueteDeseado}`)
    }
    if (renovacionSeleccionada.mensajeAlumno) {
      parts.push(`Mensaje: ${renovacionSeleccionada.mensajeAlumno}`)
    }

    return parts.join(' | ')
  }, [renovacionSeleccionada])

  const prefillClaseData = useMemo(() => {
    if (!clasePrivadaSeleccionada) return undefined

    const tipoDeseado = clasePrivadaSeleccionada.tipoClaseDeseado?.toLowerCase()
    const tipoMatch = tipoDeseado
      ? tiposClase.find(tipo => tipo.nombre.toLowerCase() === tipoDeseado || tipo.nombre.toLowerCase().includes(tipoDeseado))
      : undefined

    const fecha = clasePrivadaSeleccionada.fechaPreferida
      ? formatearFechaParaInput(clasePrivadaSeleccionada.fechaPreferida)
      : ''
    const horaInicio = clasePrivadaSeleccionada.horaPreferida
      ? formatearHoraParaInput(clasePrivadaSeleccionada.horaPreferida)
      : ''

    const observacionesParts = [`Solicitud clase privada - ${clasePrivadaSeleccionada.nombreAlumno}`]
    if (clasePrivadaSeleccionada.observacionesAlumno) {
      observacionesParts.push(clasePrivadaSeleccionada.observacionesAlumno)
    }

    return {
      fecha,
      horaInicio,
      horaFin: '',
      idTipoClase: tipoMatch?.id || '',
      observaciones: observacionesParts.join(' | '),
    }
  }, [clasePrivadaSeleccionada, tiposClase])

  const handleOpenRenovacionModal = (solicitud: SolicitudRenovacionPaqueteDTO) => {
    setRenovacionSeleccionada(solicitud)
    setIsPagoModalOpen(true)
  }

  const handleCloseRenovacionModal = () => {
    setIsPagoModalOpen(false)
    setRenovacionSeleccionada(null)
  }

  const handleOpenClasePrivadaModal = (solicitud: SolicitudClasePrivadaDTO) => {
    setClasePrivadaSeleccionada(solicitud)
    setIsClasePrivadaModalOpen(true)
  }

  const handleCloseClasePrivadaModal = () => {
    setIsClasePrivadaModalOpen(false)
    setClasePrivadaSeleccionada(null)
  }

  const handleCreateClaseFromSolicitud = async (formData: ClaseFormData) => {
    const request: CrearClaseRequest = {
      profesores: formData.profesores.map(p => ({
        idProfesor: p.idProfesor,
        rolEnClase: p.rolEnClase,
      })),
      idTipoClase: formData.idTipoClase,
      fecha: formatearFechaHoraISO(formData.fecha, '00:00'),
      horaInicio: formatearHoraConSegundos(formData.horaInicio),
      horaFin: formatearHoraConSegundos(formData.horaFin),
      cupoMaximo: formData.cupoMaximo,
      observaciones: formData.observaciones || undefined,
    }

    await createClaseMutation.mutateAsync(request)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        <AmbientGlows variant="default" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#7c5af8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#9ca3af] text-base sm:text-lg">Cargando dashboard...</p>
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
        <AmbientGlows variant="default" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(239,68,68,0.15)] border-2 border-[#ef4444] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#ef4444] text-2xl">⚠</span>
                </div>
                <h3 className="text-[#f9fafb] text-lg sm:text-xl font-bold mb-2">Error al cargar el dashboard</h3>
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
        <AmbientGlows variant="default" />
        <div className="relative z-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-[#9ca3af] text-base sm:text-lg">No hay datos disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Imagen de fondo como silueta */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] bg-no-repeat bg-contain"
        style={{ 
          backgroundImage: 'url(/JorgePeliculas.jpeg)',
          backgroundPosition: 'center -150px',
          mixBlendMode: 'screen',
          filter: 'grayscale(100%) contrast(1.2)'
        }}
      />
      
      {/* Ambient Background - Más visible */}
      <AmbientGlows variant="default" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          
          {/* Header Section */}
          <DashboardHeader 
            userName={session?.user?.name || session?.user?.email || 'Usuario'}
            userRole="Administrador"
            academyName="Academia Chetango"
          />

          {/* Tabs Sede Filter */}
          <TabsSedeFilter 
            selectedSede={sedeFilter} 
            onSedeChange={setSedeFilter}
          />

          {/* KPIs Grid */}
          {dashboard.kpIs && <KPIGrid kpis={dashboard.kpIs} sedeFilter={sedeFilter} />}

          {/* Financial Desglose - Solo visible en vista "Todas" */}
          {sedeFilter === 'all' && dashboard.kpIs && (
            <FinancialDesgloseSede kpis={dashboard.kpIs} />
          )}

          {/* Quick Actions */}
          <QuickActionsSection />

          {/* Solicitudes Pendientes - Notificaciones */}
          <SolicitudesNotifications
            maxItems={5}
            onOpenRenovacion={handleOpenRenovacionModal}
            onOpenClasePrivada={handleOpenClasePrivadaModal}
          />

          {/* Charts Section */}
          {(dashboard.graficaAsistencias || dashboard.graficaIngresos) && (
            <ChartsSection 
              graficaAsistencias={dashboard.graficaAsistencias}
              graficaIngresos={dashboard.graficaIngresos}
            />
          )}

          {/* Bottom Section: Alerts + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {dashboard.alertas && <AlertsPanel alertas={dashboard.alertas} />}
            {dashboard.ultimosPagos && (
              <ActivityTimeline 
                ultimosPagos={dashboard.ultimosPagos}
                onRefresh={() => refetch()}
              />
            )}
          </div>

          {/* Modals */}
          <RegisterPaymentModal
            isOpen={isPagoModalOpen}
            onClose={handleCloseRenovacionModal}
            onSuccess={handleCloseRenovacionModal}
            initialAlumno={
              renovacionSeleccionada
                ? {
                    idAlumno: renovacionSeleccionada.idAlumno,
                    nombre: renovacionSeleccionada.nombreAlumno,
                    correo: renovacionSeleccionada.correoAlumno,
                  }
                : null
            }
            initialNota={notaRenovacion}
          />

          <ClaseFormModal
            isOpen={isClasePrivadaModalOpen}
            onClose={handleCloseClasePrivadaModal}
            onSubmit={handleCreateClaseFromSolicitud}
            tiposClase={tiposClase}
            profesores={profesores}
            isCatalogsLoading={isCatalogsLoading}
            isSubmitting={createClaseMutation.isPending}
            mode="create"
            initialData={null}
            prefillData={prefillClaseData}
          />

        </div>
      </div>
    </div>
  )
}

export default DashboardPage