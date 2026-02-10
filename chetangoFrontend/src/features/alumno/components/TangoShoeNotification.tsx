// ============================================
// TANGO SHOE NOTIFICATION - Notificación de Confirmación
// ============================================

import { useEffect, useState } from 'react'
import type { AsistenciaPendiente } from '../types/confirmacion.types'

interface TangoShoeNotificationProps {
  asistencia: AsistenciaPendiente
  onConfirm: (idAsistencia: string) => void
  onDismiss: () => void
}

export const TangoShoeNotification = ({ 
  asistencia, 
  onConfirm,
  onDismiss 
}: TangoShoeNotificationProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pequeño delay para activar la animación de entrada
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleConfirm = () => {
    onConfirm(asistencia.idAsistencia)
  }

  const handleBackdropClick = () => {
    setIsExpanded(false)
    setTimeout(() => onDismiss(), 300)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Zapato bailarín flotante */}
      {!isExpanded && (
        <div
          onClick={handleClick}
          className={`
            fixed top-20 right-6 z-50 cursor-pointer
            transform transition-all duration-500
            ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            hover:scale-110
          `}
          style={{
            animation: 'float 3s ease-in-out infinite, rotate-subtle 4s ease-in-out infinite'
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#7c5af8] blur-xl opacity-60 rounded-full" />
          
          {/* Zapato */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#7c5af8] to-[#d946ef] rounded-2xl shadow-2xl flex items-center justify-center">
            <span className="text-4xl">👠</span>
            
            {/* Badge de notificación */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ef4444] rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              1
            </div>

            {/* Notas musicales */}
            <div 
              className="absolute -top-4 -left-4 text-2xl"
              style={{ animation: 'music-notes 2s ease-in-out infinite' }}
            >
              🎵
            </div>
          </div>
        </div>
      )}

      {/* Modal expandido */}
      {isExpanded && (
        <div 
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/60 backdrop-blur-sm
            transition-opacity duration-300
            ${isExpanded ? 'opacity-100' : 'opacity-0'}
            pt-20 pb-8
          `}
          onClick={handleBackdropClick}
        >
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`
              bg-gradient-to-br from-[#1a1a2e] to-[#16213e] 
              rounded-3xl p-8 max-w-md w-full mx-4 
              border-2 border-[#7c5af8] shadow-2xl
              transform transition-all duration-300
              ${isExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
              max-h-[calc(100vh-8rem)] overflow-y-auto
            `}
          >
            {/* Header con zapato */}
            <div className="text-center mb-6">
              <div 
                className="text-6xl mb-4 inline-block"
                style={{ animation: 'wiggle 0.5s ease-in-out infinite alternate' }}
              >
                👠
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Estuviste en clase!
              </h2>
              <p className="text-[#9ca3af]">
                Confirma tu asistencia con un tap
              </p>
            </div>

            {/* Información de la clase */}
            <div className="bg-[rgba(124,90,248,0.1)] rounded-2xl p-6 mb-6 space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Clase</p>
                <p className="text-white font-semibold text-lg">{asistencia.nombreClase}</p>
              </div>

              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Fecha</p>
                <p className="text-white">{formatDate(asistencia.fechaClase)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[#9ca3af] text-sm mb-1">Hora</p>
                  <p className="text-white">{asistencia.horaInicio} - {asistencia.horaFin}</p>
                </div>
              </div>

              {asistencia.profesores.length > 0 && (
                <div>
                  <p className="text-[#9ca3af] text-sm mb-1">
                    {asistencia.profesores.length === 1 ? 'Profesor' : 'Profesores'}
                  </p>
                  <p className="text-white">
                    {asistencia.profesores.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleBackdropClick}
                className="flex-1 px-4 py-3 bg-[rgba(124,90,248,0.1)] hover:bg-[rgba(124,90,248,0.2)] text-[#9ca3af] hover:text-white rounded-xl transition-all font-medium"
              >
                Después
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#7c5af8] to-[#d946ef] hover:from-[#6845e8] hover:to-[#c935de] text-white rounded-xl transition-all font-semibold shadow-lg"
              >
                ¡Confirmar! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes rotate-subtle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes music-notes {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.5;
          }
          50% { 
            transform: translate(-5px, -10px); 
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
      `}</style>
    </>
  )
}
