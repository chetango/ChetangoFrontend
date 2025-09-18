import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { ROUTES } from '@/shared/constants/routes'

export const useRequireAuth = (redirectTo: string = ROUTES.LOGIN) => {
  const { session, authState } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authState.isInitialized && !session.isAuthenticated) {
      navigate(redirectTo)
    }
  }, [session.isAuthenticated, authState.isInitialized, navigate, redirectTo])

  return {
    isAuthenticated: session.isAuthenticated,
    isLoading: authState.isLoading || !authState.isInitialized,
    user: session.user,
  }
}