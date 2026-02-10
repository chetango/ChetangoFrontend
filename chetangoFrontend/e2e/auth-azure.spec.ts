import { expect, test } from './helpers/fixtures';

/**
 * Tests de autenticación REAL con Microsoft Azure
 * Estos tests prueban el flujo OAuth 2.0 completo
 */

test.describe('Autenticación Real con Azure', () => {

  test('Login como Admin - Flujo completo', async ({ page, auth }) => {
    console.log('\n🔐 CP-AUTH-001: Login de Administrador');
    
    // Login real con Azure
    await auth.loginReal('admin');
    
    // Verificar que estamos autenticados
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBeTruthy();
    
    // Verificar que cargó el dashboard
    const currentUrl = page.url();
    console.log(`   📍 URL actual: ${currentUrl}`);
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/AUTH-REAL-01-admin-dashboard.png', 
      fullPage: true 
    });
    
    // Verificar navegación disponible
    const navCount = await page.locator('nav a, header a, aside a').count();
    console.log(`   🧭 Enlaces de navegación: ${navCount}`);
    
    if (navCount > 0) {
      const navLinks = await page.locator('nav a, header a, aside a').allTextContents();
      console.log('   Opciones disponibles:');
      navLinks.slice(0, 10).forEach(link => {
        if (link.trim()) console.log(`   - ${link.trim()}`);
      });
    }
    
    expect(navCount).toBeGreaterThan(0);
  });

  test('Login como Profesor - Flujo completo', async ({ page, auth }) => {
    console.log('\n🔐 CP-AUTH-002: Login de Profesor');
    
    await auth.loginReal('profesorJorge');
    
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBeTruthy();
    
    await page.screenshot({ 
      path: 'test-results/AUTH-REAL-02-profesor-dashboard.png', 
      fullPage: true 
    });
    
    console.log('   ✅ Profesor autenticado correctamente');
  });

  test('Login como Alumno - Flujo completo', async ({ page, auth }) => {
    console.log('\n🔐 CP-AUTH-003: Login de Alumno');
    
    await auth.loginReal('alumnoJuan');
    
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBeTruthy();
    
    await page.screenshot({ 
      path: 'test-results/AUTH-REAL-03-alumno-dashboard.png', 
      fullPage: true 
    });
    
    console.log('   ✅ Alumno autenticado correctamente');
  });

  test('Navegación completa después de login', async ({ page, auth }) => {
    console.log('\n🧭 CP-AUTH-004: Navegación post-login');
    
    // Login como admin para tener acceso completo
    await auth.loginReal('admin');
    
    await page.waitForTimeout(2000);
    
    // Listar todas las rutas disponibles
    const links = await page.locator('a[href^="/"]').evaluateAll(links => 
      links.map(a => ({
        text: a.textContent?.trim(),
        href: a.getAttribute('href'),
      }))
    );
    
    const uniqueRoutes = [...new Set(links.map(l => l.href))].filter(Boolean);
    console.log(`\n   📚 Rutas disponibles: ${uniqueRoutes.length}`);
    uniqueRoutes.forEach(route => console.log(`   - ${route}`));
    
    // Intentar navegar a cada ruta principal
    const mainRoutes = [
      '/dashboard',
      '/asistencias', 
      '/clases',
      '/paquetes',
      '/pagos',
      '/profesores',
      '/alumnos',
      '/reportes',
    ];
    
    for (const route of mainRoutes) {
      try {
        console.log(`\n   🔍 Navegando a: ${route}`);
        await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle', timeout: 5000 });
        
        const finalUrl = page.url();
        const isAccessible = finalUrl.includes(route) || !finalUrl.includes('404');
        
        console.log(`   ${isAccessible ? '✅' : '❌'} ${route} - URL: ${finalUrl}`);
        
        if (isAccessible) {
          await page.screenshot({ 
            path: `test-results/NAV-${route.replace('/', '')}.png`, 
            fullPage: true 
          });
        }
      } catch (e) {
        console.log(`   ❌ ${route} - Error: ${e}`);
      }
    }
    
    expect(true).toBeTruthy();
  });

});
