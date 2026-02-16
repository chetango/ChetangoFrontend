/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Definir breakpoints personalizados (mobile-first)
    screens: {
      'xs': '375px',   // Móviles pequeños
      'sm': '640px',   // Móviles grandes / landscape
      'md': '768px',   // Tablets portrait
      'lg': '1024px',  // Tablets landscape / Desktop pequeño
      'xl': '1280px',  // Desktop estándar
      '2xl': '1536px', // Desktop grande
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      // Espaciado responsive
      spacing: {
        'touch': '44px', // Tamaño mínimo para targets táctiles (44x44px)
        'mobile-padding': '1rem',
        'tablet-padding': '1.5rem',
        'desktop-padding': '2rem',
      },
      // Tamaños mínimos para touch targets
      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      },
      // Utilidades de viewport
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-bottom))',
        'screen-dynamic': '100dvh', // Dynamic viewport height
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        // Animaciones móviles
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-15px) translateX(10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        // Keyframes móviles
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  // Importante: dar prioridad a Tailwind sobre otros estilos
  important: true,
  // Habilitar modo JIT para clases arbitrarias
  mode: 'jit',
}

