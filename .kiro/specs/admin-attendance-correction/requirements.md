# Requirements Document

## Introduction

Este documento define los requisitos para la página de Corrección de Asistencias del panel de administración de Chetango. Esta funcionalidad permite a los administradores revisar, verificar y corregir las asistencias de los últimos 7 días, asegurando que todos los estudiantes que asistieron tengan su registro correcto. La página utiliza el design system premium de Chetango con estética glassmorphism.

El flujo principal es: Seleccionar Fecha → Seleccionar Clase → Ver/Editar Asistencias (con búsqueda opcional).

## Glossary

- **Admin_Attendance_System**: Sistema de corrección de asistencias para administradores de Chetango
- **Attendance_Record**: Registro individual de asistencia de un alumno en una clase específica
- **Package_Status**: Estado del paquete de clases de un alumno (Activo, Agotado, Congelado, SinPaquete)
- **Attendance_Status**: Estado de asistencia de un alumno (Presente, Ausente)
- **Class_Session**: Sesión de clase específica en una fecha y hora determinada
- **Date_Range**: Rango de fechas desde hoy hasta 7 días atrás, mostrando solo días con clases
- **Observation**: Nota opcional asociada a un registro de asistencia
- **Package_Deduction**: Descuento de una clase del paquete del alumno al marcar presente

## Requirements

### Requirement 1

**User Story:** As an admin, I want to view a date picker restricted to the last 7 days with classes, so that I can navigate to specific dates to review attendance.

#### Acceptance Criteria

1. WHEN the admin loads the attendance correction page THEN the Admin_Attendance_System SHALL fetch the date range from `/api/admin/asistencias/dias-con-clases` and display a date input showing the current date
2. WHEN the admin clicks the date input THEN the Admin_Attendance_System SHALL open a calendar popup showing only the range from `desde` to `hasta` (7 days)
3. WHEN displaying the calendar THEN the Admin_Attendance_System SHALL enable only dates present in `diasConClases` array and disable dates without classes
4. WHEN the admin selects a valid date with classes THEN the Admin_Attendance_System SHALL update the date input, close the calendar, and trigger a fetch of classes for that date
5. WHEN the admin attempts to select a disabled date THEN the Admin_Attendance_System SHALL prevent selection and maintain the current date

### Requirement 2

**User Story:** As an admin, I want to select a specific class from the selected date, so that I can view and manage attendance for that class session.

#### Acceptance Criteria

1. WHEN the admin selects a date THEN the Admin_Attendance_System SHALL fetch classes from `/api/admin/asistencias/clases-del-dia?fecha={selectedDate}`
2. WHEN classes are loaded THEN the Admin_Attendance_System SHALL display a dropdown with class name, time range, and professor name
3. WHEN the admin selects a class THEN the Admin_Attendance_System SHALL fetch the attendance summary from `/api/admin/asistencias/clase/{idClase}/resumen`
4. WHEN no classes exist for the selected date THEN the Admin_Attendance_System SHALL display an empty state message

### Requirement 3

**User Story:** As an admin, I want to view a list of all students enrolled in the selected class with their attendance status, so that I can review who attended.

#### Acceptance Criteria

1. WHEN the class summary loads THEN the Admin_Attendance_System SHALL display a table with columns: ALUMNO, PAQUETE, ASISTENCIA, OBSERVACIÓN
2. WHEN displaying ALUMNO column THEN the Admin_Attendance_System SHALL show avatar with two initials (`avatarIniciales`), full name (`nombreCompleto`), and document identity (`documentoIdentidad`) below the name
3. WHEN displaying PAQUETE column with estado Activo THEN the Admin_Attendance_System SHALL show green badge with package icon and description (e.g., "8 Clases") plus progress bar showing `clasesUsadas/clasesTotales`
4. WHEN displaying PAQUETE column with estado Agotado THEN the Admin_Attendance_System SHALL show warning badge with alert icon and text "Paquete Agotado"
5. WHEN displaying PAQUETE column with estado Congelado THEN the Admin_Attendance_System SHALL show blue badge with snowflake icon and text "Paquete Congelado" plus helper text "Si marcas presente, se reactivará automáticamente"
6. WHEN displaying PAQUETE column with estado SinPaquete THEN the Admin_Attendance_System SHALL show gray badge with alert icon and text "Sin paquete activo"
7. WHEN displaying ASISTENCIA column THEN the Admin_Attendance_System SHALL show a toggle button (green filled for Presente, empty outline for Ausente)

### Requirement 4

**User Story:** As an admin, I want to toggle attendance status for any student, so that I can correct attendance records.

#### Acceptance Criteria

1. WHEN the admin clicks the attendance toggle THEN the Admin_Attendance_System SHALL visually update the toggle state immediately (optimistic update) showing green checkmark for Presente or empty outline for Ausente
2. WHEN toggling attendance to Presente THEN the Admin_Attendance_System SHALL trigger a package deduction (one class consumed from the student package)
3. WHEN toggling attendance for a student with frozen package to Presente THEN the Admin_Attendance_System SHALL display a toast notification indicating the package was reactivated automatically
4. WHEN the attendance toggle is changed THEN the Admin_Attendance_System SHALL persist the change via API call
5. WHEN the API call fails THEN the Admin_Attendance_System SHALL revert the toggle state and display an error notification

### Requirement 5

**User Story:** As an admin, I want to add observations to attendance records, so that I can document special circumstances.

#### Acceptance Criteria

1. WHEN the admin types in the observation field THEN the Admin_Attendance_System SHALL debounce input for 500ms before persisting
2. WHEN the observation is saved THEN the Admin_Attendance_System SHALL persist the change via API call
3. WHEN the observation field loses focus with changes THEN the Admin_Attendance_System SHALL trigger a save operation

### Requirement 6

**User Story:** As an admin, I want to search students by name or document, so that I can quickly find specific students.

#### Acceptance Criteria

1. WHEN the admin types in the search field THEN the Admin_Attendance_System SHALL filter the currently loaded student list in real-time (client-side filtering)
2. WHEN the search term matches student `nombreCompleto` (case-insensitive) THEN the Admin_Attendance_System SHALL include that student in results
3. WHEN the search term matches student `documentoIdentidad` THEN the Admin_Attendance_System SHALL include that student in results
4. WHEN no students match the search THEN the Admin_Attendance_System SHALL display an empty state with search icon and message "No se encontraron estudiantes"
5. WHEN the search field is cleared THEN the Admin_Attendance_System SHALL display all students from the current class

### Requirement 7

**User Story:** As an admin, I want to see attendance statistics summary, so that I can quickly understand the class attendance status.

#### Acceptance Criteria

1. WHEN the class summary loads THEN the Admin_Attendance_System SHALL display counters for: Presentes, Ausentes, Sin Paquete
2. WHEN attendance is toggled THEN the Admin_Attendance_System SHALL update the counters in real-time
3. WHEN displaying counters THEN the Admin_Attendance_System SHALL use appropriate icons and colors for each category

### Requirement 8

**User Story:** As an admin, I want the page to follow the Chetango design system, so that the UI is consistent with the rest of the application.

#### Acceptance Criteria

1. WHEN rendering the page THEN the Admin_Attendance_System SHALL use GlassPanel components for main containers
2. WHEN rendering inputs THEN the Admin_Attendance_System SHALL use the glass input styling with proper focus states
3. WHEN rendering badges THEN the Admin_Attendance_System SHALL use Chip components with appropriate variants (active, depleted, frozen, none)
4. WHEN rendering the page THEN the Admin_Attendance_System SHALL include ambient glows, typography backdrop, and floating decorative elements

### Requirement 9

**User Story:** As an admin, I want proper loading and error states, so that I understand the system status at all times.

#### Acceptance Criteria

1. WHEN data is being fetched THEN the Admin_Attendance_System SHALL display skeleton loaders in place of content
2. WHEN an API error occurs THEN the Admin_Attendance_System SHALL display an error toast with retry option
3. WHEN the page loads initially THEN the Admin_Attendance_System SHALL show loading state until date range is fetched

### Requirement 10

**User Story:** As an admin, I want the attendance data to be serialized and deserialized correctly, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN receiving API responses THEN the Admin_Attendance_System SHALL parse DateOnly fields as `YYYY-MM-DD` format
2. WHEN receiving API responses THEN the Admin_Attendance_System SHALL parse TimeOnly fields as `HH:mm:ss` format
3. WHEN sending API requests THEN the Admin_Attendance_System SHALL serialize dates in `YYYY-MM-DD` format
4. WHEN parsing attendance data THEN the Admin_Attendance_System SHALL validate and transform API response to typed frontend models
5. WHEN serializing attendance updates THEN the Admin_Attendance_System SHALL produce valid JSON matching API contract
