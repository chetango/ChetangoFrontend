// ============================================
// ADMIN ATTENDANCE PAGE - CHETANGO
// Per Figma Design: admin assistance.txt
// ============================================

import {
    AmbientGlows,
    CreativeAnimations,
    FloatingBadge,
    FloatingParticle,
    GlassOrb,
    GlassPanel,
    Skeleton,
    SkeletonAvatar,
    SkeletonText,
    StatCardMini,
    Toaster,
    TypographyBackdrop,
} from '@/design-system'
import {
    AttendanceTable,
    ClassSelector,
    DateFilter,
    StatsSummaryBottom,
    StudentSearch,
} from '@/features/attendance/components/admin'
import { useAdminAttendance } from '@/features/attendance/hooks/useAdminAttendance'
import { useAttendanceSearch } from '@/features/attendance/hooks/useAttendanceSearch'
import { calculateAttendanceStats } from '@/features/attendance/utils/attendanceUtils'
import { ERROR_MESSAGES, type ApiError } from '@/shared/api/interceptors'
import { CheckCircle2, Users } from 'lucide-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Admin Attendance Page
 * Per Figma: Layout Asimétrico Creativo 2025
 * 
 * Structure:
 * - Header with FloatingBadge + Title + Admin Avatar
 * - Single GlassPanel containing:
 *   - Filters Bar (Date, Class, Search)
 *   - Attendance Table
 *   - Summary Bar at bottom (Stats + auto-save message)
 * - Floating StatCardMini on the right
 * - Decorative elements (GlassOrb, FloatingParticle)
 */
const AdminAttendancePage = () => {
  const [searchParams] = useSearchParams()
  const claseIdFromUrl = searchParams.get('claseId')

  const {
    dateRange,
    isLoadingDateRange,
    dateRangeError,
    classes,
    isLoadingClasses,
    classesError,
    attendanceSummary,
    isLoadingAttendance,
    attendanceError,
    selectedDate,
    selectedClassId,
    setSelectedDate,
    setSelectedClassId,
    toggleAttendance,
    updateObservation,
    isUpdatingAttendance,
  } = useAdminAttendance()

  const { searchTerm, setSearchTerm, filteredStudents } = useAttendanceSearch(
    attendanceSummary?.alumnos ?? []
  )

  useEffect(() => {
    if (claseIdFromUrl && classes?.clases) {
      const targetClass = classes.clases.find(c => c.idClase === claseIdFromUrl)
      if (targetClass) {
        setSelectedClassId(claseIdFromUrl)
      } else if (!selectedClassId) {
        setSelectedClassId(claseIdFromUrl)
      }
    }
  }, [claseIdFromUrl, classes?.clases, setSelectedClassId, selectedClassId])

  const stats = calculateAttendanceStats(filteredStudents)
  const totalStudents = attendanceSummary?.alumnos?.length ?? 0

  return (
    <>
      <CreativeAnimations />
      <Toaster position="bottom-center" />

      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
        {/* Ambient Background */}
        <AmbientGlows variant="warm" />

        {/* Typography Backdrop */}
        <TypographyBackdrop
          text="ASIST"
          orientation="vertical"
          position="right"
          size={280}
          opacity={0.35}
        />

        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating Stats - Creative Positioning (per Figma) */}
        {selectedClassId && !isLoadingAttendance && (
          <>
            <StatCardMini 
              icon={<Users className="w-5 h-5 text-[#34d399]" />}
              label="Total hoy"
              value={totalStudents}
              position="top-[12%] right-[3%]"
              delay="0s"
            />
            <StatCardMini 
              icon={<CheckCircle2 className="w-5 h-5 text-[#7c5af8]" />}
              label="Confirmados"
              value={stats.presentes}
              position="top-[26%] right-[3%]"
              delay="0.5s"
            />
          </>
        )}

        {/* Glass Orbs Decorativos */}
        <GlassOrb 
          size="w-28 h-28"
          position="top-[50%] right-[2%]"
          color="primary"
          delay="0s"
        />
        <GlassOrb 
          size="w-20 h-20"
          position="bottom-[15%] left-[3%]"
          color="success"
          delay="1s"
        />

        {/* Floating Particles */}
        <FloatingParticle position="top-[15%] right-[15%]" color="#c93448" size="w-3 h-3" delay="0s" />
        <FloatingParticle position="top-[60%] left-[8%]" color="#34d399" size="w-2 h-2" delay="1s" />
        <FloatingParticle position="bottom-[25%] right-[20%]" color="#7c5af8" size="w-4 h-4" delay="1.5s" />

        {/* Main Content - Offset Layout */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 md:pl-[4%] md:pr-[4%] lg:pl-[6%] lg:pr-[6%]">
          
          {/* Header Asimétrico */}
          <div className="mb-6 md:mb-10 max-w-[1600px]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left: Title */}
              <div>
                <FloatingBadge 
                  color="primary" 
                  className="mb-4 sm:mb-6"
                  icon={<Users className="w-4 h-4" />}
                >
                  Registro de Asistencia
                </FloatingBadge>
                
                <h1 
                  className="text-[#f9fafb] mb-3 sm:mb-4 tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[64px]"
                  style={{ fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' }}
                >
                  Asistencia
                </h1>
                
                <p className="text-[#d1d5db] max-w-2xl text-sm sm:text-base md:text-lg" style={{ lineHeight: '1.6' }}>
                  Marca la asistencia de cada estudiante en tiempo real. Los cambios se guardan automáticamente.
                </p>
              </div>

              {/* Right: Avatar Admin */}
              <div className="hidden lg:flex items-center gap-4 backdrop-blur-xl bg-[rgba(42,42,48,0.6)] border border-[rgba(255,255,255,0.12)] rounded-2xl px-6 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex-shrink-0">
                <div className="flex flex-col items-end">
                  <p className="text-[#f9fafb]" style={{ fontSize: '15px' }}>Admin</p>
                  <p className="text-[#9ca3af] text-[13px]">Chetango</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_4px_16px_rgba(201,52,72,0.4)]">
                  <span className="text-white font-semibold">AC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel Glass - Single panel per Figma */}
          <div className="max-w-[1600px]">
            <GlassPanel className="overflow-hidden">
              
              {/* Filters Bar - Glass Band */}
              <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
                  {/* Fecha */}
                  <div className="sm:col-span-1 lg:col-span-3">
                    <DateFilter
                      selectedDate={selectedDate}
                      dateRange={dateRange}
                      onDateChange={setSelectedDate}
                      isLoading={isLoadingDateRange}
                    />
                  </div>

                  {/* Clase */}
                  <div className="sm:col-span-1 lg:col-span-4">
                    <ClassSelector
                      selectedClassId={selectedClassId}
                      classes={classes}
                      onClassChange={setSelectedClassId}
                      isLoading={isLoadingClasses}
                    />
                  </div>

                  {/* Búsqueda */}
                  <div className="sm:col-span-2 lg:col-span-5">
                    <StudentSearch value={searchTerm} onChange={setSearchTerm} />
                  </div>
                </div>
              </div>

              {/* Table Content */}
              {attendanceError ? (
                <ErrorState
                  message="Error al cargar las asistencias"
                  error={attendanceError}
                  onRetry={() => setSelectedClassId(selectedClassId)}
                />
              ) : selectedClassId ? (
                isLoadingAttendance ? (
                  <AttendanceTableSkeleton />
                ) : (
                  <AttendanceTable
                    students={filteredStudents}
                    searchTerm={searchTerm}
                    onToggleAttendance={(studentId, idPaquete) => toggleAttendance(studentId, idPaquete)}
                    onObservationChange={(studentId, idPaquete, observation) => updateObservation(studentId, idPaquete, observation)}
                    isUpdating={isUpdatingAttendance}
                  />
                )
              ) : dateRangeError ? (
                <ErrorState
                  message="Error al cargar el rango de fechas"
                  error={dateRangeError}
                  onRetry={() => window.location.reload()}
                />
              ) : classesError ? (
                <ErrorState
                  message="Error al cargar las clases"
                  error={classesError}
                  onRetry={() => setSelectedDate(selectedDate)}
                />
              ) : (
                <EmptyClassState />
              )}

              {/* Summary Bar - Bottom (per Figma) */}
              {selectedClassId && !isLoadingAttendance && !attendanceError && (
                <StatsSummaryBottom
                  presentes={stats.presentes}
                  ausentes={stats.ausentes}
                  sinPaquete={stats.sinPaquete}
                />
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </>
  )
}


/**
 * Error state with retry option
 */
interface ErrorStateProps {
  message: string
  onRetry?: () => void
  error?: Error | ApiError | null
}

function ErrorState({ message, onRetry, error }: ErrorStateProps) {
  const apiError = error as ApiError | undefined
  const is403Error = apiError?.status === 403
  const isRecoverable = !is403Error && onRetry !== undefined
  const displayMessage = is403Error ? ERROR_MESSAGES[403] : message

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
        is403Error ? 'bg-[rgba(251,191,36,0.1)]' : 'bg-[rgba(239,68,68,0.1)]'
      }`}>
        {is403Error ? (
          <svg className="w-8 h-8 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>
      <p className={`text-lg mb-2 ${is403Error ? 'text-[#fbbf24]' : 'text-[#ef4444]'}`}>{displayMessage}</p>
      <p className="text-[#6b7280] text-sm mb-4">
        {is403Error ? 'Contacta al administrador si crees que deberías tener acceso' : 'Por favor, intenta de nuevo'}
      </p>
      {isRecoverable && (
        <button onClick={onRetry} className="px-4 py-2 rounded-xl backdrop-blur-xl bg-[rgba(201,52,72,0.2)] border border-[rgba(201,52,72,0.4)] text-[#f9fafb] font-medium transition-all duration-300 hover:bg-[rgba(201,52,72,0.3)] hover:scale-105">
          Reintentar
        </button>
      )}
    </div>
  )
}

function EmptyClassState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-[rgba(156,163,175,0.1)] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-[#9ca3af] text-lg mb-2">Selecciona una clase</p>
      <p className="text-[#6b7280] text-sm">Elige una fecha y clase para ver las asistencias</p>
    </div>
  )
}

function AttendanceTableSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="flex items-center gap-3 w-48">
            <SkeletonAvatar />
            <div className="space-y-2">
              <SkeletonText className="w-28" />
              <SkeletonText className="w-20 h-3" />
            </div>
          </div>
          <div className="w-32"><Skeleton className="h-8 w-24 rounded-full" /></div>
          <div className="w-20"><Skeleton variant="circular" className="h-10 w-10" /></div>
          <div className="flex-1"><Skeleton className="h-10 w-full rounded-xl" /></div>
        </div>
      ))}
    </div>
  )
}

export default AdminAttendancePage
