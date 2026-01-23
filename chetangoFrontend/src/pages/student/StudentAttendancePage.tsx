// ============================================
// STUDENT ATTENDANCE PAGE - CHETANGO
// ============================================

import {
  GlassPanel,
  Toaster,
  Skeleton,
  SkeletonText,
  AmbientGlows,
  TypographyBackdrop,
  GlassOrb,
  FloatingParticle,
  CreativeAnimations,
} from '@/design-system'
import { useAuth, useUserProfileQuery } from '@/features/auth'
import { useStudentAttendance } from '@/features/attendance/hooks/useStudentAttendance'
import {
  SummaryCard,
  PackageProgressBar,
  AttendanceHistoryCard,
  AttendanceDetailModal,
} from '@/features/attendance/components/student'
import { ErrorState } from '@/shared/components'
import {
  TrendingUp,
  Package,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react'
import type { EstadoPaqueteVariant } from '@/features/attendance/components/student/SummaryCard'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats expiration date in Spanish
 * Example: "Vence: 8 feb 2025"
 */
function formatearFechaVencimiento(fecha?: string): string | undefined {
  if (!fecha) return undefined
  const date = new Date(fecha + 'T00:00:00')
  const opciones: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
  return `Vence: ${date.toLocaleDateString('es-ES', opciones)}`
}

/**
 * Maps package state to badge label
 */
function getEstadoBadgeLabel(estado: string): string {
  switch (estado) {
    case 'activo':
      return 'Activo'
    case 'congelado':
      return 'Congelado'
    case 'agotado':
      return 'Agotado'
    case 'sin_paquete':
      return 'Sin paquete'
    default:
      return 'Desconocido'
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Student Attendance Page
 * Allows students to view their attendance history and package status.
 *
 * Features:
 * - Summary cards (classes this month, remaining classes, package status)
 * - Package progress bar
 * - Attendance history list
 * - Detail modal for each attendance record
 *
 * Backend Integration:
 * - GET /api/auth/me - Get student's ID from user profile
 * - GET /api/alumnos/{idAlumno}/asistencias - Fetch attendance history
 * - GET /api/alumnos/{idAlumno}/paquetes - Fetch package status
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 6.1
 * Figma Styles: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */
const StudentAttendancePage = () => {
  const { session } = useAuth()

  // Get student ID from user profile via GET /api/auth/me
  // The idUsuario from the profile is used as idAlumno for API calls
  const { data: userProfile, isLoading: isLoadingProfile, error: profileError } = useUserProfileQuery(
    session.isAuthenticated
  )
  
  // Use the idAlumno from the user profile (Requirement 6.1)
  const idAlumno = userProfile?.idAlumno ?? null

  // Main attendance hook
  const {
    asistencias,
    estadoPaquete,
    selectedAsistencia,
    isLoading,
    isLoadingPaquete,
    error,
    summary,
    selectAsistencia,
    closeDetailModal,
    isDetailModalOpen,
  } = useStudentAttendance(idAlumno)

  // Combine loading states
  const isLoadingInitial = isLoadingProfile || (idAlumno && isLoadingPaquete)
  
  // Combine errors (profile error takes precedence)
  const combinedError = profileError || error

  return (
    <>
      {/* Creative animations for floating elements */}
      <CreativeAnimations />

      {/* Toast notifications container */}
      <Toaster position="bottom-right" />

      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
        {/* Ambient background glows - cool variant per Figma */}
        <AmbientGlows variant="cool" />

        {/* Typography backdrop decoration - "CLASES" per Figma */}
        <TypographyBackdrop
          text="CLASES"
          orientation="vertical"
          position="right"
          size={220}
          opacity={0.2}
        />

        {/* Grid Overlay - subtle grid pattern per Figma */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating decorative elements - positioned per Figma */}
        <GlassOrb
          size="w-20 h-20"
          position="top-[12%] left-[5%]"
          color="secondary"
          delay="0s"
        />
        <GlassOrb
          size="w-14 h-14"
          position="bottom-[25%] right-[6%]"
          color="primary"
          delay="1s"
        />
        <FloatingParticle
          position="top-[15%] right-[18%]"
          color="#7c5af8"
          size="w-3 h-3"
          delay="0s"
        />
        <FloatingParticle
          position="top-[65%] left-[8%]"
          color="#34d399"
          size="w-2 h-2"
          delay="1s"
        />
        <FloatingParticle
          position="bottom-[20%] right-[25%]"
          color="#9b8afb"
          size="w-4 h-4"
          delay="1.5s"
        />

        {/* Main content - per Figma layout - Responsive */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            {/* Vista Alumno Badge - per Figma (secondary/green color) - Responsive */}
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-5
                rounded-full
                backdrop-blur-xl
                bg-[rgba(52,211,153,0.15)]
                border border-[rgba(52,211,153,0.3)]
                text-[#34d399]
                text-xs sm:text-sm font-medium
                shadow-[0_4px_16px_rgba(52,211,153,0.2)]
              "
              role="status"
              aria-label="Vista Alumno"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              Vista Alumno
            </div>

            <h1
              className="text-[#f9fafb] mb-2 sm:mb-3 tracking-tight text-3xl sm:text-4xl md:text-[48px]"
              style={{ fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' }}
            >
              Mis Asistencias
            </h1>

            <p className="text-[#d1d5db] max-w-xl text-sm sm:text-base md:text-[17px]" style={{ lineHeight: '1.6' }}>
              Consulta el historial de tus clases y el estado de tu paquete.
            </p>
          </header>

          {/* Summary Cards Grid (Requirement 4.2) - per Figma - Responsive */}
          {isLoadingInitial ? (
            <SummaryCardsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Clases este mes */}
              <SummaryCard
                icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                label="Clases asistidas"
                value={summary.asistenciasEsteMes}
                badge="Este mes"
                variant="clases_mes"
              />

              {/* Clases restantes */}
              <SummaryCard
                icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
                label="Clases restantes"
                value={estadoPaquete?.clasesRestantes ?? 0}
                secondaryValue={estadoPaquete ? `/ ${estadoPaquete.clasesTotales}` : undefined}
                badge="Disponibles"
                variant="clases_restantes"
              />

              {/* Estado del paquete (Requirements 4.7, 4.8) */}
              <div className="sm:col-span-2 lg:col-span-1">
                <SummaryCard
                  icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                  label="Estado del paquete"
                  value={estadoPaquete?.nombrePaquete ?? 'Sin paquete activo'}
                  badge={getEstadoBadgeLabel(estadoPaquete?.estado ?? 'sin_paquete')}
                  variant="estado_paquete"
                  estadoPaquete={(estadoPaquete?.estado ?? 'sin_paquete') as EstadoPaqueteVariant}
                  subtitle={formatearFechaVencimiento(estadoPaquete?.fechaVencimiento)}
                />
              </div>
            </div>
          )}

          {/* Package Progress Bar (Requirement 4.3) - per Figma - Responsive */}
          {estadoPaquete?.estado === 'activo' && (
            <div className="mb-6 sm:mb-8">
              <PackageProgressBar
                clasesUsadas={estadoPaquete.clasesUsadas}
                clasesTotales={estadoPaquete.clasesTotales}
                clasesRestantes={estadoPaquete.clasesRestantes}
              />
            </div>
          )}

          {/* Attendance History Section (Requirements 4.4, 4.6) - per Figma - Responsive */}
          <div>
            <div className="mb-3 sm:mb-4">
              <h2 className="text-[#f9fafb] font-semibold mb-1 sm:mb-2 text-xl sm:text-2xl">
                Historial de clases
              </h2>
              <p className="text-[#9ca3af] text-xs sm:text-[14px]">
                Revisa todas tus asistencias y su impacto en tu paquete
              </p>
            </div>

            <GlassPanel className="overflow-hidden">
              {combinedError ? (
                <ErrorState
                  message="Error al cargar las asistencias"
                  error={combinedError}
                />
              ) : isLoading ? (
                <AttendanceHistorySkeleton />
              ) : asistencias.length === 0 ? (
                <EmptyHistoryState />
              ) : (
                <>
                  {/* Table Header (Desktop) - per Figma */}
                  <div className="hidden md:block p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                          Fecha
                        </p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                          Clase
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                          Estado
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                          Tipo
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                          Impacto
                        </p>
                      </div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>

                  {/* Records List (sorted by date descending - Requirement 4.6) */}
                  <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                    {asistencias.map((asistencia) => (
                      <AttendanceHistoryCard
                        key={asistencia.id}
                        record={asistencia}
                        onClick={() => selectAsistencia(asistencia)}
                      />
                    ))}
                  </div>
                </>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>

      {/* Detail Modal (Requirement 4.5) */}
      <AttendanceDetailModal
        record={selectedAsistencia}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </>
  )
}

// ============================================
// STATE COMPONENTS
// ============================================

function EmptyHistoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-[rgba(156,163,175,0.1)] flex items-center justify-center">
        <Calendar className="w-8 h-8 text-[#6b7280]" />
      </div>
      <p className="text-[#9ca3af] text-lg mb-2">No hay asistencias registradas</p>
      <p className="text-[#6b7280] text-sm">Tu historial de clases aparecerá aquí</p>
    </div>
  )
}

// ============================================
// SKELETON COMPONENTS
// ============================================

function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            backdrop-blur-2xl 
            bg-gradient-to-br from-[rgba(156,163,175,0.1)] to-[rgba(107,114,128,0.05)]
            border border-[rgba(255,255,255,0.1)]
            rounded-2xl 
            p-4 sm:p-6
            ${i === 3 ? 'sm:col-span-2 lg:col-span-1' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
            <Skeleton className="w-16 sm:w-20 h-5 sm:h-6 rounded-lg" />
          </div>
          <SkeletonText className="w-20 sm:w-24 mb-2" />
          <Skeleton className="w-12 sm:w-16 h-8 sm:h-10 rounded" />
        </div>
      ))}
    </div>
  )
}

function AttendanceHistorySkeleton() {
  return (
    <div className="space-y-0">
      {/* Header skeleton */}
      <div className="hidden md:block p-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="grid grid-cols-12 gap-4">
          <Skeleton className="col-span-2 h-4 w-16" />
          <Skeleton className="col-span-3 h-4 w-20" />
          <Skeleton className="col-span-2 h-4 w-16" />
          <Skeleton className="col-span-2 h-4 w-14" />
          <Skeleton className="col-span-2 h-4 w-18" />
        </div>
      </div>
      {/* Rows skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="hidden md:grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2">
              <SkeletonText className="w-24" />
            </div>
            <div className="col-span-3">
              <SkeletonText className="w-32 mb-1" />
              <SkeletonText className="w-24 h-3" />
            </div>
            <div className="col-span-2">
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
            <div className="col-span-2">
              <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
            <div className="col-span-2">
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
            <div className="col-span-1">
              <Skeleton className="w-5 h-5 rounded ml-auto" />
            </div>
          </div>
          {/* Mobile skeleton */}
          <div className="md:hidden">
            <div className="flex items-start justify-between mb-3">
              <div>
                <SkeletonText className="w-32 mb-2" />
                <SkeletonText className="w-24 h-3" />
              </div>
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-20 h-6 rounded-lg" />
              <Skeleton className="w-16 h-6 rounded-lg" />
              <Skeleton className="w-24 h-6 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StudentAttendancePage
