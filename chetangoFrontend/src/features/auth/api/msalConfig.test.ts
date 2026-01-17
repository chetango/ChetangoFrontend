import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment variables before importing the modules
const mockEnvVars = {
  VITE_ENTRA_TENANT_ID: '8a57ec5a-e2e3-44ad-9494-77fbc7467251',
  VITE_ENTRA_CLIENT_ID: 'd35c1d4d-9ddc-4a8b-bb89-1964b37ff573',
  VITE_ENTRA_AUTHORITY: 'https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251',
  VITE_ENTRA_REDIRECT_URI: 'http://localhost:5173/auth/callback',
  VITE_ENTRA_POST_LOGOUT_REDIRECT_URI: 'http://localhost:5173/auth/logout',
  VITE_ENTRA_SCOPES: 'openid,profile,email,api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/chetango.api',
}

vi.stubGlobal('import.meta', {
  env: mockEnvVars,
})

// Re-mock import.meta.env for the module system
vi.mock('@/shared/constants/app', () => ({
  MSAL_CONFIG: {
    TENANT_ID: mockEnvVars.VITE_ENTRA_TENANT_ID,
    CLIENT_ID: mockEnvVars.VITE_ENTRA_CLIENT_ID,
    AUTHORITY: mockEnvVars.VITE_ENTRA_AUTHORITY,
    REDIRECT_URI: mockEnvVars.VITE_ENTRA_REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI: mockEnvVars.VITE_ENTRA_POST_LOGOUT_REDIRECT_URI,
    SCOPES: mockEnvVars.VITE_ENTRA_SCOPES.split(','),
  },
}))

describe('MSAL Configuration', () => {
  let msalConfig: typeof import('./msalConfig').msalConfig
  let tokenRequest: typeof import('./msalConfig').tokenRequest
  let loginRequest: typeof import('./msalConfig').loginRequest

  beforeEach(async () => {
    // Dynamically import after mocks are set up
    const module = await import('./msalConfig')
    msalConfig = module.msalConfig
    tokenRequest = module.tokenRequest
    loginRequest = module.loginRequest
  })

  describe('msalConfig', () => {
    it('should have the correct Client ID from API contract', () => {
      // Validates: Requirement 1.1
      expect(msalConfig.auth?.clientId).toBe('d35c1d4d-9ddc-4a8b-bb89-1964b37ff573')
    })

    it('should have the correct authority URL for CIAM tenant', () => {
      // Validates: Requirement 1.2
      expect(msalConfig.auth?.authority).toBe(
        'https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251'
      )
    })

    it('should use sessionStorage for cache location', () => {
      // Validates: Requirement 1.5
      expect(msalConfig.cache?.cacheLocation).toBe('sessionStorage')
    })

    it('should not store auth state in cookie', () => {
      expect(msalConfig.cache?.storeAuthStateInCookie).toBe(false)
    })
  })

  describe('tokenRequest', () => {
    it('should include the API scope for backend access', () => {
      // Validates: Requirement 1.3
      expect(tokenRequest.scopes).toContain(
        'api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/chetango.api'
      )
    })

    it('should include openid scope', () => {
      // Validates: Requirement 1.4
      expect(tokenRequest.scopes).toContain('openid')
    })

    it('should include profile scope', () => {
      // Validates: Requirement 1.4
      expect(tokenRequest.scopes).toContain('profile')
    })

    it('should include email scope', () => {
      // Validates: Requirement 1.4
      expect(tokenRequest.scopes).toContain('email')
    })

    it('should have all four required scopes', () => {
      // Validates: Requirements 1.3, 1.4
      const requiredScopes = [
        'openid',
        'profile',
        'email',
        'api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/chetango.api',
      ]
      requiredScopes.forEach((scope) => {
        expect(tokenRequest.scopes).toContain(scope)
      })
    })
  })

  describe('loginRequest', () => {
    it('should include the same scopes as tokenRequest', () => {
      expect(loginRequest.scopes).toEqual(tokenRequest.scopes)
    })
  })
})
