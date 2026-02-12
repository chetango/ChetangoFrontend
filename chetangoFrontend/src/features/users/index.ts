// ============================================
// USERS FEATURE EXPORTS
// ============================================

// Components
export { ClickableAvatar } from './components/ClickableAvatar/ClickableAvatar'
export { UserQuickViewModal } from './components/UserQuickViewModal/UserQuickViewModal'

// Hooks
export { UserQuickViewProvider, useUserQuickView } from './hooks/useUserQuickView'

// API
export { useAlumnoDetail, useProfesorDetail } from './api/userDetailQueries'

// Types
export type {
    AlumnoQuickView,
    ProfesorQuickView,
    UserQuickViewData,
    UserType
} from './types/userQuickViewTypes'

export type {
    AlumnoDetailDTO, PaqueteActivoDTO, ProfesorDetailDTO
} from './types/userDetailTypes'

