/**
 * TYPOGRAPHY BACKDROP
 * Tipografía gigante como elemento decorativo
 */

type TypographyBackdropProps = {
  text: string
  orientation?: 'vertical' | 'horizontal'
  position?: 'left' | 'right' | 'center'
  size?: number
  opacity?: number
}

export function TypographyBackdrop({
  text,
  orientation = 'vertical',
  position = 'right',
  size = 320,
  opacity = 0.4,
}: TypographyBackdropProps) {
  const positionClasses = {
    vertical: {
      left: 'left-[10%] top-1/2 -translate-y-1/2',
      right: 'right-[10%] top-1/2 -translate-y-1/2',
      center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    },
    horizontal: {
      left: 'left-0 bottom-0',
      right: 'right-0 bottom-0',
      center: 'left-1/2 bottom-0 -translate-x-1/2',
    },
  }

  return (
    <div
      className={`absolute pointer-events-none overflow-hidden ${positionClasses[orientation][position]}`}
    >
      <h1
        className="text-[#1a1a1d] select-none"
        style={{
          fontSize: `${size}px`,
          fontWeight: 700,
          lineHeight: '0.9',
          letterSpacing: '-0.04em',
          writingMode: orientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: 'mixed',
          opacity,
        }}
      >
        {text}
      </h1>
    </div>
  )
}
