/**
 * APHELLION LOGIN - GESTIÓN PARA ACADEMIAS DE BAILE
 * Microsoft Authentication (MSAL)
 * Diseño genérico para todas las academias en la plataforma Aphellion.
 * Mismo layout y sistema de diseño que LoginForm (Chetango).
 */

import { useAuth } from '@/features/auth'
import { AlertCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface LoginFormAphellionProps {
  onSuccess?: () => void
  className?: string
}

export function LoginFormAphellion({ onSuccess, className = '' }: LoginFormAphellionProps) {
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
      const logoutIntencional = sessionStorage.getItem('logoutIntencional') === 'true'
      if (logoutIntencional) {
        sessionStorage.removeItem('logoutIntencional')
      }
      await login(undefined, logoutIntencional)
      onSuccess?.()
    } catch {
      // Error handling managed by the auth hook
    }
  }

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-[#121212]" />

      {/* Ambient glow — sutil, centrado */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(147,51,234,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Partículas decorativas abstractas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Círculo grande difuminado — izquierda */}
        <div
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: 480,
            height: 480,
            top: '10%',
            left: '-8%',
            background:
              'radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Círculo mediano — derecha abajo */}
        <div
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: 320,
            height: 320,
            bottom: '5%',
            right: '5%',
            background:
              'radial-gradient(circle, rgba(147,51,234,0.05) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />
        {/* Líneas diagonales decorativas */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="diag"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="60" stroke="#9333EA" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>
      </div>

      {/* Layout: izquierda contenido | derecha visual abstracto */}
      <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-2">

        {/* ── LEFT SIDE ── */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-28 py-12 lg:py-0 relative">
          <div className="max-w-xl relative">

            {/* Línea decorativa vertical — izquierda */}
            <div className="absolute -left-8 top-0 w-1 h-24 bg-gradient-to-b from-[#9333EA] to-transparent opacity-40" />

            {/* Logo Aphellion */}
            <div className="mb-12 lg:mb-14 group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 50%, #5B21B6 100%)',
                      boxShadow:
                        '0 12px 40px rgba(124,58,237,0.6), 0 4px 12px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15)',
                    }}
                  >
                    <span
                      className="text-white text-3xl font-bold tracking-tight"
                      style={{
                        textShadow:
                          '0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3), 0 -1px 2px rgba(255,255,255,0.3)',
                      }}
                    >
                      A
                    </span>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-3xl bg-gradient-to-b from-white/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-3xl bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  {/* Ring animado al hover */}
                  <div className="absolute -inset-2 rounded-[28px] border border-[rgba(124,58,237,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div>
                  <span
                    className="text-white text-3xl font-semibold tracking-tight"
                    style={{
                      textShadow:
                        '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(124,58,237,0.3), 0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    Aphellion
                  </span>
                </div>
              </div>
            </div>

            {/* Título principal */}
            <div className="mb-8 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-gradient-to-r from-[#9333EA] to-transparent" />
                <span className="text-[#9ca3af] text-xs tracking-[0.2em] uppercase font-medium">
                  Bienvenido
                </span>
              </div>

              <h1
                className="mb-2 leading-[0.85] relative"
                style={{ fontSize: 'clamp(52px, 6vw, 82px)', fontWeight: 300, letterSpacing: '0.02em' }}
              >
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  Gestión
                </span>
                <span className="block text-white" style={{ fontWeight: 400 }}>
                  Inteligente
                </span>
              </h1>

              <div className="flex items-center gap-2 mt-6">
                <div className="h-[1px] w-12 bg-[rgba(255,255,255,0.3)]" />
                <div className="h-[2px] w-2 bg-[#9333EA] rounded-full" />
              </div>
            </div>

            {/* Descripción */}
            <p
              className="text-[#d1d5db] leading-relaxed mb-12 relative pl-4 border-l-2 border-[rgba(147,51,234,0.3)]"
              style={{ fontSize: 'clamp(16px, 1.1vw, 19px)', lineHeight: '1.8' }}
            >
              <span className="block text-[#9ca3af]">
                Sistema premium para academias modernas.
              </span>
            </p>

            {/* Error state */}
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

            {/* Botón de login — idéntico al de Chetango */}
            <button
              onClick={handleLogin}
              disabled={authState.isLoading}
              className="
                w-full px-8 py-6
                bg-gradient-to-br from-[#1f1f1f] to-[#141414]
                hover:from-[#2a2a2a] hover:to-[#1f1f1f]
                disabled:from-[#0a0a0a] disabled:to-[#050505]
                border border-[rgba(255,255,255,0.15)]
                hover:border-[rgba(147,51,234,0.5)]
                disabled:border-[rgba(255,255,255,0.05)]
                text-white rounded-2xl
                shadow-[0_8px_32px_rgba(0,0,0,0.5),0_12px_48px_rgba(147,51,234,0.15),inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]
                hover:shadow-[0_16px_56px_rgba(147,51,234,0.4),0_20px_64px_rgba(147,51,234,0.25),inset_0_2px_4px_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.25)]
                disabled:shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                transition-all duration-500
                hover:scale-[1.02] hover:-translate-y-0.5
                disabled:scale-100 disabled:translate-y-0
                disabled:cursor-not-allowed disabled:opacity-50
                relative overflow-hidden group
              "
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
              {/* Gradient overlay animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(147,51,234,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative z-10 flex items-center justify-center gap-4">
                {!authState.isLoading ? (
                  <>
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

            {/* Nota de autorización */}
            <div className="mt-10 flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-[#9333EA] mt-2 flex-shrink-0" />
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Acceso exclusivo para personal autorizado. Utiliza tu cuenta corporativa de Microsoft.
              </p>
            </div>

            {/* Línea decorativa vertical — abajo */}
            <div className="absolute -left-8 bottom-0 w-1 h-16 bg-gradient-to-t from-[#9333EA] to-transparent opacity-30" />
          </div>
        </div>

        {/* ── RIGHT SIDE — Video Zone ── */}
        <div className="flex items-center justify-center px-8 py-16 lg:py-0 order-first lg:order-last">
          <div className="relative w-full max-w-2xl lg:max-w-4xl aspect-square lg:aspect-auto lg:h-[85vh]">
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
                className="w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
              >
                <source src="/Aphellionvideo.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>

              {/* Vignette Effect - Degradado INTENSO oscureciendo los bordes */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 20%, rgba(18,18,18,0.4) 35%, rgba(18,18,18,0.75) 50%, rgba(18,18,18,0.92) 65%, #121212 80%)',
                }}
              />

              {/* Difuminado lateral — costados izquierdo y derecho */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, #121212 0%, transparent 15%, transparent 85%, #121212 100%)',
                }}
              />

              {/* Glow rojo sutil desde el centro */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0.08) 35%, transparent 60%)',
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
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25%       { transform: translate(10px, -15px) scale(1.1); opacity: 0.5; }
          50%       { transform: translate(-5px, -25px) scale(0.9); opacity: 0.4; }
          75%       { transform: translate(-15px, -10px) scale(1.05); opacity: 0.35; }
        }
        @keyframes video-visibility-cycle {
          0%   { opacity: 0; }
          10%  { opacity: 0; }
          20%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-pulse-slow              { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-slide-in                { animation: slide-in 0.4s ease-out; }
        .animate-float-particle          { animation: float-particle 7s ease-in-out infinite; }
        .animate-video-visibility-cycle  { animation: video-visibility-cycle 10s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
