# Requirements Document

## Introduction

Este documento define los requisitos para integrar la página de Corrección de Asistencias del frontend de Chetango con el API backend existente. El objetivo es hacer funcional el esqueleto de UI existente conectándolo correctamente con los endpoints documentados en el contrato API, utilizando autenticación Microsoft Entra External ID (CIAM).

## Glossary

- **Admin_Attendance_Page**: Página de corrección de asistencias para administradores ubicada en `/admin/asistencias`
- **MSAL**: Microsoft Authentication Library - biblioteca para autenticación con Entra ID
- **httpClient**: Cliente HTTP (Axios) configurado para hacer peticiones al backend
- **Access_Token**: Token JWT obtenido de Entra ID que contiene roles y permisos del usuario
- **DateRange_API**: Endpoint `GET /api/admin/asistencias/dias-con-clases` que retorna el rango de fechas con clases
- **ClassesByDate_API**: Endpoint `GET /api/admin/asistencias/clases-del-dia?fecha={YYYY-MM-DD}` que retorna clases de una fecha
- **AttendanceSummary_API**: Endpoint `GET /api/admin/asistencias/clase/{idClase}/resumen` que retorna resumen de asistencias
- **UpdateAttendance_API**: Endpoint `PUT /api/asistencias/{id}/estado` que actualiza el estado de una asistencia
- **RegisterAttendance_API**: Endpoint `POST /api/asistencias` que registra una nueva asistencia

## Requirements

### Requirement 1: Configuración de Autenticación MSAL

**User Story:** Como desarrollador frontend, quiero configurar correctamente MSAL con los parámetros del tenant de Chetango, para que los usuarios puedan autenticarse y obtener tokens válidos para el API.

#### Acceptance Criteria

1. THE MSAL_Config SHALL use the correct Client ID `d35c1d4d-9ddc-4a8b-bb89-1964b37ff573` from the API contract
2. THE MSAL_Config SHALL use the authority URL `https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251`
3. THE Token_Request SHALL include the scope `api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/chetango.api` for API access
4. THE Token_Request SHALL include scopes `openid`, `profile`, and `email` for user information
5. WHEN the user authenticates, THE MSAL_Instance SHALL store tokens in sessionStorage

### Requirement 2: Configuración del Cliente HTTP

**User Story:** Como desarrollador frontend, quiero que el httpClient esté configurado para comunicarse con el backend de Chetango, para que las peticiones lleguen correctamente al servidor.

#### Acceptance Criteria

1. THE httpClient SHALL use the base URL `https://localhost:7194` for HTTPS connections
2. THE Auth_Interceptor SHALL add the header `Authorization: Bearer {access_token}` to all requests
3. THE httpClient SHALL include the header `Content-Type: application/json` in all requests
4. WHEN a request returns 401 Unauthorized, THE Auth_Interceptor SHALL redirect the user to login
5. WHEN a request returns 403 Forbidden, THE Error_Handler SHALL display an appropriate error message

### Requirement 3: Consulta de Rango de Fechas

**User Story:** Como administrador, quiero ver los últimos 7 días con indicación de cuáles tienen clases, para poder seleccionar una fecha y revisar asistencias.

#### Acceptance Criteria

1. WHEN the Admin_Attendance_Page loads, THE DateRange_Query SHALL call `GET /api/admin/asistencias/dias-con-clases`
2. THE DateRange_Query SHALL parse the response containing `hoy`, `desde`, `hasta`, and `diasConClases` fields
3. THE Date_Filter component SHALL display dates from `desde` to `hasta` (7 days)
4. THE Date_Filter component SHALL visually highlight dates present in `diasConClases` array
5. IF the DateRange_API returns an error, THEN THE Admin_Attendance_Page SHALL display an error state with retry option

### Requirement 4: Consulta de Clases por Fecha

**User Story:** Como administrador, quiero ver las clases disponibles para una fecha seleccionada, para poder elegir cuál revisar.

#### Acceptance Criteria

1. WHEN a date is selected, THE ClassesByDate_Query SHALL call `GET /api/admin/asistencias/clases-del-dia?fecha={selectedDate}`
2. THE ClassesByDate_Query SHALL parse the response containing `fecha` and `clases` array
3. THE Class_Selector component SHALL display each class with format `{nombre} - {horaInicio} a {horaFin} ({profesorPrincipal})`
4. IF no classes exist for the selected date, THEN THE Class_Selector SHALL display "No hay clases para esta fecha"
5. IF the ClassesByDate_API returns an error, THEN THE Admin_Attendance_Page SHALL display an error state

### Requirement 5: Consulta de Resumen de Asistencias

**User Story:** Como administrador, quiero ver el listado de alumnos con su estado de asistencia y paquete para una clase, para poder revisar y corregir asistencias.

#### Acceptance Criteria

1. WHEN a class is selected, THE AttendanceSummary_Query SHALL call `GET /api/admin/asistencias/clase/{idClase}/resumen`
2. THE AttendanceSummary_Query SHALL parse the response containing class details and `alumnos` array
3. THE Attendance_Table SHALL display each student with: nombre, documento, estado de paquete, estado de asistencia, y observación
4. THE Stats_Summary SHALL display counts of `presentes`, `ausentes`, and `sinPaquete` from the response
5. IF the AttendanceSummary_API returns an error, THEN THE Admin_Attendance_Page SHALL display an error state with retry option

### Requirement 6: Actualización de Estado de Asistencia

**User Story:** Como administrador, quiero poder cambiar el estado de asistencia de un alumno (Presente/Ausente), para corregir errores en el registro.

#### Acceptance Criteria

1. WHEN the admin toggles attendance status, THE Update_Mutation SHALL call `PUT /api/asistencias/{idAsistencia}/estado`
2. THE Update_Mutation SHALL send a body with `idAsistencia`, `presente` (boolean), and optional `observacion`
3. THE Attendance_Toggle SHALL implement optimistic updates showing the new state immediately
4. IF the UpdateAttendance_API returns 204 No Content, THEN THE Attendance_Table SHALL reflect the updated state
5. IF the UpdateAttendance_API returns an error, THEN THE Attendance_Toggle SHALL rollback to previous state and show error toast

### Requirement 7: Registro de Nueva Asistencia

**User Story:** Como administrador, quiero poder registrar una asistencia para un alumno que no tiene registro previo, para completar la información de la clase.

#### Acceptance Criteria

1. WHEN an admin registers attendance for a student without existing record, THE Register_Mutation SHALL call `POST /api/asistencias`
2. THE Register_Mutation SHALL send a body with `idClase`, `idAlumno`, `presente` (boolean), and optional `observacion`
3. IF the RegisterAttendance_API returns 201 Created with the new attendance ID, THEN THE Attendance_Table SHALL update to show the new record
4. IF the RegisterAttendance_API returns 400 Bad Request, THEN THE System SHALL display the error message from the response

### Requirement 8: Actualización de Observaciones

**User Story:** Como administrador, quiero poder agregar o editar observaciones en una asistencia, para documentar situaciones especiales.

#### Acceptance Criteria

1. WHEN the admin edits an observation field, THE Update_Mutation SHALL call `PUT /api/asistencias/{idAsistencia}/estado` with the new observation
2. THE Observation_Input SHALL debounce changes by 500ms before sending the update
3. THE Observation_Input SHALL show a loading indicator while the update is in progress
4. IF the update succeeds, THEN THE Observation_Input SHALL show a brief success indicator
5. IF the update fails, THEN THE Observation_Input SHALL revert to the previous value and show error toast

### Requirement 9: Búsqueda y Filtrado de Alumnos

**User Story:** Como administrador, quiero poder buscar alumnos por nombre o documento, para encontrar rápidamente a un estudiante específico.

#### Acceptance Criteria

1. THE Student_Search component SHALL filter the displayed students by `nombreCompleto` or `documentoIdentidad`
2. THE Student_Search SHALL perform filtering client-side on the loaded data
3. THE Student_Search SHALL update results in tiempo real while typing (debounced 300ms)
4. WHEN search term is cleared, THE Attendance_Table SHALL show all students
5. THE Stats_Summary SHALL update to reflect only the filtered students

### Requirement 10: Manejo de Estados de Carga

**User Story:** Como administrador, quiero ver indicadores de carga mientras se obtienen datos, para saber que el sistema está procesando mi solicitud.

#### Acceptance Criteria

1. WHILE the DateRange_Query is loading, THE Date_Filter SHALL display a skeleton loader
2. WHILE the ClassesByDate_Query is loading, THE Class_Selector SHALL display a skeleton loader
3. WHILE the AttendanceSummary_Query is loading, THE Attendance_Table SHALL display skeleton rows
4. WHILE an attendance update is in progress, THE Attendance_Toggle for that student SHALL show a loading state
5. THE loading states SHALL not block user interaction with other parts of the page

### Requirement 11: Manejo de Errores de Autorización

**User Story:** Como sistema, quiero manejar correctamente los errores de autorización, para informar al usuario cuando no tiene permisos.

#### Acceptance Criteria

1. IF the API returns 401 Unauthorized, THEN THE System SHALL redirect the user to the login page
2. IF the API returns 403 Forbidden, THEN THE System SHALL display "No tienes permisos para acceder a esta función"
3. IF the API returns 404 Not Found, THEN THE System SHALL display "El recurso solicitado no existe"
4. THE Error_Messages SHALL be displayed using toast notifications for non-blocking errors
5. THE Error_Messages SHALL be displayed inline for blocking errors (like 403 on page load)
