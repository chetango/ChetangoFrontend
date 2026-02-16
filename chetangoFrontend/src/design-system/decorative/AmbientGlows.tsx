/**
 * AMBIENT GLOWS
 * Fondos con blur asimétricos para crear ambiente
 */

type AmbientGlowsProps = {
  variant?: 'default' | 'warm' | 'cool' | 'purple'
}

export function AmbientGlows({ variant = 'default' }: AmbientGlowsProps) {
  const variants = {
    default: (
      <>
        <div className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-[#c93448] opacity-[0.12] blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[650px] h-[650px] bg-[#e54d5e] opacity-[0.10] blur-[140px] rounded-full" />
        <div className="absolute top-[50%] right-[5%] w-[600px] h-[600px] bg-[#7c5af8] opacity-[0.08] blur-[130px] rounded-full" />
        <div className="absolute bottom-[30%] left-[20%] w-[500px] h-[500px] bg-[#34d399] opacity-[0.06] blur-[120px] rounded-full" />
      </>
    ),
    warm: (
      <>
        <div className="absolute top-[20%] left-[10%] w-[650px] h-[650px] bg-[#c93448] opacity-[0.14] blur-[145px] rounded-full" />
        <div className="absolute bottom-[15%] right-[10%] w-[700px] h-[700px] bg-[#e54d5e] opacity-[0.11] blur-[150px] rounded-full" />
      </>
    ),
    cool: (
      <>
        <div className="absolute top-[10%] right-[10%] w-[650px] h-[650px] bg-[#7c5af8] opacity-[0.10] blur-[140px] rounded-full" />
        <div className="absolute bottom-[20%] left-[15%] w-[600px] h-[600px] bg-[#34d399] opacity-[0.08] blur-[130px] rounded-full" />
      </>
    ),
    purple: (
      <>
        <div className="absolute top-[25%] left-[8%] w-[650px] h-[650px] bg-[#7c5af8] opacity-[0.12] blur-[145px] rounded-full" />
        <div className="absolute bottom-[25%] right-[12%] w-[680px] h-[680px] bg-[#9b8afb] opacity-[0.09] blur-[135px] rounded-full" />
        <div className="absolute top-[60%] left-[30%] w-[500px] h-[500px] bg-[#c93448] opacity-[0.06] blur-[120px] rounded-full" />
      </>
    ),
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {variants[variant]}
    </div>
  )
}
