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
      <GlassPanel className="p-8 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#c93448] opacity-[0.08] blur-[80px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#c93448]" />
            <h3 className="text-[#f9fafb] text-xl font-semibold">Mi Credencial Digital</h3>
          </div>

          {/* Tarjeta Digital */}
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1d] to-[#2a2a30] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#9ca3af] text-xs uppercase tracking-wider mb-1">Academia Chetango</p>
                <h4 className="text-[#f9fafb] text-xl font-semibold">{alumno.nombreAlumno}</h4>
                <p className="text-[#6b7280] text-sm mt-1">{alumno.codigo}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center">
                <span className="text-white font-bold">{iniciales}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                <span className="text-[#d1d5db] truncate">{alumno.correo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#9ca3af]" />
                <span className="text-[#d1d5db]">{alumno.telefono}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] mx-auto max-w-[280px]">
            <div className="aspect-square bg-black rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-4">
                <div className="text-6xl mb-2">⬜</div>
                <p className="text-xs">QR Code</p>
                <p className="text-xs opacity-50">{alumno.codigo}</p>
              </div>
            </div>
            <p className="text-center text-black text-sm mt-3 font-medium">
              Muestra este código en la academia
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setQrAmplificado(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <Maximize2 className="w-4 h-4" />
              Ampliar
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300">
              <Download className="w-4 h-4" />
              Descargar
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
