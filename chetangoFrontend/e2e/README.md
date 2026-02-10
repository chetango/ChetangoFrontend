# Guía de Ejecución - Tests E2E Playwright

## 📋 Prerequisitos

1. **Base de datos preparada:**
   ```powershell
   # Ejecutar seed de testing (ya ejecutado)
   sqlcmd -S "localhost" -E -d "ChetangoDB_Dev" -i "scripts\seed_testing_data.sql"
   ```

2. **Backend corriendo:**
   ```powershell
   cd c:\Proyectos\AppChetango\AppChetango\chetango-backend
   dotnet run --project Chetango.Api/Chetango.Api.csproj --launch-profile http-qa
   ```

3. **Frontend corriendo:**
   ```powershell
   cd c:\Proyectos\AppChetango\AppChetango\chetango-frontend\chetangoFrontend
   npm run dev
   ```
   
   > **Nota:** Si usas la configuración `webServer` en `playwright.config.ts`, Playwright iniciará el frontend automáticamente.

## 🚀 Ejecutar Tests

### Ejecutar todos los tests:
```powershell
cd c:\Proyectos\AppChetango\AppChetango\chetango-frontend\chetangoFrontend
npx playwright test
```

### Ejecutar un módulo específico:
```powershell
# Solo asistencias
npx playwright test e2e/asistencias

# Solo nómina
npx playwright test e2e/nomina

# Solo paquetes
npx playwright test e2e/paquetes
```

### Ejecutar un archivo específico:
```powershell
npx playwright test e2e/asistencias/asistencias-criticas.spec.ts
```

### Ejecutar un test específico:
```powershell
npx playwright test -g "CP-ASI-001"
```

## 🎯 Modo de Depuración

### Con UI interactiva:
```powershell
npx playwright test --ui
```

### Con inspector (paso a paso):
```powershell
npx playwright test --debug
```

### Ver en navegador visible:
```powershell
npx playwright test --headed
```

## 📊 Ver Reportes

Después de ejecutar los tests:

```powershell
npx playwright show-report
```

Abre un reporte HTML con:
- ✅ Tests pasados/fallados
- 📸 Screenshots de fallos
- 🎥 Videos de ejecución
- ⏱️ Tiempos de ejecución
- 📝 Logs detallados

## 🔧 Configuración de Autenticación

Los tests usan **autenticación simulada (mock)** por defecto para agilidad.

### Para usar autenticación real con Azure:

1. Configurar variables de entorno:
   ```powershell
   $env:USE_REAL_AUTH = "true"
   $env:ADMIN_PASSWORD = "tu-password-aquí"
   $env:PROFESOR_PASSWORD = "tu-password-aquí"
   $env:ALUMNO_PASSWORD = "tu-password-aquí"
   ```

2. Modificar en los tests:
   ```typescript
   // Cambiar de:
   await auth.loginMock('admin');
   
   // A:
   await auth.loginReal('admin');
   ```

## 📂 Estructura de Tests

```
e2e/
├── helpers/
│   ├── auth.helper.ts         # Autenticación (mock y real)
│   ├── test-data.helper.ts    # Datos y utilidades
│   └── fixtures.ts            # Fixtures personalizados
├── asistencias/
│   └── asistencias-criticas.spec.ts  # CP-ASI-001 a CP-ASI-007
├── nomina/
│   └── nomina-criticas.spec.ts       # CP-NOM-009 a CP-NOM-014
├── paquetes/
├── pagos/
├── clases/
└── reportes/
```

## ⚠️ Solución de Problemas

### Tests fallan por timeout:
- Verificar que backend y frontend estén corriendo
- Aumentar `navigationTimeout` en `playwright.config.ts`

### Elementos no encontrados:
- Los selectores `[data-testid="..."]` deben agregarse en los componentes React
- Alternativamente, ajustar selectores en los tests

### Autenticación falla:
- Usar modo `--headed` para ver qué ocurre en el navegador
- Verificar que `localStorage` guarda el token correctamente

### Base de datos sin datos:
- Re-ejecutar `seed_testing_data.sql`
- Verificar conexión a `localhost` (no LocalDB)

## 🎨 Mejores Prácticas

1. **Agregar `data-testid` a componentes críticos:**
   ```tsx
   <button data-testid="registrar-asistencia">Registrar</button>
   ```

2. **Usar Page Objects para páginas complejas:**
   ```typescript
   class AsistenciasPage {
     constructor(private page: Page) {}
     async registrarAsistencia() { ... }
   }
   ```

3. **Limpiar datos después de cada test:**
   ```typescript
   test.afterEach(async () => {
     // Eliminar datos de prueba
   });
   ```

4. **Paralelización cuidadosa:**
   - Los tests que modifican BD no deben correr en paralelo
   - Configurar `fullyParallel: false` si hay conflictos

## 📈 Próximos Pasos

1. ✅ Implementar casos CP-ASI-001 a CP-ASI-007
2. ✅ Implementar casos CP-NOM-009 a CP-NOM-014
3. ⏳ Implementar casos CP-PAQ-001 a CP-PAQ-011 (Paquetes)
4. ⏳ Implementar casos CP-PAG-001 a CP-PAG-009 (Pagos)
5. ⏳ Implementar casos CP-CLA-001 a CP-CLA-013 (Clases)
6. ⏳ Implementar casos CP-REP-001 a CP-REP-006 (Reportes)

## 🔗 Recursos

- [Documentación Playwright](https://playwright.dev/)
- [Plan de Pruebas](../docs/PLAN-PRUEBAS-AUTOMATIZADAS.md)
- [Datos de Testing](../docs/DATOS-TESTING-REQUERIDOS.md)
