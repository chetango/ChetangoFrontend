// ============================================
// CREDENCIAL DIGITAL CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Download, Mail, Maximize2, Phone, User } from 'lucide-react'
import { useState } from 'react'
import type { DashboardAlumnoResponse } from '../types/dashboardAlumno.types'
import { obtenerIniciales } from '../utils/dashboardUtils'

interface CredencialDigitalCardProps {
  alumno: DashboardAlumnoResponse
}

export const CredencialDigitalCard = ({ alumno }: CredencialDigitalCardProps) => {
  const [qrAmplificado, setQrAmplificado] = useState(false)
  const iniciales = obtenerIniciales(alumno.nombreAlumno)

  return (
    <>
      <GlassPanel className="p-3 sm:p-5 md:p-6 relative overflow-hidden h-full flex flex-col">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-[#c93448] opacity-[0.08] blur-[60px] sm:blur-[80px] rounded-full" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <User className="w-4 h-4 text-[#c93448]" />
            <h3 className="text-[#f9fafb] text-sm sm:text-base md:text-lg font-semibold">Mi Credencial Digital</h3>
          </div>

          {/* Tarjeta Digital - Compacta */}
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1a1a1d] to-[#2a2a30] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-[#9ca3af] text-[10px] uppercase tracking-wider mb-0.5">Academia Chetango</p>
                <h4 className="text-[#f9fafb] text-sm sm:text-base font-semibold truncate">{alumno.nombreAlumno}</h4>
                <p className="text-[#6b7280] text-[10px] sm:text-xs mt-0.5">{alumno.codigo}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-white font-bold text-xs sm:text-sm">{iniciales}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3 h-3 text-[#9ca3af] flex-shrink-0" />
                <span className="text-[#d1d5db] truncate">{alumno.correo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#9ca3af] flex-shrink-0" />
                <span className="text-[#d1d5db]">{alumno.telefono}</span>
              </div>
            </div>
          </div>

          {/* QR Code - Más pequeño */}
          <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mx-auto w-full max-w-[160px] sm:max-w-[200px]">
            <div className="aspect-square bg-black rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-2">
                <div className="text-3xl sm:text-4xl mb-1">⬜</div>
                <p className="text-[10px]">QR Code</p>
                <p className="text-[10px] opacity-50">{alumno.codigo}</p>
              </div>
            </div>
            <p className="text-center text-black text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium">
              Muestra este código en la academia
            </p>
          </div>

          {/* Actions - Compactos */}
          <div className="flex gap-2 mt-3 sm:mt-4">
            <button
              onClick={() => setQrAmplificado(true)}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300 text-sm sm:text-base min-h-touch"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Ampliar</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300 text-sm sm:text-base min-h-touch">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Descargar</span>
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Modal QR Amplificado */}
      {qrAmplificado && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setQrAmplificado(false)}
        >
          <div className="bg-white p-8 rounded-3xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-square bg-black rounded-2xl flex items-center justify-center mb-4">
              <div className="text-white text-center p-8">
                <div className="text-8xl mb-4">⬜</div>
                <p className="text-lg">QR Code</p>
                <p className="text-sm opacity-50">{alumno.codigo}</p>
              </div>
            </div>
            <p className="text-center text-black font-medium mb-4">
              {alumno.nombreAlumno}
            </p>
            <button
              onClick={() => setQrAmplificado(false)}
              className="w-full px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
