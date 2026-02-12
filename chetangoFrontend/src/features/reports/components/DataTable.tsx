// ============================================
// DATA TABLE COMPONENT - CHETANGO
// Reusable table for displaying report data
// ============================================

import { GlassPanel } from '@/design-system'

// ============================================
// TYPES
// ============================================

export interface TableColumn<T = any> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface DataTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T, index: number) => string | number
  emptyMessage?: string
  maxHeight?: string
}

// ============================================
// COMPONENT
// ============================================

export function DataTable<T = any>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay datos disponibles',
  maxHeight = '400px',
}: DataTableProps<T>) {
  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      default: return 'text-left'
    }
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-8 text-center">
        <p className="text-gray-400">{emptyMessage}</p>
      </GlassPanel>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10">
      <div 
        className="overflow-x-auto overflow-y-auto custom-scrollbar"
        style={{ maxHeight }}
      >
        <table className="w-full">
          {/* Header */}
          <thead className="
            sticky top-0 z-10
            bg-black/40 backdrop-blur-md
            border-b border-white/10
          ">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3
                    text-sm font-semibold text-gray-300 uppercase tracking-wider
                    ${getAlignment(column.align)}
                  `}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-black/20 divide-y divide-white/5">
            {data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                className="
                  hover:bg-white/5
                  transition-colors duration-150
                "
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-4 py-3
                      text-sm text-gray-300
                      ${getAlignment(column.align)}
                    `}
                  >
                    {column.render 
                      ? column.render(row)
                      : (row as any)[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
