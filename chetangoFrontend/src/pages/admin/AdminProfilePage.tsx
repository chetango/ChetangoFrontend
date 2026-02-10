// ============================================
// ADMIN PROFILE PAGE
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import { AdminProfile } from '@/features/profile/admin/AdminProfile'

const AdminProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glows */}
      <AmbientGlows variant="default" />
      
      {/* Typography Backdrop */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="text-[200px] font-bold text-white absolute top-20 -left-20 rotate-[-15deg]">
          MI
        </div>
        <div className="text-[150px] font-bold text-white absolute bottom-20 -right-20 rotate-[15deg]">
          PERFIL
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <AdminProfile />
      </div>
    </div>
  )
}

export default AdminProfilePage

