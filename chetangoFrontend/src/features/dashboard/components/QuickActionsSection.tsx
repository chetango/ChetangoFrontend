// ============================================
// QUICK ACTIONS SECTION
// ============================================

import { Calendar, CheckCircle2, DollarSign, Package } from 'lucide-react'
import { QuickActionButton } from './QuickActionButton'

export const QuickActionsSection = () => {
  const quickActions = [
    {
      id: 'asistencia',
      title: 'Asistencia',
      description: 'Marcar alumno presente',
      icon: CheckCircle2,
      color: '#34d399',
      path: '/admin/attendance'
    },
    {
      id: 'pago',
      title: 'Pago',
      description: 'Nuevo pago de alumno',
      icon: DollarSign,
      color: '#c93448',
      path: '/admin/payments'
    },
    {
      id: 'paquete',
      title: 'Paquete',
      description: 'Asignar paquete a alumno',
      icon: Package,
      color: '#f59e0b',
      path: '/admin/packages'
    },
    {
      id: 'clase',
      title: 'Clase',
      description: 'Programar nueva clase',
      icon: Calendar,
      color: '#7c5af8',
      path: '/admin/classes'
    }
  ]

  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <h2 className="text-[#f9fafb] text-base sm:text-lg font-bold">Acciones Rápidas</h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {quickActions.map((action) => (
          <QuickActionButton key={action.id} {...action} />
        ))}
      </div>
    </div>
  )
}
