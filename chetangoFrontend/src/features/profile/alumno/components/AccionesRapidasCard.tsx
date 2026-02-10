// ============================================
// ACCIONES RAPIDAS CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Download, Lock, LogOut, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AccionesRapidasCard = () => {
  const navigate = useNavigate()

  const handleDescargarQR = () => {
    // TODO: Implementar descarga de QR cuando exista el endpoint
    console.log('Descargando QR...')
  }

  const handleCambiarPassword = () => {
    // TODO: Redirigir a pantalla de cambio de contraseña
    console.log('Cambiar password...')
  }

  const handleCerrarSesion = () => {
    // TODO: Implementar logout
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-[#ef4444]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Acciones Rápidas</h3>
      </div>

      <div className="space-y-3">
        {/* Descargar QR */}
        <button
          onClick={handleDescargarQR}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[#8b5cf6] text-left transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-[rgba(139,92,246,0.1)] group-hover:bg-[rgba(139,92,246,0.2)] transition-colors">
            <QrCode className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div className="flex-1">
            <p className="text-[#f9fafb] font-medium">Descargar Código QR</p>
            <p className="text-[#9ca3af] text-sm">Guarda tu credencial digital</p>
          </div>
          <Download className="w-4 h-4 text-[#9ca3af] group-hover:text-[#8b5cf6] transition-colors" />
        </button>

        {/* Cambiar Contraseña */}
        <button
          onClick={handleCambiarPassword}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[#f59e0b] text-left transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-[rgba(245,158,11,0.1)] group-hover:bg-[rgba(245,158,11,0.2)] transition-colors">
            <Lock className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <div className="flex-1">
            <p className="text-[#f9fafb] font-medium">Cambiar Contraseña</p>
            <p className="text-[#9ca3af] text-sm">Actualiza tu clave de acceso</p>
          </div>
        </button>

        {/* Cerrar Sesión */}
        <button
          onClick={handleCerrarSesion}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(239,68,68,0.1)] hover:border-[#ef4444] text-left transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-[rgba(239,68,68,0.1)] group-hover:bg-[rgba(239,68,68,0.2)] transition-colors">
            <LogOut className="w-5 h-5 text-[#ef4444]" />
          </div>
          <div className="flex-1">
            <p className="text-[#f9fafb] font-medium">Cerrar Sesión</p>
            <p className="text-[#9ca3af] text-sm">Salir de tu cuenta</p>
          </div>
        </button>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
        <p className="text-[#fca5a5] text-sm">
          🔒 Tu información está protegida con encriptación de extremo a extremo
        </p>
      </div>
    </GlassPanel>
  )
}
