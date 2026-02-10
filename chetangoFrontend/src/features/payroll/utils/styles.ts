// ============================================
// UTILIDADES DE ESTILOS - NÓMINA
// ============================================

/**
 * Obtiene las clases CSS para el badge de estado de pago
 * @param estado - Estado del pago: Pendiente | Aprobado | Liquidado | Pagado
 * @returns String con las clases de Tailwind CSS
 */
export const getEstadoBadgeClasses = (estado: string): string => {
  const badges: Record<string, string> = {
    Pendiente: 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24]',
    Aprobado: 'bg-[rgba(34,197,94,0.15)] text-[#4ade80]',
    Liquidado: 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa]',
    Pagado: 'bg-[rgba(34,197,94,0.2)] text-[#22c55e]',
  }
  return badges[estado] || 'bg-[rgba(156,163,175,0.15)] text-[#9ca3af]'
}

/**
 * Obtiene el color de texto para un monto basado en si es bono o descuento
 * @param valor - Valor del ajuste (positivo = bono, negativo = descuento)
 * @returns String con la clase de color de Tailwind CSS
 */
export const getAjusteColorClass = (valor: number): string => {
  return valor > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
}
