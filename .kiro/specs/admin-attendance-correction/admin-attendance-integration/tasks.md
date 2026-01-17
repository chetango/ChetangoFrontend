# Implementation Plan: Admin Attendance Integration

## Overview

Este plan implementa la integración de la página de Corrección de Asistencias con el backend de Chetango. Las tareas están organizadas para hacer cambios incrementales, validando cada paso antes de continuar.

## Tasks

- [x] 1. Actualizar configuración de autenticación MSAL
  - [x] 1.1 Actualizar variables de entorno en `.env`
    - Cambiar `VITE_ENTRA_CLIENT_ID` a `d35c1d4d-9ddc-4a8b-bb89-1964b37ff573`
    - Cambiar `VITE_ENTRA_AUTHORITY` a `https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251`
    - Agregar scope de API: `api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/chetango.api`
    - Cambiar `VITE_API_BASE_URL` a `https://localhost:7194`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1_

  - [x] 1.2 Actualizar `msalConfig.ts` para usar variables de entorno correctamente
    - Asegurar que tokenRequest incluya el scope de API
    - Verificar que cacheLocation sea 'sessionStorage'
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 1.3 Escribir unit tests para configuración MSAL
    - Verificar que msalConfig tiene los valores correctos
    - Verificar que tokenRequest incluye todos los scopes requeridos
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Actualizar tipos de datos de attendance
  - [x] 2.1 Modificar `attendanceTypes.ts` para incluir `idAsistencia`
    - Agregar `idAsistencia: string | null` a `AttendanceRecord`
    - Actualizar `UpdateAttendanceRequest` para usar `presente: boolean`
    - Agregar tipo `RegisterAttendanceRequest`
    - _Requirements: 6.2, 7.2_

  - [x] 2.2 Escribir property test para formato de request de actualización
    - **Property 9: Update Mutation Request Format**
    - **Validates: Requirements 6.1, 6.2, 8.1**

- [x] 3. Checkpoint - Verificar configuración
  - Asegurar que la aplicación compila sin errores
  - Verificar que los tipos están correctos
  - Preguntar al usuario si hay dudas

- [x] 4. Corregir mutations de attendance
  - [x] 4.1 Actualizar `useUpdateAttendanceMutation` en `attendanceMutations.ts`
    - Cambiar endpoint a `PUT /api/asistencias/{idAsistencia}/estado`
    - Actualizar body para usar `presente: boolean` en lugar de `estado: string`
    - Mantener lógica de optimistic updates
    - _Requirements: 6.1, 6.2, 8.1_

  - [x] 4.2 Agregar `useRegisterAttendanceMutation` para nuevos registros
    - Implementar `POST /api/asistencias` con body correcto
    - Manejar response 201 con ID de nueva asistencia
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 4.3 Escribir property test para formato de request de registro
    - **Property 10: Register Mutation Request Format**
    - **Validates: Requirements 7.2**

- [x] 5. Actualizar hook useAdminAttendance
  - [x] 5.1 Modificar `toggleAttendance` para usar el nuevo formato
    - Obtener `idAsistencia` del estudiante
    - Si no existe `idAsistencia`, usar `useRegisterAttendanceMutation`
    - Si existe, usar `useUpdateAttendanceMutation`
    - _Requirements: 6.1, 7.1_

  - [x] 5.2 Modificar `updateObservation` para usar el nuevo formato
    - Usar `idAsistencia` del estudiante
    - Implementar debounce de 500ms
    - _Requirements: 8.1, 8.2_

  - [x] 5.3 Escribir property test para debounce de observaciones
    - **Property 13: Observation Debounce**
    - **Validates: Requirements 8.2**

- [x] 6. Checkpoint - Verificar mutations
  - Asegurar que todas las mutations compilan
  - Verificar que los tests pasan
  - Preguntar al usuario si hay dudas

- [x] 7. Mejorar manejo de errores
  - [x] 7.1 Actualizar `errorInterceptor.ts` con mensajes específicos
    - Agregar manejo de 403 con mensaje "No tienes permisos..."
    - Agregar manejo de 404 con mensaje "El recurso solicitado no existe"
    - Agregar manejo de 400 mostrando mensaje del response
    - _Requirements: 2.5, 11.2, 11.3, 11.4_

  - [x] 7.2 Actualizar componente `ErrorState` para errores inline
    - Mostrar errores 403 como estado inline (no toast)
    - Mantener botón de retry para errores recuperables
    - _Requirements: 11.5_

  - [x] 7.3 Escribir unit tests para manejo de errores
    - Test para cada código de error (401, 403, 404, 400, 500)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 8. Verificar componentes de UI
  - [x] 8.1 Verificar `DateFilter` muestra fechas correctamente
    - Asegurar que muestra rango desde-hasta
    - Asegurar que resalta días con clases
    - _Requirements: 3.3, 3.4_

  - [x] 8.2 Verificar `ClassSelector` formato de display
    - Asegurar formato: `{nombre} - {horaInicio} a {horaFin} ({profesorPrincipal})`
    - Asegurar mensaje cuando no hay clases
    - _Requirements: 4.3, 4.4_

  - [x] 8.3 Verificar `AttendanceTable` muestra todos los campos
    - Verificar que muestra: nombre, documento, paquete, asistencia, observación
    - _Requirements: 5.3_

  - [x] 8.4 Escribir property test para formato de display de clase
    - **Property 5: Class Display Format**
    - **Validates: Requirements 4.3**

- [x] 9. Verificar búsqueda y filtrado
  - [x] 9.1 Verificar `useAttendanceSearch` filtra correctamente
    - Filtrar por nombreCompleto OR documentoIdentidad
    - Implementar debounce de 300ms
    - _Requirements: 9.1, 9.3_

  - [x] 9.2 Verificar `StatsSummary` actualiza con filtros
    - Stats deben reflejar solo estudiantes filtrados
    - _Requirements: 9.5_

  - [x] 9.3 Escribir property test para filtrado de búsqueda
    - **Property 11: Search Filter Behavior**
    - **Validates: Requirements 9.1, 9.3**

  - [x] 9.4 Escribir property test para stats filtrados
    - **Property 12: Filtered Stats Accuracy**
    - **Validates: Requirements 9.5**

- [x] 10. Checkpoint final - Integración completa
  - Asegurar que todos los tests pasan
  - Verificar que la página funciona end-to-end
  - Preguntar al usuario si hay dudas o ajustes necesarios

## Notes

- Todas las tareas son obligatorias, incluyendo tests
- Cada task referencia los requisitos específicos para trazabilidad
- Los checkpoints permiten validación incremental
- Property tests validan propiedades universales de correctness
- Unit tests validan ejemplos específicos y edge cases
