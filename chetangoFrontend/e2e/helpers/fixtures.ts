import { test as base } from '@playwright/test';
import { AuthHelper } from './auth.helper';

/**
 * Fixtures personalizados para los tests de Chetango
 * 
 * Estos fixtures extienden las capacidades básicas de Playwright
 * añadiendo helpers específicos de nuestra aplicación.
 */

type ChetangoFixtures = {
  auth: AuthHelper;
};

/**
 * Test extendido con nuestros fixtures
 * 
 * Uso:
 * import { test, expect } from './helpers/fixtures';
 * 
 * test('mi prueba', async ({ page, auth }) => {
 *   await auth.loginMock('admin');
 *   // ... resto del test
 * });
 */
export const test = base.extend<ChetangoFixtures>({
  auth: async ({ page, context }, use) => {
    const auth = new AuthHelper(page, context);
    await use(auth);
  },
});

export { expect } from '@playwright/test';

