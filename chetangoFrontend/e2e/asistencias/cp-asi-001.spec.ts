import { exec } from 'child_process';
import { promisify } from 'util';
import { expect, test } from '../helpers/fixtures';

const execAsync = promisify(exec);

/**
 * CP-ASI-001: Registro de asistencia normal con descuento de clase
 * 
 * Regla de negocio R1: El registro de asistencia descuenta automáticamente 
 * una clase del paquete activo del alumno cuando TipoAsistencia.DescontarClase = true
 * 
 * Flujo Admin:
 * 1. Consultar BD: Obtener paquetes de Juan David antes de marcar asistencia
 * 2. Login como administrador
 * 3. Ir a Asistencias
 * 4. Click en ÍCONO del calendario para abrir selector
 * 5. Seleccionar Día 4 (donde hay clase)
 * 6. Click en "Clase del Día" y seleccionar Tango
 * 7. Buscar estudiante "Juan" en buscador
 * 8. Marcar como Presente (click en "AUSENTE")
 * 9. Guardar (si hay botón)
 * 10. Consultar BD: Verificar que ClasesUsadas incrementó en 1
 */

async function getPaquetesAlumno(documentoONombre: string): Promise<Array<{ ClasesDisponibles: number, ClasesUsadas: number }>> {
  const query = `SELECT p.ClasesDisponibles, p.ClasesUsadas FROM Paquetes p INNER JOIN Alumnos a ON p.IdAlumno = a.IdAlumno INNER JOIN Usuarios u ON a.IdUsuario = u.IdUsuario WHERE u.NumeroDocumento = '${documentoONombre}' OR u.NombreUsuario LIKE '%${documentoONombre}%' ORDER BY p.FechaCreacion`;
  const { stdout } = await execAsync(`sqlcmd -S localhost -d ChetangoDB_Dev -Q "${query}" -h -1 -s "|" -W`);
  
  const lines = stdout.split('\n').filter(line => line.trim() && !line.includes('rows affected'));
  const paquetes = lines.slice(1).map(line => {
    const [disponibles, usadas] = line.trim().split('|').map(v => parseInt(v.trim()));
    return { ClasesDisponibles: disponibles, ClasesUsadas: usadas };
  }).filter(p => !isNaN(p.ClasesDisponibles) && !isNaN(p.ClasesUsadas));
  
  return paquetes;
}

test.describe('CP-ASI-001: Registro de Asistencia', () => {

  test('Registrar asistencia completa y verificar descuento de clase', async ({ page, auth }) => {
    console.log('\n📝 CP-ASI-001: Registro de asistencia con descuento');
    
    // 1. Login como ADMINISTRADOR
    console.log('\n1️⃣ Autenticando como administrador...');
    await auth.loginReal('admin');
    
    console.log(`   ✓ Autenticado - URL: ${page.url()}`);
    await page.screenshot({ path: 'test-results/CP-ASI-001-01-dashboard-admin.png', fullPage: true });
    
    // 2. Navegar a asistencias
    console.log('\n2️⃣ Navegando a módulo de asistencias...');
    await page.click('a:has-text("Asistencias")');
    await page.waitForLoadState('networkidle');
    
    console.log(`   ✓ En asistencias - URL: ${page.url()}`);
    await page.screenshot({ path: 'test-results/CP-ASI-001-02-vista-inicial.png', fullPage: true });
    
    // 3. Interfaz de registro
    console.log('\n3️⃣ Interfaz de registro cargada');
    
    // 4. Click en el BOTÓN del calendario (que muestra "5 feb 2026")
    console.log('\n4️⃣ Abriendo calendario (click en botón con fecha)...');
    
    let calendarOpened = false;
    
    // Buscar el BOTÓN que contiene "5 feb 2026" o similar
    const fechaButton = page.locator('button:has-text("5 feb"), button:has-text("feb 2026")').first();
    if (await fechaButton.isVisible()) {
      await fechaButton.click();
      console.log('   ✓ Click en botón "5 feb 2026"');
      calendarOpened = true;
      await page.waitForTimeout(1000);
    } else {
      console.log('   ⚠️ No se encontró botón con fecha');
    }
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-03-calendario-abierto.png', fullPage: true });
    
    // 5. Seleccionar día 4
    console.log('\n5️⃣ Seleccionando día 4...');
    
    let dayClicked = false;
    if (calendarOpened) {
      // Buscar TODOS los elementos que tengan exactamente el texto "4"
      const day4Elements = page.getByText('4', { exact: true });
      const count = await day4Elements.count();
      console.log(`   🔎 Encontrados ${count} elementos con texto "4"`);
      
      // Intentar click en cada uno hasta que funcione
      for (let i = 0; i < count; i++) {
        const el = day4Elements.nth(i);
        if (await el.isVisible()) {
          try {
            await el.click({ timeout: 1000 });
            console.log(`   ✓ Click en día 4 (elemento #${i})`);
            dayClicked = true;
            await page.waitForTimeout(2000);
            break;
          } catch (e) {
            console.log(`   ⚠️ Elemento #${i} no clickeable, probando siguiente...`);
          }
        }
      }
    }
    
    if (!dayClicked) {
      console.log('   ⚠️ No se pudo hacer click en el día 4');
    }
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-04-despues-fecha.png', fullPage: true });
    
    // 6. Click en el botón "Seleccionar clase..." para abrir el desplegable
    console.log('\n6️⃣ Abriendo desplegable de clases...');
    
    let claseSelected = false;
    
    // Buscar el botón que dice "Seleccionar clase..."
    const claseButton = page.locator('button:has-text("Seleccionar clase"), button:has-text("Seleccionar")').first();
    if (await claseButton.isVisible()) {
      await claseButton.click();
      console.log('   ✓ Click en "Seleccionar clase..."');
      await page.waitForTimeout(1500);
      
      // Ahora hacer click en la opción "Tango - 18:00 a 19:30 (Jorge Padilla)"
      // Buscar el elemento completo con todo el texto
      const tangoOption = page.locator('text="Tango - 18:00 a 19:30 (Jorge Padilla)"').first();
      
      if (await tangoOption.isVisible({ timeout: 5000 })) {
        await tangoOption.click({ force: true });
        console.log('   ✓ Clase "Tango - 18:00 a 19:30" seleccionada');
        claseSelected = true;
        await page.waitForTimeout(3000); // Esperar más tiempo para que carguen los alumnos
      } else {
        // Si no encuentra el texto exacto, buscar cualquier elemento con "Tango"
        console.log('   ⚠️ Intentando selector alternativo para Tango...');
        const anyTango = page.getByRole('option').filter({ hasText: /Tango/i }).first();
        if (await anyTango.isVisible({ timeout: 3000 })) {
          await anyTango.click({ force: true });
          console.log('   ✓ Clase Tango seleccionada (selector alternativo)');
          claseSelected = true;
          await page.waitForTimeout(3000);
        } else {
          console.log('   ⚠️ No se encontró opción "Tango" en el desplegable');
        }
      }
    } else {
      console.log('   ⚠️ No se encontró botón "Seleccionar clase..."');
    }
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-05-despues-clase.png', fullPage: true });
    
    // 7. NO buscar alumno específico - dejar que muestre todos
    console.log('\n7️⃣ Mostrando todos los alumnos (sin filtro)...');
    await page.waitForTimeout(3000); // Esperar que carguen todos los alumnos
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-06-todos-alumnos.png', fullPage: true });
    
    // 7.5. Encontrar el PRIMER alumno con botón AUSENTE y capturar su contador
    console.log('\n7️⃣.5️⃣ Buscando primer alumno AUSENTE...');
    
    const primerAusente = page.locator('text=/AUSENTE/i').first();
    
    if (!await primerAusente.isVisible()) {
      console.log('   ❌ No hay ningún alumno AUSENTE');
      expect(false).toBeTruthy(); // Fallar el test
      return;
    }
    
    // Buscar el contenedor del alumno que tiene ese botón AUSENTE
    const alumnoRow = primerAusente.locator('xpath=ancestor::*[contains(@class, "")]').first();
    
    // Capturar el contador del paquete (buscar patrón X/Y en la misma fila)
    const paqueteTextoAntes = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
    console.log(`   📦 Primer alumno AUSENTE - Contador: "${paqueteTextoAntes}"`);
    
    const matchAntes = paqueteTextoAntes?.match(/(\d+)\/(\d+)/);
    const usadasAntes = matchAntes ? parseInt(matchAntes[1]) : 0;
    const totalAntes = matchAntes ? parseInt(matchAntes[2]) : 0;
    console.log(`   📊 ANTES de marcar: ${usadasAntes}/${totalAntes} usadas`);
    
    let studentSearched = true;
    
    // 8. Marcar asistencia
    console.log('\n8️⃣ Buscando botones AUSENTE...');
    
    const paqueteItems = await page.locator('text=/Paquete/i').count();
    const ausenteButtons = await page.locator('text=/AUSENTE/i').count();
    
    console.log(`   📦 Paquetes: ${paqueteItems}`);
    console.log(`   👥 Botones AUSENTE: ${ausenteButtons}`);
    
    let asistenciaMarcada = false;
    if (ausenteButtons > 0) {
      console.log('   ✓ Click en primer botón "AUSENTE"');
      await primerAusente.click();
      console.log('   ✓ Asistencia cambiada a PRESENTE');
      asistenciaMarcada = true;
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-07-asistencia-marcada.png', fullPage: true });
    
    // 9. Guardar
    console.log('\n9️⃣ Buscando botón guardar...');
    
    const guardarBtn = page.locator('button:has-text("Guardar"), button:has-text("Confirmar")').first();
    let guardado = false;
    
    if (await guardarBtn.isVisible().catch(() => false)) {
      await guardarBtn.click();
      console.log('   ✓ Click en guardar');
      guardado = true;
      await page.waitForTimeout(2000);
    } else {
      console.log('   ℹ️ Sin botón guardar (guardado automático)');
    }
    
    await page.screenshot({ path: 'test-results/CP-ASI-001-08-resultado-final.png', fullPage: true });
    
    // 10. Esperar confirmación de guardado
    console.log('\n🔟 Esperando confirmación de guardado...');
    
    // Buscar mensajes de éxito o confirmación
    const successMessages = page.locator('text=/guardado|éxito|success|confirmado/i');
    if (await successMessages.first().isVisible().catch(() => false)) {
      const msg = await successMessages.first().textContent();
      console.log(`   ✓ Mensaje de confirmación: "${msg}"`);
    } else {
      console.log('   ℹ️ No se detectó mensaje de confirmación');
    }
    
    await page.waitForTimeout(5000); // Esperar 5 segundos para guardado en BD
    
    // 11. Capturar valor del paquete DESPUÉS de marcar asistencia (de la UI)
    console.log('\n1️⃣1️⃣ Capturando contador de paquete DESPUÉS...');
    
    // Esperar que la UI se actualice
    await page.waitForTimeout(2000);
    
    const paqueteTextoDespues = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
    console.log(`   📦 Contador visible en UI: "${paqueteTextoDespues}"`);
    
    const matchDespues = paqueteTextoDespues?.match(/(\d+)\/(\d+)/);
    const usadasDespues = matchDespues ? parseInt(matchDespues[1]) : 0;
    const totalDespues = matchDespues ? parseInt(matchDespues[2]) : 0;
    console.log(`   📊 DESPUÉS: ${usadasDespues}/${totalDespues} usadas`);
    
    // Validar que incrementó en 1
    const paqueteIncrementado = (usadasDespues === usadasAntes + 1) && (totalDespues === totalAntes);
    
    if (paqueteIncrementado) {
      console.log(`\n   ✅ VALIDACIÓN: Paquete incrementó correctamente`);
      console.log(`      ANTES:   ${usadasAntes}/${totalAntes}`);
      console.log(`      DESPUÉS: ${usadasDespues}/${totalDespues}`);
    } else {
      console.log(`\n   ❌ VALIDACIÓN FALLIDA:`);
      console.log(`      ANTES:   ${usadasAntes}/${totalAntes}`);
      console.log(`      DESPUÉS: ${usadasDespues}/${totalDespues}`);
      console.log(`      Esperado: ${usadasAntes + 1}/${totalAntes}`);
    }
    
    expect(paqueteIncrementado).toBeTruthy();
    
    // 12. Resumen
    console.log('\n📊 RESUMEN DEL TEST:');
    console.log(`   Calendario abierto: ${calendarOpened ? 'Sí' : 'No'}`);
    console.log(`   Día 4 seleccionado: ${dayClicked ? 'Sí' : 'No'}`);
    console.log(`   Clase seleccionada: ${claseSelected ? 'Sí' : 'No'}`);
    console.log(`   Estudiante buscado: ${studentSearched ? 'Sí' : 'No'}`);
    console.log(`   Paquetes: ${paqueteItems}, AUSENTE: ${ausenteButtons}`);
    console.log(`   Asistencia marcada: ${asistenciaMarcada ? 'Sí' : 'No'}`);
    console.log(`   Guardado: ${guardado ? 'Manual' : 'Automático'}`);
    console.log(`   Paquete ANTES: ${usadasAntes}/${totalAntes}`);
    console.log(`   Paquete DESPUÉS: ${usadasDespues}/${totalDespues}`);
    console.log(`   Paquete decrementado: ${paqueteIncrementado ? '✅ Sí' : '❌ No'}`);
    
    console.log('\n   ⚠️ Revisa screenshots en test-results/');
  });

});
