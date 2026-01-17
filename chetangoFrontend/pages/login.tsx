/**
 * CHETANGO ADMIN PANEL - LOGIN PAGE
 * Microsoft Authentication (MSAL)
 * Creative Modern 2025 Layout - Premium Designer Level
 */

import { useState } from 'react';
import { GlassPanel } from '../components/design-system';
import { AlertCircle, Sparkles, TrendingUp, Users, Calendar } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Aquí iría la lógica de MSAL
      // await msalInstance.loginPopup();
    } catch (err) {
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-[#0a0a0b]"></div>
      
      {/* Asymmetric Ambient Glows - Creative Positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-[#c93448] opacity-[0.12] blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-[#e54d5e] opacity-[0.10] blur-[140px] rounded-full"></div>
        <div className="absolute top-[50%] right-[5%] w-[500px] h-[500px] bg-[#7c5af8] opacity-[0.08] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[30%] left-[20%] w-[400px] h-[400px] bg-[#34d399] opacity-[0.05] blur-[100px] rounded-full"></div>
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
            textOrientation: 'mixed'
          }}
        >
          TANGO
        </h1>
      </div>

      {/* Main Grid Layout - Asymmetric Split */}
      <div className="relative z-10 min-h-screen grid grid-cols-12 gap-8 p-8">
        
        {/* LEFT SIDE - Main Login Content (Asymmetric) */}
        <div className="col-span-5 flex flex-col justify-center pl-[8%]">
          
          {/* Floating Brand Badge */}
          <div className="mb-12 animate-float">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl bg-[rgba(201,52,72,0.1)] border border-[rgba(201,52,72,0.3)] shadow-[0_8px_24px_rgba(201,52,72,0.3)]">
              <div className="w-2 h-2 rounded-full bg-[#c93448] animate-pulse"></div>
              <span className="text-[#f9fafb] uppercase tracking-[0.15em]" style={{ fontSize: '11px', fontWeight: 500 }}>
                Admin Panel
              </span>
            </div>
          </div>

          {/* Logo Icon - Offset Position */}
          <div className="mb-8 -ml-2">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_12px_48px_rgba(201,52,72,0.5),inset_0_2px_6px_rgba(255,255,255,0.25)] relative overflow-hidden group">
                <span className="text-white text-[40px] font-semibold tracking-tight relative z-10">C</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-[28px] border border-[rgba(201,52,72,0.2)] animate-pulse-slow"></div>
            </div>
          </div>

          {/* Hero Title - Large Asymmetric */}
          <div className="mb-12 max-w-xl">
            <h1 
              className="text-[#f9fafb] mb-6 leading-[0.95]"
              style={{ 
                fontSize: '72px', 
                fontWeight: 600, 
                letterSpacing: '-0.04em'
              }}
            >
              Panel de
              <br />
              <span className="bg-gradient-to-r from-[#c93448] via-[#e54d5e] to-[#c93448] bg-clip-text text-transparent">
                Chetango
              </span>
            </h1>
            <p 
              className="text-[#d1d5db] leading-relaxed max-w-md"
              style={{ fontSize: '19px', lineHeight: '1.6' }}
            >
              Gestiona la asistencia de tus clases de tango de forma elegante. Sistema premium para academias modernas.
            </p>
          </div>

          {/* Error State - Floating */}
          {error && (
            <div className="mb-8 max-w-md animate-slide-in">
              <GlassPanel className="p-5 bg-gradient-to-br from-[rgba(239,68,68,0.15)] to-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.4)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(239,68,68,0.2)]">
                    <AlertCircle className="w-5 h-5 text-[#fca5a5]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#fca5a5] leading-relaxed" style={{ fontSize: '15px' }}>
                      {error}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </div>
          )}

          {/* CTA Button - Hero Scale */}
          <div className="mb-8 max-w-md">
            <button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="
                w-full
                px-10 py-6
                bg-gradient-to-r from-[#c93448] via-[#d83d52] to-[#a8243a]
                hover:from-[#e54d5e] hover:via-[#f14d68] hover:to-[#c93448]
                disabled:from-[#737d8d] disabled:to-[#5e6673]
                text-white
                rounded-2xl
                shadow-[0_20px_60px_rgba(201,52,72,0.6),inset_0_2px_6px_rgba(255,255,255,0.3)]
                hover:shadow-[0_24px_80px_rgba(201,52,72,0.8),0_0_80px_rgba(201,52,72,0.4)]
                disabled:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                transition-all duration-500
                hover:scale-[1.03]
                disabled:scale-100
                disabled:cursor-not-allowed
                relative overflow-hidden group
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {!isLoading ? (
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" rx="1"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" rx="1"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" rx="1"/>
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" rx="1"/>
                  </svg>
                ) : (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                
                <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {isLoading ? 'Conectando con Microsoft...' : 'Iniciar sesión con Microsoft'}
                </span>
              </span>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Authorization Notice - Subtle */}
          <p className="text-[#9ca3af] max-w-md" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            🔒 Acceso exclusivo para personal autorizado de la academia Chetango
          </p>
        </div>

        {/* RIGHT SIDE - Creative Visual Elements */}
        <div className="col-span-7 relative flex items-center justify-center">
          
          {/* Floating Glass Cards - Different Depths */}
          
          {/* Card 1 - Top Left - Floating Stat */}
          <div 
            className="absolute top-[12%] left-[8%] animate-float-slow"
            style={{ animationDelay: '0s' }}
          >
            <GlassPanel className="p-6 w-[240px] hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-[rgba(201,52,72,0.2)] backdrop-blur-sm">
                  <Users className="w-6 h-6 text-[#c93448]" />
                </div>
                <div>
                  <p className="text-[#9ca3af] text-[13px] uppercase tracking-wider mb-1">Estudiantes</p>
                  <p className="text-[#f9fafb] text-[28px] font-semibold tracking-tight">248</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#34d399] text-[13px]">
                <TrendingUp className="w-4 h-4" />
                <span>+12% este mes</span>
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
                  <div className="h-full w-[85%] bg-gradient-to-r from-[#c93448] to-[#e54d5e] rounded-full"></div>
                </div>
                <span className="text-[#9ca3af] text-[13px]">85%</span>
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
                  <Calendar className="w-5 h-5 text-[#34d399]" />
                </div>
                <div>
                  <p className="text-[#9ca3af] text-[12px] mb-0.5">Clases hoy</p>
                  <p className="text-[#f9fafb] text-[24px] font-semibold tracking-tight">8</p>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Decorative Glass Orbs - Abstract Elements */}
          <div className="absolute top-[25%] right-[25%] w-32 h-32 rounded-full backdrop-blur-3xl bg-[rgba(201,52,72,0.08)] border border-[rgba(201,52,72,0.2)] animate-pulse-slow shadow-[0_0_80px_rgba(201,52,72,0.3)]"></div>
          
          <div className="absolute bottom-[35%] left-[15%] w-24 h-24 rounded-full backdrop-blur-2xl bg-[rgba(124,90,248,0.08)] border border-[rgba(124,90,248,0.2)] animate-pulse-slow shadow-[0_0_60px_rgba(124,90,248,0.3)]" style={{ animationDelay: '1.5s' }}></div>

          {/* Central Hero Visual Element */}
          <div className="relative">
            <div className="w-[380px] h-[380px] rounded-[40px] backdrop-blur-3xl bg-gradient-to-br from-[rgba(201,52,72,0.12)] via-[rgba(124,90,248,0.08)] to-[rgba(52,211,153,0.06)] border border-[rgba(255,255,255,0.15)] shadow-[0_40px_120px_rgba(0,0,0,0.6),inset_0_2px_8px_rgba(255,255,255,0.15)] relative overflow-hidden group">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(201,52,72,0.2)] via-transparent to-[rgba(124,90,248,0.15)] opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
              
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border-2 border-[rgba(255,255,255,0.1)] animate-ping-slow"></div>
                <div className="absolute w-[140px] h-[140px] rounded-full border-2 border-[rgba(255,255,255,0.15)] animate-ping-slow" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#c93448] to-[#7c5af8] shadow-[0_20px_60px_rgba(201,52,72,0.6)] flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Particles - Small Glass Dots */}
          <div className="absolute top-[8%] right-[12%] w-3 h-3 rounded-full bg-[#c93448] opacity-40 blur-[1px] animate-float-slow"></div>
          <div className="absolute top-[45%] left-[5%] w-2 h-2 rounded-full bg-[#7c5af8] opacity-40 blur-[1px] animate-float-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-[#34d399] opacity-30 blur-[1px] animate-float-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none"></div>

      {/* Decorative Grid Overlay - Subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      ></div>

      {/* Custom Animations Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
