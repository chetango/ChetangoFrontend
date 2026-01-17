# Documento de Pruebas de Integración - Módulo de Asistencias

**Fecha:** 2026-01-12  
**Ambiente:** Development  
**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5129  
**Usuario de prueba:** Chetango@chetangoprueba.onmicrosoft.com (rol: admin)

---

## Resumen de Pruebas

| # | Caso | Endpoint | Resultado | Estado |
|---|------|----------|-----------|--------|
| 1 | Registrar asistencia con paquete activo | POST /api/asistencias | 400 Bad Request | ❌ FALLO |

---

## Caso 1: Registrar asistencia para alumno con paquete activo

### Contexto
- **Alumno:** Juan David (ID: `295093d5-b36f-4737-b68a-ab40ca871b2e`)
- **Clase:** Clase de Jorge del 2026-01-12 (ID: `6a50c2cb-461e-4ee1-a50f-03f938bc5b4c`)
- **Paquete del alumno:** ID `aabbccdd-1234-5678-90ab-cdef12345678`
  - Estado: 1 (Activo)
  - Clases disponibles: 8
  - Clases usadas: 0
  - Fecha activación: 2026-01-12
  - Fecha vencimiento: 2026-02-11

### Request

```http
POST http://localhost:5129/api/asistencias
Authorization: Bearer {token}
Content-Type: application/json

{
  "idClase": "6a50c2cb-461e-4ee1-a50f-03f938bc5b4c",
  "idAlumno": "295093d5-b36f-4737-b68a-ab40ca871b2e",
  "presente": true,
  "observacion": "Asistencia de prueba"
}
```

### Response

```http
HTTP/1.1 400 Bad Request

{
  "message": "El paquete especificado no existe o no pertenece al alumno."
}
```

### Resultado: ❌ FALLO

### Análisis

El frontend envía el request correctamente según el contrato de la API documentado en `docs/API-CONTRACT-ASISTENCIAS.md`. Sin embargo, el backend rechaza la solicitud indicando que no encuentra un paquete válido.

**Datos verificados en BD:**
- El paquete existe con ID `aabbccdd-1234-5678-90ab-cdef12345678`
- El paquete pertenece al alumno `295093d5-b36f-4737-b68a-ab40ca871b2e`
- El estado del paquete es 1 (Activo)
- Las fechas son válidas (activación: 2026-01-12, vencimiento: 2026-02-11)
- Tiene 8 clases disponibles y 0 usadas

### Causa raíz identificada ✅

**Inconsistencia entre contrato de API y implementación del backend.**

Después de revisar el código del handler `RegistrarAsistenciaCommandHandler.cs`, se identificó que:

1. **El backend REQUIERE el campo `IdPaqueteUsado`** en el request (línea 43):
   ```csharp
   var paquete = await _db.Set<Paquete>()
       .FirstOrDefaultAsync(p => p.IdPaquete == request.IdPaqueteUsado && p.IdAlumno == request.IdAlumno, ...);
   ```

2. **El contrato de API documentado NO incluye este campo:**
   ```json
   // Según docs/API-CONTRACT-ASISTENCIAS.md
   {
     "idClase": "uuid",
     "idAlumno": "uuid", 
     "presente": boolean,
     "observacion": "string (opcional)"
   }
   ```

3. **El frontend envía el request según el contrato**, sin `IdPaqueteUsado`.

### Opciones de solución

| Opción | Descripción | Impacto |
|--------|-------------|---------|
| A | **Backend busca automáticamente el paquete activo del alumno** | Cambio en backend, mantiene contrato actual |
| B | **Frontend envía `idPaqueteUsado`** | Cambio en frontend y contrato, requiere obtener paquete del alumno primero |
| C | **Actualizar contrato y ambos lados** | Documentar el campo requerido y ajustar frontend |

### Recomendación

**Opción A** - El backend debería buscar automáticamente el paquete activo del alumno cuando no se proporciona `IdPaqueteUsado`. Esto simplifica el flujo del frontend y es más intuitivo para el caso de uso de "registrar asistencia".

### Acción requerida

1. Revisar con el equipo de backend cuál opción implementar
2. Si se elige Opción B o C, actualizar el contrato de API
3. Actualizar el frontend si es necesario

---

## Notas Técnicas

### Configuración de Autenticación
- Client ID (Frontend): `3cfbc7f6-0df6-41dd-9216-213a3fbc618a`
- Scope: `api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/access_as_user`
- Authority: `https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251`

### Headers enviados
- `Authorization: Bearer {access_token}` ✅
- `Content-Type: application/json` ✅

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-01-12 | Documento inicial con Caso 1 |
