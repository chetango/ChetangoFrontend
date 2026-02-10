// ============================================
// EMPTY STATE PAYMENTS COMPONENT
// ============================================

import { Receipt } from 'lucide-react'

export const EmptyStatePayments = () => {
  return (
    <div className="text-center py-16">
      <div className="inline-block p-6 rounded-full bg-[rgba(255,255,255,0.03)] mb-4">
        <Receipt className="w-16 h-16 text-[#6b7280]" />
      </div>
      <h3 className="text-[#f9fafb] text-xl font-semibold mb-2">
        No tienes pagos registrados
      </h3>
      <p className="text-[#9ca3af] max-w-md mx-auto">
        Cuando realices tu primer pago, aparecerá aquí con todos los detalles de los paquetes
        adquiridos.
      </p>
    </div>
  )
}
