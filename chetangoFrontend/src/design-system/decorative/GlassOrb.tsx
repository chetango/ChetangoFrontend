/**
 * GLASS ORB
 * Orbe decorativo con efecto pulse
 */

type GlassOrbProps = {
  size?: string
  position?: string
  color?: 'primary' | 'secondary' | 'success'
  delay?: string
}

export function GlassOrb({
  size = 'w-32 h-32',
  position,
  color = 'primary',
  delay = '0s',
}: GlassOrbProps) {
  const colors = {
    primary: {
      bg: 'bg-[rgba(201,52,72,0.08)]',
      border: 'border-[rgba(201,52,72,0.2)]',
      shadow: 'shadow-[0_0_80px_rgba(201,52,72,0.3)]',
    },
    secondary: {
      bg: 'bg-[rgba(124,90,248,0.08)]',
      border: 'border-[rgba(124,90,248,0.2)]',
      shadow: 'shadow-[0_0_80px_rgba(124,90,248,0.3)]',
    },
    success: {
      bg: 'bg-[rgba(52,211,153,0.08)]',
      border: 'border-[rgba(52,211,153,0.2)]',
      shadow: 'shadow-[0_0_80px_rgba(52,211,153,0.3)]',
    },
  }

  return (
    <div
      className={`absolute ${position || ''} ${size} rounded-full backdrop-blur-3xl ${colors[color].bg} border ${colors[color].border} animate-pulse-slow ${colors[color].shadow}`}
      style={{ animationDelay: delay }}
    />
  )
}
