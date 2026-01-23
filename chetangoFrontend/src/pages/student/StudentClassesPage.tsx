// ============================================
// STUDENT CLASSES PAGE - CHETANGO
// Per Figma Design: alumno-clases.txt
// Requirements: 9.1-9.6
// ============================================

import { useState, useCallback } from 'react'
import { CalendarDays, Calendar, History, ChevronDown, ChevronUp, Info } from 'lucide-react'
import {
  GlassPanel,
  Toaster,
  Skeleton,
  SkeletonCard,
  AmbientGlows,
  TypographyBackdrop,
  GlassOrb,
  FloatingParticle,
  CreativeAnimations,
  FloatingBadge,
  Badge,
} from '@/design-system'
import { useStudentClasses } from '@/features/classes/hooks'
import {
  ClaseCardAlumno,
  ClaseDetailModal,
  ReprogramarModal,
} from '@/features/classes/components'
import { formatearFecha, formatearHora24 } from '@/features/classes/utils/dateUtils'
import type { ClaseAlumno } from '@/features/classes/types/classTypes'

// ============================================
// SKELETON LOADERS
// ============================================

function ClassesSkeletons() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} className="h-48" />
      ))}
    </div>
  )
}

function ProximasSkeletons() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  )
}

// ============================================
// EMPTY STATES
// ============================================

function EmptyClasesHoy() {
  return (
    <GlassPanel className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-white/5">
          <CalendarDays className="w-10 h-10 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        No tienes clases hoy
      </h3>
      <p className="text-gray-400 text-sm">
        Revisa tus próximas clases programadas
      </p>
    </GlassPanel>
  )
}

function EmptyProximasClases() {
  return (
    <div className="p-6 text-center">
      <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">No hay clases próximas programadas</p>
    </div>
  )
}

// ============================================
// PROXIMA CLASE ITEM
// ============================================

interface ProximaClaseItemProps {
  clase: ClaseAlumno
  onViewDetail: (clase: ClaseAlumno) => void
}

function ProximaClaseItem({ clase, onViewDetail }: ProximaClaseItemProps) {
  const fechaLabel = formatearFecha(clase.fecha)
  const isReprogramada = clase.estado === 'reprogramada'

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" shape="pill" className="text-xs">
              {fechaLabel}
            </Badge>
            {isReprogramada && (
              <Badge variant="warning" shape="pill" className="text-xs">
                Reprogramada
              </Badge>
            )}
          </div>
          <h4 className="text-white font-medium">{clase.nombre}</h4>
        </div>
        <button
          onClick={() => onViewDetail(clase)}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Ver detalles
        </button>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}</span>
        <span>{clase.profesor}</span>
        <span>{clase.ubicacion}</span>
      </div>
    </div>
  )
}

// ============================================
// CLASE ANTERIOR ITEM
// ============================================

interface ClaseAnteriorItemProps {
  clase: ClaseAlumno
}

function ClaseAnteriorItem({ clase }: ClaseAnteriorItemProps) {
  const getResultadoBadge = () => {
    switch (clase.resultado) {
      case 'asistida':
        return <Badge variant="success" shape="pill">Asistida</Badge>
      case 'ausente':
        return <Badge variant="error" shape="pill">Ausente</Badge>
      case 'reprogramada':
        return <Badge variant="warning" shape="pill">Reprogramada</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-gray-500 text-xs mb-1 capitalize">
            {formatearFecha(clase.fecha, true)}
          </p>
          <h4 className="text-white font-medium">{clase.nombre}</h4>
          <p className="text-gray-400 text-sm">{clase.tipo}</p>
        </div>
        {getResultadoBadge()}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-gray-400 text-sm">
          {formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}
        </span>
        {clase.descontada !== undefined && (
          <span className={`text-xs ${clase.descontada ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {clase.descontada ? 'Descontada' : 'No descontada'}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function StudentClassesPage() {
  // ============================================
  // HOOK INTEGRATION
  // ============================================

  const {
    clasesHoy,
    proximasClases,
    clasesAnteriores,
    isLoading,
    isReprogramando,
    error,
    showClasesAnteriores,
    reprogramarClaseId,
    setSelectedClaseId,
    setReprogramarClaseId,
    reprogramarClase,
    toggleClasesAnteriores,
    fechaFormateada,
    diaSemanaActual,
  } = useStudentClasses()

  // ============================================
  // LOCAL STATE
  // ============================================

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedClase, setSelectedClase] = useState<ClaseAlumno | null>(null)

  // Find clase for reprogramar modal
  const claseReprogramar = [...clasesHoy, ...proximasClases].find(
    (c) => c.id === reprogramarClaseId
  ) || null

  // ============================================
  // HANDLERS
  // ============================================

  const handleViewDetail = useCallback((clase: ClaseAlumno) => {
    setSelectedClase(clase)
    setSelectedClaseId(clase.id)
    setDetailModalOpen(true)
  }, [setSelectedClaseId])

  const handleReprogramar = useCallback((clase: ClaseAlumno) => {
    setReprogramarClaseId(clase.id)
  }, [setReprogramarClaseId])

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalOpen(false)
    setSelectedClase(null)
    setSelectedClaseId(null)
  }, [setSelectedClaseId])

  const handleCloseReprogramarModal = useCallback(() => {
    setReprogramarClaseId(null)
  }, [setReprogramarClaseId])

  const handleConfirmReprogramar = useCallback(async (nuevaFecha: string) => {
    if (reprogramarClaseId) {
      await reprogramarClase(reprogramarClaseId, nuevaFecha)
    }
  }, [reprogramarClaseId, reprogramarClase])

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <CreativeAnimations />
      <Toaster position="bottom-center" />

      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
        {/* Ambient Background */}
        <AmbientGlows variant="warm" />

        {/* Typography Backdrop */}
        <TypographyBackdrop
          text="CLASES"
          orientation="vertical"
          position="right"
          size={240}
          opacity={0.3}
        />

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glass Orbs Decorativos */}
        <GlassOrb
          size="w-24 h-24"
          position="top-[40%] right-[2%]"
          color="primary"
          delay="0s"
        />
        <GlassOrb
          size="w-16 h-16"
          position="bottom-[20%] left-[3%]"
          color="success"
          delay="1s"
        />

        {/* Floating Particles */}
        <FloatingParticle position="top-[20%] right-[12%]" color="#c93448" size="w-3 h-3" delay="0s" />
        <FloatingParticle position="top-[55%] left-[6%]" color="#34d399" size="w-2 h-2" delay="1s" />
        <FloatingParticle position="bottom-[30%] right-[18%]" color="#7c5af8" size="w-4 h-4" delay="1.5s" />

        {/* Main Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 md:pl-[4%] md:pr-[4%] lg:pl-[6%] lg:pr-[6%]">
          {/* Header */}
          <div className="mb-6 md:mb-10 max-w-[1600px]">
            <FloatingBadge color="info" className="mb-4 sm:mb-6">
              Mi Agenda
            </FloatingBadge>

            <h1
              className="text-[#f9fafb] mb-3 sm:mb-4 tracking-tight text-3xl sm:text-4xl md:text-[48px]"
              style={{ fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' }}
            >
              Mis Clases
            </h1>

            <p className="text-[#d1d5db] max-w-2xl text-sm sm:text-base md:text-lg" style={{ lineHeight: '1.6' }}>
              Consulta tus clases programadas y gestiona tu agenda
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Column: Clases de Hoy */}
            <div className="lg:col-span-7">
              <GlassPanel className="p-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#c93448]/20">
                    <CalendarDays className="w-5 h-5 text-[#c93448]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Clases de Hoy</h2>
                    <p className="text-gray-400 text-sm capitalize">
                      {diaSemanaActual}, {fechaFormateada}
                    </p>
                  </div>
                </div>

                {/* Classes List */}
                {isLoading ? (
                  <ClassesSkeletons />
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-400">Error al cargar las clases</p>
                  </div>
                ) : clasesHoy.length === 0 ? (
                  <EmptyClasesHoy />
                ) : (
                  <div className="space-y-4">
                    {clasesHoy.map((clase) => (
                      <ClaseCardAlumno
                        key={clase.id}
                        clase={clase}
                        onViewDetail={handleViewDetail}
                        onReprogramar={handleReprogramar}
                      />
                    ))}
                  </div>
                )}
              </GlassPanel>

              {/* Clases Anteriores - Collapsible */}
              <GlassPanel className="p-6 mt-6">
                <button
                  onClick={toggleClasesAnteriores}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-500/20">
                      <History className="w-5 h-5 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Clases Anteriores</h2>
                  </div>
                  {showClasesAnteriores ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {showClasesAnteriores && (
                  <div className="mt-6">
                    {/* Informative Note */}
                    <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-300 text-sm">
                        Las clases no reprogramadas se descuentan automáticamente de tu paquete
                      </p>
                    </div>

                    {/* Historical Classes */}
                    {isLoading ? (
                      <ProximasSkeletons />
                    ) : clasesAnteriores.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-6">
                        No hay clases anteriores
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {clasesAnteriores.map((clase) => (
                          <ClaseAnteriorItem key={clase.id} clase={clase} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </GlassPanel>
            </div>

            {/* Sidebar: Próximas Clases */}
            <div className="lg:col-span-5">
              <GlassPanel className="p-6 sticky top-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Próximas Clases</h2>
                </div>

                {/* Upcoming Classes List */}
                {isLoading ? (
                  <ProximasSkeletons />
                ) : proximasClases.length === 0 ? (
                  <EmptyProximasClases />
                ) : (
                  <div className="space-y-3">
                    {proximasClases.slice(0, 5).map((clase) => (
                      <ProximaClaseItem
                        key={clase.id}
                        clase={clase}
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                    {proximasClases.length > 5 && (
                      <p className="text-gray-500 text-sm text-center pt-2">
                        +{proximasClases.length - 5} clases más
                      </p>
                    )}
                  </div>
                )}
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <ClaseDetailModal
        idClase={selectedClase?.id || null}
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {/* Reprogramar Modal */}
      <ReprogramarModal
        isOpen={!!reprogramarClaseId}
        onClose={handleCloseReprogramarModal}
        clase={claseReprogramar}
        onConfirm={handleConfirmReprogramar}
        isLoading={isReprogramando}
      />
    </>
  )
}
