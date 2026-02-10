// ============================================
// EVENTOS CAROUSEL COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
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

  const nextEvento = () => {
    setEventoActual((prev) => (prev + 1) % eventos.length)
  }

  const prevEvento = () => {
    setEventoActual((prev) => (prev - 1 + eventos.length) % eventos.length)
  }

  const evento = eventos[eventoActual]

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-[#7c5af8]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">NotiChetango</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-4">
          {/* Botón Anterior */}
          {eventos.length > 1 && (
            <button
              onClick={prevEvento}
              className="shrink-0 p-2 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Evento Card */}
          <div 
            className="flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <GlassPanel className="overflow-hidden group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evento.imagenUrl}
                  alt={evento.titulo}
                  className="w-full h-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-110"
                />
                {evento.destacado && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#c93448] text-white text-xs font-medium">
                    Destacado
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6">
                <h4 className="text-[#f9fafb] text-lg font-semibold mb-2">{evento.titulo}</h4>
                <p className="text-[#9ca3af] text-sm mb-4 line-clamp-3">{evento.descripcion}</p>
                {evento.precio !== null && evento.precio > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[#9ca3af] text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(evento.fecha)}</span>
                      </div>
                      <span className="text-[#34d399] font-semibold">{formatearPrecio(evento.precio)}</span>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c5af8] to-[#6938ef] text-white text-sm font-medium hover:shadow-lg transition-all">
                      Reservar Cupo
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </GlassPanel>
          </div>

          {/* Botón Siguiente */}
          {eventos.length > 1 && (
            <button
              onClick={nextEvento}
              className="shrink-0 p-2 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dots indicadores */}
        {eventos.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {eventos.map((_, index) => (
              <button
                key={index}
                onClick={() => setEventoActual(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === eventoActual 
                    ? 'w-8 bg-[#7c5af8]' 
                    : 'bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
