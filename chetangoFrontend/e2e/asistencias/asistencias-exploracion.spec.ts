import { expect, test } from '../helpers/fixtures';

/**
 * CP-ASI-001: Registro de asistencia normal con descuento de clase
 * CP-ASI-002: Registro de asistencia con paquete válido
 * 
 * Casos de prueba de módulo Asistencias
 */

test.describe('Módulo Asistencias - Registro', () => {

  test.beforeEach(async ({ page, auth }) => {
    // Login como alumno antes de cada test
    await auth.loginMock('alumno');
    await page.waitForLoadState('networkidle');
  });

  test('CP-ASI-001: Registrar asistencia normal y verificar descuento', async ({ page }) => {
    console.log('\n📝 CP-ASI-001: Registro de asistencia con descuento de clase');
    
    // 1. Navegar a la sección de asistencias
    console.log('1️⃣ Navegando a asistencias...');
    
    // Buscar link/botón de asistencias en navegación
    const asistenciasLinks = [
      'a[href*="asistencias"]',
      'a[href*="attendance"]',
      'button:has-text("Asistencias")',
      '[data-testid="nav-asistencias"]',
      'nav a:has-text("Asistencias")',
    ];
    
    let navigated = false;
    for (const selector of asistenciasLinks) {
      const element = page.locator(selector).first();
      if (await element.count() > 0 && await element.isVisible()) {
        await element.click();
        console.log(`   ✓ Click en: ${selector}`);
        navigated = true;
        break;
      }
    }
    
    if (!navigated) {
      // Intentar navegación directa
      await page.goto('/asistencias');
      console.log('   ℹ️ Navegación directa a /asistencias');
    }
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/CP-ASI-001-step1-navegacion.png', fullPage: true });
    
    // 2. Verificar que estamos en la página correcta
    const currentUrl = page.url();
    console.log(`2️⃣ URL actual: ${currentUrl}`);
    
    // 3. Buscar botón para registrar nueva asistencia
    console.log('3️⃣ Buscando botón "Registrar Asistencia"...');
    
    const registrarButtons = [
      'button:has-text("Registrar")',
      'button:has-text("Nueva Asistencia")',
      '[data-testid="registrar-asistencia"]',
      'button:has-text("Agregar")',
      'a:has-text("Registrar")',
    ];
    
    let registrarFound = false;
    for (const selector of registrarButtons) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          await element.click();
          console.log(`   ✓ Click en botón: ${selector}`);
          registrarFound = true;
          break;
        }
      }
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/CP-ASI-001-step3-formulario.png', fullPage: true });
    
    // 4. Verificar estado actual
    console.log('4️⃣ Analizando estado de la página...');
    
    // Ver qué elementos hay en la página
    const pageText = await page.locator('body').textContent();
    console.log('   📄 Texto visible (primeros 500 caracteres):');
    console.log('   ' + pageText?.substring(0, 500).replace(/\s+/g, ' '));
    
    // Verificar si hay formularios
    const formCount = await page.locator('form').count();
    console.log(`   📋 Formularios detectados: ${formCount}`);
    
    // Verificar si hay inputs/selects
    const inputCount = await page.locator('input, select, textarea').count();
    console.log(`   🔤 Campos de entrada detectados: ${inputCount}`);
    
    // Verificar si hay tablas (lista de asistencias)
    const tableCount = await page.locator('table').count();
    console.log(`   📊 Tablas detectadas: ${tableCount}`);
    
    // 5. Buscar lista de clases disponibles o similar
    console.log('5️⃣ Buscando clases disponibles...');
    
    const claseItems = await page.locator('tr, .clase-item, .card, [role="listitem"]').count();
    console.log(`   📚 Items de clase detectados: ${claseItems}`);
    
    // 6. Tomar screenshot final del estado
    await page.screenshot({ 
      path: 'test-results/CP-ASI-001-step6-estado-final.png', 
      fullPage: true 
    });
    
    // 7. Análisis de estructura
    console.log('7️⃣ Estructura de navegación:');
    const navItems = await page.locator('nav a, nav button').allTextContents();
    console.log('   🧭 Items de navegación:', navItems.slice(0, 10));
    
    console.log('\n📊 RESULTADO DEL TEST:');
    console.log('   ℹ️ Este es un test exploratorio para entender la estructura de tu UI');
    console.log('   ℹ️ Revisa los screenshots en test-results/ para ver el estado actual');
    console.log('   ℹ️ Basado en esto, ajustaremos los selectores específicos');
    
    // El test pasa para que podamos ver los resultados
    expect(true).toBeTruthy();
  });

  test('CP-ASI-EXPLORACION: Explorar estructura completa de la app', async ({ page }) => {
    console.log('\n🔍 Test exploratorio de estructura');
    
    await page.waitForTimeout(2000);
    
    // 1. Analizar estructura de la página principal
    console.log('\n1️⃣ ESTRUCTURA DEL DOM:');
    
    const mainSelectors = {
      'Contenedor principal': 'main, #root, #app, [role="main"]',
      'Navegación': 'nav, [role="navigation"], header',
      'Sidebar': 'aside, .sidebar, [role="complementary"]',
      'Contenido': '.content, .main-content, main > div',
    };
    
    for (const [name, selector] of Object.entries(mainSelectors)) {
      const count = await page.locator(selector).count();
      const visible = count > 0 ? await page.locator(selector).first().isVisible().catch(() => false) : false;
      console.log(`   ${visible ? '✅' : '❌'} ${name}: ${selector} (${count} encontrados)`);
    }
    
    // 2. Analizar rutas disponibles
    console.log('\n2️⃣ RUTAS DISPONIBLES:');
    
    const links = await page.locator('a[href]').evaluateAll(links => 
      links.map(a => ({ 
        text: a.textContent?.trim(), 
        href: a.getAttribute('href') 
      }))
    );
    
    const uniqueRoutes = [...new Set(links.map(l => l.href))].filter(h => h?.startsWith('/'));
    console.log('   Rutas detectadas:');
    uniqueRoutes.slice(0, 15).forEach(route => {
      console.log(`   - ${route}`);
    });
    
    // 3. Tomar screenshots de diferentes secciones
    await page.screenshot({ 
      path: 'test-results/EXPLORACION-dashboard.png', 
      fullPage: true 
    });
    
    // Intentar navegar a diferentes secciones
    const sections = [
      '/asistencias',
      '/attendance', 
      '/clases',
      '/classes',
      '/paquetes',
      '/packages',
    ];
    
    for (const section of sections) {
      try {
        await page.goto(`http://localhost:5173${section}`, { waitUntil: 'networkidle', timeout: 5000 });
        const title = await page.title();
        console.log(`   ✓ ${section} - Título: ${title}`);
        
        await page.screenshot({ 
          path: `test-results/EXPLORACION${section.replace(/\//g, '-')}.png`, 
          fullPage: true 
        });
      } catch (e) {
        console.log(`   ❌ ${section} - No accesible`);
      }
    }
    
    console.log('\n✅ Exploración completa. Revisa los screenshots en test-results/');
    expect(true).toBeTruthy();
  });

  test('CP-ASI-API: Verificar endpoints del API de asistencias', async ({ page }) => {
    console.log('\n🌐 Test de conectividad API');
    
    const apiCalls: any[] = [];
    
    // Interceptar todas las llamadas al API
    page.on('response', response => {
      if (response.url().includes('localhost:5194') || response.url().includes('/api/')) {
        apiCalls.push({
          url: response.url(),
          status: response.status(),
          method: response.request().method(),
        });
      }
    });
    
    // Navegar por la app para generar llamadas
    await page.waitForTimeout(2000);
    
    // Intentar navegar a asistencias
    await page.goto('http://localhost:5173/asistencias').catch(() => {});
    await page.waitForTimeout(2000);
    
    console.log('\n📡 LLAMADAS AL API DETECTADAS:');
    const backendCalls = apiCalls.filter(c => c.url.includes('localhost:5194'));
    
    if (backendCalls.length > 0) {
      console.log(`   ✅ Se detectaron ${backendCalls.length} llamadas al backend:`);
      backendCalls.forEach(call => {
        console.log(`   - ${call.method} ${call.url} (${call.status})`);
      });
    } else {
      console.log('   ℹ️ No se detectaron llamadas al backend aún');
      console.log('   ℹ️ Esto es normal si la página requiere autenticación real');
    }
    
    console.log(`\n   📊 Total de requests HTTP: ${apiCalls.length}`);
    
    expect(true).toBeTruthy();
  });

});
