import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] relative overflow-hidden flex items-center justify-center">
      {/* Ambient Background Glow - Optimized for Auth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-[#c93448] opacity-[0.12] blur-[140px] rounded-full" />
        <div className="absolute bottom-[15%] right-[10%] w-[700px] h-[700px] bg-[#7c5af8] opacity-[0.10] blur-[160px] rounded-full" />
        <div className="absolute top-[50%] right-[20%] w-[500px] h-[500px] bg-[#34d399] opacity-[0.06] blur-[120px] rounded-full" />
      </div>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#c93448] shadow-[0_0_12px_rgba(201,52,72,0.8)]" />
            <h1 className="text-[#f9fafb] text-2xl font-semibold tracking-tight">
              Chetango
            </h1>
          </div>
          <p className="text-[#9ca3af] text-sm">
            Sistema de Gestión Administrativa
          </p>
        </div>

        {/* Auth Form Container */}
        {children}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#6b7280] text-xs">
            © 2025 Chetango. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-8 right-8 w-24 h-24 rounded-full backdrop-blur-3xl bg-[rgba(201,52,72,0.08)] border border-[rgba(201,52,72,0.2)] animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-12 left-12 w-32 h-32 rounded-full backdrop-blur-3xl bg-[rgba(124,90,248,0.08)] border border-[rgba(124,90,248,0.2)] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
}
