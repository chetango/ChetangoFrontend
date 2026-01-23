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
 * Keyboard accessible with proper ARIA attributes
 * 
 * Requirements: 6.1, 7.3, 7.4
 */
export function StudentSearch({ value, onChange }: StudentSearchProps) {
  return (
    <div role="search" aria-label="Buscar estudiantes">
      <label className="block text-[#d1d5db] mb-2 text-[14px]">
        <Search className="w-4 h-4 inline mr-2" />
        Buscar Estudiante
      </label>
      <GlassInput
        type="search"
        placeholder="Nombre o documento..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<Search className="w-5 h-5" aria-hidden="true" />}
        aria-label="Buscar estudiantes por nombre o documento"
        aria-describedby="search-hint"
      />
      <span id="search-hint" className="sr-only">
        Escribe para filtrar la lista de estudiantes
      </span>
    </div>
  )
}
