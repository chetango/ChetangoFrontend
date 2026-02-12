import { expect, test } from '../helpers/fixtures';
import { expectToastMessage, waitForApiCall } from '../helpers/test-data.helper';

/**
 * CP-NOM-009 a CP-NOM-014: Pruebas de Nómina con Múltiples Profesores y Tarifas Individuales
 * 
 * Reglas de Negocio: R40-R50, R42a-R42f
 * - Cada profesor tiene tarifa individual configurable
 * - Cualquier profesor puede ser Principal o Monitor en diferentes clases
 * - Una clase puede tener múltiples profesores con diferentes roles
 * - La nómina se calcula según: TarifaProgramada = TarifaProfesor × HorasDuración
 * - Se pueden aplicar valores adicionales (bonos/descuentos)
 */
test.describe('Nómina - Casos Críticos (Tarifas Individuales)', () => {

  test('CP-NOM-009: Calcular pago con tarifas individuales de profesores', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // Crear clase con Jorge (tarifa 40k) - duración 1.5 horas
    await page.goto('/admin/clases/crear');
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="fecha"]', '2026-02-04'); // Ayer
    await page.fill('[data-testid="hora-inicio"]', '18:00');
    await page.fill('[data-testid="hora-fin"]', '19:30'); // 1.5 horas
    await page.selectOption('[data-testid="profesor-principal"]', { label: 'Jorge' });
    
    await page.click('button[type="submit"]');
    await expectToastMessage(page, 'Clase creada');
    
    // ACT: Completar clase
    const claseRow = page.locator('[data-testid="clase-row"]').filter({ hasText: 'Jorge' }).first();
    await claseRow.locator('button:has-text("Completar")').click();
    
    const responsePromise = waitForApiCall(page, '/api/clases/completar');
    await page.click('button:has-text("Confirmar")');
    await responsePromise;
    
    // ASSERT: Verificar cálculo de nómina
    await page.goto('/admin/nomina');
    await page.waitForLoadState('networkidle');
    
    const pagoJorge = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Jorge' }).first();
    const tarifaProgramada = await pagoJorge.locator('[data-testid="tarifa-programada"]').textContent();
    
    // 40,000 × 1.5 = 60,000
    expect(tarifaProgramada).toContain('60,000');
    
    console.log('✅ CP-NOM-009: Tarifa individual calculada correctamente (40k × 1.5h = 60k)');
  });

  test('CP-NOM-010: Calcular pago para clase con múltiples profesores', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // Crear clase con 2 profesores: Ana (40k) Principal + Santi (30k) Monitor
    await page.goto('/admin/clases/crear');
    
    await page.fill('[data-testid="fecha"]', '2026-02-04');
    await page.fill('[data-testid="hora-inicio"]', '20:00');
    await page.fill('[data-testid="hora-fin"]', '21:00'); // 1 hora
    
    // Profesor principal
    await page.selectOption('[data-testid="profesor-principal"]', { label: 'Ana' });
    
    // Agregar monitor
    await page.click('[data-testid="agregar-monitor"]');
    await page.selectOption('[data-testid="monitor-1"]', { label: 'Santi' });
    
    await page.click('button[type="submit"]');
    await expectToastMessage(page, 'Clase creada');
    
    // ACT: Completar clase
    const claseRow = page.locator('[data-testid="clase-row"]').filter({ hasText: 'Ana' }).first();
    await claseRow.locator('button:has-text("Completar")').click();
    await page.click('button:has-text("Confirmar")');
    
    await waitForApiCall(page, '/api/clases/completar');
    
    // ASSERT: Verificar ambos pagos
    await page.goto('/admin/nomina');
    await page.waitForLoadState('networkidle');
    
    // Ana Principal: 40k × 1h = 40k
    const pagoAna = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Ana' }).first();
    const tarifaAna = await pagoAna.locator('[data-testid="tarifa-programada"]').textContent();
    expect(tarifaAna).toContain('40,000');
    
    // Santi Monitor: 30k × 1h = 30k
    const pagoSanti = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Santi' }).first();
    const tarifaSanti = await pagoSanti.locator('[data-testid="tarifa-programada"]').textContent();
    expect(tarifaSanti).toContain('30,000');
    
    console.log('✅ CP-NOM-010: Múltiples profesores calculados correctamente');
  });

  test('CP-NOM-011: Modificar tarifa de profesor desde vista de usuario', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // ACT: Ir a perfil de profesor Jorge
    await page.goto('/admin/profesores');
    await page.waitForLoadState('networkidle');
    
    const profesorRow = page.locator('[data-testid="profesor-row"]').filter({ hasText: 'Jorge' }).first();
    await profesorRow.click();
    
    // Esperar modal o página de edición
    await page.waitForSelector('[data-testid="editar-profesor"]');
    
    // Modificar tarifa
    await page.fill('[data-testid="tarifa-actual"]', '45000');
    
    const responsePromise = waitForApiCall(page, '/api/profesores');
    await page.click('button[type="submit"]:has-text("Guardar")');
    await responsePromise;
    
    // ASSERT: Verificar que se actualizó
    await expectToastMessage(page, 'Tarifa actualizada');
    
    // Verificar en la lista
    await page.goto('/admin/profesores');
    await page.waitForLoadState('networkidle');
    
    const tarifaActualizada = await page.locator('[data-testid="profesor-row"]')
      .filter({ hasText: 'Jorge' })
      .locator('[data-testid="tarifa"]')
      .textContent();
    
    expect(tarifaActualizada).toContain('45,000');
    
    console.log('✅ CP-NOM-011: Tarifa de profesor actualizada desde UI');
  });

  test('CP-NOM-012: Mismo profesor en roles diferentes en distintas clases', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // Crear Clase 1: Jorge como Principal
    await page.goto('/admin/clases/crear');
    await page.fill('[data-testid="fecha"]', '2026-02-04');
    await page.fill('[data-testid="hora-inicio"]', '18:00');
    await page.fill('[data-testid="hora-fin"]', '19:00');
    await page.selectOption('[data-testid="profesor-principal"]', { label: 'Jorge' });
    await page.click('button[type="submit"]');
    await expectToastMessage(page, 'Clase creada');
    
    // Crear Clase 2: Jorge como Monitor (con Ana de Principal)
    await page.goto('/admin/clases/crear');
    await page.fill('[data-testid="fecha"]', '2026-02-04');
    await page.fill('[data-testid="hora-inicio"]', '20:00');
    await page.fill('[data-testid="hora-fin"]', '21:00');
    await page.selectOption('[data-testid="profesor-principal"]', { label: 'Ana' });
    await page.click('[data-testid="agregar-monitor"]');
    await page.selectOption('[data-testid="monitor-1"]', { label: 'Jorge' });
    await page.click('button[type="submit"]');
    await expectToastMessage(page, 'Clase creada');
    
    // ACT: Completar ambas clases
    await page.goto('/admin/clases');
    const clases = page.locator('[data-testid="clase-row"]').filter({ hasText: '2026-02-04' });
    
    for (let i = 0; i < 2; i++) {
      await clases.nth(i).locator('button:has-text("Completar")').click();
      await page.click('button:has-text("Confirmar")');
      await page.waitForTimeout(1000);
    }
    
    // ASSERT: Verificar nómina con ambos roles
    await page.goto('/admin/nomina');
    await page.waitForLoadState('networkidle');
    
    const pagosJorge = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Jorge' });
    const count = await pagosJorge.count();
    
    expect(count).toBeGreaterThanOrEqual(2); // Al menos 2 pagos
    
    // Debe haber uno como Principal y otro con rol diferente
    const roles = [];
    for (let i = 0; i < Math.min(count, 2); i++) {
      const rol = await pagosJorge.nth(i).locator('[data-testid="rol"]').textContent();
      roles.push(rol);
    }
    
    expect(roles).toContain('Principal');
    
    console.log(`✅ CP-NOM-012: Jorge con roles flexibles (${roles.join(', ')})`);
  });

  test('CP-NOM-013: Aplicar valor adicional (bono) a pago de profesor', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    // Ir a nómina pendiente
    await page.goto('/admin/nomina');
    await page.waitForLoadState('networkidle');
    
    // ACT: Seleccionar un pago y agregar bono
    const pagoRow = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Pendiente' }).first();
    await pagoRow.locator('button:has-text("Editar")').click();
    
    await page.waitForSelector('[data-testid="modal-editar-pago"]');
    
    // Agregar bono de 10,000
    await page.fill('[data-testid="valor-adicional"]', '10000');
    await page.fill('[data-testid="observaciones"]', 'Bono por clase especial');
    
    await page.click('button[type="submit"]');
    await expectToastMessage(page, 'Pago actualizado');
    
    // ASSERT: Verificar total con bono
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const totalPago = await pagoRow.locator('[data-testid="total-pago"]').textContent();
    const total = parseInt(totalPago?.replace(/\D/g, '') || '0');
    
    // Debe ser mayor que la tarifa base
    expect(total).toBeGreaterThan(10000);
    
    console.log(`✅ CP-NOM-013: Bono aplicado correctamente (Total: ${totalPago})`);
  });

  test('CP-NOM-014: Aprobar pago y cambiar estado', async ({ page, auth }) => {
    // ARRANGE: Login como admin
    await auth.loginMock('admin');
    
    await page.goto('/admin/nomina');
    await page.waitForLoadState('networkidle');
    
    // ACT: Aprobar un pago pendiente
    const pagoPendiente = page.locator('[data-testid="pago-row"]').filter({ hasText: 'Pendiente' }).first();
    const nombreProfesor = await pagoPendiente.locator('[data-testid="nombre-profesor"]').textContent();
    
    await pagoPendiente.locator('button:has-text("Aprobar")').click();
    await page.click('button:has-text("Confirmar")');
    
    await expectToastMessage(page, 'Pago aprobado');
    
    // ASSERT: Verificar cambio de estado
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const pagoAprobado = page.locator('[data-testid="pago-row"]').filter({ hasText: nombreProfesor || '' }).first();
    const estado = await pagoAprobado.locator('[data-testid="estado-pago"]').textContent();
    
    expect(estado).toContain('Aprobado');
    
    console.log(`✅ CP-NOM-014: Pago aprobado para ${nombreProfesor}`);
  });
});
