// ============================================
// DOCUMENTOS CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { toLocalISOString } from '@/shared/utils/dateTimeHelper'
import { Download, FileText, Receipt } from 'lucide-react'
import type { DocumentoDescargable } from '../types/profile.types'

// Datos estáticos mientras se implementa el backend
const documentos: DocumentoDescargable[] = [
  {
    tipo: 'credencial',
    nombre: 'Credencial Digital',
    descripcion: 'Tu credencial de alumno en formato PDF',
    url: '/api/alumnos/me/documentos/credencial',
    fechaGeneracion: toLocalISOString(),
  },
  {
    tipo: 'recibo',
    nombre: 'Último Recibo de Pago',
    descripcion: 'Recibo de tu última compra de paquete',
    url: '/api/alumnos/me/documentos/ultimo-recibo',
    fechaGeneracion: toLocalISOString(),
  },
]

const getIcono = (tipo: string) => {
  switch (tipo) {
    case 'credencial':
      return <FileText className="w-5 h-5 text-[#8b5cf6]" />
    case 'recibo':
      return <Receipt className="w-5 h-5 text-[#10b981]" />
    default:
      return <FileText className="w-5 h-5 text-[#6b7280]" />
  }
}

export const DocumentosCard = () => {
  const handleDownload = (documento: DocumentoDescargable) => {
    // TODO: Implementar descarga real cuando exista el backend
    console.log('Descargando:', documento.nombre)
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-[#3b82f6]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Documentos</h3>
      </div>

      <div className="space-y-3">
        {documentos.map((doc) => (
          <div
            key={doc.tipo}
            className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {getIcono(doc.tipo)}
              <div>
                <p className="text-[#f9fafb] font-medium">{doc.nombre}</p>
                <p className="text-[#9ca3af] text-sm">{doc.descripcion}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(doc)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] text-sm font-medium transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)]">
        <p className="text-[#93c5fd] text-sm">
          💡 Los documentos se generan automáticamente y siempre están actualizados
        </p>
      </div>
    </GlassPanel>
  )
}
