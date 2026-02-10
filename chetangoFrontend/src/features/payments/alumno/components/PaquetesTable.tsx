// ============================================
// PAQUETES TABLE COMPONENT
// ============================================

import { Calendar, Package } from 'lucide-react'
import type { PaqueteResumen } from '../types/payments.types'
import { calcularProgresoPaquete, formatearFechaPago, formatearMonto, getEstadoPaqueteBadge } from '../utils/paymentsUtils'

interface PaquetesTableProps {
  paquetes: PaqueteResumen[]
}

export const PaquetesTable = ({ paquetes }: PaquetesTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.1)]">
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Tipo de Paquete
            </th>
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Clases
            </th>
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Progreso
            </th>
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Vencimiento
            </th>
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Valor
            </th>
            <th className="text-left py-3 px-2 text-[#9ca3af] text-sm font-medium">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {paquetes.map((paquete) => {
            const badge = getEstadoPaqueteBadge(paquete.estado)
            const progreso = calcularProgresoPaquete(paquete.clasesUsadas, paquete.clasesDisponibles)

            return (
              <tr
                key={paquete.idPaquete}
                className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                {/* Tipo */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-[#f9fafb] font-medium">
                      {paquete.nombreTipoPaquete}
                    </span>
                  </div>
                </td>

                {/* Clases */}
                <td className="py-4 px-2">
                  <span className="text-[#f9fafb]">
                    {paquete.clasesUsadas}/{paquete.clasesDisponibles}
                  </span>
                  <span className="text-[#9ca3af] text-sm ml-1">
                    ({paquete.clasesRestantes} restantes)
                  </span>
                </td>

                {/* Progreso */}
                <td className="py-4 px-2">
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#c93448] to-[#e54d5e] transition-all duration-300"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                    <span className="text-[#9ca3af] text-xs mt-1">{progreso}%</span>
                  </div>
                </td>

                {/* Vencimiento */}
                <td className="py-4 px-2">
                  {paquete.fechaVencimiento ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#9ca3af]" />
                      <span className="text-[#d1d5db] text-sm">
                        {formatearFechaPago(paquete.fechaVencimiento)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#6b7280] text-sm">Sin vencimiento</span>
                  )}
                </td>

                {/* Valor */}
                <td className="py-4 px-2 text-[#f9fafb] font-medium">
                  {formatearMonto(paquete.valorPaquete)}
                </td>

                {/* Estado */}
                <td className="py-4 px-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.color} ${badge.bgColor}`}
                  >
                    {paquete.estado.charAt(0).toUpperCase() + paquete.estado.slice(1)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
