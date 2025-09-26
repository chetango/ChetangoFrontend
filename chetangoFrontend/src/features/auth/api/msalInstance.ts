import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './msalConfig'

// INSTANCIA MSAL SINGLETON
export const msalInstance = new PublicClientApplication(msalConfig)