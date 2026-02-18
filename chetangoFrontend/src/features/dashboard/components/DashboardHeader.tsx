// ============================================
// DASHBOARD HEADER COMPONENT
// ============================================

// Imports minimizados - componente simplificado

interface DashboardHeaderProps {
  userName?: string
  userRole?: string
  academyName?: string
}

export const DashboardHeader = ({ 
  userName = 'Administrador'
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
    <header className="mb-2 sm:mb-3">
      {/* Hero Section - Minimalista y editorial */}
      <div className="max-w-3xl">
        <h1 className="text-[#f9fafb] text-lg sm:text-xl md:text-2xl font-bold mb-0.5 tracking-tight">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-[#9ca3af] text-[10px] sm:text-xs">
          {formatDate()}
        </p>
      </div>
    </header>
  )
}
