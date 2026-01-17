# Requirements Document

## Introduction

Este documento define los requisitos para integrar la página de Gestión de Pagos del panel de administración del frontend de Chetango con el API backend existente. El objetivo es hacer funcional la UI de registro y consulta de pagos conectándola correctamente con los endpoints documentados en el contrato API de Pagos, utilizando autenticación Microsoft Entra External ID (CIAM).

Esta página está diseñada exclusivamente para **administradores**, quienes tienen acceso completo para registrar pagos, ver estadísticas, consultar historial de pagos y editar pagos existentes. Un pago puede generar múltiples paquetes de clases automáticamente.

La UI incluye funcionalidades especiales como:
- Búsqueda de alumno por nombre o escaneo de código QR
- Selección múltiple de paquetes a asignar
- Cálculo automático del monto total basado en paquetes seleccionados
- Panel lateral con estadísticas y últimos pagos
- Plantilla rápida para repetir el último pago

## Glossary

- **Payments_Page**: Página de gestión de pagos ubicada en `/admin/pagos`
- **MSAL**: Microsoft Authentication Library - biblioteca para autenticación con Entra ID
- **httpClient**: Cliente HTTP (Axios) configurado para hacer peticiones al backend
- **Access_Token**: Token JWT obtenido de Entra ID que contiene roles y permisos del usuario
- **MetodosPago_API**: Endpoint `GET /api/pagos/metodos-pago` que retorna los métodos de pago disponibles
- **Estadisticas_API**: Endpoint `GET /api/pagos/estadisticas` que retorna estadísticas de pagos por período
- **CreatePago_API**: Endpoint `POST /api/pagos` que registra un nuevo pago y crea paquetes
- **GetPago_API**: Endpoint `GET /api/pagos/{id}` que obtiene detalles de un pago específico
- **UpdatePago_API**: Endpoint `PUT /api/pagos/{id}` que edita un pago existente
- **PagosAlumno_API**: Endpoint `GET /api/alumnos/{idAlumno}/pagos` que lista pagos de un alumno
- **TiposPaquete_API**: Endpoint `GET /api/paquetes/tipos` que retorna los tipos de paquete disponibles
- **Alumnos_API**: Endpoint `GET /api/alumnos` que retorna los alumnos activos
- **RegisterPaymentForm**: Formulario principal para registrar un nuevo pago
- **PaymentDetailModal**: Modal para ver detalles completos de un pago con paquetes generados
- **QRScanner**: Componente para escanear código QR del alumno
- **MetodoPago**: Objeto con idMetodoPago, nombre, descripcion
- **TipoPaquete**: Objeto con id, nombre, clasesDisponibles, diasVigencia, precio

## Requirements

### Requirement 1: Configuración de Autenticación y HTTP Client

**User Story:** Como desarrollador frontend, quiero que el httpClient esté configurado correctamente para comunicarse con el módulo de Pagos del backend, reutilizando la configuración MSAL existente.

#### Acceptance Criteria

1. THE httpClient SHALL use the base URL configured in environment variables for HTTPS connections
2. THE Auth_Interceptor SHALL add the header `Authorization: Bearer {access_token}` to all requests
3. THE httpClient SHALL include the header `Content-Type: application/json` in all requests
4. WHEN a request returns 401 Unauthorized, THE Auth_Interceptor SHALL redirect the user to login
5. WHEN a request returns 403 Forbidden, THE Error_Handler SHALL display "No tienes permisos para acceder a esta función"

### Requirement 2: Consulta de Catálogos (Lookups)

**User Story:** Como administrador, quiero que los dropdowns y selectores de la página de pagos se carguen con datos reales del backend, para poder seleccionar alumnos, métodos de pago y tipos de paquete.

#### Acceptance Criteria

1. WHEN the Payments_Page loads, THE MetodosPago_Query SHALL call `GET /api/pagos/metodos-pago`
2. THE MetodosPago_Query SHALL parse the response containing array of `{idMetodoPago, nombre, descripcion}` objects
3. WHEN the Payments_Page loads, THE TiposPaquete_Query SHALL call `GET /api/paquetes/tipos`
4. THE TiposPaquete_Query SHALL parse the response containing array of `{id, nombre, clasesDisponibles, diasVigencia, precio}` objects
5. WHEN the Payments_Page loads, THE Alumnos_Query SHALL call `GET /api/alumnos`
6. THE Alumnos_Query SHALL parse the response containing array of `{idAlumno, nombreCompleto, documentoIdentidad, correo}` objects
7. THE MetodoPago_Selector SHALL display buttons for: Efectivo, Transferencia, Nequi, Otros (agrupando los demás métodos)
8. THE TipoPaquete_List SHALL display cards with format: nombre, cantidad de clases, precio formateado
9. IF any catalog API returns an error, THEN THE System SHALL display an error toast and allow retry

### Requirement 3: Estadísticas y Panel Lateral

**User Story:** Como administrador, quiero ver estadísticas de pagos del mes y los últimos pagos registrados, para tener una visión general de la gestión financiera.

#### Acceptance Criteria

1. WHEN the Payments_Page loads, THE Estadisticas_Query SHALL call `GET /api/pagos/estadisticas` with fechaDesde y fechaHasta del mes actual
2. THE Stats_Cards SHALL display: "PAGOS DEL MES" (cantidad), "TOTAL RECAUDADO" (monto formateado con $), "PENDIENTES" (si aplica)
3. THE Stats_Cards SHALL use glassmorphism design with colors: verde para pagos, rojo para recaudado, amarillo para pendientes
4. THE Hoy_Badge SHALL display the count of payments registered today
5. THE UltimosPagos_Panel SHALL display a list of recent payments with: monto, tipo de paquete, fecha abreviada
6. THE UltimosPagos_Panel SHALL be scrollable if there are many payments
7. IF the Estadisticas_API returns an error, THEN THE Stats_Cards SHALL display "Error al cargar estadísticas"

### Requirement 4: Selección de Alumno

**User Story:** Como administrador, quiero poder seleccionar un alumno mediante búsqueda o escaneo de QR, para registrar un pago a su nombre.

#### Acceptance Criteria

1. THE Payments_Page SHALL display two tabs: "Búsqueda" and "Escanear QR"
2. WHEN the "Búsqueda" tab is active, THE System SHALL display a search input for alumno
3. THE Search_Input SHALL filter alumnos by nombreCompleto or documentoIdentidad (client-side)
4. THE Search_Input SHALL debounce input by 300ms before filtering
5. WHEN an alumno is selected, THE Alumno_Card SHALL display: avatar with initials, nombreCompleto, correo
6. THE Alumno_Card SHALL include a "Cambiar alumno" button to clear selection
7. WHEN the "Escanear QR" tab is active, THE QRScanner SHALL activate the device camera
8. THE QRScanner SHALL display instructions: "El alumno debe mostrar su código QR desde su perfil de la app"
9. WHEN a valid QR is scanned, THE System SHALL auto-select the corresponding alumno by idAlumno
10. IF the QR contains an invalid or non-existent alumno, THEN THE System SHALL display "Alumno no encontrado"

### Requirement 5: Formulario de Registro de Pago

**User Story:** Como administrador, quiero completar un formulario para registrar un pago con fecha, método de pago, paquetes y notas, para crear el pago y sus paquetes asociados.

#### Acceptance Criteria

1. THE RegisterPaymentForm SHALL display fields: Fecha de pago (date picker), Método de pago (button selector), Paquetes a asignar (card list with checkboxes), Monto total (calculated, read-only), Referencia (input opcional), Observaciones (textarea opcional)
2. THE Fecha_Pago SHALL default to today's date
3. THE MetodoPago_Selector SHALL display 4 buttons: Efectivo ($), Transferencia (icon), Nequi (icon), Otros (icon)
4. WHEN "Otros" is selected, THE System SHALL show a dropdown with remaining payment methods
5. THE Paquetes_List SHALL display available tipos de paquete as selectable cards
6. THE Paquete_Card SHALL display: nombre, cantidad de clases, precio formateado
7. THE Paquete_Card SHALL allow multiple selection (checkboxes or radio buttons)
8. WHEN paquetes are selected, THE MontoTotal SHALL auto-calculate as sum of selected paquetes' prices
9. THE MontoTotal_Display SHALL show "TOTAL A PAGAR" with the calculated amount in green highlight box
10. THE Referencia_Input SHALL have placeholder "Número de comprobante..."
11. THE Observaciones_Textarea SHALL have placeholder "Notas adicionales..."

### Requirement 6: Cálculo y Validación del Monto

**User Story:** Como administrador, quiero que el monto total se calcule automáticamente basado en los paquetes seleccionados, y poder ajustarlo si hay descuentos.

#### Acceptance Criteria

1. WHEN no paquetes are selected, THE MontoTotal SHALL display $0
2. WHEN paquetes are selected, THE MontoTotal SHALL equal the sum of all selected paquetes' precio
3. THE Admin SHALL be able to override the MontoTotal manually for discounts
4. IF the Admin enters a MontoTotal less than the sum of paquetes, THE System SHALL allow it (discount scenario)
5. IF the Admin enters a MontoTotal of 0 or negative, THE Form_Validation SHALL prevent submission
6. THE MontoTotal SHALL be formatted with thousand separators (e.g., $300.000)

### Requirement 7: Registro del Pago

**User Story:** Como administrador, quiero enviar el formulario para registrar el pago y crear automáticamente los paquetes asociados.

#### Acceptance Criteria

1. WHEN the Admin clicks "Registrar Pago", THE Form_Validation SHALL verify: alumno selected, at least one paquete selected, método de pago selected, montoTotal > 0
2. IF validation fails, THE System SHALL highlight missing fields and display error messages
3. WHEN validation passes, THE CreatePago_Mutation SHALL call `POST /api/pagos` with body: `{idAlumno, fechaPago, montoTotal, idMetodoPago, nota, paquetes: [{idTipoPaquete, valorPaquete?}]}`
4. IF valorPaquete is not specified per paquete, THE API SHALL divide montoTotal equally among paquetes
5. IF the CreatePago_API returns 200 with `{idPago, idPaquetesCreados, montoTotal}`, THEN THE System SHALL display success toast "Pago registrado exitosamente"
6. AFTER successful creation, THE Form SHALL reset and THE UltimosPagos_Panel SHALL refresh
7. IF the CreatePago_API returns 400 with error (e.g., "El alumno especificado no existe"), THEN THE System SHALL display the error message in a toast
8. THE "Registrar Pago" button SHALL show loading state while mutation is in progress

### Requirement 8: Plantilla Rápida - Repetir Último Pago

**User Story:** Como administrador, quiero poder repetir rápidamente el último pago registrado para un alumno, para agilizar el proceso de pagos recurrentes.

#### Acceptance Criteria

1. THE PlantillaRapida_Panel SHALL display a card "Repetir último pago" with description "Autocompleta con los datos del último pago registrado"
2. WHEN the Admin clicks "Repetir último pago", THE System SHALL fetch the last payment for the selected alumno
3. THE Form SHALL auto-fill with: same método de pago, same paquetes selection, same montoTotal
4. THE Fecha_Pago SHALL remain as today's date (not copied from last payment)
5. THE Admin SHALL be able to modify any field before submitting
6. IF the alumno has no previous payments, THE "Repetir último pago" button SHALL be disabled with tooltip "No hay pagos anteriores"

### Requirement 9: Visualización de Detalle de Pago

**User Story:** Como administrador, quiero ver los detalles completos de un pago incluyendo los paquetes generados, para revisar toda la información del pago.

#### Acceptance Criteria

1. WHEN the Admin clicks on a payment in UltimosPagos_Panel, THE GetPago_Query SHALL call `GET /api/pagos/{idPago}`
2. THE GetPago_Query SHALL parse the response containing: idPago, nombreAlumno, correoAlumno, fechaPago, montoTotal, nombreMetodoPago, nota, fechaCreacion, paquetes[]
3. THE PaymentDetailModal SHALL display sections: Información del Pago (fecha, monto, método, nota), Información del Alumno (nombre, correo)
4. THE PaymentDetailModal SHALL display Paquetes Generados section: list of paquetes with nombreTipoPaquete, clasesDisponibles, clasesRestantes, fechaVencimiento, estado, valorPaquete
5. THE Paquete_Item SHALL display estado badge: Activo (verde), Vencido (gris), Congelado (azul), Agotado (naranja)
6. THE PaymentDetailModal SHALL display buttons: "Editar Pago", "Cerrar"
7. IF the GetPago_API returns 400 "El pago no existe", THEN THE System SHALL display error toast

### Requirement 10: Edición de Pago

**User Story:** Como administrador, quiero poder editar un pago existente para corregir el monto, método de pago o notas.

#### Acceptance Criteria

1. WHEN the Admin clicks "Editar Pago" in PaymentDetailModal, THE EditPaymentModal SHALL open
2. THE EditPaymentModal SHALL display editable fields: montoTotal, idMetodoPago, nota
3. THE EditPaymentModal SHALL NOT allow editing: idAlumno, fechaPago, paquetes (as per API contract)
4. WHEN the Admin submits changes, THE UpdatePago_Mutation SHALL call `PUT /api/pagos/{id}` with body: `{montoTotal, idMetodoPago, nota}`
5. IF the UpdatePago_API returns 204 No Content, THEN THE System SHALL display success toast and refresh payment detail
6. IF the UpdatePago_API returns 400 (e.g., "El monto total debe ser mayor a cero"), THEN THE System SHALL display the error message
7. THE Form_Validation SHALL prevent submission if montoTotal <= 0

### Requirement 11: Historial de Pagos del Alumno

**User Story:** Como administrador, quiero ver el historial completo de pagos de un alumno seleccionado, para revisar su historial financiero.

#### Acceptance Criteria

1. WHEN an alumno is selected, THE System SHALL fetch payments using `GET /api/alumnos/{idAlumno}/pagos`
2. THE PagosAlumno_Query SHALL support pagination with pageNumber and pageSize parameters
3. THE Historial_Panel SHALL display list of payments: fechaPago, montoTotal, nombreMetodoPago, cantidadPaquetes
4. THE Historial_Panel SHALL be scrollable with infinite scroll or pagination
5. WHEN the Admin clicks on a payment in Historial_Panel, THE PaymentDetailModal SHALL open
6. IF the alumno has no payments, THE Historial_Panel SHALL display "Este alumno no tiene pagos registrados"

### Requirement 12: Manejo de Estados de Carga

**User Story:** Como administrador, quiero ver indicadores de carga mientras se obtienen datos, para saber que el sistema está procesando mi solicitud.

#### Acceptance Criteria

1. WHILE the MetodosPago_Query or TiposPaquete_Query is loading, THE Selectors SHALL display skeleton loaders
2. WHILE the Estadisticas_Query is loading, THE Stats_Cards SHALL display skeleton content
3. WHILE a mutation (create/update) is in progress, THE Submit_Button SHALL show loading state and be disabled
4. WHILE the GetPago_Query is loading, THE PaymentDetailModal SHALL display skeleton content
5. WHILE the QRScanner is initializing, THE System SHALL display "Iniciando cámara..."
6. THE loading states SHALL not block user interaction with other parts of the page

### Requirement 13: Manejo de Errores y Permisos

**User Story:** Como sistema, quiero manejar correctamente los errores de autorización y validación, informando al administrador cuando hay problemas.

#### Acceptance Criteria

1. IF the API returns 401 Unauthorized, THEN THE System SHALL redirect the user to the login page
2. IF the API returns 403 Forbidden, THEN THE System SHALL display "No tienes permisos para acceder a esta función"
3. IF the API returns 400 Bad Request, THEN THE System SHALL display the error message from the response body
4. IF the API returns 404 Not Found, THEN THE System SHALL display "El recurso especificado no existe"
5. THE Error_Messages SHALL be displayed using toast notifications for non-blocking errors
6. THE Admin role SHALL have full access to all payments and all alumnos
7. IF camera access is denied for QR scanning, THEN THE System SHALL display "Permiso de cámara denegado. Por favor habilita el acceso a la cámara."

### Requirement 14: Estados Vacíos y Sin Datos

**User Story:** Como administrador, quiero ver mensajes informativos cuando no hay datos disponibles, para entender el estado actual del sistema.

#### Acceptance Criteria

1. WHEN no alumno is selected, THE RegisterPaymentForm SHALL display empty state prompting to search or scan QR
2. WHEN no paquetes are selected, THE MontoTotal SHALL display $0 with message "Selecciona al menos un paquete"
3. WHEN UltimosPagos_Panel has no payments, THE Panel SHALL display "No hay pagos recientes"
4. WHEN search returns no alumnos, THE Search_Results SHALL display "No se encontraron alumnos"
5. THE Empty_States SHALL include an icon and descriptive text following the glassmorphism design system

### Requirement 15: Accesibilidad y UX

**User Story:** Como administrador, quiero que la interfaz sea accesible y fácil de usar, para poder registrar pagos de manera eficiente.

#### Acceptance Criteria

1. THE Form_Fields SHALL have proper labels and aria attributes for screen readers
2. THE Keyboard_Navigation SHALL allow tabbing through all interactive elements
3. THE Focus_States SHALL be visible on all interactive elements
4. THE Error_Messages SHALL be announced to screen readers
5. THE Success_Messages SHALL provide clear feedback after actions
6. THE Date_Picker SHALL support keyboard input in format DD/MM/YYYY
7. THE Currency_Inputs SHALL format numbers with thousand separators as user types
