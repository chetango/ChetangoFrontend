/**
 * SERVICES INDEX
 * Barrel export para servicios compartidos
 */

// Auth Services
export { 
  TokenAcquisitionService,
  tokenAcquisitionService,
  TokenAcquisitionError,
  type TokenAcquisitionOptions,
  type TokenAcquisitionResult,
} from './auth/TokenAcquisitionService'

// Network Services
export {
  NetworkStatusService,
  networkStatusService,
  type NetworkStatus,
  type NetworkStatusCallback,
} from './network/NetworkStatusService'
