// ============================================
// RECOMENDADOS SECTION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { useGenerarCodigoReferido } from '@/features/referidos/api/referidosMutations'
import { useMiCodigoReferido } from '@/features/referidos/api/referidosQueries'
import { useSolicitarClasePrivada, useSolicitarRenovacionPaquete } from '@/features/solicitudes/api/solicitudesMutations'
import { Gift, Loader2, MessageCircle, Package, Star, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PaqueteActivo } from '../types/dashboardAlumno.types'

interface RecomendadosSectionProps {
  paquete: PaqueteActivo | null
}

interface CTACard {
  id: string
  titulo: string
  descripcion: string
  icon: any
  color: string
  bgColor: string
  ctaText: string
  path: string
  prioridad: 'alta' | 'media' | 'baja'
}

export const RecomendadosSection = ({ paquete }: RecomendadosSectionProps) => {
  const navigate = useNavigate()
  const [loadingCard, setLoadingCard] = useState<string | null>(null)

  // Mutations
  const solicitarRenovacion = useSolicitarRenovacionPaquete()
  const solicitarClasePrivada = useSolicitarClasePrivada()
  const generarCodigo = useGenerarCodigoReferido()

  // Queries
  const { data: miCodigo } = useMiCodigoReferido()

  const handleSolicitarRenovacion = async () => {
    setLoadingCard('renovar')
    try {
      await solicitarRenovacion.mutateAsync({
        idTipoPaqueteDeseado: null,
        mensajeAlumno: paquete 
          ? `Quiero renovar mi paquete ${paquete.tipo}. Me quedan ${paquete.clasesRestantes} clases.`
          : 'Quiero renovar mi paquete'
      })
    } finally {
      setLoadingCard(null)
    }
  }

  const handleSolicitarClasePrivada = async () => {
    setLoadingCard('clase-privada')
    try {
      await solicitarClasePrivada.mutateAsync({
        idTipoClaseDeseado: null,
        fechaPreferida: null,
        horaPreferida: null,
        observacionesAlumno: 'Me gustaría tomar una clase privada para mejorar mi técnica.'
      })
    } finally {
      setLoadingCard(null)
    }
  }

  const handleGenerarCodigo = async () => {
    setLoadingCard('invita-amigo')
    try {
      await generarCodigo.mutateAsync()
    } finally {
      setLoadingCard(null)
    }
  }

  const handleCopiarCodigo = () => {
    if (miCodigo?.codigo) {
      navigator.clipboard.writeText(miCodigo.codigo)
      // Toast ya manejado por el mutation
    }
  }

  const getCTACards = (): CTACard[] => {
    const cards: CTACard[] = []

    // Alta prioridad: paquete agotándose
    if (paquete && paquete.clasesRestantes <= 2) {
      cards.push({
        id: 'renovar',
        titulo: 'Tu paquete está por agotarse',
        descripcion: `Te quedan solo ${paquete.clasesRestantes} clases. Renueva para no perder ritmo.`,
        icon: Package,
        color: '#c93448',
        bgColor: 'rgba(201, 52, 72, 0.15)',
        ctaText: 'Renovar Paquete',
        path: '/student/packages',
        prioridad: 'alta'
      })
    }

    // Media prioridad: clase privada
    cards.push({
      id: 'clase-privada',
      titulo: 'Mejora tu técnica',
      descripcion: 'Clases personalizadas 1 a 1 con profesores expertos.',
      icon: Star,
      color: '#7c5af8',
      bgColor: 'rgba(124, 90, 248, 0.15)',
      ctaText: 'Quiero Clase Privada',
      path: '', // No navega, ejecuta acción
      prioridad: 'media'
    })

    // Baja prioridad: Invita un Amigo (Referidos)
    cards.push({
      id: 'invita-amigo',
      titulo: 'Invita un Amigo',
      descripcion: miCodigo 
        ? `Tu código: ${miCodigo.codigo} - Usado ${miCodigo.vecesUsado} veces`
        : 'Comparte tu código y gana 1 clase gratis por cada amigo.',
      icon: Users,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      ctaText: miCodigo ? 'Copiar Código' : 'Generar Código',
      path: '', // No navega, ejecuta acción
      prioridad: 'baja'
    })

    return cards
  }

  const cards = getCTACards()

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#c93448]" />
        <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">Recomendado para Ti</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          const isLoading = loadingCard === card.id

          const handleCardClick = () => {
            if (isLoading) return

            // Acciones específicas por tarjeta
            if (card.id === 'renovar') {
              handleSolicitarRenovacion()
            } else if (card.id === 'clase-privada') {
              handleSolicitarClasePrivada()
            } else if (card.id === 'invita-amigo') {
              if (miCodigo) {
                handleCopiarCodigo()
              } else {
                handleGenerarCodigo()
              }
            } else if (card.path) {
              // Navegación estándar para otras tarjetas
              navigate(card.path)
            }
          }

          return (
            <GlassPanel
              key={card.id}
              className={`p-4 sm:p-6 group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
                isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'
              } ${card.prioridad === 'alta' ? 'ring-2 ring-[#c93448]' : ''}`}
              onClick={handleCardClick}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl flex items-center justify-center"
                style={{
                  background: card.bgColor,
                  color: card.color
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <h4 className="text-[#f9fafb] text-sm sm:text-base font-semibold mb-2">{card.titulo}</h4>
              <p className="text-[#9ca3af] text-xs sm:text-sm mb-3 sm:mb-4">{card.descripcion}</p>
              <button
                disabled={isLoading}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 disabled:opacity-60 active:scale-95"
                style={{
                  background: `linear-gradient(to right, ${card.color}, ${card.color}dd)`,
                  boxShadow: `0 4px 12px ${card.color}40`
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                {card.ctaText}
              </button>
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
