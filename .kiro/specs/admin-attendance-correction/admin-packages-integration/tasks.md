# Implementation Plan: Admin Packages Integration

## Overview

Este plan implementa la integración de la página de Gestión de Paquetes del panel de administración con el API backend. Se seguirán los patrones establecidos en las integraciones de asistencias y clases, reutilizando la configuración MSAL y httpClient existentes.

## Tasks

- [x] 1. Crear tipos TypeScript para el módulo de paquetes
  - [x] 1.1 Crear archivo `src/features/packages/types/packageTypes.ts` con interfaces
    - Definir AlumnoDTO, TipoPaqueteDTO para catálogos
    - Definir PaqueteListItemDTO, PaqueteDetalleDTO, CongelacionDTO, AsistenciaHistorialDTO
    - Definir tipos de request: CrearPaqueteRequest, EditarPaqueteRequest, CongelarPaqueteRequest
    - Definir tipos de response: CrearPaqueteResponse, PaginatedResponse
    - Definir tipos de UI: PaqueteFormData, PackagesFilters, PackagesStats
    - Definir constantes: ESTADO_PAQUETE_MAP, ESTADO_PAQUETE_COLORS
    - _Requirements: 2.2, 2.4, 3.2, 3.8, 6.2_

- [x] 2. Implementar React Query hooks para consultas
  - [x] 2.1 Crear archivo `src/features/packages/api/packageQueries.ts`
    - Implementar useAlumnosQuery para GET /api/alumnos
    - Implementar useTiposPaqueteQuery para GET /api/tipos-paquete
    - Implementar usePaquetesByAlumnoQuery para GET /api/alumnos/{id}/paquetes
    - Implementar usePaqueteDetailQuery para GET /api/paquetes/{id}
    - Definir packageKeys para cache management
    - _Requirements: 2.1, 2.3, 3.1, 6.1_

  - [x] 2.2 Write property test for response parsing
    - **Property 2: Alumnos Response Parsing**
    - **Property 3: TiposPaquete Response Parsing**
    - **Validates: Requirements 2.2, 2.4**

- [x] 3. Implementar React Query mutations
  - [x] 3.1 Crear archivo `src/features/packages/api/packageMutations.ts`
    - Implementar useCreatePaqueteMutation para POST /api/paquetes
    - Implementar useUpdatePaqueteMutation para PUT /api/paquetes/{id}
    - Implementar useCongelarPaqueteMutation para POST /api/paquetes/{id}/congelar
    - Implementar useDescongelarPaqueteMutation para POST /api/paquetes/{id}/descongelar
    - Configurar invalidación de queries y toasts de éxito/error
    - _Requirements: 5.4, 8.3, 9.3_

  - [x] 3.2 Write property test for request format
    - **Property 14: Create Paquete Request Format**
    - **Property 19: Congelar Request Format**
    - **Property 21: Descongelar Request Format**
    - **Validates: Requirements 5.4, 8.3, 9.3**


- [x] 4. Implementar Redux slice para estado de UI
  - [x] 4.1 Crear archivo `src/features/packages/store/packagesSlice.ts`
    - Definir PackagesUIState con searchTerm, filterEstado, filterTipoPaquete
    - Implementar reducers: setSearchTerm, setFilterEstado, setFilterTipoPaquete, clearFilters
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.2 Registrar slice en rootReducer
    - Agregar packagesReducer a `src/app/store/rootReducer.ts`
    - _Requirements: 4.1_

- [x] 5. Implementar custom hook useAdminPackages
  - [x] 5.1 Crear archivo `src/features/packages/hooks/useAdminPackages.ts`
    - Integrar queries de catálogos (alumnos, tiposPaquete)
    - Implementar lógica de filtrado client-side
    - Implementar cálculo de estadísticas por estado
    - Implementar helpers: getInitials, getConsumoPercentage
    - Exponer mutations y estados de loading
    - _Requirements: 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.7_

  - [x] 5.2 Write property tests for calculations
    - **Property 5: Stats Calculation Accuracy**
    - **Property 7: Consumption Percentage Calculation**
    - **Property 24: Initials Generation**
    - **Validates: Requirements 3.2, 3.3, 3.5, 3.7**

  - [x] 5.3 Write property tests for filtering
    - **Property 9: Search Filter Behavior**
    - **Property 10: Estado Filter Behavior**
    - **Property 11: TipoPaquete Filter Behavior**
    - **Property 12: Filtered Stats Accuracy**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.7**

- [x] 6. Checkpoint - Verificar lógica de negocio
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementar componentes de UI - Stats Cards
  - [x] 7.1 Crear componente `PackageStatsCards`
    - Mostrar 4 tarjetas: Activos (verde), Agotados (naranja), Congelados (azul), Vencidos (gris)
    - Mostrar badge flotante con total
    - Usar design system glassmorphism existente
    - _Requirements: 3.2, 3.3_

  - [x] 7.2 Write property test for estado badge colors
    - **Property 8: Estado Badge Color Mapping**
    - **Validates: Requirements 3.8**

- [x] 8. Implementar componentes de UI - Filtros
  - [x] 8.1 Crear componente `PackageFilters`
    - Input de búsqueda con debounce 300ms
    - Dropdown de estado (Todos, Activo, Agotado, Congelado, Vencido)
    - Dropdown de tipo de paquete
    - Usar GlassInput y GlassSelect del design system
    - _Requirements: 4.1, 4.2, 4.3, 4.6_

- [x] 9. Implementar componentes de UI - Tabla de Paquetes
  - [x] 9.1 Crear componente `PackagesTable`
    - Columnas: ALUMNO, PAQUETE, CONSUMO, ESTADO, VIGENCIA, ACCIONES
    - Usar GlassTable del design system
    - Implementar skeleton loader durante carga
    - Implementar empty state cuando no hay paquetes
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 10.2, 12.1, 12.2_

  - [x] 9.2 Crear componente `PackageTableRow`
    - Avatar con iniciales del alumno
    - Barra de progreso de consumo con porcentaje
    - Badge de estado con color correspondiente
    - Fechas formateadas
    - Botón de ver detalle (ojo)
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

  - [x] 9.3 Write property test for row display format
    - **Property 6: Package Row Display Format**
    - **Validates: Requirements 3.5, 3.6, 3.7, 3.8, 3.9**


- [x] 10. Implementar Modal de Crear Paquete
  - [x] 10.1 Crear componente `CreatePackageModal`
    - Dropdown de alumno con búsqueda
    - Dropdown de tipo de paquete
    - Date picker para fecha inicio
    - Date picker para fecha fin (auto-calculada)
    - Textarea para notas internas (opcional)
    - Botones Cancelar y Crear Paquete
    - Validación de campos requeridos
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7_

  - [x] 10.2 Write property test for fecha fin calculation
    - **Property 13: Fecha Fin Auto-Calculation**
    - **Validates: Requirements 5.3**

  - [x] 10.3 Write property test for form validation
    - **Property 15: Form Validation - Required Fields**
    - **Validates: Requirements 5.7**

- [x] 11. Implementar Modal de Detalle de Paquete
  - [x] 11.1 Crear componente `PackageDetailModal`
    - Sección Información del Alumno: avatar, nombre, documento
    - Sección Información del Paquete: tipo, estado badge, fecha inicio, fecha fin
    - Sección Consumo de Clases: Total, Usadas, Restantes, barra de progreso
    - Sección Historial de Consumo: lista de asistencias
    - Nota informativa sobre historial solo lectura
    - Botones Renovar y Cerrar
    - Skeleton loader durante carga
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 10.4_

  - [x] 11.2 Crear componente `ConsumptionHistoryItem`
    - Icono de calendario
    - Tipo de clase
    - Fecha y horario formateados
    - Badge "Descontada" (verde) o "No descontada" (gris)
    - _Requirements: 6.6_

  - [x] 11.3 Write property test for detail display
    - **Property 16: Package Detail Response Parsing**
    - **Property 17: Consumo Display in Detail Modal**
    - **Property 18: Historial Item Display Format**
    - **Validates: Requirements 6.2, 6.4, 6.6**

- [x] 12. Implementar funcionalidad de Renovar Paquete
  - [x] 12.1 Agregar lógica de renovación en PackageDetailModal
    - Al click en Renovar, abrir CreatePackageModal pre-llenado
    - Pre-seleccionar mismo alumno
    - Pre-seleccionar mismo tipo de paquete
    - Fecha inicio default a hoy
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 13. Checkpoint - Verificar UI básica
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implementar funcionalidad de Congelar Paquete
  - [x] 14.1 Crear componente `CongelarPaqueteDialog`
    - Date picker para fecha inicio (>= hoy)
    - Date picker para fecha fin (> fecha inicio)
    - Input para motivo (opcional)
    - Validación de fechas
    - Botones Cancelar y Congelar
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [x] 14.2 Agregar botón Congelar en PackageTableRow
    - Visible solo para paquetes con estado "Activo"
    - _Requirements: 8.6_

  - [x] 14.3 Write property test for congelar button visibility
    - **Property 20: Congelar Button Visibility**
    - **Validates: Requirements 8.6**

- [x] 15. Implementar funcionalidad de Descongelar Paquete
  - [x] 15.1 Crear componente `DescongelarPaqueteDialog`
    - Mostrar días congelados calculados
    - Mostrar nueva fecha de vencimiento calculada
    - Botones Cancelar y Descongelar
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

  - [x] 15.2 Agregar botón Descongelar en PackageTableRow
    - Visible solo para paquetes con estado "Congelado"
    - _Requirements: 9.6_

  - [x] 15.3 Write property tests for descongelar
    - **Property 22: Descongelar Button Visibility**
    - **Property 23: Descongelar Dialog Calculation Display**
    - **Validates: Requirements 9.2, 9.6**


- [x] 16. Implementar página principal AdminPackagesPage
  - [x] 16.1 Crear/actualizar `src/pages/admin/AdminPackagesPage.tsx`
    - Integrar useAdminPackages hook
    - Header con título, subtítulo y botón "Crear Paquete"
    - PackageStatsCards
    - PackageFilters
    - PackagesTable
    - CreatePackageModal
    - PackageDetailModal
    - CongelarPaqueteDialog
    - DescongelarPaqueteDialog
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 6.1_

  - [x] 16.2 Configurar ruta en router
    - Agregar ruta `/admin/paquetes` en el router
    - Proteger con autenticación admin
    - _Requirements: 1.1, 1.4_

- [x] 17. Implementar manejo de estados de carga
  - [x] 17.1 Agregar skeleton loaders
    - Skeleton en dropdowns mientras cargan catálogos
    - Skeleton rows en tabla mientras cargan paquetes
    - Skeleton en modal de detalle mientras carga
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 18. Implementar manejo de errores
  - [x] 18.1 Configurar error handling en queries y mutations
    - Redirect a login en 401
    - Toast de error en 403, 400, 404
    - Mensajes de error del backend
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 19. Implementar estados vacíos
  - [x] 19.1 Agregar empty states
    - Empty state cuando no hay paquetes
    - Empty state cuando filtros no retornan resultados
    - Empty state cuando paquete no tiene historial
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 20. Crear archivo index para exports
  - [x] 20.1 Crear `src/features/packages/index.ts`
    - Exportar tipos, hooks, componentes
    - _Requirements: N/A (organización de código)_

- [x] 21. Final checkpoint - Verificar integración completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Se reutiliza la configuración MSAL y httpClient existente
- Se siguen los patrones de admin-attendance-integration y admin-classes-integration
