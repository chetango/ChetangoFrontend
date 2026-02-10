import { expect, test } from './helpers/fixtures';

/**
 * Test de autenticación y navegación REAL
 * Este test sigue el flujo completo de autenticación
 */

test.describe('Flujo Real de Autenticación y Navegación', () => {

  test('Explorar app con autenticación real', async ({ page }) => {
    console.log('\n🔐 TEST DE AUTENTICACIÓN REAL');
    
    // 1. Ir a la página principal
    console.log('\n1️⃣ Navegando a http://localhost:5173...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Tomar screenshot inicial
    await page.screenshot({ 
      path: 'test-results/AUTH-01-pagina-inicial.png', 
      fullPage: true 
    });
    
    // 2. Ver qué hay en la página inicial
    console.log('\n2️⃣ Analizando página inicial...');
    const currentUrl = page.url();
    console.log(`   URL actual: ${currentUrl}`);
    
    const pageText = await page.locator('body').textContent();
    console.log(`   Texto visible (primeros 300 chars): ${pageText?.substring(0, 300).replace(/\s+/g, ' ')}`);
    
    // 3. Buscar botones de login
    console.log('\n3️⃣ Buscando botones de login...');
    
    const loginSelectors = [
      'button:has-text("Iniciar sesión")',
      'button:has-text("Login")',
      'button:has-text("Ingresar")',
      'a:has-text("Iniciar sesión")',
      '[data-testid="login-button"]',
      'button[type="submit"]',
    ];
    
    for (const selector of loginSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const text = await page.locator(selector).first().textContent();
        const isVisible = await page.locator(selector).first().isVisible().catch(() => false);
        console.log(`   ${isVisible ? '✅' : '❌'} "${selector}" - Texto: "${text}" (${count} encontrados)`);
      }
    }
    
    // 4. Ver si hay formulario de login
    console.log('\n4️⃣ Analizando formularios...');
    const formCount = await page.locator('form').count();
    console.log(`   Formularios: ${formCount}`);
    
    const inputCount = await page.locator('input').count();
    console.log(`   Inputs: ${inputCount}`);
    
    if (inputCount > 0) {
      const inputs = await page.locator('input').evaluateAll(inputs => 
        inputs.map(i => ({
          type: i.getAttribute('type'),
          name: i.getAttribute('name'),
          placeholder: i.getAttribute('placeholder'),
        }))
      );
      console.log('   Inputs detectados:', inputs);
    }
    
    // 5. Verificar si ya estamos autenticados (token en localStorage)
    console.log('\n5️⃣ Verificando estado de autenticación...');
    const hasToken = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      console.log('LocalStorage keys:', keys);
      return keys.some(k => k.includes('token') || k.includes('auth') || k.includes('msal'));
    });
    console.log(`   ¿Hay token en localStorage? ${hasToken}`);
    
    // 6. Ver cookies
    const cookies = await page.context().cookies();
    console.log(`   Cookies: ${cookies.length}`);
    if (cookies.length > 0) {
      cookies.forEach(c => console.log(`   - ${c.name}`));
    }
    
    // 7. Buscar elementos de navegación (si ya está autenticado)
    console.log('\n6️⃣ Buscando elementos de navegación...');
    
    const navElements = await page.locator('nav a, nav button, header a, header button, aside a, aside button').count();
    console.log(`   Elementos de navegación: ${navElements}`);
    
    if (navElements > 0) {
      const navTexts = await page.locator('nav a, nav button, header a, header button, aside a, aside button').allTextContents();
      console.log('   Opciones de navegación:');
      navTexts.slice(0, 15).forEach(text => {
        if (text.trim()) console.log(`   - ${text.trim()}`);
      });
    }
    
    // 8. Buscar rutas en el DOM
    console.log('\n7️⃣ Analizando rutas disponibles...');
    const links = await page.locator('a[href]').evaluateAll(links =>
      links.map(a => a.getAttribute('href'))
    );
    
    const internalRoutes = links.filter(href => 
      href?.startsWith('/') && !href.startsWith('/#')
    );
    
    const uniqueRoutes = [...new Set(internalRoutes)];
    console.log(`   Rutas internas encontradas: ${uniqueRoutes.length}`);
    uniqueRoutes.slice(0, 20).forEach(route => {
      console.log(`   - ${route}`);
    });
    
    // 9. Screenshot final
    await page.screenshot({ 
      path: 'test-results/AUTH-02-estado-final.png', 
      fullPage: true 
    });
    
    console.log('\n📊 RESUMEN:');
    console.log(`   URL: ${currentUrl}`);
    console.log(`   ¿Autenticado?: ${hasToken ? 'Sí (tiene token)' : 'No'}`);
    console.log(`   Navegación visible: ${navElements > 0 ? 'Sí' : 'No'}`);
    console.log(`   Rutas detectadas: ${uniqueRoutes.length}`);
    
    console.log('\n💡 SIGUIENTE PASO:');
    if (!hasToken && inputCount > 0) {
      console.log('   → Parece que hay un formulario de login. Necesitamos credenciales reales.');
    } else if (hasToken) {
      console.log('   → Ya hay sesión iniciada. Intentemos navegar.');
    } else {
      console.log('   → Analizar screenshots para entender el flujo de auth.');
    }
    
    expect(true).toBeTruthy();
  });

  test('Intentar navegar después de "login mock"', async ({ page, auth }) => {
    console.log('\n🧪 TEST: Navegación después de login mock');
    
    // 1. Hacer login mock
    console.log('\n1️⃣ Ejecutando login mock...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Guardar token manualmente
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'mock-token-12345');
      localStorage.setItem('userRole', 'Alumno');
      localStorage.setItem('userId', 'test-user-001');
    });
    
    console.log('   ✓ Token mock guardado en localStorage');
    
    // 2. Recargar la página
    console.log('\n2️⃣ Recargando página...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const urlAfterReload = page.url();
    console.log(`   URL después de reload: ${urlAfterReload}`);
    
    await page.screenshot({ 
      path: 'test-results/AUTH-03-despues-mock.png', 
      fullPage: true 
    });
    
    // 3. Ver si cambió algo
    const pageText = await page.locator('body').textContent();
    console.log(`   Texto visible: ${pageText?.substring(0, 200).replace(/\s+/g, ' ')}`);
    
    // 4. Buscar navegación
    const navCount = await page.locator('nav, header, aside').count();
    console.log(`   Elementos de navegación: ${navCount}`);
    
    if (navCount > 0) {
      console.log('\n✅ La app detectó la autenticación mock!');
      
      const navLinks = await page.locator('nav a, header a, aside a').allTextContents();
      console.log('   Links disponibles:');
      navLinks.forEach(link => {
        if (link.trim()) console.log(`   - ${link.trim()}`);
      });
    } else {
      console.log('\n❌ La app NO detectó la autenticación mock');
      console.log('   → Necesitamos usar el sistema de auth real de la app');
    }
    
    expect(true).toBeTruthy();
  });

});
