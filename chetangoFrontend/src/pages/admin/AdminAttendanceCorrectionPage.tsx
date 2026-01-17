// ============================================
// ADMIN ATTENDANCE CORRECTION PAGE - CHETANGO
// ============================================

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  GlassPanel,
  Toaster,
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  AmbientGlows,
  TypographyBackdrop,
  GlassOrb,
  FloatingParticle,
  CreativeAnimations,
} from '@/design-system'
import { useAdminAttendance } from '@/features/attendance/hooks/useAdminAttendance'
import { useAttendanceSearch } from '@/features/attendance/hooks/useAttendanceSearch'
import {
  DateFilter,
  ClassSelector,
  StudentSearch,
  AttendanceTable,
  StatsSummary,
} from '@/features/attendance/components/admin'
import { calculateAttendanceStats } from '@/features/attendance/utils/attendanceUtils'
import { ERROR_MESSAGES, type ApiError } from '@/shared/api/interceptors'
import styles from '../PageStyles.module.scss'

/**
 * Admin Attendance Correction Page
 * Allows administrators to review and correct attendance records
 * for the last 7 days.
 *
 * Flow: Select Date → Select Class → View/Edit Attendance (with optional search)
 * 
 * Supports navigation from Classes page with claseId query parameter:
 * /admin/asistencias?claseId={idClase}
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 4.3, 4.5, 9.2, 12.4
 */
const AdminAttendanceCorrectionPage = () => {
  // Read claseId from URL query parameters (Requirement 12.4)
  const [searchParams] = useSearchParams()
  const claseIdFromUrl = searchParams.get('claseId')

  // Main attendance hook - combines queries, mutations, and Redux state
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

  // Search hook - filters students by name or document
  const { searchTerm, setSearchTerm, filteredStudents } = useAttendanceSearch(
    attendanceSummary?.alumnos ?? []
  )

  // Handle claseId from URL query parameter (Requirement 12.4)
  // When navigating from Classes page, pre-select the class
  useEffect(() => {
    if (claseIdFromUrl && classes?.clases) {
      // Find the class in the loaded classes to get its date
      const targetClass = classes.clases.find(c => c.idClase === claseIdFromUrl)
      if (targetClass) {
        // Set the class ID to load its attendance
        setSelectedClassId(claseIdFromUrl)
      } else if (!selectedClassId) {
        // If class not found in current date's classes, still try to set it
        // The backend will handle validation
        setSelectedClassId(claseIdFromUrl)
      }
    }
  }, [claseIdFromUrl, classes?.clases, setSelectedClassId, selectedClassId])

  // Calculate stats from filtered students (Requirement 9.5)
  // Stats reflect only the filtered students, not the original list
  const stats = calculateAttendanceStats(filteredStudents)

  return (
    <>
      {/* Creative animations for floating elements */}
      <CreativeAnimations />
      
      {/* Toast notifications container */}
      <Toaster />

      <div className="relative min-h-screen overflow-hidden">
        {/* Ambient background glows */}
        <AmbientGlows variant="warm" />

        {/* Typography backdrop decoration */}
        <TypographyBackdrop
          text="ASISTENCIA"
          orientation="vertical"
          position="right"
          size={280}
          opacity={0.3}
        />

        {/* Floating decorative elements */}
        <GlassOrb
          size="w-24 h-24"
          position="top-[15%] left-[5%]"
          color="primary"
          delay="0s"
        />
        <GlassOrb
          size="w-16 h-16"
          position="bottom-[20%] right-[8%]"
          color="secondary"
          delay="1s"
        />
        <FloatingParticle
          position="top-[30%] right-[15%]"
          color="#c93448"
          size="w-2 h-2"
          delay="0.5s"
        />
        <FloatingParticle
          position="bottom-[40%] left-[10%]"
          color="#7c5af8"
          size="w-3 h-3"
          delay="1.5s"
        />
        <FloatingParticle
          position="top-[60%] right-[25%]"
          color="#34d399"
          size="w-2 h-2"
          delay="2s"
        />

        {/* Main content */}
        <div className={`${styles['page-container']} relative z-10`}>
          {/* Page header */}
          <header className="mb-8">
            <h1 className={styles['page-title']}>Corrección de Asistencias</h1>
            <p className={styles['page-description']}>
              Revisa y corrige las asistencias de los últimos 7 días
            </p>
          </header>

          {/* Filters bar */}
          <GlassPanel className="p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date filter */}
              <DateFilter
                selectedDate={selectedDate}
                dateRange={dateRange}
                onDateChange={setSelectedDate}
                isLoading={isLoadingDateRange}
              />

              {/* Class selector */}
              <ClassSelector
                selectedClassId={selectedClassId}
                classes={classes}
                onClassChange={setSelectedClassId}
                isLoading={isLoadingClasses}
              />

              {/* Student search - only show when class is selected */}
              {selectedClassId && (
                <div className="flex-1 min-w-[200px] max-w-[320px]">
                  <StudentSearch value={searchTerm} onChange={setSearchTerm} />
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Stats summary - only show when attendance data is loaded */}
          {attendanceSummary && !isLoadingAttendance && (
            <div className="mb-6">
              <StatsSummary
                presentes={stats.presentes}
                ausentes={stats.ausentes}
                sinPaquete={stats.sinPaquete}
              />
            </div>
          )}

          {/* Attendance table */}
          <GlassPanel className="p-6">
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
                  onToggleAttendance={toggleAttendance}
                  onObservationChange={updateObservation}
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
          </GlassPanel>
        </div>
      </div>
    </>
  )
}

/**
 * Error state with retry option
 * Handles both inline errors (403) and recoverable errors
 * Requirements: 4.5, 9.2, 11.5
 */
interface ErrorStateProps {
  message: string
  onRetry?: () => void
  error?: Error | ApiError | null
}

function ErrorState({ message, onRetry, error }: ErrorStateProps) {
  // Check if this is a 403 forbidden error (inline, no retry)
  const apiError = error as ApiError | undefined
  const is403Error = apiError?.status === 403
  const isRecoverable = !is403Error && onRetry !== undefined
  
  // Use specific message for 403 errors
  const displayMessage = is403Error 
    ? ERROR_MESSAGES[403] 
    : message

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
        is403Error 
          ? 'bg-[rgba(251,191,36,0.1)]' // Warning yellow for 403
          : 'bg-[rgba(239,68,68,0.1)]'   // Error red for other errors
      }`}>
        {is403Error ? (
          // Lock icon for 403 forbidden
          <svg
            className="w-8 h-8 text-[#fbbf24]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ) : (
          // Warning icon for other errors
          <svg
            className="w-8 h-8 text-[#ef4444]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
      </div>
      <p className={`text-lg mb-2 ${is403Error ? 'text-[#fbbf24]' : 'text-[#ef4444]'}`}>
        {displayMessage}
      </p>
      <p className="text-[#6b7280] text-sm mb-4">
        {is403Error 
          ? 'Contacta al administrador si crees que deberías tener acceso'
          : 'Por favor, intenta de nuevo'
        }
      </p>
      {isRecoverable && (
        <button
          onClick={onRetry}
          className="
            px-4 py-2
            rounded-xl
            backdrop-blur-xl
            bg-[rgba(201,52,72,0.2)]
            border border-[rgba(201,52,72,0.4)]
            text-[#f9fafb]
            font-medium
            transition-all duration-300
            hover:bg-[rgba(201,52,72,0.3)]
            hover:border-[rgba(201,52,72,0.6)]
            hover:scale-105
          "
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

/**
 * Empty state when no class is selected
 */
function EmptyClassState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-[rgba(156,163,175,0.1)] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[#6b7280]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-[#9ca3af] text-lg mb-2">Selecciona una clase</p>
      <p className="text-[#6b7280] text-sm">
        Elige una fecha y clase para ver las asistencias
      </p>
    </div>
  )
}

/**
 * Skeleton loader for attendance table
 * Uses design system Skeleton components
 * Requirements: 9.1
 */
function AttendanceTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="flex gap-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Table rows skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 w-48">
            <SkeletonAvatar />
            <div className="space-y-2">
              <SkeletonText className="w-28" />
              <SkeletonText className="w-20 h-3" />
            </div>
          </div>
          {/* Package badge */}
          <div className="w-32">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          {/* Toggle */}
          <div className="w-20">
            <Skeleton variant="circular" className="h-10 w-10" />
          </div>
          {/* Observation */}
          <div className="flex-1">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminAttendanceCorrectionPage
