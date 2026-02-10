// ============================================
// USER QUICK VIEW HOOK
// ============================================

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserQuickViewState, UserType } from '../types/userQuickViewTypes'

interface UserQuickViewContextType {
  state: UserQuickViewState
  openQuickView: (userId: string, userType: UserType) => void
  closeQuickView: () => void
}

const UserQuickViewContext = createContext<UserQuickViewContextType | undefined>(undefined)

/**
 * Provider para el contexto de Quick View
 * Debe envolver la aplicación en un nivel alto para estar disponible globalmente
 */
export function UserQuickViewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserQuickViewState>({
    isOpen: false,
    userId: null,
    userType: null,
  })

  const openQuickView = (userId: string, userType: UserType) => {
    setState({
      isOpen: true,
      userId,
      userType,
    })
  }

  const closeQuickView = () => {
    setState({
      isOpen: false,
      userId: null,
      userType: null,
    })
  }

  return (
    <UserQuickViewContext.Provider value={{ state, openQuickView, closeQuickView }}>
      {children}
    </UserQuickViewContext.Provider>
  )
}

/**
 * Hook para acceder al Quick View desde cualquier componente
 * 
 * @example
 * const { openQuickView } = useUserQuickView()
 * 
 * // En un click handler
 * openQuickView(alumnoId, 'alumno')
 */
export function useUserQuickView() {
  const context = useContext(UserQuickViewContext)
  
  if (!context) {
    throw new Error('useUserQuickView debe usarse dentro de UserQuickViewProvider')
  }
  
  return context
}
