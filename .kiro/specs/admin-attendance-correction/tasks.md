# Implementation Plan

- [x] 1. Migrate required UI components to design system





  - [x] 1.1 Analyze and migrate Calendar component


    - Review `chetangoFrontend/components/ui/calendar.tsx` (shadcn)
    - Create `src/design-system/molecules/Calendar/Calendar.tsx`
    - Apply glass styling (backdrop-blur, glass borders, dark theme)
    - Add date range restriction and disabled dates support
    - _Requirements: 1.2, 1.3_
  - [x] 1.2 Analyze and migrate Popover component


    - Review `chetangoFrontend/components/ui/popover.tsx` (shadcn)
    - Create `src/design-system/atoms/Popover/Popover.tsx`
    - Apply glass styling for popup container
    - _Requirements: 1.2_
  - [x] 1.3 Analyze and migrate Select component


    - Review `chetangoFrontend/components/ui/select.tsx` (shadcn)
    - Create `src/design-system/atoms/GlassSelect/GlassSelect.tsx`
    - Apply glass styling matching GlassInput
    - _Requirements: 2.2_
  - [x] 1.4 Analyze and migrate Table component


    - Review `chetangoFrontend/components/ui/table.tsx` (shadcn)
    - Create `src/design-system/molecules/GlassTable/GlassTable.tsx`
    - Apply glass styling with hover states and borders
    - _Requirements: 3.1_
  - [x] 1.5 Analyze and migrate Skeleton component


    - Review `chetangoFrontend/components/ui/skeleton.tsx` (shadcn)
    - Create `src/design-system/atoms/Skeleton/Skeleton.tsx`
    - Apply glass styling with shimmer animation
    - _Requirements: 9.1_
  - [x] 1.6 Set up Toast notifications (Sonner)


    - Review `chetangoFrontend/components/ui/sonner.tsx` (shadcn)
    - Create `src/design-system/molecules/Toast/Toast.tsx` wrapper
    - Configure Sonner with glass theme
    - Add to AppProviders
    - _Requirements: 4.3, 9.2_
  - [x] 1.7 Update design system barrel exports


    - Update `src/design-system/index.ts` with new components
    - _Requirements: N/A (infrastructure)_

- [x] 2. Set up types and utilities





  - [x] 2.1 Create attendance types file with all API response and frontend types


    - Create `src/features/attendance/types/attendanceTypes.ts`
    - Define `DateRangeResponse`, `ClassesByDateResponse`, `AttendanceSummaryResponse`
    - Define `StudentAttendance`, `StudentPackage`, `AttendanceStatus`, `PackageState`
    - Define `UpdateAttendanceRequest` for mutations
    - _Requirements: 10.4_
  - [x] 2.2 Create date utilities for parsing and formatting


    - Create `src/shared/lib/dateUtils.ts` if not exists
    - Add `formatDateForAPI(date: Date): string` - returns YYYY-MM-DD
    - Add `parseAPIDate(dateStr: string): Date` - parses YYYY-MM-DD
    - Add `formatTimeForDisplay(timeStr: string): string` - formats HH:mm:ss to HH:mm
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 2.3 Write property test for date serialization round-trip


    - **Property 9: Date serialization round-trip**
    - **Validates: Requirements 10.1, 10.3**
  - [x] 2.4 Create attendance utilities for filtering and calculations


    - Create `src/features/attendance/utils/attendanceUtils.ts`
    - Add `filterStudentsBySearch(students, searchTerm): StudentAttendance[]`
    - Add `calculateAttendanceStats(students): { presentes, ausentes, sinPaquete }`
    - _Requirements: 6.1, 6.2, 6.3, 7.1_
  - [x] 2.5 Write property test for search filtering


    - **Property 7: Search filtering**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 3. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Set up API layer with React Query





  - [x] 4.1 Create attendance queries file


    - Create `src/features/attendance/api/attendanceQueries.ts`
    - Add `useDateRangeQuery()` - fetches `/api/admin/asistencias/dias-con-clases`
    - Add `useClassesByDateQuery(fecha: string)` - fetches `/api/admin/asistencias/clases-del-dia`
    - Add `useAttendanceSummaryQuery(idClase: string)` - fetches `/api/admin/asistencias/clase/{id}/resumen`
    - Use `httpClient` from `@/shared/api/httpClient`
    - _Requirements: 1.1, 2.1, 2.3_
  - [x] 4.2 Create attendance mutations file


    - Create `src/features/attendance/api/attendanceMutations.ts`
    - Add `useUpdateAttendanceMutation()` - PUT to update attendance
    - Implement optimistic updates with rollback on error
    - _Requirements: 4.4, 5.2_
  - [x] 4.3 Write property test for API data transformation


    - **Property 10: API data transformation**
    - **Validates: Requirements 10.4, 10.5**

- [x] 5. Set up Redux slice for UI state






  - [x] 5.1 Create attendance slice

    - Update `src/features/attendance/store/attendanceSlice.ts`
    - Add state: `selectedDate`, `selectedClassId`, `searchTerm`, `updatingStudents`
    - Add actions: `setSelectedDate`, `setSelectedClassId`, `setSearchTerm`, `setUpdatingStudent`
    - _Requirements: 1.4, 2.3, 6.1_

  - [x] 5.2 Register slice in root reducer

    - Update `src/app/store/rootReducer.ts` to include attendance slice
    - _Requirements: N/A (infrastructure)_

- [x] 6. Create custom hooks






  - [x] 6.1 Create useAdminAttendance hook

    - Create `src/features/attendance/hooks/useAdminAttendance.ts`
    - Combine queries, mutations, and Redux state
    - Expose: dateRange, classes, attendanceSummary, selectedDate, selectedClassId
    - Expose: setSelectedDate, setSelectedClassId, toggleAttendance, updateObservation
    - Handle loading and error states
    - _Requirements: 1.1, 2.1, 2.3, 4.4, 5.2_

  - [x] 6.2 Create useAttendanceSearch hook






    - Create `src/features/attendance/hooks/useAttendanceSearch.ts`
    - Use Redux state for searchTerm
    - Use `filterStudentsBySearch` utility
    - Return: searchTerm, setSearchTerm, filteredStudents
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create UI components - Atoms and Molecules





  - [x] 8.1 Create AttendanceToggle component


    - Create `src/features/attendance/components/admin/AttendanceToggle/`
    - Implement toggle button with green filled (Presente) and empty outline (Ausente)
    - Add hover and disabled states
    - Use glass styling from design system
    - _Requirements: 3.7, 4.1_
  - [x] 8.2 Write property test for attendance toggle visual state


    - **Property 5: Attendance toggle visual state**
    - **Validates: Requirements 3.7**
  - [x] 8.3 Create PackageStatusBadge component


    - Create `src/features/attendance/components/admin/PackageStatusBadge/`
    - Implement badge variants: Activo (green), Agotado (warning), Congelado (blue), SinPaquete (gray)
    - Add icons: Package, AlertCircle, Snowflake
    - Add progress bar for Activo/Agotado states
    - Add helper text for Congelado state
    - _Requirements: 3.3, 3.4, 3.5, 3.6_
  - [x] 8.4 Write property test for package status badge rendering


    - **Property 4: Package status badge rendering**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**
  - [x] 8.5 Create StudentSearch component


    - Create `src/features/attendance/components/admin/StudentSearch/`
    - Use GlassInput styling with search icon
    - Implement real-time filtering on input change
    - _Requirements: 6.1_
  - [x] 8.6 Create StatsSummary component


    - Create `src/features/attendance/components/admin/StatsSummary/`
    - Display counters: Presentes (green), Ausentes (gray), Sin Paquete (warning)
    - Use appropriate icons: CheckCircle2, XCircle, AlertCircle
    - _Requirements: 7.1, 7.3_
  - [x] 8.7 Write property test for counter updates


    - **Property 8: Counter updates**
    - **Validates: Requirements 7.2**

- [x] 9. Create UI components - Organisms





  - [x] 9.1 Create DateFilter component


    - Create `src/features/attendance/components/admin/DateFilter/`
    - Implement date input with calendar popup
    - Restrict calendar to 7-day range (desde to hasta)
    - Enable only dates in diasConClases array
    - Use glass input styling
    - _Requirements: 1.2, 1.3, 1.4, 1.5_


  - [x] 9.2 Write property test for calendar date enablement


    - **Property 1: Calendar date enablement**
    - **Validates: Requirements 1.3**
  - [x] 9.3 Create ClassSelector component

    - Create `src/features/attendance/components/admin/ClassSelector/`

    - Implement dropdown with class name, time range, professor
    - Handle empty state when no classes
    - Use glass select styling
    - _Requirements: 2.2, 2.4_
  - [x] 9.4 Write property test for class dropdown content

    - **Property 2: Class dropdown content**
    - **Validates: Requirements 2.2**
  - [x] 9.5 Create AttendanceRow component


    - Create `src/features/attendance/components/admin/AttendanceRow/`
    - Compose: Avatar, Name, Document, PackageStatusBadge, AttendanceToggle, Observation input
    - Handle observation debounce (500ms)
    - _Requirements: 3.2, 5.1, 5.3_
  - [x] 9.6 Write property test for student row rendering


    - **Property 3: Student row rendering**
    - **Validates: Requirements 3.2**
  - [x] 9.7 Create AttendanceTable component


    - Create `src/features/attendance/components/admin/AttendanceTable/`
    - Implement table with columns: ALUMNO, PAQUETE, ASISTENCIA, OBSERVACIÓN
    - Use AttendanceRow for each student
    - Handle empty state when no students match search
    - _Requirements: 3.1, 6.4_
  - [x] 9.8 Write property test for attendance toggle persistence


    - **Property 6: Attendance toggle persistence**
    - **Validates: Requirements 4.4**

- [x] 10. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create page and integrate components





  - [x] 11.1 Create AdminAttendanceCorrectionPage


    - Create `src/pages/admin/AdminAttendanceCorrectionPage.tsx`
    - Use useAdminAttendance and useAttendanceSearch hooks
    - Compose: AmbientGlows, TypographyBackdrop, GlassPanel
    - Layout: Header, Filters bar (DateFilter, ClassSelector, StudentSearch), AttendanceTable, StatsSummary
    - Add floating decorative elements (GlassOrb, FloatingParticle)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 11.2 Add loading states and skeletons


    - Add skeleton loaders for date range, classes, and attendance table
    - Show loading spinner on individual toggle updates
    - _Requirements: 9.1, 9.3_
  - [x] 11.3 Add error handling and toast notifications


    - Display error toast on API failures
    - Show success toast for frozen package reactivation
    - Implement retry option on errors
    - _Requirements: 4.3, 4.5, 9.2_
  - [x] 11.4 Update barrel exports


    - Update `src/features/attendance/index.ts` with public exports
    - Update `src/features/attendance/components/admin/index.ts`
    - _Requirements: N/A (infrastructure)_

- [x] 12. Configure routing


  - [x] 12.1 Add route for admin attendance correction page
    - Update `src/app/router/routes.tsx`
    - Add route `/admin/attendance/correction` with AdminAttendanceCorrectionPage
    - Ensure route is protected with admin role guard
    - _Requirements: N/A (infrastructure)_
  - [x] 12.2 Update routes constants

    - Update `src/shared/constants/routes.ts`
    - Add `ADMIN.ATTENDANCE_CORRECTION: '/admin/attendance/correction'`
    - _Requirements: N/A (infrastructure)_


- [ ] 13. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
