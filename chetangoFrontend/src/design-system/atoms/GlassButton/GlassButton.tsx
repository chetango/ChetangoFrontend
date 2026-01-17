import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 rounded-lg text-[14px]',
    md: 'px-6 py-3 rounded-xl text-[16px]',
    lg: 'px-8 py-4 rounded-xl text-[16px]',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#c93448] to-[#a8243a] 
      hover:from-[#e54d5e] hover:to-[#c93448] 
      text-white 
      shadow-[0_8px_32px_rgba(201,52,72,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] 
      hover:shadow-[0_12px_48px_rgba(201,52,72,0.6)] 
      hover:scale-[1.02]
    `,
    secondary: `
      backdrop-blur-2xl 
      bg-[rgba(42,42,48,0.6)] 
      border border-[rgba(255,255,255,0.15)] 
      hover:border-[rgba(255,255,255,0.25)] 
      text-[#f9fafb] 
      hover:bg-[rgba(42,42,48,0.8)] 
      hover:scale-[1.02] 
      shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)] 
      hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]
    `,
    ghost: `
      text-[#d1d5db] 
      hover:text-[#f9fafb] 
      hover:bg-[rgba(255,255,255,0.05)] 
      backdrop-blur-sm
    `,
    icon: `
      p-3 
      backdrop-blur-xl 
      bg-[rgba(42,42,48,0.6)] 
      border border-[rgba(255,255,255,0.15)] 
      hover:border-[rgba(255,255,255,0.25)] 
      text-[#f9fafb] 
      hover:bg-[rgba(42,42,48,0.8)] 
      shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] 
      hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] 
      hover:scale-105
    `,
  };

  if (variant === 'icon') {
    return (
      <button
        className={`
          ${variantClasses.icon}
          rounded-xl 
          transition-all duration-300
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        transition-all duration-300 
        relative overflow-hidden group
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}
