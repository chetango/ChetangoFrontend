// ============================================
// ADMIN PROFILE PAGE - MAIN COMPONENT
// ============================================

import { useAdminProfileQuery, useAdminSeguridadQuery } from './api/profileQueries'
import {
    ConfiguracionCard,
    DatosAcademiaCard,
    DatosPersonalesCard,
    InformacionProfesionalCard,
    ProfileHeader,
    SeguridadCard,
} from './components'

export const AdminProfile = () => {
  const { data: profile, isLoading, error } = useAdminProfileQuery()
  const { data: seguridadInfo } = useAdminSeguridadQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c93448] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9ca3af] text-sm">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-[#ef4444] text-lg mb-2">Error al cargar el perfil</p>
          <p className="text-[#9ca3af] text-sm">
            {error instanceof Error ? error.message : 'Por favor, intenta de nuevo más tarde'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con información básica */}
      <ProfileHeader profile={profile} />

      {/* Grid con 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="space-y-6">
          <DatosPersonalesCard profile={profile} />
          <InformacionProfesionalCard profile={profile} />
          <DatosAcademiaCard profile={profile} />
        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">
          <ConfiguracionCard profile={profile} />
          <SeguridadCard seguridadInfo={seguridadInfo} />
        </div>
      </div>
    </div>
  )
}
