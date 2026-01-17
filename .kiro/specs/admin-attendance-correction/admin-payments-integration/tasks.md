# Implementation Plan: Admin Payments Integration

## Overview

Este plan implementa la integración de la página de Gestión de Pagos del panel de administración con el API backend. Se reutiliza la configuración MSAL y httpClient existentes, siguiendo los patrones establecidos en las integraciones de paquetes, asistencias y clases.

## Tasks

- [x] 1. Crear tipos TypeScript para el módulo de pagos
  - [x] 1.1 Crear archivo `src/features/payments/types/paymentTypes.ts` con interfaces
    - Definir MetodoPagoDTO, EstadisticasPagosDTO, DesgloseMétodoPagoDTO
    - Definir PagoListItemDTO, PagoDetalleDTO, PaquetePagoDTO
    - Definir tipos de request: CrearPagoRequest, EditarPagoRequest, PaquetePagoRequest
    - Definir tipos de response: CrearPagoResponse, PaginatedResponse
    - Definir tipos de UI: PagoFormData, SelectedPaquete, PaymentsUIState, PaymentsStats
    - Definir constantes: METODO_PAGO_ICONS, METODOS_PAGO_RAPIDOS
    - Re-exportar tipos compartidos de packages (AlumnoDTO, TipoPaqueteDTO)
    - _Requirements: 2.2, 2.4, 2.6, 2.8_

- [x] 2. Implementar React Query hooks para consultas
  - [x] 2.1 Crear archivo `src/features/payments/api/paymentQueries.ts`
    - Implementar useMetodosPagoQuery para GET /api/pagos/metodos-pago
    - Implementar useEstadisticasQuery para GET /api/pagos/estadisticas
    - Implementar usePagosByAlumnoQuery para GET /api/alumnos/{idAlumno}/pagos
    - Implementar usePagoDetailQuery para GET /api/pagos/{id}
    - Implementar useAlumnosForPaymentsQuery para GET /api/alumnos
    - Implementar useTiposPaqueteForPaymentsQuery para GET /api/paquetes/tipos
    - Definir paymentKeys para cache management
    - _Requirements: 2.1, 2.3, 2.5, 3.1, 9.1, 11.1_

  - [x] 2.2 Write property test for response parsing
    - **Property 2: API Response Parsing**
    - Validar MetodoPagoDTO con idMetodoPago, nombre, descripcion
    - Validar TipoPaqueteDTO con id, nombre, clasesDisponibles, diasVigencia, precio
    - Validar AlumnoDTO con idAlumno, nombreCompleto, documentoIdentidad, correo opcional
    - **Validates: Requirements 2.2, 2.4, 2.6**

- [x] 3. Implementar React Query mutations
  - [x] 3.1 Crear archivo `src/features/payments/api/paymentMutations.ts`
    - Implementar useCreatePagoMutation para POST /api/pagos
    - Implementar useUpdatePagoMutation para PUT /api/pagos/{id}
    - Configurar invalidación de queries y toasts de éxito/error
    - _Requirements: 7.3, 7.5, 7.6, 10.4, 10.5, 10.6_

  - [x] 3.2 Write property test for request format
    - **Property 11: Create Payment Request Format**
    - **Property 12: Update Payment Request Format**
    - **Validates: Requirements 7.3, 10.4**

- [x] 4. Implementar Redux slice para estado de UI
  - [x] 4.1 Crear archivo `src/features/payments/store/paymentsSlice.ts`
    - Definir PaymentsUIState con searchTerm, selectedAlumnoId, activeTab, isQRScannerActive
    - Implementar reducers: setSearchTerm, setSelectedAlumno, setActiveTab, setQRScannerActive, clearSelection, resetPaymentsUI
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.2 Registrar slice en rootReducer
    - Agregar paymentsReducer a `src/app/store/rootReducer.ts`
    - _Requirements: 4.1_

- [x] 5. Implementar custom hook useAdminPayments
  - [x] 5.1 Crear archivo `src/features/payments/hooks/useAdminPayments.ts`
    - Integrar queries de catálogos (metodosPago, tiposPaquete, alumnos)
    - Integrar query de estadísticas con rango de mes actual
    - Implementar lógica de filtrado client-side para alumnos
    - Implementar helpers: getInitials, formatCurrency, calculateTotal, filterAlumnosBySearch
    - Exponer mutations y estados de loading
    - _Requirements: 3.2, 4.3, 4.5, 5.8, 6.6, 7.1_

  - [x] 5.2 Write property tests for calculations
    - **Property 5: Initials Generation**
    - **Property 8: MontoTotal Calculation**
    - **Property 9: Currency Formatting**
    - **Validates: Requirements 4.5, 5.8, 6.1, 6.2, 6.6**

  - [x] 5.3 Write property tests for filtering
    - **Property 3: Search Filter Behavior**
    - **Validates: Requirements 4.3**

- [x] 6. Checkpoint - Verificar lógica de negocio
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementar componentes de UI - Stats Cards
  - [x] 7.1 Crear componente `PaymentStatsCards`
    - Mostrar 3 tarjetas: Pagos del Mes (verde), Total Recaudado (rojo), Pagos Hoy (amarillo)
    - Mostrar badge "Hoy" flotante cuando hay pagos del día
    - Usar design system glassmorphism existente
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 8. Implementar componentes de UI - Selección de Alumno
  - [x] 8.1 Crear componente `AlumnoSearchTabs`
    - Tabs: "Búsqueda" y "Escanear QR"
    - Input de búsqueda con debounce 300ms
    - Lista de resultados filtrados
    - Placeholder para QR scanner
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 Crear componente `AlumnoCard`
    - Avatar con iniciales
    - Nombre completo y correo
    - Botón "Cambiar alumno" para limpiar selección
    - _Requirements: 4.5, 4.6_

- [x] 9. Implementar componentes de UI - Formulario de Pago
  - [x] 9.1 Crear componente `PaymentMethodSelector`
    - 4 botones: Efectivo, Transferencia, Nequi, Otros
    - Dropdown para métodos adicionales en "Otros"
    - _Requirements: 5.3, 5.4, 2.7_

  - [x] 9.2 Crear componente `PackageSelector`
    - Cards seleccionables con checkbox
    - Mostrar nombre, clases, precio formateado
    - Permitir selección múltiple
    - _Requirements: 5.5, 5.6, 5.7_

  - [x] 9.3 Crear componente `PaymentTotalDisplay`
    - Mostrar "TOTAL A PAGAR" con monto calculado
    - Permitir edición manual del monto
    - Indicador de monto editado con opción de restaurar
    - _Requirements: 5.8, 5.9, 6.1, 6.2, 6.3, 6.4_

  - [x] 9.4 Crear componente `RegisterPaymentForm`
    - Integrar todos los componentes del formulario
    - Date picker para fecha de pago (default hoy)
    - Inputs para referencia y observaciones
    - Validación de campos requeridos
    - Botones Cancelar y Registrar Pago con loading state
    - _Requirements: 5.1, 5.2, 5.10, 5.11, 7.1, 7.2, 7.8_

- [x] 10. Implementar componentes de UI - Panel Lateral
  - [x] 10.1 Crear componente `QuickTemplateCard`
    - Card "Repetir último pago"
    - Botón deshabilitado si no hay pagos previos
    - _Requirements: 8.1, 8.6_

  - [x] 10.2 Crear componente `RecentPaymentsList`
    - Lista de últimos pagos del alumno
    - Mostrar monto, método, fecha abreviada, cantidad de paquetes
    - Scrollable si hay muchos pagos
    - Click para abrir detalle
    - _Requirements: 3.5, 3.6, 11.3, 11.4, 11.5_

- [x] 11. Implementar Modal de Detalle de Pago
  - [x] 11.1 Crear componente `PackageStatusBadge`
    - Badge con color según estado: Activo (verde), Vencido (gris), Congelado (azul), Agotado (naranja)
    - _Requirements: 9.5_

  - [x] 11.2 Crear componente `PaymentDetailModal`
    - Sección Información del Pago: fecha, monto, método, nota
    - Sección Información del Alumno: nombre, correo
    - Sección Paquetes Generados: lista con detalles de cada paquete
    - Botones Cerrar y Editar Pago
    - Skeleton loader durante carga
    - _Requirements: 9.3, 9.4, 9.5, 9.6, 12.4_

- [x] 12. Implementar Modal de Edición de Pago
  - [x] 12.1 Crear componente `EditPaymentModal`
    - Campos editables: montoTotal, idMetodoPago, nota
    - Campos no editables (readonly): alumno, fecha, paquetes
    - Validación: montoTotal > 0
    - Botones Cancelar y Guardar Cambios con loading state
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 10.6, 10.7_

- [x] 13. Checkpoint - Verificar UI de componentes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implementar página principal AdminPaymentsPage
  - [x] 14.1 Crear/actualizar `src/pages/admin/AdminPaymentsPage.tsx`
    - Integrar useAdminPayments hook
    - Header con título "Pagos" y subtítulo "GESTIÓN FINANCIERA"
    - PaymentStatsCards
    - Layout de dos columnas: formulario (2/3) y panel lateral (1/3)
    - AlumnoSearchTabs o AlumnoCard según selección
    - RegisterPaymentForm cuando hay alumno seleccionado
    - QuickTemplateCard y RecentPaymentsList en panel lateral
    - PaymentDetailModal y EditPaymentModal
    - _Requirements: 3.1, 3.2, 4.1, 5.1, 8.1, 9.1, 10.1_

  - [x] 14.2 Configurar ruta en router
    - Agregar ruta `/admin/pagos` en el router
    - Proteger con autenticación admin
    - _Requirements: 1.1, 1.4_

- [x] 15. Implementar manejo de estados de carga
  - [x] 15.1 Agregar skeleton loaders
    - Skeleton en stats cards mientras cargan estadísticas
    - Skeleton en selectores mientras cargan catálogos
    - Skeleton en lista de pagos mientras carga
    - Skeleton en modal de detalle mientras carga
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 16. Implementar manejo de errores
  - [x] 16.1 Configurar error handling en queries y mutations
    - Redirect a login en 401 (via authInterceptor)
    - Toast de error en 403, 400, 404
    - Mensajes de error del backend
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 17. Implementar estados vacíos
  - [x] 17.1 Agregar empty states
    - Empty state cuando no hay alumno seleccionado
    - Empty state cuando no hay paquetes seleccionados
    - Empty state cuando no hay pagos recientes
    - Empty state cuando búsqueda no retorna alumnos
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 18. Crear archivo index para exports
  - [x] 18.1 Crear `src/features/payments/index.ts`
    - Exportar tipos, hooks, componentes
    - _Requirements: N/A (organización de código)_

  - [x] 18.2 Crear `src/features/payments/store/index.ts`
    - Exportar slice y reducer
    - _Requirements: N/A (organización de código)_

  - [x] 18.3 Crear `src/features/payments/hooks/index.ts`
    - Exportar hooks
    - _Requirements: N/A (organización de código)_

  - [x] 18.4 Crear `src/features/payments/components/index.ts`
    - Exportar todos los componentes
    - _Requirements: N/A (organización de código)_

- [x] 19. Implementar funcionalidad de Repetir Último Pago
  - [x] 19.1 Implementar lógica en useAdminPayments
    - Obtener último pago del alumno seleccionado
    - Crear función para pre-llenar formulario con datos del último pago
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [x] 19.2 Conectar QuickTemplateCard con la lógica
    - Al click, pre-llenar formulario con: mismo método de pago, mismos paquetes, mismo monto
    - Fecha de pago debe ser hoy (no copiada del pago anterior)
    - _Requirements: 8.3, 8.4_

- [x] 20. Implementar funcionalidad de QR Scanner
  - [x] 20.1 Integrar librería de escaneo QR
    - Activar cámara cuando tab QR está activo
    - Mostrar instrucciones al usuario
    - _Requirements: 4.7, 4.8_

  - [x] 20.2 Implementar manejo de resultado QR
    - Parsear idAlumno del código QR
    - Auto-seleccionar alumno si existe
    - Mostrar error si alumno no encontrado
    - _Requirements: 4.9, 4.10_

  - [x] 20.3 Manejar permisos de cámara
    - Mostrar mensaje si permiso denegado
    - _Requirements: 13.7_

- [x] 21. Final checkpoint - Verificar integración completa
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar flujo completo: selección de alumno → registro de pago → visualización de detalle → edición
  - Verificar estadísticas se actualizan después de crear pago
  - Verificar lista de pagos se actualiza después de crear/editar pago

## Notes

- All tasks are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Se reutiliza la configuración MSAL y httpClient existente
- Se siguen los patrones de admin-packages-integration, admin-attendance-integration y admin-classes-integration
- Las tareas 1-18 están completadas según el código existente
- Las tareas 19-21 están pendientes (funcionalidad de repetir último pago y QR scanner)
