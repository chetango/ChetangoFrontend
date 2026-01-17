import type { ReactNode } from 'react';

type BadgeVariant = 'active' | 'expired' | 'depleted' | 'frozen' | 'none' | 'info' | 'success' | 'warning' | 'error';
type BadgeShape = 'rounded' | 'pill';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  className?: string;
}

export function Badge({ children, variant = 'info', shape = 'rounded', className = '' }: BadgeProps) {
  const variants = {
    active: 'bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.4)] text-[#6ee7b7] shadow-[0_4px_12px_rgba(52,211,153,0.2),inset_0_1px_1px_rgba(52,211,153,0.3)]',
    expired: 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.4)] text-[#fca5a5] shadow-[0_4px_12px_rgba(239,68,68,0.2),inset_0_1px_1px_rgba(239,68,68,0.3)]',
    depleted: 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.4)] text-[#fcd34d] shadow-[0_4px_12px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(245,158,11,0.3)]',
    frozen: 'bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.4)] text-[#93c5fd] shadow-[0_4px_12px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(59,130,246,0.3)]',
    none: 'bg-[rgba(156,163,175,0.15)] border-[rgba(156,163,175,0.4)] text-[#d1d5db] shadow-[0_4px_12px_rgba(156,163,175,0.2),inset_0_1px_1px_rgba(156,163,175,0.3)]',
    info: 'bg-[rgba(124,90,248,0.15)] border-[rgba(124,90,248,0.4)] text-[#9b8afb] shadow-[0_4px_12px_rgba(124,90,248,0.2),inset_0_1px_1px_rgba(124,90,248,0.3)]',
    success: 'bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.4)] text-[#6ee7b7] shadow-[0_4px_12px_rgba(52,211,153,0.2),inset_0_1px_1px_rgba(52,211,153,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.4)] text-[#fcd34d] shadow-[0_4px_12px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(245,158,11,0.3)]',
    error: 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.4)] text-[#fca5a5] shadow-[0_4px_12px_rgba(239,68,68,0.2),inset_0_1px_1px_rgba(239,68,68,0.3)]',
  };

  const shapeClasses = {
    rounded: 'rounded-lg',
    pill: 'rounded-full',
  };

  return (
    <span
      className={`
        inline-block
        px-3 py-1.5 
        backdrop-blur-xl 
        border 
        text-sm
        ${variants[variant]}
        ${shapeClasses[shape]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
