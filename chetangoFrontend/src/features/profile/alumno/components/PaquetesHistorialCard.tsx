// ============================================
// PAQUETES HISTORIAL CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Calendar, History, Package } from 'lucide-react'
import { usePaquetesHistorialQuery } from '../api/profileQueries'
import type { PaqueteHistorial } from '../types/profile.types'

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case 'activo':
      return 'bg-[#10b981] text-white'
    case 'vencido':
      return 'bg-[#6b7280] text-white'
    case 'completado':
      return 'bg-[#3b82f6] text-white'
    case 'cancelado':
      return 'bg-[#ef4444] text-white'
    default:
      return 'bg-[#6b7280] text-white'
  }
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const PaquetesHistorialCard = () => {
  const { data: paquetes, isLoading } = usePaquetesHistorialQuery()

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-[#8b5cf6]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Historial de Paquetes</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse" />
          ))}
        </div>
      ) : !paquetes || paquetes.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
          <p className="text-[#9ca3af]">No tienes paquetes registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">Paquete</th>
                <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">Fecha Compra</th>
                <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">Clases</th>
                <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">Precio</th>
                <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map((paquete: PaqueteHistorial) => (
                <tr
                  key={paquete.idPaquete}
                  className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <td className="py-4 px-2">
                    <div>
                      <p className="text-[#f9fafb] font-medium">{paquete.tipo}</p>
                      {paquete.fechaVencimiento && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-[#9ca3af]" />
                          <p className="text-[#6b7280] text-xs">
                            Vence: {formatearFecha(paquete.fechaVencimiento)}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-[#d1d5db]">
                    {formatearFecha(paquete.fechaCompra)}
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-[#f9fafb]">
                      {paquete.clasesUsadas}/{paquete.clasesTotales}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-[#f9fafb] font-medium">
                    ${paquete.precio.toLocaleString('es-AR')}
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                        paquete.estado
                      )}`}
                    >
                      {paquete.estado.charAt(0).toUpperCase() + paquete.estado.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  )
}
