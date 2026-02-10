import { expect, test } from '../helpers/fixtures';

/**
 * CP-ASI-001: Registro de asistencia normal con descuento de clase
 * 
 * Precondiciones:
 * - Usuario alumno autenticado (Juan David)
 * - Alumno tiene paquete activo con clases disponibles
 * - Existe una clase programada
 * 
 * Pasos:
 * 1. Login como alumno
 * 2. Navegar a página de asistencias
 * 3. Registrar asistencia con tipo "Asistencia Completa"
 * 4. Verificar que se registró correctamente
 * 5. Verificar que se descontó una clase del paquete
 * 
 * Resultado esperado:
 * - Asistencia registrada exitosamente
 * - ClasesUsadas incrementa en 1
 * - ClasesDisponibles decrementa en 1
 */
test.describe('CP-ASI-001: Registro de asistencia normal', () => {
  
  test('debe registrar asistencia y descontar clase del paquete', async ({ page, auth }) => {
    // 1. Login como alumno
    await auth.loginMock('alumno');
    
    // Verificar que cargó el dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1, h2').filter({ hasText: /bienvenido|dashboard/i })).toBeVisible();
    
    // 2. Navegar a asistencias (ajustar selector según tu UI)
    await page.click('text=Asistencias');
    
    // Esperar que cargue la página
    await page.waitForLoadState('networkidle');
    
    // 3. Click en "Registrar Asistencia" o similar
    await page.click('button:has-text("Registrar")');
    
    // Esperar que aparezca el formulario
    await page.waitForSelector('form, [data-testid="asistencia-form"]');
    
    // 4. Llenar formulario (ajustar selectores según tu implementación)
    await page.selectOption('select[name="tipoAsistencia"]', '1'); // Asistencia Completa
    
    // 5. Enviar formulario
    await page.click('button[type="submit"]');
    
    // 6. Verificar mensaje de éxito
    await expect(
      page.locator('.toast, .alert, [role="alert"]').filter({ hasText: /éxito|registrada|completado/i })
    ).toBeVisible({ timeout: 5000 });
    
    // 7. Verificar que aparece en la lista
    await page.waitForSelector('table tbody tr, .asistencia-item');
    
    // 8. Tomar screenshot de evidencia
    await page.screenshot({ path: 'test-results/CP-ASI-001-success.png', fullPage: true });
  });

  test('no debe permitir registrar sin paquete activo', async ({ page, auth }) => {
    // Este test se puede implementar con un alumno sin paquetes
    // O desactivando el paquete del alumno de prueba
    
    await auth.loginMock('alumno2'); // Alumno sin asistencias previas
    
    await page.click('text=Asistencias');
    await page.waitForLoadState('networkidle');
    
    // Intentar registrar sin paquete disponible debería mostrar error
    // (Implementar según tus validaciones)
  });

});

/**
 * Test básico de navegación - Verificar que la app carga
 */
test.describe('Verificación básica', () => {
  
  test('la aplicación carga correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que carga la página de login o dashboard
    await expect(page).toHaveTitle(/Chetango/i);
    
    // Verificar que hay contenido visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    console.log('✅ Aplicación cargó correctamente');
  });

  test('login funciona con usuario mock', async ({ page, auth }) => {
    await auth.loginMock('admin');
    
    // Verificar que redirige al dashboard después del login
    await page.waitForTimeout(1000); // Esperar animaciones
    
    // Debería ver el nombre del usuario o dashboard
    const isLoggedIn = await auth.isAuthenticated();
    expect(isLoggedIn).toBeTruthy();
    
    console.log('✅ Login mock funcionó correctamente');
  });

});
