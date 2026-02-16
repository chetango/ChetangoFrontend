// ============================================
// PROFESOR PROFILE PAGE
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import { useAuth } from '@/features/auth'
import { useProfesorProfileQuery } from '@/features/profile/profesor/api/profileQueries'
import {
    AccionesRapidasCard,
    ConfiguracionCard,
    DatosPersonalesCard,
    PerfilProfesionalCard,
    ProfileHeader,
} from '@/features/profile/profesor/components'

export const ProfesorProfilePage = () => {
  const { session } = useAuth()
  const { data: profile, isLoading, error } = useProfesorProfileQuery(session.isAuthenticated)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7c5af8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#d1d5db] text-lg">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ef4444] text-xl mb-4">Error al cargar el perfil</p>
          <p className="text-[#9ca3af]">Por favor, intenta nuevamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glows */}
      <AmbientGlows variant="cool" />

      {/* Typography Backdrop */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="text-[120px] sm:text-[150px] md:text-[200px] font-bold text-white absolute top-10 sm:top-20 -left-10 sm:-left-20 rotate-[-15deg]">
          PERFIL
        </div>
        <div className="text-[100px] sm:text-[120px] md:text-[150px] font-bold text-white absolute bottom-10 sm:bottom-20 -right-10 sm:-right-20 rotate-[15deg]">
          PROFESOR
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <ProfileHeader profile={profile} />

        {/* Grid Layout */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-4 sm:space-y-6">
            <DatosPersonalesCard profile={profile} />
            <PerfilProfesionalCard profile={profile} />
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4 sm:space-y-6">
            <ConfiguracionCard profile={profile} />
            <AccionesRapidasCard />
          </div>
        </div>
      </div>
    </div>
  )
}
