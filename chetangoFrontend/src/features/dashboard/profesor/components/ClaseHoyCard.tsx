// ============================================
// CLASE HOY CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { CheckCircle2, Clock, Play, Users } from 'lucide-react'
import type { ClaseHoy } from '../types/dashboardProfesor.types'
import { formatearHora } from '../utils/dashboardUtils'

interface ClaseHoyCardProps {
  clase: ClaseHoy
  onRegistrarAsistencia: (claseId: string) => void
}

export const ClaseHoyCard = ({ clase, onRegistrarAsistencia }: ClaseHoyCardProps) => {
  const isEnCurso = clase.estado === 'en-curso'
  const isProxima = clase.minutosParaInicio && clase.minutosParaInicio < 30

  const estadoBadge = {
    'programada': {
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#93c5fd',
      label: 'Programada'
    },
    'en-curso': {
      bg: 'rgba(52, 211, 153, 0.15)',
      border: 'rgba(52, 211, 153, 0.3)',
      text: '#6ee7b7',
      label: 'En curso'
    },
    'finalizada': {
      bg: 'rgba(156, 163, 175, 0.15)',
      border: 'rgba(156, 163, 175, 0.3)',
      text: '#d1d5db',
      label: 'Finalizada'
    }
  }[clase.estado]

  const getTiempoRestante = (): string => {
    if (!clase.minutosParaInicio) return ''
    
    const minutos = clase.minutosParaInicio
    if (minutos < 60) return `Empieza en ${minutos} min`
    
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `Empieza en ${horas}h ${mins}min`
  }

  return (
    <GlassPanel
      className={`p-6 group transition-all duration-300 ${
        isEnCurso 
          ? 'ring-2 ring-[#34d399] shadow-[0_8px_32px_rgba(52,211,153,0.3)]' 
          : 'hover:scale-[1.02]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-[#f9fafb] text-lg font-semibold mb-1">{clase.nombre}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[#9ca3af] text-sm">{clase.nivel}</span>
            <span className="w-1 h-1 rounded-full bg-[#6b7280]" />
            <span className="text-[#9ca3af] text-sm capitalize">{clase.tipo}</span>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-lg text-xs font-medium border whitespace-nowrap"
          style={{
            background: estadoBadge.bg,
            borderColor: estadoBadge.border,
            color: estadoBadge.text
          }}
        >
          {estadoBadge.label}
        </span>
      </div>

      {/* Horario */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
        <Clock className="w-5 h-5 text-[#7c5af8]" />
        <div className="flex-1">
          <p className="text-[#f9fafb] font-medium">
            {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
          </p>
          {clase.minutosParaInicio !== undefined && clase.estado === 'programada' && (
            <p className={`text-sm ${isProxima ? 'text-[#f59e0b]' : 'text-[#9ca3af]'}`}>
              {getTiempoRestante()}
            </p>
          )}
        </div>
      </div>

      {/* Alumnos */}
      <div className="flex items-center gap-2 mb-5 text-[#d1d5db] text-sm">
        <Users className="w-4 h-4 text-[#9ca3af]" />
        <span>
          {clase.alumnosPresentes !== undefined
            ? `${clase.alumnosPresentes}/${clase.alumnosEsperados} presentes`
            : `${clase.alumnosEsperados} alumnos esperados`
          }
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onRegistrarAsistencia(clase.idClase)}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300
          ${isEnCurso
            ? 'bg-gradient-to-r from-[#34d399] to-[#059669] text-white shadow-[0_4px_16px_rgba(52,211,153,0.4)] hover:shadow-[0_8px_24px_rgba(52,211,153,0.5)]'
            : 'bg-gradient-to-r from-[#7c5af8] to-[#6938ef] text-white shadow-[0_4px_16px_rgba(124,90,248,0.4)] hover:shadow-[0_8px_24px_rgba(124,90,248,0.5)]'
          }
          hover:scale-[1.02] font-medium
        `}
      >
        {isEnCurso ? (
          <>
            <Play className="w-5 h-5" />
            Registrar Asistencia Ahora
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Registrar Asistencia
          </>
        )}
      </button>
    </GlassPanel>
  )
}
