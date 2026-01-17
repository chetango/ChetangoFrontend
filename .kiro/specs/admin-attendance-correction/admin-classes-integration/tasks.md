# Implementation Plan: Admin Classes Integration

## Overview

Este plan implementa la integración de la página de Gestión de Clases del panel de administración con el backend de Chetango. Las tareas están organizadas para hacer cambios incrementales, validando cada paso antes de continuar. Se reutiliza la configuración MSAL y httpClient existente del módulo de asistencias.

## Tasks

- [x] 1. Crear tipos de datos para el módulo de clases
  - [x] 1.1 Crear archivo `src/features/classes/types/classTypes.ts`
    - Definir tipos para catálogos: `TipoClaseDTO`, `ProfesorDTO`, `AlumnoDTO`
    - Definir tipos para clases: `ClaseListItemDTO`, `ClaseDetalleDTO`, `MonitorClaseDTO`
    - Definir tipos para requests: `CrearClaseRequest`, `EditarClaseRequest`
    - Definir tipos para responses: `CrearClaseResponse`, `PaginatedResponse<T>`
    - Definir tipos para UI: `ClaseFormData`, `ClassesFilters`, `ClaseEstado`
    - _Requirements: 2.2, 2.4, 3.4, 5.3, 6.3_

  - [x] 1.2 Escribir property test para parsing de TipoClaseDTO
    - **Property 2: TiposClase Response Parsing**
    - **Validates: Requirements 2.2**

  - [x] 1.3 Escribir property test para parsing de ProfesorDTO
    - **Property 3: Profesores Response Parsing**
    - **Validates: Requirements 2.4**

- [x] 2. Crear React Query hooks para catálogos
  - [x] 2.1 Crear archivo `src/features/classes/api/classQueries.ts`
    - Implementar `useTiposClaseQuery` para `GET /api/tipos-clase`
    - Implementar `useProfesoresQuery` para `GET /api/profesores`
    - Definir query keys para cache management
    - Configurar staleTime de 5 minutos para catálogos
    - _Requirements: 2.1, 2.3, 2.5, 2.6_

  - [x] 2.2 Escribir unit tests para queries de catálogos
    - Test para useTiposClaseQuery
    - Test para useProfesoresQuery
    - _Requirements: 2.1, 2.3_

- [x] 3. Checkpoint - Verificar catálogos
  - Asegurar que la aplicación compila sin errores
  - Verificar que los tipos están correctos
  - Preguntar al usuario si hay dudas

- [x] 4. Crear React Query hooks para clases
  - [x] 4.1 Agregar queries de clases a `classQueries.ts`
    - Implementar `useClasesByProfesorQuery` para `GET /api/profesores/{id}/clases`
    - Implementar `useClaseDetailQuery` para `GET /api/clases/{id}`
    - Soportar parámetros de paginación y filtros
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2_

  - [x] 4.2 Escribir property test para query con parámetros
    - **Property 4: Classes Query with Profesor Filter**
    - **Validates: Requirements 3.1, 3.9**

- [x] 5. Crear mutations para CRUD de clases
  - [x] 5.1 Crear archivo `src/features/classes/api/classMutations.ts`
    - Implementar `useCreateClaseMutation` para `POST /api/clases`
    - Implementar `useUpdateClaseMutation` para `PUT /api/clases/{id}`
    - Implementar `useDeleteClaseMutation` para `DELETE /api/clases/{id}`
    - Configurar invalidación de cache en onSuccess
    - Configurar manejo de errores con toast
    - _Requirements: 5.3, 5.5, 5.6, 6.3, 6.4, 6.5, 7.2, 7.3, 7.4_

  - [x] 5.2 Escribir property test para formato de request de creación
    - **Property 10: Create Clase Request Format**
    - **Validates: Requirements 5.3**

  - [x] 5.3 Escribir property test para formato de request de actualización
    - **Property 12: Update Clase Request Format**
    - **Validates: Requirements 6.3**

- [x] 6. Checkpoint - Verificar API layer
  - Asegurar que queries y mutations compilan
  - Verificar que los tests pasan
  - Preguntar al usuario si hay dudas

- [x] 7. Crear Redux slice para estado de UI
  - [x] 7.1 Crear archivo `src/features/classes/store/classesSlice.ts`
    - Definir estado inicial con filtros
    - Implementar reducers: setSearchTerm, setFilterProfesor, setFilterTipo, setFilterFecha, clearFilters
    - Exportar actions y reducer
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

  - [x] 7.2 Registrar slice en rootReducer
    - Agregar classesReducer al store
    - _Requirements: 8.1_

- [x] 8. Crear hook principal useAdminClasses
  - [x] 8.1 Crear archivo `src/features/classes/hooks/useAdminClasses.ts`
    - Integrar queries de catálogos y clases
    - Integrar mutations
    - Implementar lógica de filtrado client-side
    - Implementar agrupación de clases por fecha
    - Implementar cálculo de estado (hoy/programada/completada)
    - Implementar cálculo de estadísticas
    - Implementar handlers para crear, editar, cancelar
    - _Requirements: 3.4, 3.5, 3.6, 8.1, 8.5, 9.1, 9.2_

  - [x] 8.2 Escribir property test para agrupación por fecha
    - **Property 5: Classes Grouped by Date**
    - **Validates: Requirements 3.4**

  - [x] 8.3 Escribir property test para cálculo de estado
    - **Property 7: Estado Badge Mapping**
    - **Validates: Requirements 3.5**

  - [x] 8.4 Escribir property test para filtrado de búsqueda
    - **Property 14: Search Filter Behavior**
    - **Validates: Requirements 8.1, 8.7**

  - [x] 8.5 Escribir property test para cálculo de estadísticas
    - **Property 15: Stats Calculation Accuracy**
    - **Validates: Requirements 9.1, 9.2**

- [x] 9. Checkpoint - Verificar lógica de negocio
  - Asegurar que el hook compila
  - Verificar que los tests pasan
  - Preguntar al usuario si hay dudas

- [x] 10. Actualizar componente ClaseCard
  - [x] 10.1 Modificar `src/features/classes/components/ClaseCard.tsx`
    - Conectar con datos reales del hook
    - Implementar display de estado badge según fecha
    - Implementar barra de progreso de capacidad
    - Implementar visibilidad condicional de botones editar/cancelar
    - Implementar botón "Ir a Asistencia" con navegación
    - _Requirements: 3.4, 3.5, 3.6, 6.6, 7.5, 12.1, 12.2_

  - [x] 10.2 Escribir property test para formato de display
    - **Property 6: ClaseCard Display Format**
    - **Validates: Requirements 3.4**

  - [x] 10.3 Escribir property test para visibilidad de botones
    - **Property 16: Action Buttons Visibility by Estado**
    - **Validates: Requirements 6.6, 7.5, 12.1**

- [x] 11. Actualizar componente ClaseFormModal
  - [x] 11.1 Modificar `src/features/classes/components/ClaseFormModal.tsx`
    - Conectar dropdowns con datos de catálogos
    - Implementar validación de fecha futura
    - Implementar modo crear vs editar
    - Implementar submit con formato correcto de request
    - Implementar estados de loading en botones
    - _Requirements: 5.1, 5.2, 5.4, 5.7, 6.1, 6.2, 10.3_

  - [x] 11.2 Escribir property test para validación de fecha futura
    - **Property 11: Create Clase Future Validation**
    - **Validates: Requirements 5.4**

- [x] 12. Actualizar componente ClaseDetailModal
  - [x] 12.1 Modificar `src/features/classes/components/ClaseDetailModal.tsx`
    - Conectar con datos de useClaseDetailQuery
    - Implementar display de todos los campos
    - Implementar cálculo de duración
    - Implementar botón "Ir a Asistencia"
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 12.2 Escribir property test para display del modal
    - **Property 9: ClaseDetailModal Display**
    - **Validates: Requirements 4.3**

- [x] 13. Actualizar página AdminClassesPage
  - [x] 13.1 Modificar `src/pages/admin/ClassesPage.tsx`
    - Integrar hook useAdminClasses
    - Conectar filtros con Redux state
    - Implementar renderizado de clases agrupadas por fecha
    - Implementar skeleton loaders durante carga
    - Implementar empty state cuando no hay clases
    - Implementar stats cards flotantes
    - _Requirements: 3.3, 3.7, 3.8, 8.5, 8.6, 9.3, 10.1, 10.2_

  - [x] 13.2 Implementar confirmación de cancelación
    - Agregar dialog de confirmación antes de cancelar
    - _Requirements: 7.1, 7.6_

- [x] 14. Checkpoint - Verificar UI completa
  - Asegurar que la página renderiza correctamente
  - Verificar que los filtros funcionan
  - Verificar que los modales abren y cierran
  - Preguntar al usuario si hay dudas

- [x] 15. Implementar navegación a asistencias
  - [x] 15.1 Agregar navegación desde ClaseCard y ClaseDetailModal
    - Implementar navegación a `/admin/asistencias?claseId={idClase}`
    - Verificar que el parámetro se pasa correctamente
    - _Requirements: 12.2, 12.3, 12.4_

  - [x] 15.2 Escribir property test para navegación
    - **Property 16: Navigation to Attendance**
    - **Validates: Requirements 12.2**

- [x] 16. Mejorar manejo de errores
  - [x] 16.1 Verificar manejo de errores HTTP
    - Verificar que 401 redirige a login
    - Verificar que 403 muestra mensaje de permisos
    - Verificar que 400 muestra mensaje del backend
    - Verificar que 404 muestra mensaje apropiado
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 16.2 Escribir unit tests para manejo de errores
    - Test para cada código de error (401, 403, 404, 400, 500)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 17. Checkpoint final - Integración completa
  - Asegurar que todos los tests pasan
  - Verificar que la página funciona end-to-end
  - Verificar flujo completo: crear, editar, cancelar clase
  - Verificar navegación a asistencias
  - Preguntar al usuario si hay dudas o ajustes necesarios

## Notes

- Todas las tareas son obligatorias, incluyendo tests
- Cada task referencia los requisitos específicos para trazabilidad
- Los checkpoints permiten validación incremental
- Property tests validan propiedades universales de correctness
- Unit tests validan ejemplos específicos y edge cases
- Se reutiliza la configuración MSAL y httpClient existente del módulo de asistencias
- El lenguaje de implementación es TypeScript con React
