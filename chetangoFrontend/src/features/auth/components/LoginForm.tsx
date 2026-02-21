/**
 * CHETANGO LOGIN - ELEGANCIA EN MOVIMIENTO
 * Microsoft Authentication (MSAL)
 * Premium 2025 Design with Animated Logo Video
 */

import { useAuth } from '@/features/auth'
import { AlertCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const { login, authState } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Force video play on mount - Fix mobile autoplay issue with aggressive retry
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 10
    
    const attemptPlay = async () => {
      if (videoRef.current && attempts < maxAttempts) {
        try {
          // Reset video to beginning
          videoRef.current.currentTime = 0
          await videoRef.current.play()
          console.log('Video playing successfully')
          return true
        } catch (error) {
          attempts++
          console.log(`Video play attempt ${attempts} failed, retrying...`)
          
          // Keep retrying with exponential backoff
          if (attempts < maxAttempts) {
            setTimeout(attemptPlay, 100 * attempts)
          }
          return false
        }
      }
      return false
    }

    // First attempt immediately
    attemptPlay()

    // Aggressive fallback: play on ANY user interaction
    const interactions = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown']
    
    const handleInteraction = async () => {
      if (videoRef.current && videoRef.current.paused) {
        try {
          await videoRef.current.play()
          // Remove all listeners after successful play
          interactions.forEach(event => {
            document.removeEventListener(event, handleInteraction)
          })
        } catch (err) {
          // Silently fail
        }
      }
    }

    // Add multiple event listeners for maximum compatibility
    interactions.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    return () => {
      interactions.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  const handleLogin = async () => {
    try {
      await login()
      onSuccess?.()
    } catch (error) {
      // Error handling is managed by the auth hook
    }
  }

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
      {/* Dark Background - Mismo tono que el video */}
      <div className="absolute inset-0 bg-[#121212]" />

      {/* Main Layout - Desktop Split, Mobile Stack */}
      <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-2">
        
        {/* LEFT SIDE - Content Zone */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-28 py-12 lg:py-0 relative">
          <div className="max-w-xl relative">
            
            {/* Decorative Line - Top */}
            <div className="absolute -left-8 top-0 w-1 h-24 bg-gradient-to-b from-[#c93448] to-transparent opacity-40" />
            
            {/* Logo Simple - Versión Estática con Mejoras */}
            <div className="mb-12 lg:mb-14 group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#B84545] via-[#A03838] to-[#7D2B2B] flex items-center justify-center shadow-[0_12px_40px_rgba(184,69,69,0.6),0_4px_12px_rgba(0,0,0,0.4)] group-hover:shadow-[0_16px_50px_rgba(184,69,69,0.8),0_6px_16px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-105" style={{ boxShadow: '0 12px 40px rgba(184,69,69,0.6), 0 4px 12px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15)' }}>
                    <span 
                      className="text-white text-3xl font-bold tracking-tight"
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3), 0 -1px 2px rgba(255,255,255,0.3), 2px 2px 4px rgba(125,43,43,0.5)'
                      }}
                    >
                      C
                    </span>
                    {/* Inner glow con más profundidad */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-50" />
                    {/* Highlight top para efecto 3D */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-3xl bg-gradient-to-b from-white/10 to-transparent" />
                    {/* Shadow bottom para efecto 3D */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-3xl bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  {/* Animated ring */}
                  <div className="absolute -inset-2 rounded-[28px] border border-[rgba(184,69,69,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div>
                  <span 
                    className="text-white text-3xl font-semibold tracking-tight"
                    style={{
                      textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(184,69,69,0.3), 0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    Chetango
                  </span>
                </div>
              </div>
            </div>

            {/* Título Principal con Detalles Elegantes */}
            <div className="mb-8 relative">
              {/* Small decorative accent */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-gradient-to-r from-[#c93448] to-transparent" />
                <span className="text-[#9ca3af] text-xs tracking-[0.2em] uppercase font-medium">Bienvenido</span>
              </div>
              
              <h1 
                className="mb-2 leading-[0.85] relative"
                style={{ fontSize: 'clamp(52px, 6vw, 82px)', fontWeight: 300, letterSpacing: '0.02em' }}
              >
                {/* Gestión - Outline only */}
                <span 
                  className="block outline-text"
                  style={{
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                  }}
                >
                  Gestión
                </span>
                {/* Inteligente - Filled solid */}
                <span className="block text-white" style={{ fontWeight: 400 }}>
                  Inteligente
                </span>
              </h1>
              
              {/* Decorative underline - más sutil */}
              <div className="flex items-center gap-2 mt-6">
                <div className="h-[1px] w-12 bg-[rgba(255,255,255,0.3)]" />
                <div className="h-[2px] w-2 bg-[#c93448] rounded-full" />
              </div>
            </div>

            {/* Descripción con Mejor Tipografía */}
            <p 
              className="text-[#d1d5db] leading-relaxed mb-12 relative pl-4 border-l-2 border-[rgba(201,52,72,0.3)]"
              style={{ fontSize: 'clamp(16px, 1.1vw, 19px)', lineHeight: '1.8' }}
            >
              <span className="block text-[#9ca3af]">
                Sistema premium para academias modernas.
              </span>
            </p>

            {/* Error State */}
            {authState.error && (
              <div className="mb-8 p-5 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] backdrop-blur-sm animate-slide-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                  <p className="text-[#fca5a5] text-sm leading-relaxed">
                    {authState.error}
                  </p>
                </div>
              </div>
            )}

            {/* Botón Principal de Login - Más Elegante */}
            <button
              onClick={handleLogin}
              disabled={authState.isLoading}
              className="
                w-full
                px-8 py-6
                bg-gradient-to-br from-[#1f1f1f] to-[#141414]
                hover:from-[#2a2a2a] hover:to-[#1f1f1f]
                disabled:from-[#0a0a0a] disabled:to-[#050505]
                border border-[rgba(255,255,255,0.15)]
                hover:border-[rgba(201,52,72,0.5)]
                disabled:border-[rgba(255,255,255,0.05)]
                text-white
                rounded-2xl
                shadow-[0_8px_32px_rgba(0,0,0,0.5),0_12px_48px_rgba(201,52,72,0.15),inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]
                hover:shadow-[0_16px_56px_rgba(201,52,72,0.4),0_20px_64px_rgba(201,52,72,0.25),inset_0_2px_4px_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.25)]
                disabled:shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                transition-all duration-500
                hover:scale-[1.02]
                hover:-translate-y-0.5
                disabled:scale-100
                disabled:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-50
                relative overflow-hidden group
              "
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(201,52,72,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative z-10 flex items-center justify-center gap-4">
                {!authState.isLoading ? (
                  <>
                    {/* Microsoft Logo */}
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <rect x="1" y="1" width="10" height="10" fill="#F25022" rx="1" />
                      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" rx="1" />
                      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" rx="1" />
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900" rx="1" />
                    </svg>
                    <span className="text-[17px] font-medium tracking-wide">
                      Iniciar sesión con Microsoft
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-[17px] font-medium tracking-wide">
                      Conectando...
                    </span>
                  </>
                )}
              </span>
            </button>

            {/* Nota de Autorización Mejorada */}
            <div className="mt-10 flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-[#c93448] mt-2 flex-shrink-0" />
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Acceso exclusivo para personal autorizado. Utiliza tu cuenta corporativa de Microsoft.
              </p>
            </div>

            {/* Decorative element - Bottom */}
            <div className="absolute -left-8 bottom-0 w-1 h-16 bg-gradient-to-t from-[#c93448] to-transparent opacity-30" />
          </div>
        </div>

        {/* RIGHT SIDE - Video Zone */}
        <div className="flex items-center justify-center px-8 py-16 lg:py-0 order-first lg:order-last">
          {/* Contenedor del Video con Vignette Effect Intenso - Más Grande */}
          <div className="relative w-full max-w-2xl lg:max-w-4xl aspect-square lg:aspect-auto lg:h-[85vh]">
            
            {/* Video con degradado intenso en bordes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Video del Logo Animado con ciclo de visibilidad */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload nofullscreen noremoteplayback"
                  className="w-full h-full object-contain animate-video-visibility-cycle"
                  style={{ pointerEvents: 'none' }}
                >
                  <source src="/Video-LogoChetango.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>

                {/* Vignette Effect - Degradado INTENSO oscureciendo los bordes */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, rgba(18,18,18,0.4) 35%, rgba(18,18,18,0.75) 50%, rgba(18,18,18,0.92) 65%, #121212 80%)'
                  }}
                />
                
                {/* Difuminado lateral - costados izquierdo y derecho */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to right, #121212 0%, transparent 15%, transparent 85%, #121212 100%)'
                  }}
                />

                {/* Glow rojo sutil desde el centro */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(201,52,72,0.2) 0%, rgba(201,52,72,0.08) 35%, transparent 60%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -15px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-5px, -25px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
            opacity: 0.35;
          }
        }

        @keyframes video-visibility-cycle {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        .animate-float-particle {
          animation: float-particle 7s ease-in-out infinite;
        }

        .animate-video-visibility-cycle {
          animation: video-visibility-cycle 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}