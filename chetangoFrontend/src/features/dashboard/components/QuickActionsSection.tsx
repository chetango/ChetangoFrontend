// ============================================
// QUICK ACTIONS SECTION
// ============================================

import { Calendar, CheckCircle2, DollarSign, Package } from 'lucide-react'
import { QuickActionButton } from './QuickActionButton'

export const QuickActionsSection = () => {
  const quickActions = [
    {
      id: 'asistencia',
      title: 'Registrar Asistencia',
      description: 'Marcar alumno presente',
      icon: CheckCircle2,
      color: '#34d399',
      path: '/admin/attendance'
    },
    {
      id: 'pago',
      title: 'Registrar Pago',
      description: 'Nuevo pago de alumno',
      icon: DollarSign,
      color: '#c93448',
      path: '/admin/payments'
    },
    {
      id: 'paquete',
      title: 'Crear Paquete',
      description: 'Asignar paquete a alumno',
      icon: Package,
      color: '#f59e0b',
      path: '/admin/packages'
    },
    {
      id: 'clase',
      title: 'Crear Clase',
      description: 'Programar nueva clase',
      icon: Calendar,
      color: '#7c5af8',
      path: '/admin/classes'
    }
  ]

  return (
    <div className="mb-6 sm:mb-8 md:mb-10">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h2 className="text-[#f9fafb] text-xl sm:text-2xl font-bold">Acciones Rápidas</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <QuickActionButton key={action.id} {...action} />
        ))}
      </div>
    </div>
  )
}
