import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c93448] opacity-[0.08] blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#7c5af8] opacity-[0.06] blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-[#34d399] opacity-[0.04] blur-[100px] rounded-full" />
      </div>

      {/* Content */}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
}
