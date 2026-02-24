/**
 * SERVICES INDEX
 * Barrel export para servicios compartidos
 */

// Auth Services
export {
    TokenAcquisitionError, TokenAcquisitionService,
    tokenAcquisitionService, type TokenAcquisitionOptions,
    type TokenAcquisitionResult
} from './auth/TokenAcquisitionService'

// Network Services
export {
    NetworkStatusService,
    networkStatusService,
    type NetworkStatus,
    type NetworkStatusCallback
} from './network/NetworkStatusService'

