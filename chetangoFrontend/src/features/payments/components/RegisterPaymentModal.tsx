// ============================================
// REGISTER PAYMENT MODAL
// ============================================

import { useModalScroll } from '@/shared/hooks'
import { getToday } from '@/shared/utils/dateTimeHelper'
import { Check, Image as ImageIcon, Plus, Search, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { httpClient } from '../../../shared/api/httpClient'
import { useStudentsSearchQuery } from '../../students/api/studentsQueries'
import type { Student } from '../../students/types/student.types'
import { usePackageTypesQuery, usePaymentMethodsQuery, useRegisterPaymentMutation } from '../api/paymentsQueries'
import type { PackageType, RegisterPaymentRequest } from '../types/payment.types'

interface RegisterPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialAlumno?: AlumnoOption | null
  initialNota?: string
}

type AlumnoOption = Pick<Student, 'idAlumno' | 'nombre' | 'correo' | 'numeroDocumento' | 'telefono'>

export const RegisterPaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialAlumno = null,
  initialNota
}: RegisterPaymentModalProps) => {
  const containerRef = useModalScroll(isOpen)
  const [searchAlumno, setSearchAlumno] = useState('')
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoOption | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [paqueteIndexBuscando, setPaqueteIndexBuscando] = useState<number | null>(null) // Para saber a cuál paquete asignar alumno
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedExistingPackages, setSelectedExistingPackages] = useState<string[]>([])
  const [alumnosPorPaquete, setAlumnosPorPaquete] = useState<Record<number, AlumnoOption | null>>({}) // Mapa: indexPaquete -> alumno seleccionado
  const [formData, setFormData] = useState<Partial<RegisterPaymentRequest>>({
    montoTotal: 0,
    fechaPago: getToday(),
    paquetes: [],
  })
  const paquetesCount = formData.paquetes?.length ?? 0

  const { data: metodosPago } = usePaymentMethodsQuery()
  const { data: tiposPaquetes } = usePackageTypesQuery()
  const { data: alumnosResults, isLoading: searchingAlumnos } = useStudentsSearchQuery(searchAlumno)
  const registerMutation = useRegisterPaymentMutation()

  useEffect(() => {
    if (!isOpen) return

    if (initialAlumno) {
      setSelectedAlumno(initialAlumno)
      setSearchAlumno(initialAlumno.nombre)

      if (paquetesCount > 0) {
        setAlumnosPorPaquete(prev => {
          const updated = { ...prev }
          for (let i = 0; i < paquetesCount; i += 1) {
            if (!updated[i]) updated[i] = initialAlumno
          }
          return updated
        })
      }
    }

    if (initialNota) {
      setFormData(prev => ({ ...prev, nota: initialNota }))
    }
  }, [isOpen, initialAlumno, initialNota, paquetesCount])

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Mostrar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('comprobante', file)

      const response = await httpClient.post('/api/pagos/upload-comprobante', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      updateField('comprobanteUrl', response.data.url)
    } catch (error) {
      console.error('Error subiendo comprobante:', error)
      alert('Error al subir el comprobante')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los paquetes tengan alumno asignado
    const paquetesSinAlumno = formData.paquetes?.filter((_, index) => !alumnosPorPaquete[index])
    if (paquetesSinAlumno && paquetesSinAlumno.length > 0) {
      alert('Todos los paquetes deben tener un alumno asignado')
      return
    }

    try {
      // Construir paquetes con idAlumno
      const paquetesConAlumno = formData.paquetes?.map((paq, index) => ({
        ...paq,
        idAlumno: alumnosPorPaquete[index]!.idAlumno
      }))

      await registerMutation.mutateAsync({
        ...formData,
        idAlumno: null, // Ya no necesitamos IdAlumno global
        paquetes: paquetesConAlumno,
        idsPaquetesExistentes: selectedExistingPackages.length > 0 ? selectedExistingPackages : undefined,
      } as RegisterPaymentRequest)
      onSuccess?.()
      onClose()
      // Reset form
      setSearchAlumno('')
      setSelectedAlumno(null)
      setSelectedExistingPackages([])
      setAlumnosPorPaquete({})
      setFormData({
        montoTotal: 0,
        fechaPago: getToday(),
        paquetes: [],
      })
    } catch (error) {
      console.error('Error registrando pago:', error)
    }
  }

  const updateField = (field: keyof RegisterPaymentRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectAlumno = (alumno: AlumnoOption) => {
    if (paqueteIndexBuscando !== null) {
      // Asignar al paquete específico
      setAlumnosPorPaquete(prev => ({ ...prev, [paqueteIndexBuscando]: alumno }))
      setPaqueteIndexBuscando(null)
    } else {
      // Asignar globalmente (para compatibilidad con paquetes existentes)
      setSelectedAlumno(alumno)
    }
    setSearchAlumno(alumno.nombre)
    setShowResults(false)
  }

  const addPaquete = () => {
    const newIndex = formData.paquetes?.length || 0
    setFormData((prev) => ({
      ...prev,
      paquetes: [
        ...(prev.paquetes || []),
        {
          idTipoPaquete: '',
          clasesDisponibles: 0,
          valorPaquete: 0,
          diasVigencia: 30,
        },
      ],
    }))
    // Si hay un alumno seleccionado globalmente, asignarlo al nuevo paquete
    if (selectedAlumno) {
      setAlumnosPorPaquete(prev => ({ ...prev, [newIndex]: selectedAlumno }))
    }
  }

  const isTwoPersonsPackage = (packageName: string | undefined): boolean => {
    if (!packageName) return false
    return packageName.toLowerCase().includes('2 personas') || packageName.toLowerCase().includes('2p')
  }

  const handlePackageTypeChange = (index: number, selectedTipo: PackageType) => {
    const newPaquetes = [...(formData.paquetes || [])]
    newPaquetes[index] = {
      idTipoPaquete: selectedTipo.idTipoPaquete,
      clasesDisponibles: selectedTipo.numeroClases,
      valorPaquete: selectedTipo.precio,
      diasVigencia: selectedTipo.diasVigencia,
    }
    updateField('paquetes', newPaquetes)

    // Si es paquete de 2 personas y solo hay 1 paquete, agregar automáticamente el segundo
    if (isTwoPersonsPackage(selectedTipo.nombre) && newPaquetes.length === 1) {
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          paquetes: [
            ...newPaquetes,
            {
              idTipoPaquete: selectedTipo.idTipoPaquete,
              clasesDisponibles: selectedTipo.numeroClases,
              valorPaquete: 0, // Segundo paquete en $0
              diasVigencia: selectedTipo.diasVigencia,
            },
          ],
        }))
      }, 100)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-[rgba(26,26,26,0.98)] border border-[rgba(64,64,64,0.3)] rounded-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-[rgba(26,26,26,0.98)] border-b border-[rgba(64,64,64,0.3)] p-6 flex items-center justify-between">
          <h2 className="text-[#f9fafb] text-2xl font-semibold">💰 Registrar Pago</h2>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Búsqueda de Alumnos (flotante, aparece al hacer clic en selector de paquete) */}
          {showResults && searchAlumno.trim().length >= 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowResults(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div className="relative z-10 bg-[rgba(26,26,26,0.98)] border border-[rgba(64,64,64,0.3)] rounded-lg shadow-2xl w-full max-w-2xl max-h-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-[rgba(64,64,64,0.3)]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar alumno por nombre o documento..."
                      value={searchAlumno}
                      onChange={(e) => setSearchAlumno(e.target.value)}
                      autoFocus
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {searchingAlumnos && (
                    <div className="p-4 text-center text-[#9ca3af]">
                      Buscando...
                    </div>
                  )}
                  {alumnosResults && alumnosResults.length === 0 && searchAlumno.trim().length >= 2 && (
                    <div className="p-4 text-center text-[#9ca3af]">
                      No se encontraron alumnos
                    </div>
                  )}
                  {!searchAlumno && (
                    <div className="p-4 text-center text-[#6b7280]">
                      Escribe para buscar alumnos...
                    </div>
                  )}
                  {alumnosResults && alumnosResults.map((alumno) => (
                    <button
                      key={alumno.idAlumno}
                      type="button"
                      onClick={() => selectAlumno(alumno)}
                      className="w-full p-4 text-left hover:bg-[rgba(201,52,72,0.1)] transition-colors border-b border-[rgba(64,64,64,0.3)] last:border-0"
                    >
                      <div className="text-[#f9fafb] font-medium">{alumno.nombre}</div>
                      <div className="text-sm text-[#9ca3af] flex gap-3 mt-1">
                        {alumno.numeroDocumento && <span>CC: {alumno.numeroDocumento}</span>}
                        {alumno.telefono && <span>📱 {alumno.telefono}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Monto */}
            <div>
              <label className="block text-[#f9fafb] text-sm font-medium mb-2">Monto Total *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.montoTotal}
                onChange={(e) => updateField('montoTotal', parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                placeholder="0"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-[#f9fafb] text-sm font-medium mb-2">Fecha de Pago *</label>
              <input
                type="date"
                required
                value={formData.fechaPago}
                onChange={(e) => updateField('fechaPago', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
              />
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-[#f9fafb] text-sm font-medium mb-2">Método de Pago *</label>
            <div className="grid grid-cols-3 gap-3">
              {metodosPago?.map((metodo) => (
                <button
                  key={metodo.idMetodoPago}
                  type="button"
                  onClick={() => updateField('idMetodoPago', metodo.idMetodoPago)}
                  className={`py-3 px-4 rounded-lg border transition-all ${
                    formData.idMetodoPago === metodo.idMetodoPago
                      ? 'bg-[rgba(201,52,72,0.15)] border-[rgba(201,52,72,0.3)] text-[#c93448]'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(64,64,64,0.3)] text-[#9ca3af] hover:border-[rgba(201,52,72,0.2)]'
                  }`}
                >
                  {metodo.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Referencia (solo si es transferencia) */}
          {formData.idMetodoPago && metodosPago?.find(m => m.idMetodoPago === formData.idMetodoPago)?.nombre === 'Transferencia Bancaria' && (
            <div>
              <label className="block text-[#f9fafb] text-sm font-medium mb-2">Referencia</label>
              <input
                type="text"
                value={formData.referencia || ''}
                onChange={(e) => updateField('referencia', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                placeholder="Número de referencia de la transferencia"
              />
            </div>
          )}

          {/* Comprobante de Pago */}
          <div>
            <label className="block text-[#f9fafb] text-sm font-medium mb-2">Comprobante de Pago</label>
            
            <div className="flex gap-4">
              {/* Input de archivo */}
              <label className="flex-1 flex items-center justify-center gap-3 px-4 py-8 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[#c93448] cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#c93448] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#9ca3af]">Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-[#c93448]" size={24} />
                    <div className="text-center">
                      <p className="text-[#f9fafb] font-medium">Click para subir comprobante</p>
                      <p className="text-[#9ca3af] text-sm">JPG, PNG, PDF (máx. 10MB)</p>
                    </div>
                  </>
                )}
              </label>

              {/* Preview de la imagen */}
              {previewUrl && (
                <div className="w-32 h-32 rounded-lg border border-[rgba(255,255,255,0.1)] overflow-hidden bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                  {previewUrl.endsWith('.pdf') ? (
                    <ImageIcon className="text-[#9ca3af]" size={32} />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-[#f9fafb] text-sm font-medium mb-2">Nota (opcional)</label>
            <textarea
              rows={3}
              value={formData.nota || ''}
              onChange={(e) => updateField('nota', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Paquetes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[#f9fafb] text-sm font-medium">Paquetes Asociados</label>
              <button
                type="button"
                onClick={addPaquete}
                className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(201,52,72,0.15)] hover:bg-[rgba(201,52,72,0.25)] text-[#c93448] rounded-lg text-sm transition-all"
              >
                <Plus size={16} />
                Agregar Paquete
              </button>
            </div>
            
            {/* Lista de paquetes */}
            <div className="space-y-3">
              {formData.paquetes?.map((paquete, index) => {
                const tipoPaquete = tiposPaquetes?.find((tp: PackageType) => tp.idTipoPaquete === paquete.idTipoPaquete)
                return (
                  <div key={index} className="p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#f9fafb] text-sm font-medium">Paquete {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newPaquetes = formData.paquetes?.filter((_, i) => i !== index)
                          updateField('paquetes', newPaquetes)
                        }}
                        className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Selector de Alumno para este paquete */}
                      <div className="col-span-2">
                        <label className="block text-[#9ca3af] text-xs mb-1">Alumno para este paquete *</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
                          <input
                            type="text"
                            placeholder="Click para buscar alumno..."
                            value={alumnosPorPaquete[index]?.nombre || ''}
                            onFocus={() => {
                              setPaqueteIndexBuscando(index)
                              setSearchAlumno('')
                              setShowResults(true)
                            }}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] text-sm focus:outline-none focus:border-[#c93448] transition-colors cursor-pointer"
                          />
                          {alumnosPorPaquete[index] && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                          )}
                        </div>
                      </div>

                      {/* Selector de tipo de paquete */}
                      <div className="col-span-2">
                        <label className="block text-[#9ca3af] text-xs mb-1">Tipo de Paquete *</label>
                        <select
                          value={paquete.idTipoPaquete}
                          onChange={(e) => {
                            const selectedTipo = tiposPaquetes?.find((tp: PackageType) => tp.idTipoPaquete === e.target.value)
                            if (selectedTipo) {
                              handlePackageTypeChange(index, selectedTipo)
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] text-sm focus:outline-none focus:border-[#c93448] transition-colors"
                        >
                          <option value="">Seleccionar tipo...</option>
                          {tiposPaquetes?.map((tipo: PackageType) => (
                            <option key={tipo.idTipoPaquete} value={tipo.idTipoPaquete}>
                              {tipo.nombre} - ${tipo.precio.toLocaleString()} ({tipo.numeroClases} clases, {tipo.diasVigencia} días)
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Info del paquete seleccionado */}
                      {tipoPaquete && (
                        <>
                          <div>
                            <label className="block text-[#9ca3af] text-xs mb-1">Clases</label>
                            <input
                              type="number"
                              min="1"
                              value={paquete.clasesDisponibles}
                              onChange={(e) => {
                                const newPaquetes = [...(formData.paquetes || [])]
                                newPaquetes[index] = {
                                  ...newPaquetes[index],
                                  clasesDisponibles: parseInt(e.target.value) || 0,
                                }
                                updateField('paquetes', newPaquetes)
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] text-sm focus:outline-none focus:border-[#c93448] transition-colors"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[#9ca3af] text-xs mb-1">
                              Valor (editable) 
                              <span className="text-[#6b7280] ml-1">💡</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={paquete.valorPaquete}
                              onChange={(e) => {
                                const newPaquetes = [...(formData.paquetes || [])]
                                newPaquetes[index] = {
                                  ...newPaquetes[index],
                                  valorPaquete: parseFloat(e.target.value) || 0,
                                }
                                updateField('paquetes', newPaquetes)
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] text-sm focus:outline-none focus:border-[#c93448] transition-colors"
                              placeholder="0"
                            />
                            {paquete.valorPaquete === 0 && (
                              <p className="text-[#fbbf24] text-[10px] mt-0.5">
                                ⚠️ Valor en $0 - Útil para 2do alumno en parejas
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-[#9ca3af] text-xs mb-1">Vigencia (días)</label>
                            <input
                              type="number"
                              min="1"
                              value={paquete.diasVigencia}
                              onChange={(e) => {
                                const newPaquetes = [...(formData.paquetes || [])]
                                newPaquetes[index] = {
                                  ...newPaquetes[index],
                                  diasVigencia: parseInt(e.target.value) || 30,
                                }
                                updateField('paquetes', newPaquetes)
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] text-sm focus:outline-none focus:border-[#c93448] transition-colors"
                            />
                          </div>
                          
                          {tipoPaquete.descripcion && (
                            <div className="col-span-2">
                              <label className="block text-[#9ca3af] text-xs mb-1">Descripción</label>
                              <div className="px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#9ca3af] text-xs leading-relaxed">
                                {tipoPaquete.descripcion}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {(!formData.paquetes || formData.paquetes.length === 0) && (
                <div className="text-center py-6 text-[#6b7280] text-sm">
                  No hay paquetes asociados. Click en "Agregar Paquete" para añadir uno.
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex-1 px-6 py-3 rounded-lg bg-[#c93448] hover:bg-[#b02d3c] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
