import type { CSSProperties, ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassPanel({ children, className = '', hover = false, onClick, style }: GlassPanelProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        backdrop-blur-xl
        bg-gradient-to-br from-[rgba(26,26,32,0.6)] to-[rgba(18,18,24,0.7)] 
        border border-[rgba(255,255,255,0.2)] 
        rounded-2xl 
        shadow-[0_8px_24px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:border-[rgba(255,255,255,0.25)] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
