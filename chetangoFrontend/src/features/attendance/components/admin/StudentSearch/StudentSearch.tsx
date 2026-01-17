// ============================================
// STUDENT SEARCH COMPONENT
// ============================================

import { Search } from 'lucide-react'
import { GlassInput } from '@/design-system'

interface StudentSearchProps {
  value: string
  onChange: (value: string) => void
}

/**
 * Search input for filtering students by name or document
 * Uses GlassInput styling with search icon
 * Implements real-time filtering on input change
 * 
 * Requirements: 6.1
 */
export function StudentSearch({ value, onChange }: StudentSearchProps) {
  return (
    <GlassInput
      type="text"
      placeholder="Buscar por nombre o documento..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      icon={<Search className="w-5 h-5" />}
      aria-label="Buscar estudiantes"
    />
  )
}
