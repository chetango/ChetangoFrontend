// ============================================
// PAYMENTS UTILS - FORMATTERS & HELPERS
// ============================================

export const formatearMonto = (monto: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto)
}

export const formatearFechaPago = (fecha: string): string => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatearFechaCompleta = (fecha: string): string => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const obtenerTiempoRelativo = (fecha: string): string => {
  const ahora = new Date()
  const fechaPago = new Date(fecha)
  const diffMs = ahora.getTime() - fechaPago.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias === 0) return 'Hoy'
  if (diffDias === 1) return 'Ayer'
  if (diffDias < 7) return `Hace ${diffDias} días`
  if (diffDias < 30) {
    const semanas = Math.floor(diffDias / 7)
    return `Hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`
  }
  if (diffDias < 365) {
    const meses = Math.floor(diffDias / 30)
    return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`
  }
  const años = Math.floor(diffDias / 365)
  return `Hace ${años} ${años === 1 ? 'año' : 'años'}`
}

export const getEstadoPagoBadge = (
  estado: string
): { color: string; bgColor: string; label: string } => {
  const estadoLower = estado.toLowerCase()

  switch (estadoLower) {
    case 'verificado':
      return {
        color: 'text-[#10b981]',
        bgColor: 'bg-[rgba(16,185,129,0.1)]',
        label: 'Verificado ✓',
      }
    case 'pendiente':
    case 'pendiente verificación':
      return {
        color: 'text-[#f59e0b]',
        bgColor: 'bg-[rgba(245,158,11,0.1)]',
        label: 'Pendiente',
      }
    case 'rechazado':
      return {
        color: 'text-[#ef4444]',
        bgColor: 'bg-[rgba(239,68,68,0.1)]',
        label: 'Rechazado',
      }
    default:
      return {
        color: 'text-[#9ca3af]',
        bgColor: 'bg-[rgba(156,163,175,0.1)]',
        label: estado,
      }
  }
}

export const getEstadoPaqueteBadge = (
  estado: string
): { color: string; bgColor: string } => {
  const estadoLower = estado.toLowerCase()

  switch (estadoLower) {
    case 'activo':
      return { color: 'text-[#10b981]', bgColor: 'bg-[rgba(16,185,129,0.1)]' }
    case 'vencido':
      return { color: 'text-[#6b7280]', bgColor: 'bg-[rgba(107,114,128,0.1)]' }
    case 'completado':
      return { color: 'text-[#3b82f6]', bgColor: 'bg-[rgba(59,130,246,0.1)]' }
    case 'cancelado':
      return { color: 'text-[#ef4444]', bgColor: 'bg-[rgba(239,68,68,0.1)]' }
    case 'congelado':
      return { color: 'text-[#8b5cf6]', bgColor: 'bg-[rgba(139,92,246,0.1)]' }
    default:
      return { color: 'text-[#9ca3af]', bgColor: 'bg-[rgba(156,163,175,0.1)]' }
  }
}

export const getMetodoPagoIcono = (metodo: string): string => {
  const metodoLower = metodo.toLowerCase()

  if (metodoLower.includes('efectivo')) return '💵'
  if (metodoLower.includes('transferencia')) return '🏦'
  if (metodoLower.includes('débito')) return '💳'
  if (metodoLower.includes('crédito')) return '💳'
  if (metodoLower.includes('nequi')) return '📱'
  if (metodoLower.includes('daviplata')) return '📱'
  return '💰'
}

export const calcularProgresoPaquete = (usado: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((usado / total) * 100)
}
