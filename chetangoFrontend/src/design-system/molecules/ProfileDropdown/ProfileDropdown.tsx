// ============================================
// PROFILE DROPDOWN COMPONENT - MINIMALISTA
// ============================================

import { LogOut, User as UserIcon } from 'lucide-react'
import { useRef } from 'react'

interface ProfileDropdownProps {
  userName?: string
  userRole?: string
  onLogout: () => void
  onClose: () => void
}

export const ProfileDropdown = ({
  userName = 'Usuario',
  userRole = 'Administrador',
  onLogout,
  onClose
}: ProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    onClose()
    onLogout()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[calc(100%+8px)] right-0 w-64 backdrop-blur-xl bg-gradient-to-br from-[rgba(26,26,32,0.95)] to-[rgba(18,18,24,0.97)] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#f9fafb] font-medium text-sm truncate">{userName}</p>
            <p className="text-[#6b7280] text-xs">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9ca3af] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f9fafb] transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
