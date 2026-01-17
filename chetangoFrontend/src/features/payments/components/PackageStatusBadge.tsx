// ============================================
// PACKAGE STATUS BADGE - CHETANGO ADMIN
// Requirements: 9.5
// ============================================

interface PackageStatusBadgeProps {
  estado: string
}

/**
 * Badge displaying package status with appropriate color
 *
 * Requirements:
 * - 9.5: Badge with color: Activo (green), Vencido (gray), Congelado (blue), Agotado (orange)
 */
export function PackageStatusBadge({ estado }: PackageStatusBadgeProps) {
  // Map estado to color classes
  const colorMap: Record<string, string> = {
    Activo: 'bg-[#34d399]/20 text-[#34d399] border-[#34d399]/30',
    Vencido: 'bg-[#6b7280]/20 text-[#9ca3af] border-[#6b7280]/30',
    Congelado: 'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/30',
    Agotado: 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30',
  }

  const colorClass = colorMap[estado] || colorMap.Vencido

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {estado}
    </span>
  )
}
