// ============================================
// PACKAGE DEPLETED NOTIFICATION - Notificación de Paquetes Agotados
// ============================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PackageDepletedData {
  total: number
  medellin: number
  manizales: number
}

interface PackageDepletedNotificationProps {
  data: PackageDepletedData
  onDismiss: () => void
}

export const PackageDepletedNotification = ({ 
  data, 
  onDismiss 
}: PackageDepletedNotificationProps) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pequeño delay para activar la animación de entrada
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleViewDetails = () => {
    // Navegar a la página de paquetes con filtro de "Agotado"
    navigate('/admin/paquetes?filterEstado=Agotado')
  }

  const handleBackdropClick = () => {
    setIsExpanded(false)
    setTimeout(() => onDismiss(), 300)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Icono flotante de advertencia */}
      {!isExpanded && (
        <div
          onClick={handleClick}
          className={`
            fixed top-20 right-6 z-50 cursor-pointer
            transform transition-all duration-500
            ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            hover:scale-110
          `}
        >
          {/* Glow effect - amarillo/naranja para advertencia */}
          <div 
            className="absolute inset-0 bg-[#f59e0b] blur-xl opacity-60 rounded-2xl"
            style={{ animation: 'pulse-warning 2s ease-in-out infinite' }}
          />
          
          {/* Caja con esquinas redondeadas - estilo consistente con la app */}
          <div 
            className="relative w-20 h-20 bg-gradient-to-br from-[#f59e0b] to-[#ef4444] rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            <span className="text-4xl">📦</span>
            
            {/* Badge de notificación con número */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ef4444] rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
              {data.total}
            </div>

            {/* Icono de advertencia */}
            <div 
              className="absolute -bottom-2 -right-2 text-2xl"
              style={{ animation: 'warning-blink 1.5s ease-in-out infinite' }}
            >
              ⚠️
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
              border-2 border-[#f59e0b] shadow-2xl
              transform transition-all duration-300
              ${isExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
              max-h-[calc(100vh-8rem)] overflow-y-auto
            `}
          >
            {/* Header con icono */}
            <div className="text-center mb-6">
              <div 
                className="text-6xl mb-4 inline-block"
                style={{ animation: 'wiggle 0.5s ease-in-out infinite alternate' }}
              >
                📦
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Paquetes Agotados!
              </h2>
              <p className="text-[#9ca3af]">
                Hay paquetes que requieren atención
              </p>
            </div>

            {/* Información de paquetes agotados */}
            <div className="bg-[rgba(245,158,11,0.1)] rounded-2xl p-6 mb-6 space-y-4">
              <div className="text-center pb-4 border-b border-[rgba(245,158,11,0.2)]">
                <p className="text-[#9ca3af] text-sm mb-1">Total Paquetes Agotados</p>
                <p className="text-white font-bold text-4xl">{data.total}</p>
              </div>

              {/* Desglose por sede */}
              <div className="space-y-3">
                <p className="text-[#9ca3af] text-sm font-semibold">Desglose por Sede:</p>
                
                {data.medellin > 0 && (
                  <div className="flex items-center justify-between bg-[rgba(124,90,248,0.1)] rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      <span className="text-white font-medium">Medellín</span>
                    </div>
                    <span className="text-[#f59e0b] font-bold text-lg">{data.medellin}</span>
                  </div>
                )}

                {data.manizales > 0 && (
                  <div className="flex items-center justify-between bg-[rgba(124,90,248,0.1)] rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      <span className="text-white font-medium">Manizales</span>
                    </div>
                    <span className="text-[#f59e0b] font-bold text-lg">{data.manizales}</span>
                  </div>
                )}
              </div>

              {/* Mensaje adicional */}
              <div className="pt-3 border-t border-[rgba(245,158,11,0.2)]">
                <p className="text-[#9ca3af] text-sm text-center">
                  Estos paquetes están activos pero han consumido todas sus clases disponibles
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleBackdropClick}
                className="flex-1 px-4 py-3 bg-[rgba(124,90,248,0.1)] hover:bg-[rgba(124,90,248,0.2)] text-[#9ca3af] hover:text-white rounded-xl transition-all font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={handleViewDetails}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#f59e0b] to-[#ef4444] hover:from-[#ea8c00] hover:to-[#dc2626] text-white rounded-xl transition-all font-semibold shadow-lg"
              >
                Ver Detalles 📋
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

        @keyframes pulse-warning {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
          }
          50% { 
            box-shadow: 0 0 20px 10px rgba(245, 158, 11, 0);
          }
        }

        @keyframes warning-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </>
  )
}
