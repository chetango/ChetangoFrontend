import type { ReactNode } from 'react';
import { GlassPanel } from '../../atoms/GlassPanel';

type StatCardColor = 'primary' | 'secondary' | 'success' | 'warning';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label?: string;
  title?: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: StatCardColor;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  title,
  subtitle,
  trend,
  trendValue,
  color = 'primary',
  className = '',
}: StatCardProps) {
  const colors = {
    primary: {
      glow: 'bg-gradient-to-br from-[rgba(201,52,72,0.1)] to-transparent',
      icon: 'bg-[rgba(201,52,72,0.2)] text-[#c93448] shadow-[0_4px_12px_rgba(201,52,72,0.3),inset_0_1px_2px_rgba(201,52,72,0.4)]',
    },
    secondary: {
      glow: 'bg-gradient-to-br from-[rgba(124,90,248,0.1)] to-transparent',
      icon: 'bg-[rgba(124,90,248,0.2)] text-[#7c5af8] shadow-[0_4px_12px_rgba(124,90,248,0.3),inset_0_1px_2px_rgba(124,90,248,0.4)]',
    },
    success: {
      glow: 'bg-gradient-to-br from-[rgba(52,211,153,0.1)] to-transparent',
      icon: 'bg-[rgba(52,211,153,0.2)] text-[#34d399] shadow-[0_4px_12px_rgba(52,211,153,0.3),inset_0_1px_2px_rgba(52,211,153,0.4)]',
    },
    warning: {
      glow: 'bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-transparent',
      icon: 'bg-[rgba(245,158,11,0.2)] text-[#f59e0b] shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_1px_2px_rgba(245,158,11,0.4)]',
    },
  };

  return (
    <GlassPanel
      className={`p-6 group hover:scale-[1.03] transition-all duration-300 cursor-pointer relative overflow-hidden ${className}`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-[0.08] blur-[60px] rounded-full group-hover:opacity-[0.15] transition-opacity duration-300 ${colors[color].glow}`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 backdrop-blur-md rounded-xl ${colors[color].icon}`}>{icon}</div>
          {trend && trendValue && (
            <span className={trend === 'up' ? 'text-[#34d399]' : 'text-[#fca5a5]'}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
        <h3 className="text-[#f9fafb] text-2xl font-semibold mb-1">{value}</h3>
        <p className="text-[#9ca3af] font-medium mb-1">{title || label}</p>
        {subtitle && (
          <p className="text-[#6b7280] text-sm">{subtitle}</p>
        )}
      </div>
    </GlassPanel>
  );
}
