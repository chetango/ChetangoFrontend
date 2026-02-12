import { BrowserContext, Page } from '@playwright/test';

/**
 * Usuarios de prueba REALES en Azure (con contraseñas en .env.test)
 * Estos usuarios están sincronizados con la base de datos
 */
export const testUsers = {
  admin: {
    email: 'Chetango@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'Chet4ngo20#',
    name: 'Administrador Chetango',
    role: 'Admin',
  },
  admin2: {
    email: 'yenypadilla@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ADMIN2_PASSWORD || 'Chetango2026!',
    name: 'Yeny Padilla',
    role: 'Admin',
  },
  // PROFESORES
  profesorJorge: {
    email: 'Jorgepadilla@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_PROFESOR_JORGE_PASSWORD || 'Jorge2026',
    name: 'Jorge Padilla',
    role: 'Profesor',
  },
  profesorAna: {
    email: 'anazoraida@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_PROFESOR_ANA_PASSWORD || 'Chetango2026!%',
    name: 'Ana Zoraida Gómez',
    role: 'Profesor',
  },
  profesorMaria: {
    email: 'mariaalejandra@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_PROFESOR_MARIA_PASSWORD || 'Chetango2026!',
    name: 'María Alejandra',
    role: 'Profesor',
  },
  profesorSantiago: {
    email: 'santiagosalazar@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_PROFESOR_SANTIAGO_PASSWORD || 'Chetango2026!',
    name: 'Santiago Salazar',
    role: 'Profesor',
  },
  // ALUMNOS
  alumnoJuan: {
    email: 'JuanDavid@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ALUMNO_JUAN_PASSWORD || 'Juaj0rge20#',
    name: 'Juan David',
    role: 'Alumno',
  },
  alumnoCamilo: {
    email: 'camilotobon@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ALUMNO_CAMILO_PASSWORD || 'Chetango2026!$',
    name: 'Camilo Tobon',
    role: 'Alumno',
  },
  alumnoCatalina: {
    email: 'catalinasanchez@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ALUMNO_CATALINA_PASSWORD || 'Chetango2026!',
    name: 'Catalina Sánchez',
    role: 'Alumno',
  },
  alumnoAndrea: {
    email: 'andreasolorzano@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ALUMNO_ANDREA_PASSWORD || 'Chetango2026!',
    name: 'Andrea Solorzano',
    role: 'Alumno',
  },
  alumnoHumberto: {
    email: 'humbertogiraldo@chetangoprueba.onmicrosoft.com',
    password: process.env.TEST_ALUMNO_HUMBERTO_PASSWORD || 'Chetango2026!',
    name: 'Humberto Giraldo',
    role: 'Alumno',
  },
};

/**
 * Helper para autenticación con Microsoft Entra ID (CIAM)
 * 
 * NOTA: Como usamos Microsoft Entra External ID (CIAM), la autenticación
 * real requiere redireccionamiento a Microsoft. Para testing E2E, hay 3 opciones:
 * 
 * 1. Mock de autenticación (recomendado para desarrollo rápido)
 * 2. Usuario de prueba real en Azure (requiere configuración en Azure Portal)
 * 3. Interceptar requests y simular tokens (más complejo pero realista)
 * 
 * Este helper implementa la opción 1 (mock) para agilizar el desarrollo.
 * Puedes cambiar a las otras opciones cuando necesites probar el flujo completo.
 */
export class AuthHelper {
  constructor(
    private page: Page,
    private context: BrowserContext
  ) {}

  /**
   * Login simulado (Mock) - Para pruebas rápidas sin Azure
   * Guarda un token simulado en localStorage
   */
  async loginMock(user: keyof typeof testUsers) {
    const userData = testUsers[user];
    
    // Token JWT simulado (NO USAR EN PRODUCCIÓN)
    const mockToken = this.createMockToken(userData);
    
    await this.page.goto('/');
    
    // Inyectar token en localStorage
    await this.page.evaluate((token) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify({
        name: token.split('.')[1], // Simular datos del token
        email: token.split('.')[2],
      }));
    }, mockToken);
    
    // Recargar para que la app detecte la sesión
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login REAL con Microsoft Azure (OAuth 2.0)
   * Usa credenciales reales de Azure configuradas en .env.test
   */
  async loginReal(user: keyof typeof testUsers) {
    const userData = testUsers[user];
    
    console.log(`🔐 Iniciando login con: ${userData.email}`);
    
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    
    // Buscar botón de login (varios selectores posibles)
    const loginButtons = [
      'button:has-text("Iniciar sesión")',
      'button:has-text("Login")',
      'button:has-text("Ingresar")',
      'a:has-text("Iniciar sesión")',
    ];
    
    let loginClicked = false;
    for (const selector of loginButtons) {
      const element = this.page.locator(selector).first();
      if (await element.count() > 0 && await element.isVisible().catch(() => false)) {
        await element.click();
        loginClicked = true;
        console.log(`   ✓ Click en botón: ${selector}`);
        break;
      }
    }
    
    if (!loginClicked) {
      throw new Error('No se encontró botón de login');
    }
    
    // Esperar redirect a Microsoft (Azure External ID usa ciamlogin.com)
    await this.page.waitForURL(/ciamlogin\.com|login\.microsoftonline\.com|login\.live\.com/, { timeout: 15000 });
    console.log('   ✓ Redirigido a Microsoft Azure');
    
    // Esperar a que la página cargue completamente
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    // Buscar campo de email con múltiples selectores
    const emailSelectors = [
      'input[type="email"]',
      'input[name="loginfmt"]',
      'input[name="email"]',
      'input[name="username"]',
      '#i0116', // ID común en Microsoft login
      'input[placeholder*="correo" i]',
      'input[placeholder*="email" i]',
    ];
    
    let emailInput = null;
    for (const selector of emailSelectors) {
      const element = this.page.locator(selector).first();
      if (await element.count() > 0 && await element.isVisible().catch(() => false)) {
        emailInput = element;
        console.log(`   ✓ Campo de email encontrado: ${selector}`);
        break;
      }
    }
    
    if (!emailInput) {
      // Tomar screenshot para debug
      await this.page.screenshot({ path: 'test-results/DEBUG-no-email-field.png', fullPage: true });
      throw new Error('No se encontró el campo de email en la página de Azure');
    }
    
    await emailInput.fill(userData.email);
    console.log(`   ✓ Email ingresado: ${userData.email}`);
    
    // Buscar y hacer click en botón "Next" o "Siguiente"
    const nextButtons = [
      'input[type="submit"]',
      'button[type="submit"]',
      'button:has-text("Next")',
      'button:has-text("Siguiente")',
      'input[value="Next"]',
    ];
    
    for (const selector of nextButtons) {
      const button = this.page.locator(selector).first();
      if (await button.count() > 0 && await button.isVisible().catch(() => false)) {
        await button.click();
        console.log(`   ✓ Click en botón siguiente`);
        break;
      }
    }
    
    await this.page.waitForTimeout(2000);
    
    // Buscar campo de contraseña
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="passwd"]',
      'input[name="password"]',
      '#i0118', // ID común en Microsoft
    ];
    
    let passwordInput = null;
    for (const selector of passwordSelectors) {
      const element = this.page.locator(selector).first();
      if (await element.count() > 0 && await element.isVisible().catch(() => false)) {
        passwordInput = element;
        console.log(`   ✓ Campo de contraseña encontrado: ${selector}`);
        break;
      }
    }
    
    if (!passwordInput) {
      await this.page.screenshot({ path: 'test-results/DEBUG-no-password-field.png', fullPage: true });
      throw new Error('No se encontró el campo de contraseña');
    }
    
    await passwordInput.fill(userData.password);
    console.log('   ✓ Contraseña ingresada');
    
    // Click en botón "Sign in" o "Iniciar sesión"
    const signInButtons = [
      'input[type="submit"]',
      'button[type="submit"]',
      'button:has-text("Sign in")',
      'button:has-text("Iniciar sesión")',
      'input[value="Sign in"]',
    ];
    
    for (const selector of signInButtons) {
      const button = this.page.locator(selector).first();
      if (await button.count() > 0 && await button.isVisible().catch(() => false)) {
        await button.click();
        console.log(`   ✓ Click en botón "Sign in"`);
        break;
      }
    }
    
    // Manejar posible solicitud de cambio de contraseña
    await this.page.waitForTimeout(2000);
    const needsPasswordChange = await this.page.locator('text=/cambiar.*contraseña|update.*password/i').isVisible().catch(() => false);
    
    if (needsPasswordChange) {
      console.log('   ⚠️ Se solicitó cambio de contraseña - Saltando por ahora');
      // Aquí podrías implementar lógica para cambiar contraseña si es necesario
      // Por ahora, el test fallará si Azure pide cambio obligatorio
    }
    
    // Manejar "Mantener sesión iniciada" (Stay signed in?)
    await this.page.waitForTimeout(1000);
    const staySignedIn = await this.page.locator('input[type="submit"][value="Yes"], button:has-text("Yes"), button:has-text("Sí")').first();
    if (await staySignedIn.isVisible().catch(() => false)) {
      await staySignedIn.click();
      console.log('   ✓ Aceptado "Mantener sesión"');
    }
    
    // Esperar redirect de vuelta a la app
    await this.page.waitForURL(/localhost:5173/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    console.log('   ✅ Login completado exitosamente');
  }

  /**
   * Logout
   */
  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('button:has-text("Cerrar sesión")');
    await this.page.waitForURL('/login');
  }

  /**
   * Verifica que el usuario está autenticado
   * Busca tokens de MSAL en localStorage
   */
  async isAuthenticated(): Promise<boolean> {
    const hasToken = await this.page.evaluate(() => {
      // Buscar tokens de MSAL
      const keys = Object.keys(localStorage);
      const hasMsalToken = keys.some(k => 
        k.includes('msal') || 
        k.includes('token') || 
        k.includes('auth') ||
        k.includes('accessToken') ||
        k.includes('idToken')
      );
      
      // También verificar sessionStorage
      const sessionKeys = Object.keys(sessionStorage);
      const hasSessionToken = sessionKeys.some(k => 
        k.includes('msal') || 
        k.includes('token')
      );
      
      return hasMsalToken || hasSessionToken;
    });
    return hasToken;
  }

  /**
   * Obtiene la información del usuario actual
   */
  async getCurrentUser() {
    return await this.page.evaluate(() => {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    });
  }

  /**
   * Crea un token JWT simulado (solo para testing)
   */
  private createMockToken(user: any): string {
    // Base64 simulado (NO es un JWT real, solo para testing)
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.oid,
      name: user.name,
      email: user.email,
      roles: this.getUserRoles(user),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    }));
    return `${header}.${payload}.mock-signature`;
  }

  /**
   * Obtiene los roles del usuario según su tipo
   */
  private getUserRoles(user: any): string[] {
    if (user.email.includes('chetango@')) return ['Admin'];
    if (user.idProfesor) return ['Profesor'];
    if (user.idAlumno) return ['Alumno'];
    return [];
  }
}

/**
 * Fixture personalizado para autenticación
 * Úsalo en tus tests así:
 * 
 * test('mi prueba', async ({ page, context }) => {
 *   const auth = new AuthHelper(page, context);
 *   await auth.loginMock('admin');
 *   // ... resto del test
 * });
 */
