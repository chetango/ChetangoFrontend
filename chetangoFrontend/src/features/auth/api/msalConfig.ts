import type { Configuration } from '@azure/msal-browser'
import { LogLevel } from '@azure/msal-browser'
import { MSAL_CONFIG } from '@/shared/constants/authConstants'

// CONFIGURACIÓN MSAL PARA MICROSOFT ENTRA EXTERNAL ID
export const msalConfig: Configuration = {
  auth: {
    clientId: MSAL_CONFIG.CLIENT_ID,
    authority: 'https://chetangoprueba.ciamlogin.com/',
    redirectUri: MSAL_CONFIG.REDIRECT_URI,
    // Post logout URI opcional (no disponible en HTTP local)
    ...(MSAL_CONFIG.POST_LOGOUT_REDIRECT_URI && {
      postLogoutRedirectUri: MSAL_CONFIG.POST_LOGOUT_REDIRECT_URI
    }),
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            break
          case LogLevel.Info:
            console.info(message)
            break
          case LogLevel.Verbose:
            console.debug(message)
            break
          case LogLevel.Warning:
            console.warn(message)
            break
        }
      },
    },
  },
}

// REQUEST DE LOGIN
export const loginRequest = {
  scopes: [], // External ID maneja scopes automáticamente
}

// REQUEST DE TOKEN SILENCIOSO
export const tokenRequest = {
  scopes: ['openid', 'profile', 'email'],
  forceRefresh: false,
}