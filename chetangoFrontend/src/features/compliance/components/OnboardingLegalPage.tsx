// ============================================
// ONBOARDING LEGAL PAGE
// ============================================
// Página de aceptación de documentos legales para el Admin de una academia.
// Se muestra la primera vez que accede (onboardingCompletado = false)
// o cuando hay nuevas versiones de documentos que requieren reaceptación.

import { AlertCircle, CheckCircle2, ExternalLink, FileText, Loader2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAceptarDocumentosMutation } from '../api/complianceMutations'
import { useEstadoCumplimientoQuery } from '../api/complianceQueries'
import type { DocumentoPendienteDto } from '../types/compliance.types'

export const OnboardingLegalPage = () => {
  const navigate = useNavigate()
  const { data: estado, isLoading, isError, refetch } = useEstadoCumplimientoQuery()
  const aceptarMutation = useAceptarDocumentosMutation()

  // Qué documentos ha revisado el usuario en esta sesión (UI state)
  const [revisados, setRevisados] = useState<Set<string>>(new Set())
  // Qué documentos ya marcó como "acepto" (UI state)
  const [aceptados, setAceptados] = useState<Set<string>>(new Set())

  const pendientes: DocumentoPendienteDto[] = estado?.documentosPendientes ?? []
  const obligatorios = pendientes.filter(d => d.esObligatorio)
  const todosObligatoriosAceptados = obligatorios.every(d => aceptados.has(d.versionId))

  const toggleAceptado = (versionId: string) => {
    setAceptados(prev => {
      const next = new Set(prev)
      if (next.has(versionId)) {
        next.delete(versionId)
      } else {
        next.add(versionId)
      }
      return next
    })
  }

  const handleAbrirDocumento = (doc: DocumentoPendienteDto) => {
    window.open(doc.urlDocumento, '_blank', 'noopener,noreferrer')
    setRevisados(prev => new Set(prev).add(doc.versionId))
  }

  const handleConfirmar = async () => {
    if (!todosObligatoriosAceptados) return

    const versionesIds = Array.from(aceptados)
    try {
      const resultado = await aceptarMutation.mutateAsync({
        versionesDocumentoLegalIds: versionesIds,
        contexto: estado?.onboardingCompletado ? 'Reacepacion' : 'Onboarding',
      })

      if (resultado.onboardingCompletado) {
        toast.success('¡Documentos aceptados! Ya puedes usar la plataforma.')
        await refetch()
        navigate('/admin', { replace: true })
      } else {
        toast.info('Documentos registrados. Completa todos los obligatorios para continuar.')
        await refetch()
      }
    } catch {
      toast.error('Ocurrió un error al registrar la aceptación. Intenta de nuevo.')
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Cargando documentos legales…</p>
        </div>
      </div>
    )
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (isError || !estado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-red-500 max-w-sm text-center">
          <AlertCircle className="h-8 w-8" />
          <p className="font-semibold">No se pudieron cargar los documentos</p>
          <p className="text-sm text-gray-500">
            Verifica tu conexión o contacta al soporte técnico.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // ─── Si ya completó el onboarding y no requiere reaceptación ───────────────
  if (estado.onboardingCompletado && !estado.requiereReaceptacion && pendientes.length === 0) {
    navigate('/admin', { replace: true })
    return null
  }

  const esReaceptacion = estado.onboardingCompletado && estado.requiereReaceptacion

  const aceptadosCount = obligatorios.filter(d => aceptados.has(d.versionId)).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col items-center justify-start pt-10 px-4 pb-36">
      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl w-full mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <ShieldCheck className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {esReaceptacion ? 'Actualización de documentos legales' : 'Bienvenido a Aphellion'}
        </h1>
        <p className="mt-2 text-gray-500 text-sm leading-relaxed">
          {esReaceptacion
            ? 'Hemos actualizado nuestros documentos legales. Debes aceptarlos para continuar operando.'
            : `Antes de comenzar a gestionar ${estado.nombreAcademia}, necesitas leer y aceptar los documentos legales de la plataforma.`}
        </p>
      </div>

      {/* ─── Lista de documentos ─────────────────────────────────────────────── */}
      <div className="max-w-2xl w-full space-y-4">
        {pendientes.map(doc => {
          const yaAceptado = aceptados.has(doc.versionId)
          const yaRevisado = revisados.has(doc.versionId)

          return (
            <div
              key={doc.versionId}
              className={`rounded-xl border bg-white p-5 shadow-sm transition-all ${
                yaAceptado ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              {/* Encabezado del documento */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className={`h-5 w-5 shrink-0 ${yaAceptado ? 'text-green-600' : 'text-blue-500'}`} />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {doc.nombre}
                      {doc.esObligatorio && (
                        <span className="ml-2 text-xs text-red-500 font-normal">(obligatorio)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">Versión {doc.numeroVersion}</p>
                  </div>
                </div>
                {yaAceptado && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
              </div>

              {/* Descripción */}
              {doc.descripcion && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{doc.descripcion}</p>
              )}

              {/* Acciones */}
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAbrirDocumento(doc)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Leer documento completo
                </button>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-blue-600"
                    checked={yaAceptado}
                    disabled={!yaRevisado}
                    onChange={() => toggleAceptado(doc.versionId)}
                  />
                  <span className={`text-xs font-medium ${!yaRevisado ? 'text-gray-400' : 'text-gray-700'}`}>
                    {!yaRevisado ? 'Primero abre el documento' : 'Acepto este documento'}
                  </span>
                </label>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Barra de confirmación sticky ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-4 z-50">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">

          {/* Progreso */}
          {obligatorios.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(aceptadosCount / obligatorios.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 shrink-0">
                {aceptadosCount}/{obligatorios.length} documentos aceptados
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={!todosObligatoriosAceptados || aceptarMutation.isPending}
            onClick={handleConfirmar}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              todosObligatoriosAceptados && !aceptarMutation.isPending
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {aceptarMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando aceptación…
              </>
            ) : todosObligatoriosAceptados ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                Confirmar y acceder a la plataforma
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Acepta todos los documentos obligatorios para continuar
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Al confirmar, se registrará tu consentimiento con fecha, hora e IP como evidencia legal.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingLegalPage
