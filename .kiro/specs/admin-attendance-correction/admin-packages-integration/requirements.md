# Requirements Document

## Introduction

Este documento define los requisitos para integrar la página de Gestión de Paquetes del panel de administración del frontend de Chetango con el API backend existente. El objetivo es hacer funcional la UI de gestión de paquetes de clases conectándola correctamente con los endpoints documentados en el contrato API de Paquetes, utilizando autenticación Microsoft Entra External ID (CIAM).

Esta página está diseñada exclusivamente para **administradores**, quienes tienen acceso completo para crear, ver, editar, congelar y descongelar paquetes de cualquier alumno. El consumo de clases se calcula automáticamente desde el módulo de Asistencias.

## Glossary

- **Packages_Page**: Página de gestión de paquetes ubicada en `/admin/paquetes`
- **MSAL**: Microsoft Authentication Library - biblioteca para autenticación con Entra ID
- **httpClient**: Cliente HTTP (Axios) configurado para hacer peticiones al backend
- **Access_Token**: Token JWT obtenido de Entra ID que contiene roles y permisos del usuario
- **Alumnos_API**: Endpoint `GET /api/alumnos` que retorna los alumnos activos
- **TiposPaquete_API**: Endpoint `GET /api/tipos-paquete` que retorna los tipos de paquete disponibles
- **CreatePaquete_API**: Endpoint `POST /api/paquetes` que crea un nuevo paquete
- **GetPaquete_API**: Endpoint `GET /api/paquetes/{id}` que obtiene detalles de un paquete
- **UpdatePaquete_API**: Endpoint `PUT /api/paquetes/{id}` que actualiza un paquete existente
- **CongelarPaquete_API**: Endpoint `POST /api/paquetes/{id}/congelar` que congela un paquete
- **DescongelarPaquete_API**: Endpoint `POST /api/paquetes/{id}/descongelar` que descongela un paquete
- **PaquetesAlumno_API**: Endpoint `GET /api/alumnos/{idAlumno}/paquetes` que lista paquetes de un alumno
- **PackageCard**: Fila de la tabla que muestra información resumida de un paquete
- **CreatePackageModal**: Modal para crear nuevos paquetes
- **PackageDetailModal**: Modal para ver detalles completos de un paquete con historial de consumo
- **EstadoPaquete**: Enum con valores: Activo (1), Vencido (2), Congelado (3), Agotado (4)

## Requirements

### Requirement 1: Configuración de Autenticación y HTTP Client

**User Story:** Como desarrollador frontend, quiero que el httpClient esté configurado correctamente para comunicarse con el módulo de Paquetes del backend, reutilizando la configuración MSAL existente.

#### Acceptance Criteria

1. THE httpClient SHALL use the base URL `https://localhost:7194` for HTTPS connections
2. THE Auth_Interceptor SHALL add the header `Authorization: Bearer {access_token}` to all requests
3. THE httpClient SHALL include the header `Content-Type: application/json` in all requests
4. WHEN a request returns 401 Unauthorized, THE Auth_Interceptor SHALL redirect the user to login
5. WHEN a request returns 403 Forbidden, THE Error_Handler SHALL display "No tienes permisos para acceder a esta función"

### Requirement 2: Consulta de Catálogos (Lookups)

**User Story:** Como administrador, quiero que los dropdowns de la página de paquetes se carguen con datos reales del backend, para poder seleccionar alumnos y tipos de paquete.

#### Acceptance Criteria

1. WHEN the Packages_Page loads, THE Alumnos_Query SHALL call `GET /api/alumnos`
2. THE Alumnos_Query SHALL parse the response containing array of `{idAlumno, nombreCompleto, documentoIdentidad}` objects
3. WHEN the Packages_Page loads, THE TiposPaquete_Query SHALL call `GET /api/tipos-paquete`
4. THE TiposPaquete_Query SHALL parse the response containing array of `{id, nombre, clasesDisponibles, diasVigencia, precio}` objects
5. THE Alumno_Dropdown SHALL display all alumnos with format `{nombreCompleto} - {documentoIdentidad}`
6. THE TipoPaquete_Dropdown SHALL display all tipos de paquete with format `{nombre} ({clasesDisponibles} clases)`
7. IF any catalog API returns an error, THEN THE System SHALL display an error toast and allow retry

### Requirement 3: Listado de Paquetes con Estadísticas

**User Story:** Como administrador, quiero ver el listado de todos los paquetes con estadísticas por estado, para tener una visión general de los paquetes de la academia.

#### Acceptance Criteria

1. WHEN the Packages_Page loads, THE System SHALL fetch all packages using `GET /api/alumnos/{idAlumno}/paquetes` for each alumno or a consolidated endpoint
2. THE Stats_Cards SHALL display counts grouped by estado: Activos (verde), Agotados (naranja), Congelados (azul), Vencidos (gris)
3. THE Total_Badge SHALL display the total count of all packages
4. THE Packages_Table SHALL display columns: ALUMNO, PAQUETE, CONSUMO, ESTADO, VIGENCIA, ACCIONES
5. THE ALUMNO column SHALL display avatar with initials, nombre completo, and documento de identidad
6. THE PAQUETE column SHALL display nombre del tipo de paquete and cantidad de clases
7. THE CONSUMO column SHALL display `{clasesUsadas} / {clasesDisponibles}`, progress bar, and percentage
8. THE ESTADO column SHALL display a colored badge: Activo (verde), Agotado (naranja), Congelado (azul), Vencido (gris)
9. THE VIGENCIA column SHALL display fecha inicio and fecha fin formatted
10. THE ACCIONES column SHALL display a view detail button (eye icon)

### Requirement 4: Filtrado y Búsqueda de Paquetes

**User Story:** Como administrador, quiero filtrar y buscar paquetes por diferentes criterios, para encontrar rápidamente los paquetes que necesito gestionar.

#### Acceptance Criteria

1. THE Search_Input SHALL filter packages by alumno nombre or documento de identidad (client-side)
2. THE Estado_Filter SHALL filter packages by estado: Todos, Activo, Agotado, Congelado, Vencido
3. THE TipoPaquete_Filter SHALL filter packages by tipo de paquete
4. WHEN filters are applied, THE Packages_Table SHALL update immediately showing only matching packages
5. WHEN filters are cleared, THE Packages_Table SHALL show all packages
6. THE Search_Input SHALL debounce input by 300ms before filtering
7. THE Stats_Cards SHALL update to reflect only the filtered packages count

### Requirement 5: Creación de Nuevo Paquete

**User Story:** Como administrador, quiero crear nuevos paquetes de clases para los alumnos, para que puedan asistir a clases.

#### Acceptance Criteria

1. WHEN the Admin clicks "Crear Paquete", THE CreatePackageModal SHALL open
2. THE CreatePackageModal SHALL display fields: Alumno (dropdown con búsqueda), Tipo de paquete (dropdown), Fecha inicio (date picker), Fecha fin (date picker, auto-calculada), Notas internas (textarea opcional)
3. WHEN the Admin selects a Tipo de paquete, THE Fecha_Fin SHALL auto-calculate as `fechaInicio + diasVigencia` from the tipo
4. WHEN the Admin submits the form, THE CreatePaquete_Mutation SHALL call `POST /api/paquetes` with body: `{idAlumno, idTipoPaquete, clasesDisponibles, valorPaquete, diasVigencia}`
5. IF the CreatePaquete_API returns 201 with idPaquete, THEN THE Packages_Table SHALL refresh and show the new package
6. IF the CreatePaquete_API returns 400 with error message (e.g., "El alumno especificado no existe"), THEN THE System SHALL display the error message in a toast
7. THE Form_Validation SHALL prevent submission if required fields (alumno, tipoPaquete, fechaInicio) are empty

### Requirement 6: Visualización de Detalle de Paquete

**User Story:** Como administrador, quiero ver los detalles completos de un paquete incluyendo el historial de consumo, para revisar toda la información del paquete.

#### Acceptance Criteria

1. WHEN the Admin clicks the view icon on a PackageCard, THE GetPaquete_Query SHALL call `GET /api/paquetes/{idPaquete}`
2. THE GetPaquete_Query SHALL parse the response containing: idPaquete, nombreAlumno, nombreTipoPaquete, clasesDisponibles, clasesUsadas, clasesRestantes, fechaActivacion, fechaVencimiento, estado, congelaciones
3. THE PackageDetailModal SHALL display sections: Información del Alumno (avatar, nombre, documento), Información del Paquete (tipo, estado badge, fecha inicio, fecha fin)
4. THE PackageDetailModal SHALL display Consumo de Clases section: Total, Usadas, Restantes with progress bar and percentage
5. THE PackageDetailModal SHALL display Historial de Consumo section: list of asistencias that consumed from this package
6. THE Historial_Item SHALL display: calendar icon, tipo de clase, fecha y horario, badge "Descontada" (verde) or "No descontada" (gris)
7. THE PackageDetailModal SHALL display informative note: "Este historial es solo lectura. Las asistencias se editan en el módulo de Asistencias."
8. THE PackageDetailModal SHALL display buttons: "Renovar" (to create new package based on this one), "Cerrar"
9. IF the GetPaquete_API returns 404, THEN THE System SHALL display "El paquete especificado no existe"

### Requirement 7: Renovación de Paquete

**User Story:** Como administrador, quiero poder renovar un paquete existente creando uno nuevo con los mismos datos del alumno, para facilitar la continuidad del servicio.

#### Acceptance Criteria

1. WHEN the Admin clicks "Renovar" in PackageDetailModal, THE CreatePackageModal SHALL open pre-filled with the same alumno
2. THE CreatePackageModal SHALL pre-select the same tipo de paquete from the original package
3. THE Fecha_Inicio SHALL default to today's date
4. THE Admin SHALL be able to modify any field before submitting
5. WHEN submitted, THE System SHALL create a new independent package (not modify the existing one)

### Requirement 8: Congelación de Paquete

**User Story:** Como administrador, quiero poder congelar un paquete activo temporalmente, para pausar el vencimiento cuando el alumno no puede asistir.

#### Acceptance Criteria

1. WHEN the Admin clicks "Congelar" on an active package, THE System SHALL show a confirmation dialog with date range inputs
2. THE Congelar_Dialog SHALL require: fecha inicio (>= hoy), fecha fin (> fecha inicio), motivo (opcional)
3. WHEN the Admin confirms, THE CongelarPaquete_Mutation SHALL call `POST /api/paquetes/{idPaquete}/congelar` with body: `{idPaquete, fechaInicio, fechaFin, motivo}`
4. IF the CongelarPaquete_API returns 200, THEN THE Package SHALL update to estado "Congelado" (azul badge)
5. IF the CongelarPaquete_API returns 400 (e.g., "Solo se pueden congelar paquetes activos"), THEN THE System SHALL display the error message
6. THE Congelar_Button SHALL only be visible for packages with estado "Activo"

### Requirement 9: Descongelación de Paquete

**User Story:** Como administrador, quiero poder descongelar un paquete congelado, para reactivarlo y extender automáticamente su fecha de vencimiento.

#### Acceptance Criteria

1. WHEN the Admin clicks "Descongelar" on a frozen package, THE System SHALL show a confirmation dialog
2. THE Descongelar_Dialog SHALL display: días congelados, nueva fecha de vencimiento calculada
3. WHEN the Admin confirms, THE DescongelarPaquete_Mutation SHALL call `POST /api/paquetes/{idPaquete}/descongelar?idCongelacion={idCongelacion}`
4. IF the DescongelarPaquete_API returns 200, THEN THE Package SHALL update to estado "Activo" with extended fecha vencimiento
5. IF the DescongelarPaquete_API returns 400 (e.g., "El paquete no está congelado"), THEN THE System SHALL display the error message
6. THE Descongelar_Button SHALL only be visible for packages with estado "Congelado"

### Requirement 10: Manejo de Estados de Carga

**User Story:** Como administrador, quiero ver indicadores de carga mientras se obtienen datos, para saber que el sistema está procesando mi solicitud.

#### Acceptance Criteria

1. WHILE the Alumnos_Query or TiposPaquete_Query is loading, THE Dropdowns SHALL display skeleton loaders
2. WHILE the Packages_Query is loading, THE Packages_Table SHALL display skeleton rows
3. WHILE a mutation (create/congelar/descongelar) is in progress, THE Submit_Button SHALL show loading state and be disabled
4. WHILE the GetPaquete_Query is loading, THE PackageDetailModal SHALL display skeleton content
5. THE loading states SHALL not block user interaction with other parts of the page

### Requirement 11: Manejo de Errores y Permisos

**User Story:** Como sistema, quiero manejar correctamente los errores de autorización y validación, informando al administrador cuando hay problemas.

#### Acceptance Criteria

1. IF the API returns 401 Unauthorized, THEN THE System SHALL redirect the user to the login page
2. IF the API returns 403 Forbidden, THEN THE System SHALL display "No tienes permisos para acceder a esta función"
3. IF the API returns 400 Bad Request, THEN THE System SHALL display the error message from the response body
4. IF the API returns 404 Not Found, THEN THE System SHALL display "El paquete especificado no existe"
5. THE Error_Messages SHALL be displayed using toast notifications for non-blocking errors
6. THE Admin role SHALL have full access to all packages and all alumnos

### Requirement 12: Estados Vacíos y Sin Datos

**User Story:** Como administrador, quiero ver mensajes informativos cuando no hay datos disponibles, para entender el estado actual del sistema.

#### Acceptance Criteria

1. WHEN no packages exist, THE Packages_Table SHALL display an empty state with message "No hay paquetes registrados"
2. WHEN filters return no results, THE Packages_Table SHALL display "No se encontraron paquetes con los filtros aplicados"
3. WHEN a package has no consumption history, THE Historial_Section SHALL display "Este paquete aún no tiene consumos registrados"
4. THE Empty_States SHALL include an icon and descriptive text following the glassmorphism design system
