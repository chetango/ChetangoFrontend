import { Page } from '@playwright/test';

/**
 * Datos de prueba para los tests E2E
 */

// IDs de entidades en la BD de prueba
export const testIds = {
  // Profesores
  profesorJorge: '8f6e460d-328d-4a40-89e3-b8effa76829c',
  profesorAna: 'aaaaaaaa-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  profesorSanti: 'cccccccc-dddd-dddd-dddd-dddddddddddd',
  profesorMaria: 'eeeeeeee-ffff-ffff-ffff-ffffffffffff',
  
  // Alumnos
  alumnoJuan: '295093d5-b36f-4737-b68a-ab40ca871b2e',
  alumnoMaria: '22222222-2222-2222-2222-222222222222',
  
  // Paquetes
  paqueteVencido: '55555555-5555-5555-5555-555555555555',
  paqueteCasiAgotado: '66666666-6666-6666-6666-666666666666',
  paqueteAlumno2: '77777777-7777-7777-7777-777777777777',
  
  // Clases
  claseAyer: '88888888-8888-8888-8888-888888888888',
  claseFutura: '99999999-9999-9999-9999-999999999999',
};

/**
 * Tarifas de profesores (según seed_testing_data.sql)
 */
export const tarifasProfesores = {
  jorge: 40000,
  ana: 40000,
  santi: 30000,
  maria: 30000,
};

/**
 * Tipos de asistencia (IDs ficticios - verificar con BD real)
 */
export const tiposAsistencia = {
  asistenciaCompleta: {
    id: 1,
    nombre: 'Asistencia Completa',
    requierePaquete: true,
    descontarClase: true,
  },
  asistenciaParcial: {
    id: 2,
    nombre: 'Asistencia Parcial',
    requierePaquete: true,
    descontarClase: false,
  },
  recuperacion: {
    id: 3,
    nombre: 'Recuperación',
    requierePaquete: false,
    descontarClase: false,
  },
};

/**
 * Helper para esperar a que las peticiones al API terminen
 */
export async function waitForApiCall(page: Page, endpoint: string) {
  return await page.waitForResponse(
    (response) => 
      response.url().includes(endpoint) && 
      (response.status() === 200 || response.status() === 201),
    { timeout: 10000 }
  );
}

/**
 * Helper para obtener el texto de un elemento de forma segura
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = await page.locator(selector).first();
  const text = await element.textContent();
  return text?.trim() || '';
}

/**
 * Helper para esperar y hacer click de forma segura
 */
export async function clickElement(page: Page, selector: string) {
  await page.locator(selector).first().waitFor({ state: 'visible' });
  await page.locator(selector).first().click();
}

/**
 * Helper para llenar formularios
 */
export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.locator(selector).fill(value);
  }
}

/**
 * Helper para verificar que existe un mensaje de éxito/error
 */
export async function expectToastMessage(page: Page, message: string, type: 'success' | 'error' = 'success') {
  const toastSelector = type === 'success' 
    ? '.toast.success, .alert.success, [role="alert"].success'
    : '.toast.error, .alert.error, [role="alert"].error';
  
  const toast = page.locator(toastSelector).filter({ hasText: message });
  await toast.waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Helper para formatear fechas como las espera el backend
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Helper para formatear horas como las espera el backend
 */
export function formatTimeForApi(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}

/**
 * Helper para esperar que un elemento desaparezca (útil para spinners)
 */
export async function waitForElementToDisappear(page: Page, selector: string) {
  await page.locator(selector).waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * Helper para tomar screenshots con nombres descriptivos
 */
export async function takeScreenshot(page: Page, testName: string, step: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/${testName}-${step}-${timestamp}.png`,
    fullPage: true 
  });
}
