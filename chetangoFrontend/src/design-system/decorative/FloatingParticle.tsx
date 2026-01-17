/**
 * FLOATING PARTICLE
 * Partícula pequeña flotante
 */

type FloatingParticleProps = {
  position: string
  color?: string
  size?: string
  delay?: string
}

export function FloatingParticle({
  position,
  color = '#c93448',
  size = 'w-3 h-3',
  delay = '0s',
}: FloatingParticleProps) {
  return (
    <div
      className={`absolute ${position} ${size} rounded-full opacity-40 blur-[1px] animate-float-slow`}
      style={{ backgroundColor: color, animationDelay: delay }}
    />
  )
}
