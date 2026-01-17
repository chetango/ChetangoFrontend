/**
 * CHETANGO ADMIN PANEL - LOGIN FORM
 * Microsoft Authentication (MSAL)
 * Creative Modern 2025 Layout - Premium Designer Level
 */

import { GlassPanel } from '@/design-system'
import { useAuth } from '@/features/auth'
import { AlertCircle, Sparkles, TrendingUp, Heart, Music } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const { login, authState } = useAuth()

  const handleLogin = async () => {
    try {
      await login()
      onSuccess?.()
    } catch (error) {
      // Error handling is managed by the auth hook
    }
  }

  return (
    <div className={`h-screen w-full relative overflow-hidden ${className}`}>
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-[#0a0a0b]" />

      {/* Asymmetric Ambient Glows - Creative Positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-[#c93448] opacity-[0.12] blur-[160px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-[#e54d5e] opacity-[0.10] blur-[140px] rounded-full" />
        <div className="absolute top-[50%] right-[5%] w-[500px] h-[500px] bg-[#7c5af8] opacity-[0.08] blur-[120px] rounded-full" />
        <div className="absolute bottom-[30%] left-[20%] w-[400px] h-[400px] bg-[#34d399] opacity-[0.05] blur-[100px] rounded-full" />
      </div>

      {/* Giant Typography Backdrop - Creative Element */}
      <div className="absolute inset-0 flex items-center justify-end pr-[10%] pointer-events-none overflow-hidden">
        <h1
          className="text-[#1a1a1d] select-none opacity-40"
          style={{
            fontSize: '320px',
            fontWeight: 700,
            lineHeight: '0.9',
            letterSpacing: '-0.04em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          TANGO
        </h1>
      </div>

      {/* Main Grid Layout - Asymmetric Split */}
      <div className="relative z-10 h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
        {/* LEFT SIDE - Main Login Content (Asymmetric) */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:pl-[8%] max-h-screen py-4">
          {/* Floating Brand Badge */}
          <div className="mb-[3vh] animate-float">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl bg-[rgba(201,52,72,0.1)] border border-[rgba(201,52,72,0.3)] shadow-[0_8px_24px_rgba(201,52,72,0.3)]">
              <div className="w-2 h-2 rounded-full bg-[#c93448] animate-pulse" />
              <span
                className="text-[#f9fafb] uppercase tracking-[0.15em]"
                style={{ fontSize: '11px', fontWeight: 500 }}
              >
                Sistema Chetango
              </span>
            </div>
          </div>

          {/* Logo Icon - Offset Position */}
          <div className="mb-[2vh] -ml-2">
            <div className="relative inline-block">
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center relative group">
                <img 
                  src="/src/assets/logos/Logo-CheTango-white (2) (1).png" 
                  alt="Chetango Logo" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_25px_rgba(201,52,72,0.6)] group-hover:drop-shadow-[0_0_35px_rgba(201,52,72,0.8)] transition-all duration-700"
                />
              </div>
              {/* Decorative rings - Multiple layers */}
              <div className="absolute -inset-4 rounded-full border border-[rgba(201,52,72,0.3)] animate-pulse-slow" />
              <div className="absolute -inset-6 rounded-full border border-[rgba(201,52,72,0.2)] animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -inset-8 rounded-full border border-[rgba(201,52,72,0.1)] animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Hero Title - Large Asymmetric */}
          <div className="mb-[3vh] max-w-xl">
            <h1
              className="text-[#f9fafb] mb-[2vh] leading-[0.95]"
              style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 600, letterSpacing: '-0.04em' }}
            >
              Panel de
              <br />
              <span className="bg-gradient-to-r from-[#c93448] via-[#e54d5e] to-[#c93448] bg-clip-text text-transparent">
                Chetango
              </span>
            </h1>
            <p
              className="text-[#d1d5db] leading-relaxed max-w-md"
              style={{ fontSize: 'clamp(16px, 1.2vw, 19px)', lineHeight: '1.6' }}
            >
              Gestiona la asistencia de tus clases de tango de forma elegante. Sistema premium
              para academias modernas.
            </p>
          </div>

          {/* Error State - Floating */}
          {authState.error && (
            <div className="mb-[2vh] max-w-md animate-slide-in">
              <GlassPanel className="p-5 bg-gradient-to-br from-[rgba(239,68,68,0.15)] to-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.4)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(239,68,68,0.2)]">
                    <AlertCircle className="w-5 h-5 text-[#fca5a5]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#fca5a5] leading-relaxed" style={{ fontSize: '15px' }}>
                      {authState.error}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </div>
          )}

          {/* CTA Button - Hero Scale */}
          <div className="mb-[2vh] max-w-md">
            <button
              onClick={handleLogin}
              disabled={authState.isLoading}
              className="w-full px-10 py-6 bg-gradient-to-r from-[#c93448] via-[#d83d52] to-[#a8243a] hover:from-[#e54d5e] hover:via-[#f14d68] hover:to-[#c93448] disabled:from-[#737d8d] disabled:to-[#5e6673] text-white rounded-2xl shadow-[0_20px_60px_rgba(201,52,72,0.6),inset_0_2px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_24px_80px_rgba(201,52,72,0.8),0_0_80px_rgba(201,52,72,0.4)] disabled:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-[1.03] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {!authState.isLoading ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" rx="1" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" rx="1" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" rx="1" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" rx="1" />
                  </svg>
                ) : (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {authState.isLoading ? 'Conectando con Microsoft...' : 'Iniciar sesión con Microsoft'}
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Creative Visual Elements */}
        <div className="hidden lg:flex lg:col-span-7 relative items-center justify-center">
          {/* Floating Glass Cards - Different Depths */}
          
          {/* Card 1 - Top Left - Passion for Tango */}
          <div className="absolute top-[12%] left-[8%] animate-float-slow" style={{ animationDelay: '0s' }}>
            <GlassPanel className="p-6 w-[240px] hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-[rgba(201,52,72,0.2)] backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-[#c93448]" />
                </div>
                <div>
                  <p className="text-[#9ca3af] text-[13px] uppercase tracking-wider mb-1">
                    Pasión
                  </p>
                  <p className="text-[#f9fafb] text-[28px] font-semibold tracking-tight">100%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#34d399] text-[13px]">
                <TrendingUp className="w-4 h-4" />
                <span>Creando historias</span>
              </div>
            </GlassPanel>
          </div>

          {/* Card 2 - Center Right - Larger Feature Card */}
          <div
            className="absolute top-[35%] right-[5%] animate-float-slow"
            style={{ animationDelay: '1s' }}
          >
            <GlassPanel className="p-8 w-[320px] hover:scale-105 transition-transform duration-500">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] mb-4">
                  <Sparkles className="w-4 h-4 text-[#9b8afb]" />
                  <span className="text-[#9b8afb] text-[12px] uppercase tracking-wider">Premium</span>
                </div>
                <h3 className="text-[#f9fafb] text-[22px] font-semibold mb-2 tracking-tight">
                  Sistema Inteligente
                </h3>
                <p className="text-[#d1d5db] text-[15px] leading-relaxed">
                  Automatiza el registro de asistencia con tecnología de última generación
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div className="h-full w-[100%] bg-gradient-to-r from-[#c93448] to-[#e54d5e] rounded-full" />
                </div>
                <span className="text-[#9ca3af] text-[13px]">100%</span>
              </div>
            </GlassPanel>
          </div>

          {/* Card 3 - Bottom Center - Mini Stat */}
          <div
            className="absolute bottom-[18%] left-[25%] animate-float-slow"
            style={{ animationDelay: '2s' }}
          >
            <GlassPanel className="p-5 w-[200px] hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[rgba(52,211,153,0.2)] backdrop-blur-sm">
                  <Music className="w-5 h-5 text-[#34d399]" />
                </div>
                <div>
                  <p className="text-[#9ca3af] text-[12px] mb-0.5">Ritmo</p>
                  <p className="text-[#f9fafb] text-[24px] font-semibold tracking-tight">2x4</p>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Decorative Glass Orbs - Abstract Elements */}
          <div className="absolute top-[25%] right-[25%] w-32 h-32 rounded-full backdrop-blur-3xl bg-[rgba(201,52,72,0.08)] border border-[rgba(201,52,72,0.2)] animate-pulse-slow shadow-[0_0_80px_rgba(201,52,72,0.3)]" />
          <div
            className="absolute bottom-[35%] left-[15%] w-24 h-24 rounded-full backdrop-blur-2xl bg-[rgba(124,90,248,0.08)] border border-[rgba(124,90,248,0.2)] animate-pulse-slow shadow-[0_0_60px_rgba(124,90,248,0.3)]"
            style={{ animationDelay: '1.5s' }}
          />

          {/* Central Hero Visual Element */}
          <div className="relative">
            <div className="w-[380px] h-[380px] rounded-[40px] backdrop-blur-3xl bg-gradient-to-br from-[rgba(201,52,72,0.12)] via-[rgba(124,90,248,0.08)] to-[rgba(52,211,153,0.06)] border border-[rgba(255,255,255,0.15)] shadow-[0_40px_120px_rgba(0,0,0,0.6),inset_0_2px_8px_rgba(255,255,255,0.15)] relative overflow-hidden group">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(201,52,72,0.2)] via-transparent to-[rgba(124,90,248,0.15)] opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border-2 border-[rgba(255,255,255,0.1)] animate-ping-slow" />
                <div
                  className="absolute w-[140px] h-[140px] rounded-full border-2 border-[rgba(255,255,255,0.15)] animate-ping-slow"
                  style={{ animationDelay: '1s' }}
                />
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#c93448] to-[#7c5af8] shadow-[0_20px_60px_rgba(201,52,72,0.6)] flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Particles - Small Glass Dots */}
          <div className="absolute top-[8%] right-[12%] w-3 h-3 rounded-full bg-[#c93448] opacity-40 blur-[1px] animate-float-slow" />
          <div
            className="absolute top-[45%] left-[5%] w-2 h-2 rounded-full bg-[#7c5af8] opacity-40 blur-[1px] animate-float-slow"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-[#34d399] opacity-30 blur-[1px] animate-float-slow"
            style={{ animationDelay: '1.5s' }}
          />
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none" />

      {/* Decorative Grid Overlay - Subtle */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}