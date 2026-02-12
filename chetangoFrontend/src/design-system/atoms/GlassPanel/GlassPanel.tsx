import type { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassPanel({ children, className = '', hover = false, onClick }: GlassPanelProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-2xl 
        bg-gradient-to-br from-[rgba(42,42,48,0.7)] to-[rgba(26,26,32,0.8)] 
        border border-[rgba(255,255,255,0.15)] 
        rounded-2xl 
        shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:scale-[1.02] transition-transform duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
