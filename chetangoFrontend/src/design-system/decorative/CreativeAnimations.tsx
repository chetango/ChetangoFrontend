/**
 * CREATIVE ANIMATIONS
 * Estilos de animación para elementos creativos
 * Incluir en cada página que use elementos creativos
 */

export function CreativeAnimations() {
  return (
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes float-slow {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-15px) translateX(10px); }
      }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.3); opacity: 0; }
      }
      
      @keyframes slide-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes shine {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-float-slow {
        animation: float-slow 6s ease-in-out infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
      }
      
      .animate-ping-slow {
        animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      .animate-slide-in {
        animation: slide-in 0.5s ease-out;
      }
    `}</style>
  )
}
