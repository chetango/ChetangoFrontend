// ============================================
// DASHBOARD HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Building2, User } from 'lucide-react'

interface DashboardHeaderProps {
  userName?: string
  userRole?: string
  academyName?: string
}

export const DashboardHeader = ({ 
  userName = 'Administrador',
  userRole = 'Administrador',
  academyName = 'Academia Chetango'
}: DashboardHeaderProps) => {
  const currentTime = new Date()

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <header className="mb-10 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        
        {/* Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <p className="text-[#9ca3af] tracking-[0.2em] uppercase text-sm">
              Sistema Activo
            </p>
          </div>
          <h1 className="text-[#f9fafb] text-3xl md:text-4xl font-bold mb-3">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-[#d1d5db] text-lg">
            Este es el estado de Chetango hoy – {formatDate()}
          </p>
        </div>

        {/* Admin Card */}
        <GlassPanel className="p-5 md:min-w-[280px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_4px_16px_rgba(201,52,72,0.4)]">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#f9fafb] font-medium mb-0.5">{userName}</p>
              <p className="text-[#9ca3af] text-sm">{userRole}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#9ca3af]" />
              <p className="text-[#d1d5db] text-sm">{academyName}</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </header>
  )
}
