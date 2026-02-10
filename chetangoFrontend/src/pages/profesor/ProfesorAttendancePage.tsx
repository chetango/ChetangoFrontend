// ============================================
// PROFESOR ATTENDANCE PAGE - CHETANGO
// ============================================

import {
    AmbientGlows,
    Calendar as CalendarComponent,
    CreativeAnimations,
    FloatingParticle,
    GlassOrb,
    GlassPanel,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    SkeletonAvatar,
    SkeletonText,
    Toaster,
    TypographyBackdrop,
} from '@/design-system'
import {
    AttendanceToggleProfesor,
    ClassSelectorProfesor,
    PackageStatusBadgeProfesor,
} from '@/features/attendance/components/profesor'
import { useProfesorAttendance } from '@/features/attendance/hooks/useProfesorAttendance'
import { useAuth, useUserProfileQuery } from '@/features/auth'
import { ErrorState } from '@/shared/components'
import { getToday } from '@/shared/utils/dateTimeHelper'
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Package,
    Users,
    XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats a date string in Spanish
 * Example: "2026-01-19" -> "Domingo, 19 de enero"
 */
function formatearFecha(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }
  const fechaFormateada = date.toLocaleDateString('es-ES', opciones)
  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
}

/**
 * Checks if a date is today
 */
function isToday(dateString: string): boolean {
  const todayString = getToday()
  return dateString === todayString
}

/**
 * Formats today's date in Spanish
 * Example: "Hoy · Sábado, 17 de enero"
 */
function formatearHoy(): string {
  const hoy = new Date()
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }
  const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones)
  return `Hoy · ${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}`
}

/**
 * Formats time from HH:mm:ss to HH:mm (24h format)
 */
function formatearHora24(hora24: string): string {
  return hora24.substring(0, 5)
}

/**
 * Checks if a class is currently in progress
 */
function isClaseEnCurso(horaInicio: string, horaFin: string, currentTime: string): boolean {
  return currentTime >= horaInicio && currentTime <= horaFin
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Profesor Attendance Page
 * Allows professors to mark attendance for their classes of the day.
 *
 * Features:
 * - Auto-detects current class based on time
 * - Class selector for multiple classes
 * - Student list with toggle and observation
 * - Real-time counters (presentes, ausentes, alertas)
 * - Auto-save with toast notifications
 *
 * Backend Integration:
 * - GET /api/auth/me - Get profesor's ID from user profile
 * - GET /api/profesores/{idProfesor}/clases - Fetch profesor's classes
 * - GET /api/clases/{idClase}/asistencias - Fetch attendance for a class
 * - POST /api/asistencias - Register new attendance
 * - PUT /api/asistencias/{id}/estado - Update existing attendance
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8, 6.1
 * Figma Styles: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */
const ProfesorAttendancePage = () => {
  const { session } = useAuth()
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getToday()
  })
  
  // State for calendar popover
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Get profesor ID from user profile via GET /api/auth/me
  // The idUsuario from the profile is used as idProfesor for API calls
  const { data: userProfile, isLoading: isLoadingProfile, error: profileError } = useUserProfileQuery(
    session.isAuthenticated
  )
  
  // Use the idProfesor from the user profile (Requirement 6.1)
  const idProfesor = userProfile?.idProfesor ?? null

  // Main attendance hook
  const {
    clasesDelDia,
    claseActual: _claseActual, // Auto-detected class (used internally by hook)
    estudiantes,
    selectedClassId,
    currentTime,
    isLoadingClases,
    isLoadingEstudiantes,
    isUpdatingAttendance,
    error,
    setSelectedClassId,
    toggleAttendance,
    updateObservation,
    counters,
  } = useProfesorAttendance(idProfesor, selectedDate)

  // Combine loading states
  const isLoadingInitial = isLoadingProfile || (idProfesor && isLoadingClases)
  
  // Combine errors (profile error takes precedence)
  const combinedError = profileError || error

  // Find selected class details
  const selectedClass = useMemo(() => {
    return clasesDelDia.find((c) => c.id === selectedClassId) ?? null
  }, [clasesDelDia, selectedClassId])

  // Check if selected class is in progress
  const isSelectedClassEnCurso = useMemo(() => {
    if (!selectedClass) return false
    return isClaseEnCurso(selectedClass.horaInicio, selectedClass.horaFin, currentTime)
  }, [selectedClass, currentTime])

  // Parse selected date for calendar
  const selectedDateObj = useMemo(() => {
    return new Date(selectedDate + 'T00:00:00')
  }, [selectedDate])

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      setSelectedDate(dateStr)
      setIsCalendarOpen(false)
    }
  }

  // Format date for display button
  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Creative animations for floating elements */}
      <CreativeAnimations />

      {/* Toast notifications container - positioned at bottom right per Figma */}
      <Toaster position="bottom-right" />

      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
        {/* Ambient background glows - warm variant per Figma */}
        <AmbientGlows variant="warm" />

        {/* Typography backdrop decoration - "ASIST" per Figma */}
        <TypographyBackdrop
          text="ASIST"
          orientation="vertical"
          position="right"
          size={240}
          opacity={0.25}
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
          color="primary"
          delay="0s"
        />
        <GlassOrb
          size="w-14 h-14"
          position="bottom-[25%] right-[6%]"
          color="secondary"
          delay="1s"
        />
        <FloatingParticle
          position="top-[15%] right-[18%]"
          color="#c93448"
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
          color="#7c5af8"
          size="w-4 h-4"
          delay="1.5s"
        />

        {/* Main content - per Figma layout - Responsive */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            {/* Vista Profesor Badge - per Figma - Responsive */}
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-5
                rounded-full
                backdrop-blur-xl
                bg-[rgba(201,52,72,0.15)]
                border border-[rgba(201,52,72,0.3)]
                text-[#e54d5e]
                text-xs sm:text-sm font-medium
                shadow-[0_4px_16px_rgba(201,52,72,0.2)]
              "
              role="status"
              aria-label="Vista Profesor"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              Vista Profesor
            </div>

            <h1
              className="text-[#f9fafb] mb-2 sm:mb-3 tracking-tight text-3xl sm:text-4xl md:text-[48px]"
              style={{ fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' }}
            >
              Asistencia
            </h1>

            <p className="text-[#d1d5db] max-w-xl mb-4 sm:mb-6 text-sm sm:text-base md:text-[17px]" style={{ lineHeight: '1.6' }}>
              Marca la asistencia de tu clase. Los cambios se guardan automáticamente.
            </p>

            {/* Fecha Selector con Calendar Popover - per Figma - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-[rgba(124,90,248,0.15)] backdrop-blur-sm border border-[rgba(124,90,248,0.3)]">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#9b8afb]" aria-hidden="true" />
                </div>
                <p className="text-[#d1d5db] font-medium text-sm sm:text-base md:text-lg">
                  {isToday(selectedDate) ? formatearHoy() : formatearFecha(selectedDate)}
                </p>
              </div>
              
              {/* Calendar Popover */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Fecha seleccionada: ${formatDisplayDate(selectedDate)}. Presiona para cambiar`}
                    aria-expanded={isCalendarOpen}
                    aria-haspopup="dialog"
                    className="
                      flex items-center gap-2
                      px-3 py-2
                      backdrop-blur-xl
                      bg-[rgba(30,30,36,0.4)]
                      border border-[rgba(255,255,255,0.08)]
                      hover:border-[rgba(255,255,255,0.25)]
                      focus:border-[#c93448]
                      focus:bg-[rgba(30,30,36,0.6)]
                      focus:ring-2
                      focus:ring-[rgba(201,52,72,0.2)]
                      rounded-lg
                      text-[#f9fafb]
                      text-sm
                      outline-none
                      transition-all duration-200
                      cursor-pointer
                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                    "
                  >
                    <Calendar className="w-4 h-4 text-[#6b7280]" aria-hidden="true" />
                    <span>{formatDisplayDate(selectedDate)}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    selected={selectedDateObj}
                    onSelect={handleDateSelect}
                    defaultMonth={selectedDateObj}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Class Selector */}
            {isLoadingInitial ? (
              <div className="flex gap-3 mb-6">
                <Skeleton className="h-20 w-64 rounded-2xl" />
                <Skeleton className="h-20 w-64 rounded-2xl" />
              </div>
            ) : (
              <ClassSelectorProfesor
                clases={clasesDelDia}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
                currentTime={currentTime}
              />
            )}

            {/* Clase Info Card - per Figma */}
            {selectedClass && (
              <ClaseInfoCard
                clase={selectedClass}
                isEnCurso={isSelectedClassEnCurso}
                totalAlumnos={estudiantes.length}
                presentes={counters.presentes}
                ausentes={counters.ausentes}
              />
            )}
          </header>

          {/* Main Panel - Lista de Alumnos */}
          <GlassPanel className="overflow-hidden">
            {combinedError ? (
              <ErrorState
                message="Error al cargar las asistencias"
                error={combinedError}
                onRetry={() => setSelectedClassId(selectedClassId)}
              />
            ) : !selectedClassId ? (
              <EmptyClassState />
            ) : isLoadingEstudiantes ? (
              <AttendanceTableSkeleton />
            ) : estudiantes.length === 0 ? (
              <EmptyStudentsState />
            ) : (
              <>
                {/* Table Header - per Figma - Hidden on mobile */}
                <div className="hidden md:block p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                        Alumno
                      </p>
                    </div>
                    <div className="col-span-2 text-center">
                      <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                        Estado
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                        Observación
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                        Info
                      </p>
                    </div>
                  </div>
                </div>

                {/* Students List - per Figma */}
                <div className="divide-y divide-[rgba(255,255,255,0.05)]" role="list" aria-label="Lista de estudiantes">
                  {estudiantes.map((estudiante) => (
                    <StudentRow
                      key={estudiante.id}
                      estudiante={estudiante}
                      onToggle={() => toggleAttendance(estudiante.id)}
                      onObservacionChange={(value) => updateObservation(estudiante.id, value)}
                      isUpdating={isUpdatingAttendance[estudiante.id] ?? false}
                    />
                  ))}
                </div>

                {/* Summary Bar - per Figma */}
                <SummaryBar
                  presentes={counters.presentes}
                  ausentes={counters.ausentes}
                  alertas={counters.alertas}
                />
              </>
            )}
          </GlassPanel>
        </div>
      </div>
    </>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface ClaseInfoCardProps {
  clase: {
    nombre: string
    horaInicio: string
    horaFin: string
  }
  isEnCurso: boolean
  totalAlumnos: number
  presentes: number
  ausentes: number
}

function ClaseInfoCard({ clase, isEnCurso, totalAlumnos, presentes, ausentes }: ClaseInfoCardProps) {
  return (
    <div
      className="
        backdrop-blur-2xl
        bg-gradient-to-br from-[rgba(201,52,72,0.15)] to-[rgba(168,36,58,0.1)]
        border border-[rgba(201,52,72,0.3)]
        rounded-2xl
        p-4 sm:p-6
        shadow-[0_12px_32px_rgba(201,52,72,0.2),inset_0_2px_4px_rgba(255,255,255,0.1)]
      "
      role="region"
      aria-label={`Información de la clase ${clase.nombre}`}
    >
      <div className="flex flex-col gap-4">
        {/* Class Info */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[rgba(201,52,72,0.3)] backdrop-blur-sm flex-shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#e54d5e]" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h2 className="text-[#f9fafb] font-semibold text-lg sm:text-xl md:text-2xl truncate">
                {clase.nombre}
              </h2>
              {isEnCurso && (
                <span
                  className="
                    px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[12px] font-bold uppercase
                    bg-[rgba(201,52,72,0.3)] border border-[rgba(201,52,72,0.5)]
                    text-[#e54d5e] whitespace-nowrap flex-shrink-0
                  "
                  role="status"
                  aria-label="Clase en curso"
                >
                  🔥 En curso ahora
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#d1d5db]">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9ca3af] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-[15px]">
                {formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive grid */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#9ca3af]" aria-hidden="true" />
            <span className="text-[#d1d5db] text-xs sm:text-[14px]">{totalAlumnos} alumnos</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34d399]" aria-hidden="true" />
            <span className="text-[#34d399] text-xs sm:text-[14px] font-medium">{presentes} presentes</span>
          </div>

          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[#6b7280]" aria-hidden="true" />
            <span className="text-[#6b7280] text-xs sm:text-[14px]">{ausentes} ausentes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StudentRowProps {
  estudiante: {
    id: string
    nombre: string
    documento: string
    asistencia: boolean
    observacion: string
    estadoPaquete: 'activo' | 'agotado' | 'sin_paquete' | 'clase_prueba'
  }
  onToggle: () => void
  onObservacionChange: (value: string) => void
  isUpdating: boolean
}

function StudentRow({ estudiante, onToggle, onObservacionChange, isUpdating }: StudentRowProps) {
  // Get initials from name
  const initials = estudiante.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div 
      className="p-4 sm:p-6 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-200 group"
      role="listitem"
      aria-label={`Asistencia de ${estudiante.nombre}`}
    >
      {/* Mobile Layout (< md) */}
      <div className="md:hidden">
        {/* Header: Avatar, Name, Toggle */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div
              className={`
                w-10 h-10 rounded-xl flex-shrink-0
                flex items-center justify-center
                backdrop-blur-sm border
                transition-all duration-300
                ${
                  estudiante.asistencia
                    ? 'bg-gradient-to-br from-[rgba(52,211,153,0.25)] to-[rgba(5,150,105,0.2)] border-[rgba(52,211,153,0.4)]'
                    : 'bg-gradient-to-br from-[rgba(156,163,175,0.15)] to-[rgba(107,114,128,0.1)] border-[rgba(255,255,255,0.1)]'
                }
              `}
              aria-hidden="true"
            >
              <span
                className={`
                  font-medium text-[13px]
                  ${estudiante.asistencia ? 'text-[#6ee7b7]' : 'text-[#9ca3af]'}
                `}
              >
                {initials}
              </span>
            </div>

            {/* Nombre y DNI */}
            <div className="min-w-0">
              <p className="text-[#f9fafb] font-medium text-sm truncate">
                {estudiante.nombre}
              </p>
              {estudiante.documento && (
                <p className="text-[#6b7280] text-xs mt-0.5 truncate">DNI: {estudiante.documento}</p>
              )}
            </div>
          </div>

          {/* Toggle */}
          <AttendanceToggleProfesor
            isPresent={estudiante.asistencia}
            onToggle={onToggle}
            isLoading={isUpdating}
          />
        </div>

        {/* Package Badge */}
        <div className="mb-3">
          <PackageStatusBadgeProfesor estado={estudiante.estadoPaquete} />
        </div>

        {/* Observation Input */}
        <input
          type="text"
          value={estudiante.observacion}
          onChange={(e) => onObservacionChange(e.target.value)}
          placeholder="Nota opcional..."
          aria-label={`Observación para ${estudiante.nombre}`}
          className="
            w-full
            px-3 py-2
            backdrop-blur-xl
            bg-[rgba(30,30,36,0.4)]
            border border-[rgba(255,255,255,0.08)]
            focus:border-[#c93448]
            focus:bg-[rgba(30,30,36,0.6)]
            focus:ring-2
            focus:ring-[rgba(201,52,72,0.2)]
            rounded-lg
            text-[#f9fafb]
            text-sm
            placeholder-[#4b5563]
            outline-none
            transition-all duration-200
          "
        />
      </div>

      {/* Desktop Layout (>= md) */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        {/* Alumno Info */}
        <div className="col-span-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`
                w-11 h-11 rounded-xl
                flex items-center justify-center
                backdrop-blur-sm border
                transition-all duration-300
                ${
                  estudiante.asistencia
                    ? 'bg-gradient-to-br from-[rgba(52,211,153,0.25)] to-[rgba(5,150,105,0.2)] border-[rgba(52,211,153,0.4)]'
                    : 'bg-gradient-to-br from-[rgba(156,163,175,0.15)] to-[rgba(107,114,128,0.1)] border-[rgba(255,255,255,0.1)]'
                }
              `}
              aria-hidden="true"
            >
              <span
                className={`
                  font-medium text-[14px]
                  ${estudiante.asistencia ? 'text-[#6ee7b7]' : 'text-[#9ca3af]'}
                `}
              >
                {initials}
              </span>
            </div>

            {/* Nombre y DNI */}
            <div>
              <p className="text-[#f9fafb] font-medium" style={{ fontSize: '15px' }}>
                {estudiante.nombre}
              </p>
              {estudiante.documento && (
                <p className="text-[#6b7280] text-[13px] mt-0.5">DNI: {estudiante.documento}</p>
              )}
            </div>
          </div>
        </div>

        {/* Estado Toggle */}
        <div className="col-span-2">
          <div className="flex justify-center">
            <AttendanceToggleProfesor
              isPresent={estudiante.asistencia}
              onToggle={onToggle}
              isLoading={isUpdating}
            />
          </div>
        </div>

        {/* Observación */}
        <div className="col-span-3">
          <input
            type="text"
            value={estudiante.observacion}
            onChange={(e) => onObservacionChange(e.target.value)}
            placeholder="Nota opcional..."
            aria-label={`Observación para ${estudiante.nombre}`}
            className="
              w-full
              px-3 py-2
              backdrop-blur-xl
              bg-[rgba(30,30,36,0.4)]
              border border-[rgba(255,255,255,0.08)]
              focus:border-[#c93448]
              focus:bg-[rgba(30,30,36,0.6)]
              focus:ring-2
              focus:ring-[rgba(201,52,72,0.2)]
              rounded-lg
              text-[#f9fafb]
              text-[13px]
              placeholder-[#4b5563]
              outline-none
              transition-all duration-200
            "
          />
        </div>

        {/* Info Badges */}
        <div className="col-span-3 flex items-center gap-2 flex-wrap">
          <PackageStatusBadgeProfesor estado={estudiante.estadoPaquete} />
        </div>
      </div>
    </div>
  )
}

interface SummaryBarProps {
  presentes: number
  ausentes: number
  alertas: number
}

function SummaryBar({ presentes, ausentes, alertas }: SummaryBarProps) {
  return (
    <div 
      className="p-4 sm:p-6 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm"
      role="region"
      aria-label="Resumen de asistencias"
    >
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
          {/* Presentes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[rgba(52,211,153,0.15)] backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#34d399]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-[11px] sm:text-[12px]">Presentes</p>
              <p className="text-[#f9fafb] font-semibold text-base sm:text-lg md:text-xl" aria-live="polite">
                {presentes}
              </p>
            </div>
          </div>

          {/* Ausentes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[rgba(156,163,175,0.15)] backdrop-blur-sm">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-[11px] sm:text-[12px]">Ausentes</p>
              <p className="text-[#f9fafb] font-semibold text-base sm:text-lg md:text-xl" aria-live="polite">
                {ausentes}
              </p>
            </div>
          </div>

          {/* Alertas */}
          {alertas > 0 && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-[rgba(245,158,11,0.15)] backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[#9ca3af] text-[11px] sm:text-[12px]">Alertas</p>
                <p className="text-[#f9fafb] font-semibold text-base sm:text-lg md:text-xl" aria-live="polite">
                  {alertas}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Auto Save Message (Requirement 3.8) */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl backdrop-blur-sm bg-[rgba(124,90,248,0.1)] border border-[rgba(124,90,248,0.2)]">
          <div className="w-2 h-2 rounded-full bg-[#7c5af8] animate-pulse" aria-hidden="true"></div>
          <p className="text-[#9b8afb] text-xs sm:text-[13px] font-medium">
            Los cambios se guardan automáticamente
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// STATE COMPONENTS
// ============================================

function EmptyClassState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-[rgba(156,163,175,0.1)] flex items-center justify-center">
        <Calendar className="w-8 h-8 text-[#6b7280]" />
      </div>
      <p className="text-[#9ca3af] text-lg mb-2">No hay clases seleccionadas</p>
      <p className="text-[#6b7280] text-sm">Selecciona una clase para ver los alumnos</p>
    </div>
  )
}

function EmptyStudentsState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-[rgba(156,163,175,0.1)] flex items-center justify-center">
        <Users className="w-8 h-8 text-[#6b7280]" />
      </div>
      <p className="text-[#9ca3af] text-lg mb-2">No hay alumnos en esta clase</p>
      <p className="text-[#6b7280] text-sm">Esta clase no tiene alumnos inscritos</p>
    </div>
  )
}

function AttendanceTableSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {/* Table header skeleton */}
      <div className="flex gap-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
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
          {/* Toggle */}
          <div className="w-32">
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
          {/* Observation */}
          <div className="flex-1">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Badge */}
          <div className="w-28">
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProfesorAttendancePage
