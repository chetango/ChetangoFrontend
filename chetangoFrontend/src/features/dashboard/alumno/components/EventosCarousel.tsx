// ============================================
// EVENTOS CAROUSEL COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { useSwipe } from '@/shared/hooks/useTouchGestures'
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { EventoProximo } from '../types/dashboardAlumno.types'
import { formatearFecha, formatearPrecio } from '../utils/dashboardUtils'

interface EventosCarouselProps {
  eventos: EventoProximo[]
}

export const EventosCarousel = ({ eventos }: EventosCarouselProps) => {
  const [eventoActual, setEventoActual] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Funciones de navegación
  const nextEvento = () => {
    setEventoActual((prev) => (prev + 1) % eventos.length)
  }

  const prevEvento = () => {
    setEventoActual((prev) => (prev - 1 + eventos.length) % eventos.length)
  }

  // Swipe gestures para móvil
  const { bind } = useSwipe({
    onSwipeLeft: nextEvento,
    onSwipeRight: prevEvento,
    threshold: 50
  })

  // Autoplay - cambiar cada 5 segundos
  useEffect(() => {
    if (eventos.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setEventoActual((prev) => (prev + 1) % eventos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [eventos.length, isPaused])

  if (eventos.length === 0) {
    return (
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-[#7c5af8]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">NotiChetango</h3>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
        </div>
        <GlassPanel className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(124,90,248,0.15)] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#7c5af8]" />
          </div>
          <h4 className="text-[#f9fafb] text-lg font-semibold mb-2">Contenido en camino</h4>
          <p className="text-[#9ca3af] text-sm">
            Estamos preparando talleres y milongas increíbles para ti. ¡Vuelve pronto!
          </p>
        </GlassPanel>
      </div>
    )
  }

  const evento = eventos[eventoActual]

  return (
    <div className="mb-6 sm:mb-8 md:mb-10">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c5af8]" />
        <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">NotiChetango</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-4">
          {/* Botón Anterior - Oculto en móvil */}
          {eventos.length > 1 && (
            <button
              onClick={prevEvento}
              className="hidden sm:flex shrink-0 p-2 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Evento Card con swipe gestures */}
          <div 
            {...bind()}
            className="flex-1 touch-pan-y"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <GlassPanel className="overflow-hidden group cursor-pointer">
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                <img
                  src={evento.imagenUrl}
                  alt={evento.titulo}
                  className="w-full h-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-110"
                />
                {evento.destacado && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 rounded-full bg-[#c93448] text-white text-xs font-medium">
                    Destacado
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h4 className="text-[#f9fafb] text-base sm:text-lg font-semibold mb-2">{evento.titulo}</h4>
                <p className="text-[#9ca3af] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{evento.descripcion}</p>
                {evento.precio !== null && evento.precio > 0 && (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-[#9ca3af] text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{formatearFecha(evento.fecha)}</span>
                      </div>
                      <span className="text-[#34d399] text-sm sm:text-base font-semibold">{formatearPrecio(evento.precio)}</span>
                    </div>
                    <button className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7c5af8] to-[#6938ef] text-white text-sm font-medium hover:shadow-lg active:scale-95 transition-all">
                      Reservar Cupo
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </GlassPanel>
          </div>

          {/* Botón Siguiente - Oculto en móvil */}
          {eventos.length > 1 && (
            <button
              onClick={nextEvento}
              className="hidden sm:flex shrink-0 p-2 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dots indicadores */}
        {eventos.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            {eventos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setEventoActual(index)
                  setIsPaused(false) // Reanudar autoplay después de click manual
                }}
                className={`rounded-full transition-all touch-manipulation ${
                  index === eventoActual 
                    ? 'w-8 h-2 bg-[#7c5af8]' 
                    : 'w-2 h-2 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] active:bg-[rgba(255,255,255,0.4)]'
                }`}
                aria-label={`Ir al evento ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
