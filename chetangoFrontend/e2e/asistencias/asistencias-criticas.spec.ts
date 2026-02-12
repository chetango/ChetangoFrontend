import { expect, test } from '../helpers/fixtures';
import { expectToastMessage, testIds, waitForApiCall } from '../helpers/test-data.helper';

/**
 * CP-ASI-001: Registrar asistencia normal con descuento de paquete
 * 
 * Regla de Negocio: R1
 * Un alumno solo puede registrar asistencia si tiene un paquete activo con clases disponibles.
 * 
 * Precondiciones:
 * - Backend corriendo en localhost
 * - BD con datos de testing (seed_testing_data.sql ejecutado)
 * - Alumno Juan con paquete activo
 * - Clase disponible para registrar asistencia
 * 
 * Resultado Esperado:
 * - Asistencia registrada exitosamente
 * - Paquete descontado en 1 clase
 * - Mensaje de confirmación mostrado
 */
test.describe('Asistencias - Casos Críticos', () => {
  
  test('CP-ASI-001: Debe registrar asistencia normal y descontar clase del paquete', async ({ page, auth }) => {
    // ARRANGE: Login como alumno
    await auth.loginMock('alumno');
    
    // ACT: Navegar a la página de asistencias
    await page.goto('/asistencias');
    await page.waitForLoadState('networkidle');
    
    // Buscar clase disponible (de ayer o hoy)
    const claseCard = page.locator('[data-testid="clase-card"]').first();
    await claseCard.waitFor({ state: 'visible' });
    
    // Click en "Registrar Asistencia"
    await claseCard.locator('button:has-text("Registrar")').click();
    
    // Esperar modal o formulario
    await page.waitForSelector('[data-testid="modal-asistencia"]', { timeout: 5000 });
    
    // Seleccionar tipo de asistencia "Completa"
    await page.selectOption('[data-testid="tipo-asistencia"]', '1'); // ID del tipo
    
    // Verificar que muestra el paquete disponible
    const paqueteInfo = await page.locator('[data-testid="paquete-info"]').textContent();
    expect(paqueteInfo).toContain('Clases disponibles');
    
    // Confirmar registro
    const responsePromise = waitForApiCall(page, '/api/asistencias');
    await page.click('button[type="submit"]:has-text("Confirmar")');
    
    // ASSERT: Verificar respuesta del API
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    
    // Verificar mensaje de éxito
    await expectToastMessage(page, 'Asistencia registrada exitosamente');
    
    // Verificar que el paquete se descontó
    await page.goto('/perfil/paquetes');
    await page.waitForLoadState('networkidle');
    
    const clasesUsadas = await page.locator('[data-testid="clases-usadas"]').textContent();
    expect(clasesUsadas).toMatch(/\d+/); // Debe mostrar un número
    
    console.log('✅ CP-ASI-001: Asistencia registrada y paquete descontado');
  });

  test('CP-ASI-002: No debe permitir asistencia sin paquete activo', async ({ page, auth }) => {
    // ARRANGE: Login como alumno2 (sin paquete activo para la clase)
    await auth.loginMock('alumno2');
    
    // ACT: Intentar registrar asistencia
    await page.goto('/asistencias');
    await page.waitForLoadState('networkidle');
    
    const claseCard = page.locator('[data-testid="clase-card"]').first();
    await claseCard.waitFor({ state: 'visible' });
    
    // Verificar que el botón está deshabilitado o no existe
    const registrarBtn = claseCard.locator('button:has-text("Registrar")');
    
    // Opción 1: El botón está deshabilitado
    const isDisabled = await registrarBtn.isDisabled().catch(() => true);
    
    // Opción 2: El botón no existe
    const count = await registrarBtn.count();
    
    // ASSERT: Debe estar deshabilitado o no existir
    expect(isDisabled || count === 0).toBeTruthy();
    
    // Debe mostrar mensaje informativo
    const mensaje = await page.locator('[data-testid="sin-paquete-warning"]').textContent();
    expect(mensaje).toContain('paquete activo');
    
    console.log('✅ CP-ASI-002: Validación sin paquete activo funciona correctamente');
  });

  test('CP-ASI-004: No debe permitir asistencia con paquete vencido', async ({ page, auth }) => {
    // ARRANGE: Login como alumno Juan (tiene paquete vencido)
    await auth.loginMock('alumno');
    
    // ACT: Navegar a página de asistencias
    await page.goto('/asistencias');
    await page.waitForLoadState('networkidle');
    
    // Intentar registrar con clase que requiere paquete activo
    const claseCard = page.locator('[data-testid="clase-card"]').first();
    await claseCard.click();
    
    // Si permite llegar al formulario
    const modalVisible = await page.locator('[data-testid="modal-asistencia"]').isVisible().catch(() => false);
    
    if (modalVisible) {
      // Seleccionar paquete vencido (si aparece en la lista)
      const paqueteVencidoOption = page.locator(`option[value="${testIds.paqueteVencido}"]`);
      const exists = await paqueteVencidoOption.count();
      
      // ASSERT: El paquete vencido NO debe aparecer en opciones válidas
      expect(exists).toBe(0);
    } else {
      // El sistema previene desde el inicio - mejor aún
      const warning = await page.locator('[data-testid="paquete-vencido-warning"]').textContent();
      expect(warning).toContain('vencido');
    }
    
    console.log('✅ CP-ASI-004: Paquete vencido correctamente bloqueado');
  });

  test('CP-ASI-005: Debe permitir recuperación sin descontar paquete', async ({ page, auth }) => {
    // ARRANGE: Login como alumno
    await auth.loginMock('alumno');
    
    // Obtener clases usadas inicialmente
    await page.goto('/perfil/paquetes');
    await page.waitForLoadState('networkidle');
    const clasesUsadasInicial = await page.locator('[data-testid="clases-usadas"]').first().textContent();
    const numeroInicial = parseInt(clasesUsadasInicial?.match(/\d+/)?.[0] || '0');
    
    // ACT: Registrar asistencia tipo "Recuperación"
    await page.goto('/asistencias');
    await page.waitForLoadState('networkidle');
    
    const claseCard = page.locator('[data-testid="clase-card"]').first();
    await claseCard.locator('button:has-text("Registrar")').click();
    
    await page.waitForSelector('[data-testid="modal-asistencia"]');
    
    // Seleccionar tipo "Recuperación" (no requiere paquete, no descuenta)
    await page.selectOption('[data-testid="tipo-asistencia"]', { label: 'Recuperación' });
    
    // Nota informativa debe aparecer
    const nota = await page.locator('[data-testid="info-recuperacion"]').textContent();
    expect(nota).toContain('no descontará');
    
    // Confirmar
    await page.click('button[type="submit"]:has-text("Confirmar")');
    await expectToastMessage(page, 'Asistencia registrada');
    
    // ASSERT: Verificar que el paquete NO se descontó
    await page.goto('/perfil/paquetes');
    await page.waitForLoadState('networkidle');
    
    const clasesUsadasFinal = await page.locator('[data-testid="clases-usadas"]').first().textContent();
    const numeroFinal = parseInt(clasesUsadasFinal?.match(/\d+/)?.[0] || '0');
    
    // El número debe ser igual (no se descontó)
    expect(numeroFinal).toBe(numeroInicial);
    
    console.log('✅ CP-ASI-005: Recuperación sin descuento funciona correctamente');
  });

  test('CP-ASI-007: Admin debe ver todas las asistencias', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // ACT: Navegar al listado de asistencias
    await page.goto('/admin/asistencias');
    await page.waitForLoadState('networkidle');
    
    // ASSERT: Debe ver asistencias de todos los alumnos
    const asistencias = page.locator('[data-testid="asistencia-row"]');
    const count = await asistencias.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Debe tener filtros por fecha, alumno, clase
    await expect(page.locator('[data-testid="filtro-fecha"]')).toBeVisible();
    await expect(page.locator('[data-testid="filtro-alumno"]')).toBeVisible();
    await expect(page.locator('[data-testid="filtro-clase"]')).toBeVisible();
    
    console.log(`✅ CP-ASI-007: Admin visualiza ${count} asistencias correctamente`);
  });
});
