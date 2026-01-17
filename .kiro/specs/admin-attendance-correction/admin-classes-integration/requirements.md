# Requirements Document

## Introduction

Este documento define los requisitos para integrar la página de Gestión de Clases del panel de administración del frontend de Chetango con el API backend existente. El objetivo es hacer funcional el esqueleto de UI existente (estilo glassmorphism) conectándolo correctamente con los endpoints documentados en el contrato API de Clases, utilizando autenticación Microsoft Entra External ID (CIAM).

Esta página está diseñada principalmente para **administradores**, quienes tienen acceso completo a todas las clases y profesores. Los profesores tienen acceso limitado solo a sus propias clases (ownership validation manejada por el backend).

## Glossary

- **Classes_Page**: Página de gestión de clases ubicada en `/admin/clases`
- **MSAL**: Microsoft Authentication Library - biblioteca para autenticación con Entra ID
- **httpClient**: Cliente HTTP (Axios) configurado para hacer peticiones al backend
- **Access_Token**: Token JWT obtenido de Entra ID que contiene roles y permisos del usuario
- **TiposClase_API**: Endpoint `GET /api/tipos-clase` que retorna los tipos de clase disponibles
- **Profesores_API**: Endpoint `GET /api/profesores` que retorna los profesores activos
- **Alumnos_API**: Endpoint `GET /api/alumnos` que retorna los alumnos activos
- **PaquetesAlumno_API**: Endpoint `GET /api/alumnos/{idAlumno}/paquetes` que retorna paquetes de un alumno
- **CreateClase_API**: Endpoint `POST /api/clases` que crea una nueva clase
- **UpdateClase_API**: Endpoint `PUT /api/clases/{id}` que actualiza una clase existente
- **DeleteClase_API**: Endpoint `DELETE /api/clases/{id}` que cancela/elimina una clase
- **GetClase_API**: Endpoint `GET /api/clases/{id}` que obtiene detalles de una clase
- **ClasesProfesor_API**: Endpoint `GET /api/profesores/{idProfesor}/clases` que lista clases de un profesor
- **ClaseCard**: Componente que muestra una tarjeta de clase con información resumida
- **ClaseFormModal**: Modal para crear/editar clases
- **ClaseDetailModal**: Modal para ver detalles de una clase

## Requirements

### Requirement 1: Configuración de Autenticación y HTTP Client

**User Story:** Como desarrollador frontend, quiero que el httpClient esté configurado correctamente para comunicarse con el módulo de Clases del backend, reutilizando la configuración MSAL existente.

#### Acceptance Criteria

1. THE httpClient SHALL use the base URL `https://localhost:7194` for HTTPS connections
2. THE Auth_Interceptor SHALL add the header `Authorization: Bearer {access_token}` to all requests
3. THE httpClient SHALL include the header `Content-Type: application/json` in all requests
4. WHEN a request returns 401 Unauthorized, THE Auth_Interceptor SHALL redirect the user to login
5. WHEN a request returns 403 Forbidden, THE Error_Handler SHALL display "No tienes permisos para acceder a esta función"

### Requirement 2: Consulta de Catálogos (Lookups) - Solo Admin

**User Story:** Como administrador, quiero que los dropdowns de la página de clases se carguen con datos reales del backend, para poder seleccionar tipos de clase, profesores y monitores.

#### Acceptance Criteria

1. WHEN the Classes_Page loads, THE TiposClase_Query SHALL call `GET /api/tipos-clase`
2. THE TiposClase_Query SHALL parse the response containing array of `{id, nombre}` objects
3. WHEN the user has Admin role, THE Profesores_Query SHALL call `GET /api/profesores`
4. THE Profesores_Query SHALL parse the response containing array of `{idProfesor, nombreCompleto, tipoProfesor}` objects
5. THE TipoClase_Dropdown SHALL display all tipos de clase from the API response
6. THE Profesor_Dropdown SHALL display all profesores from the API response (Admin only)
7. IF the user is a Profesor (not Admin), THEN THE Profesor_Dropdown SHALL be hidden or show only the current user
8. IF any catalog API returns an error, THEN THE System SHALL display an error toast and allow retry

### Requirement 3: Listado de Clases - Vista Admin

**User Story:** Como administrador, quiero ver el listado de todas las clases programadas con filtros por fecha, profesor y tipo, para gestionar el calendario de clases de toda la academia.

#### Acceptance Criteria

1. WHEN the Classes_Page loads for Admin, THE System SHALL fetch classes for all professors or a selected professor
2. THE ClasesProfesor_Query SHALL call `GET /api/profesores/{idProfesor}/clases` with pagination parameters
3. THE ClasesProfesor_Query SHALL support query parameters: `fechaDesde`, `fechaHasta`, `pagina`, `tamanoPagina`
4. THE Classes_List SHALL display classes grouped by date in chronological order
5. THE Classes_List SHALL show for each class: tipo, horario (horaInicio - horaFin), profesor principal, monitores, capacidad/inscriptos, observaciones
6. THE Classes_List SHALL display estado badges: "Hoy" (rojo), "Programada" (morado), "Completada" (verde), "Cancelada" (gris)
7. WHEN filters are applied, THE ClasesProfesor_Query SHALL refetch with updated parameters
8. IF the ClasesProfesor_API returns an error, THEN THE Classes_Page SHALL display an error state with retry option
9. THE Admin SHALL be able to filter by any profesor using the Profesor_Filter dropdown

### Requirement 4: Visualización de Detalle de Clase

**User Story:** Como administrador, quiero ver los detalles completos de una clase en un modal, para revisar toda la información antes de tomar acciones.

#### Acceptance Criteria

1. WHEN the user clicks "Ver Detalle" on a ClaseCard, THE GetClase_Query SHALL call `GET /api/clases/{idClase}`
2. THE GetClase_Query SHALL parse the response containing: idClase, fecha, horaInicio, horaFin, tipoClase, nombreProfesor, cupoMaximo, observaciones, totalAsistencias, monitores
3. THE ClaseDetailModal SHALL display all class details including: estado badge, fecha formateada, horario con duración calculada, profesor principal, inscriptos/capacidad con barra de progreso
4. THE ClaseDetailModal SHALL show a button "Ir a Asistencia" that navigates to the attendance page for that class
5. IF the GetClase_API returns 404, THEN THE System SHALL display "La clase especificada no existe"

### Requirement 5: Creación de Nueva Clase - Admin

**User Story:** Como administrador, quiero crear nuevas clases programadas asignando cualquier profesor, para organizar el calendario de enseñanza de toda la academia.

#### Acceptance Criteria

1. WHEN the Admin clicks "Nueva Clase", THE ClaseFormModal SHALL open in create mode
2. THE ClaseFormModal SHALL display fields: fecha, horaInicio, horaFin, tipoClase (dropdown), profesorPrincipal (dropdown con todos los profesores), monitores (multi-select), cupoMaximo, observaciones
3. WHEN the Admin submits the form, THE CreateClase_Mutation SHALL call `POST /api/clases` with body: `{idProfesorPrincipal, idTipoClase, fecha, horaInicio, horaFin, cupoMaximo, observaciones}`
4. THE CreateClase_Mutation SHALL validate that fecha and hora are in the future before sending
5. IF the CreateClase_API returns 201 with idClase, THEN THE Classes_List SHALL refresh and show the new class
6. IF the CreateClase_API returns 400 with error message (e.g., "El profesor ya tiene una clase programada en ese horario"), THEN THE System SHALL display the error message in a toast
7. THE Form_Validation SHALL prevent submission if required fields are empty
8. THE Admin SHALL be able to select any profesor from the dropdown

### Requirement 6: Edición de Clase Existente - Admin

**User Story:** Como administrador, quiero editar cualquier clase programada, para ajustar horarios, profesores o capacidad según sea necesario.

#### Acceptance Criteria

1. WHEN the Admin clicks the edit icon on a ClaseCard, THE ClaseFormModal SHALL open in edit mode with pre-filled data
2. THE ClaseFormModal SHALL load current class data from the GetClase_API response
3. WHEN the Admin submits changes, THE UpdateClase_Mutation SHALL call `PUT /api/clases/{idClase}` with body: `{idTipoClase, idProfesor, fechaHoraInicio, duracionMinutos, cupoMaximo, observaciones}`
4. IF the UpdateClase_API returns 204 No Content, THEN THE Classes_List SHALL refresh with updated data
5. IF the UpdateClase_API returns 400 with error message, THEN THE System SHALL display the error message
6. THE Edit_Button SHALL only be visible for classes with estado "programada" or "hoy"
7. THE Admin SHALL be able to change the profesor of any class

### Requirement 7: Cancelación de Clase - Admin

**User Story:** Como administrador, quiero cancelar cualquier clase programada, para manejar situaciones como enfermedad del profesor o falta de inscriptos.

#### Acceptance Criteria

1. WHEN the Admin clicks the cancel icon on a ClaseCard, THE System SHALL show a confirmation dialog
2. WHEN the Admin confirms cancellation, THE DeleteClase_Mutation SHALL call `DELETE /api/clases/{idClase}`
3. IF the DeleteClase_API returns 204 No Content, THEN THE ClaseCard SHALL update to show estado "Cancelada"
4. IF the DeleteClase_API returns 400 with error message (e.g., "No puedes cancelar una clase que ya tiene asistencias registradas"), THEN THE System SHALL display the error message
5. THE Cancel_Button SHALL only be visible for classes with estado "programada" or "hoy"
6. WHEN a class is cancelled, THE ClaseCard SHALL display with reduced opacity and "Cancelada" badge

### Requirement 8: Filtrado y Búsqueda de Clases

**User Story:** Como administrador, quiero filtrar y buscar clases por diferentes criterios, para encontrar rápidamente las clases que necesito gestionar.

#### Acceptance Criteria

1. THE Search_Input SHALL filter classes by tipo de clase or nombre de profesor (client-side)
2. THE Date_Filter SHALL filter classes by fecha específica
3. THE Profesor_Filter SHALL filter classes by profesor principal
4. THE Tipo_Filter SHALL filter classes by tipo de clase
5. WHEN filters are applied, THE Classes_List SHALL update immediately showing only matching classes
6. WHEN filters are cleared, THE Classes_List SHALL show all classes
7. THE Search_Input SHALL debounce input by 300ms before filtering

### Requirement 9: Estadísticas de Clases

**User Story:** Como administrador, quiero ver estadísticas rápidas sobre las clases, para tener una visión general del calendario.

#### Acceptance Criteria

1. THE Stats_Cards SHALL display: "Hoy" (clases del día actual), "Esta semana" (clases próximos 7 días), "Canceladas" (total canceladas)
2. THE Stats_Cards SHALL calculate values from the loaded classes data
3. THE Stats_Cards SHALL update when the classes list changes
4. THE Stats_Cards SHALL be positioned as floating elements on the right side of the page

### Requirement 10: Manejo de Estados de Carga

**User Story:** Como administrador, quiero ver indicadores de carga mientras se obtienen datos, para saber que el sistema está procesando mi solicitud.

#### Acceptance Criteria

1. WHILE the TiposClase_Query or Profesores_Query is loading, THE Dropdowns SHALL display skeleton loaders
2. WHILE the ClasesProfesor_Query is loading, THE Classes_List SHALL display skeleton cards
3. WHILE a mutation (create/update/delete) is in progress, THE Submit_Button SHALL show loading state and be disabled
4. THE loading states SHALL not block user interaction with other parts of the page

### Requirement 11: Manejo de Errores y Permisos - Admin Context

**User Story:** Como sistema, quiero manejar correctamente los errores de autorización y validación, informando al administrador cuando hay problemas.

#### Acceptance Criteria

1. IF the API returns 401 Unauthorized, THEN THE System SHALL redirect the user to the login page
2. IF the API returns 403 Forbidden, THEN THE System SHALL display "No tienes permisos para acceder a esta función" (esto no debería ocurrir para Admin)
3. IF the API returns 400 Bad Request, THEN THE System SHALL display the error message from the response body
4. IF the API returns 404 Not Found, THEN THE System SHALL display "El recurso solicitado no existe"
5. THE Error_Messages SHALL be displayed using toast notifications for non-blocking errors
6. THE Admin role SHALL have full access to all classes and all professors

### Requirement 12: Navegación a Asistencias

**User Story:** Como administrador, quiero poder navegar directamente desde una clase a su página de asistencias, para gestionar la asistencia de los alumnos.

#### Acceptance Criteria

1. THE ClaseCard SHALL display a button "Ir a Asistencia" for classes with estado not "cancelada"
2. WHEN the user clicks "Ir a Asistencia", THE System SHALL navigate to `/admin/asistencias?claseId={idClase}`
3. THE ClaseDetailModal SHALL also display the "Ir a Asistencia" button
4. THE navigation SHALL preserve the class context for the attendance page
