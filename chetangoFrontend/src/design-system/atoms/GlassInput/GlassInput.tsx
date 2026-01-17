import type { InputHTMLAttributes, ReactNode } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export function GlassInput({
  label,
  icon,
  error,
  className = '',
  ...props
}: GlassInputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-[#d1d5db] mb-2 text-sm">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] z-10">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full 
            ${icon ? 'pl-12' : 'pl-4'} 
            pr-4 py-3 
            backdrop-blur-xl 
            bg-[rgba(30,30,36,0.6)] 
            border 
            ${error ? 'border-[#ef4444]' : 'border-[rgba(255,255,255,0.12)]'}
            focus:border-[#c93448] 
            focus:ring-2 
            focus:ring-[rgba(201,52,72,0.3)] 
            rounded-xl 
            text-[#f9fafb] 
            placeholder-[#6b7280] 
            outline-none 
            transition-all duration-300 
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)] 
            focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_0_3px_rgba(201,52,72,0.2)]
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[#fca5a5] text-sm mt-1">{error}</p>}
    </div>
  );
}
