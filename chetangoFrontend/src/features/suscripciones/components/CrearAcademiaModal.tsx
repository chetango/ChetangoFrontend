// ============================================
// CREAR ACADEMIA MODAL - SUPERADMIN
// ============================================

import { Building2, FileText, Mail, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassButton } from '../../../design-system/atoms/GlassButton/GlassButton'
import { GlassInput } from '../../../design-system/atoms/GlassInput/GlassInput'
import { useCrearAcademiaConAdminMutation } from '../api/suscripcionMutations'

interface CrearAcademiaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CrearAcademiaModal({ isOpen, onClose, onSuccess }: CrearAcademiaModalProps) {
  const [formData, setFormData] = useState({
    nombreTenant: '',
    subdomain: '',
    nombreUsuario: '',
    correoAdmin: '',
    numeroDocumento: '',
    telefono: '',
    plan: 'Basic',
    maxSedes: 1,
    maxAlumnos: 50,
    maxProfesores: 10,
    maxStorageMB: 1000,
  })

  const crearAcademiaMutation = useCrearAcademiaConAdminMutation()

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.nombreTenant.trim()) {
      toast.warning('Por favor ingresa el nombre de la academia')
      return
    }
    if (!formData.subdomain.trim()) {
      toast.warning('Por favor ingresa el subdomain')
      return
    }
    if (!formData.correoAdmin.trim()) {
      toast.warning('Por favor ingresa el correo del administrador')
      return
    }
    if (!formData.nombreUsuario.trim()) {
      toast.warning('Por favor ingresa el nombre del administrador')
      return
    }

    // Validar formato de subdomain (solo letras minúsculas y números)
    const subdomainRegex = /^[a-z0-9]+$/
    if (!subdomainRegex.test(formData.subdomain)) {
      toast.warning('El subdomain solo puede contener letras minúsculas y números')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correoAdmin)) {
      toast.warning('Por favor ingresa un correo válido')
      return
    }

    try {
      await crearAcademiaMutation.mutateAsync({
        ...formData,
        dominioCompleto: `${formData.subdomain}.aphellion.com`,
        idTipoDocumento: '11111111-1111-1111-1111-111111111111', // Cédula de Ciudadanía
      })

      toast.success('¡Academia creada exitosamente! 🎉', {
        description: `URL: https://${formData.subdomain}.aphellion.com`,
      })
      
      onSuccess()
      onClose()
      
      // Resetear formulario
      setFormData({
        nombreTenant: '',
        subdomain: '',
        nombreUsuario: '',
        correoAdmin: '',
        numeroDocumento: '',
        telefono: '',
        plan: 'Basico',
        maxSedes: 1,
        maxAlumnos: 50,
        maxProfesores: 10,
        maxStorageMB: 1000,
      })
    } catch (error: any) {
      toast.error('Error al crear la academia', {
        description: error?.message || 'Por favor intenta nuevamente',
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 bg-[rgba(42,42,48,0.95)] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl max-w-3xl w-full">
        {/* Header */}
        <div className="bg-[rgba(42,42,48,0.98)] border-b border-[rgba(255,255,255,0.1)] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#c93448] to-[#a8243a] rounded-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[#f9fafb] text-xl font-bold">Crear Nueva Academia</h2>
              <p className="text-[#9ca3af] text-sm">Complete la información para crear la academia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* IMPORTANTE: Recordatorio */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-400 text-sm flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <span>
                <strong>IMPORTANTE:</strong> Antes de crear la academia, asegúrate de haber registrado el usuario administrador en{' '}
                <strong>Azure Entra ID</strong> con el correo que vas a ingresar aquí.
              </span>
            </p>
          </div>

          {/* Datos de la Academia */}
          <div className="space-y-4">
            <h3 className="text-[#f9fafb] font-semibold flex items-center gap-2">
              <Building2 size={18} className="text-[#c93448]" />
              Datos de la Academia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                label="Nombre de la Academia"
                value={formData.nombreTenant}
                onChange={(e) => handleChange('nombreTenant', e.target.value)}
                placeholder="Ej: Salsa Latina"
                required
              />

              <div>
                <label className="block text-[#f9fafb] text-sm font-medium mb-2">
                  Subdomain
                </label>
                <div className="flex items-center gap-2">
                  <GlassInput
                    value={formData.subdomain}
                    onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase())}
                    placeholder="salsalatina"
                    required
                    className="flex-1"
                  />
                  <span className="text-[#9ca3af] text-sm whitespace-nowrap">.aphellion.com</span>
                </div>
                <p className="text-[#9ca3af] text-xs mt-1">
                  Solo letras minúsculas y números, sin espacios
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#f9fafb] text-sm font-medium mb-2">Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => handleChange('plan', e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-[rgba(30,30,36,0.6)] border border-[rgba(255,255,255,0.12)] rounded-xl text-[#f9fafb] focus:border-[#c93448] focus:ring-2 focus:ring-[rgba(201,52,72,0.3)] focus:outline-none transition-all duration-300"
                >
                  <option value="Basico">Básico</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <GlassInput
                label="Max Alumnos"
                type="number"
                value={formData.maxAlumnos}
                onChange={(e) => handleChange('maxAlumnos', parseInt(e.target.value))}
                min="1"
                required
              />

              <GlassInput
                label="Max Profesores"
                type="number"
                value={formData.maxProfesores}
                onChange={(e) => handleChange('maxProfesores', parseInt(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                label="Max Sedes"
                type="number"
                value={formData.maxSedes}
                onChange={(e) => handleChange('maxSedes', parseInt(e.target.value))}
                min="1"
                required
              />

              <GlassInput
                label="Storage (MB)"
                type="number"
                value={formData.maxStorageMB}
                onChange={(e) => handleChange('maxStorageMB', parseInt(e.target.value))}
                min="100"
                required
              />
            </div>
          </div>

          {/* Datos del Administrador */}
          <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <h3 className="text-[#f9fafb] font-semibold flex items-center gap-2">
              <FileText size={18} className="text-[#c93448]" />
              Usuario Administrador
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                label="Nombre Completo"
                value={formData.nombreUsuario}
                onChange={(e) => handleChange('nombreUsuario', e.target.value)}
                placeholder="Ej: Administrador Salsa Latina"
                required
                icon={<FileText size={18} />}
              />

              <GlassInput
                label="Correo Electrónico"
                type="email"
                value={formData.correoAdmin}
                onChange={(e) => handleChange('correoAdmin', e.target.value)}
                placeholder="admin@salsalatina.aphellion.com"
                required
                icon={<Mail size={18} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                label="Número de Documento"
                value={formData.numeroDocumento}
                onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                placeholder="123456789"
                required
              />

              <GlassInput
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="3001234567"
                required
                icon={<Phone size={18} />}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <GlassButton variant="secondary" onClick={onClose} type="button">
              Cancelar
            </GlassButton>
            <GlassButton
              variant="primary"
              type="submit"
              disabled={crearAcademiaMutation.isPending}
            >
              {crearAcademiaMutation.isPending ? 'Creando...' : 'Crear Academia'}
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  )
}
