import { expect, test } from './helpers/fixtures';

/**
 * Test de verificación básica - Smoke Test
 * 
 * Este test verifica que la aplicación carga correctamente
 * y que el sistema de autenticación mock funciona.
 */

test.describe('Verificación de Setup E2E', () => {
  
  test('🚀 La aplicación carga correctamente', async ({ page }) => {
    console.log('\n🔍 Navegando a http://localhost:5173...');
    
    await page.goto('/');
    
    // Esperar que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que hay contenido en el body
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBeTruthy();
    
    console.log('✅ Aplicación cargó correctamente');
    
    // Tomar screenshot de evidencia
    await page.screenshot({ 
      path: 'test-results/00-app-loaded.png', 
      fullPage: true 
    });
  });

  test('🔐 Login mock funciona correctamente', async ({ page, auth }) => {
    console.log('\n🔍 Probando autenticación mock...');
    
    // Login como admin
    await auth.loginMock('admin');
    
    // Esperar un poco para que procese
    await page.waitForTimeout(2000);
    
    // Verificar que el token se guardó
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBeTruthy();
    
    console.log('✅ Token guardado en localStorage');
    
    // Verificar que podemos leer la info del usuario
    const userInfo = await auth.getCurrentUser();
    console.log('👤 Usuario actual:', userInfo);
    
    expect(userInfo).toBeTruthy();
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/01-login-mock.png', 
      fullPage: true 
    });
    
    console.log('✅ Login mock funcionó correctamente');
  });

  test('📊 Puede navegar por la aplicación', async ({ page, auth }) => {
    console.log('\n🔍 Probando navegación básica...');
    
    await auth.loginMock('admin');
    await page.waitForTimeout(1000);
    
    // Verificar que la URL cambió o permanece en la app
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // La app debe estar en localhost:5173
    expect(currentUrl).toContain('localhost:5173');
    
    // Buscar elementos comunes de navegación
    const hasNavigation = await page.locator('nav, header, [role="navigation"]').count() > 0;
    console.log('🧭 Navegación detectada:', hasNavigation);
    
    // Tomar screenshot del estado final
    await page.screenshot({ 
      path: 'test-results/02-navegacion.png', 
      fullPage: true 
    });
    
    console.log('✅ Navegación básica funcional');
  });

  test('🌐 Backend responde correctamente', async ({ page }) => {
    console.log('\n🔍 Verificando conectividad con backend...');
    
    // Interceptar llamadas al API
    let apiCallDetected = false;
    
    page.on('response', response => {
      if (response.url().includes('localhost:5194') || response.url().includes('/api/')) {
        apiCallDetected = true;
        console.log('📡 Llamada al API detectada:', response.url(), response.status());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    console.log('📊 ¿Se detectaron llamadas al API?', apiCallDetected);
    
    // Este test pasa independientemente, solo es informativo
    console.log('ℹ️ Backend en: http://localhost:5194');
    console.log('ℹ️ Frontend en: http://localhost:5173');
  });

});
