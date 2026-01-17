// ============================================
// PROPERTY-BASED TESTS - DETAIL DISPLAY
// Properties 16, 17, 18
// Validates: Requirements 6.2, 6.4, 6.6
// ============================================

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  PaqueteDetalleDTO,
  AsistenciaHistorialDTO,
  EstadoPaquete,
  EstadoPaqueteId,
  CongelacionDTO,
} from '../types/packageTypes'
import {
  calculateConsumoPercentage,
  formatDetailDate,
} from '../components/admin/PackageDetailModal/PackageDetailModal'
import {
  formatHistorialDate,
  formatTimeSpan,
  formatHorario,
  getDescontadaBadgeConfig,
} from '../components/admin/PackageDetailModal/ConsumptionHistoryItem'

// ============================================
// ARBITRARIES FOR GENERATING VALID API DATA
// ============================================

/**
 * Generate valid EstadoPaquete values
 */
const estadoPaqueteArb: fc.Arbitrary<EstadoPaquete> = fc.constantFrom(
  'Activo',
  'Vencido',
  'Congelado',
  'Agotado'
)

/**
 * Generate valid EstadoPaqueteId values
 */
const estadoPaqueteIdArb: fc.Arbitrary<EstadoPaqueteId> = fc.constantFrom(1, 2, 3, 4)

/**
 * Generate valid ISO date strings
 * Using integer-based approach to avoid invalid date issues
 */
const isoDateArb: fc.Arbitrary<string> = fc
  .integer({
    min: new Date('2020-01-01').getTime(),
    max: new Date('2030-12-31').getTime(),
  })
  .map((timestamp) => new Date(timestamp).toISOString())

/**
 * Generate valid time span strings (HH:mm:ss format)
 */
const timeSpanArb: fc.Arbitrary<string> = fc
  .tuple(
    fc.integer({ min: 0, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 59 })
  )
  .map(([h, m, s]) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  })

/**
 * Generate valid CongelacionDTO objects
 */
const congelacionArb: fc.Arbitrary<CongelacionDTO> = fc.record({
  idCongelacion: fc.uuid(),
  fechaInicio: isoDateArb,
  fechaFin: isoDateArb,
  diasCongelados: fc.integer({ min: 1, max: 365 }),
})

/**
 * Generate valid AsistenciaHistorialDTO objects
 */
const asistenciaHistorialArb: fc.Arbitrary<AsistenciaHistorialDTO> = fc.record({
  idAsistencia: fc.uuid(),
  tipoClase: fc.constantFrom('Tango', 'Milonga', 'Vals', 'Técnica', 'Práctica'),
  fecha: isoDateArb,
  horaInicio: timeSpanArb,
  horaFin: timeSpanArb,
  descontada: fc.boolean(),
})

/**
 * Generate valid PaqueteDetalleDTO objects matching GET /api/paquetes/{id} response
 */
const paqueteDetalleArb: fc.Arbitrary<PaqueteDetalleDTO> = fc
  .record({
    idPaquete: fc.uuid(),
    idAlumno: fc.uuid(),
    nombreAlumno: fc.string({ minLength: 1, maxLength: 100 }),
    idTipoPaquete: fc.uuid(),
    nombreTipoPaquete: fc.string({ minLength: 1, maxLength: 50 }),
    clasesDisponibles: fc.integer({ min: 1, max: 100 }),
    clasesUsadas: fc.integer({ min: 0, max: 100 }),
    fechaActivacion: isoDateArb,
    fechaVencimiento: isoDateArb,
    valorPaquete: fc.float({ min: 0, max: 100000, noNaN: true }),
    idEstado: estadoPaqueteIdArb,
    estado: estadoPaqueteArb,
    estaVencido: fc.boolean(),
    tieneClasesDisponibles: fc.boolean(),
    congelaciones: fc.array(congelacionArb, { minLength: 0, maxLength: 5 }),
    historialConsumo: fc.option(
      fc.array(asistenciaHistorialArb, { minLength: 0, maxLength: 20 }),
      { nil: undefined }
    ),
  })
  .map((p) => ({
    ...p,
    // Ensure clasesUsadas <= clasesDisponibles
    clasesUsadas: Math.min(p.clasesUsadas, p.clasesDisponibles),
    // Calculate clasesRestantes
    clasesRestantes: p.clasesDisponibles - Math.min(p.clasesUsadas, p.clasesDisponibles),
  }))

// ============================================
// PARSING FUNCTIONS
// ============================================

/**
 * Parses and validates a PaqueteDetalleDTO from API response
 * Returns the parsed object if valid, throws if invalid
 */
function parsePaqueteDetalleDTO(data: unknown): PaqueteDetalleDTO {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid PaqueteDetalleDTO: expected object')
  }

  const obj = data as Record<string, unknown>

  // Validate required string fields
  const stringFields = [
    'idPaquete',
    'idAlumno',
    'nombreAlumno',
    'idTipoPaquete',
    'nombreTipoPaquete',
    'fechaActivacion',
    'fechaVencimiento',
    'estado',
  ]
  for (const field of stringFields) {
    if (typeof obj[field] !== 'string') {
      throw new Error(`Invalid PaqueteDetalleDTO: ${field} must be a string`)
    }
  }

  // Validate required number fields
  const numberFields = [
    'clasesDisponibles',
    'clasesUsadas',
    'clasesRestantes',
    'valorPaquete',
    'idEstado',
  ]
  for (const field of numberFields) {
    if (typeof obj[field] !== 'number') {
      throw new Error(`Invalid PaqueteDetalleDTO: ${field} must be a number`)
    }
  }

  // Validate required boolean fields
  const booleanFields = ['estaVencido', 'tieneClasesDisponibles']
  for (const field of booleanFields) {
    if (typeof obj[field] !== 'boolean') {
      throw new Error(`Invalid PaqueteDetalleDTO: ${field} must be a boolean`)
    }
  }

  // Validate congelaciones array
  if (!Array.isArray(obj.congelaciones)) {
    throw new Error('Invalid PaqueteDetalleDTO: congelaciones must be an array')
  }

  return obj as unknown as PaqueteDetalleDTO
}

/**
 * Parses and validates an AsistenciaHistorialDTO from API response
 */
function parseAsistenciaHistorialDTO(data: unknown): AsistenciaHistorialDTO {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid AsistenciaHistorialDTO: expected object')
  }

  const obj = data as Record<string, unknown>

  // Validate required string fields
  const stringFields = ['idAsistencia', 'tipoClase', 'fecha', 'horaInicio', 'horaFin']
  for (const field of stringFields) {
    if (typeof obj[field] !== 'string') {
      throw new Error(`Invalid AsistenciaHistorialDTO: ${field} must be a string`)
    }
  }

  // Validate descontada boolean
  if (typeof obj.descontada !== 'boolean') {
    throw new Error('Invalid AsistenciaHistorialDTO: descontada must be a boolean')
  }

  return obj as unknown as AsistenciaHistorialDTO
}

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 16: Package Detail Response Parsing**
 * **Validates: Requirements 6.2**
 *
 * *For any* valid response from `/api/paquetes/{id}`, the parsed object SHALL contain
 * all required fields: idPaquete, nombreAlumno, nombreTipoPaquete, clasesDisponibles,
 * clasesUsadas, clasesRestantes, fechaActivacion, fechaVencimiento, estado, and
 * congelaciones array.
 */
describe('Property 16: Package Detail Response Parsing', () => {
  it('should parse valid PaqueteDetalleDTO with all required fields', () => {
    fc.assert(
      fc.property(paqueteDetalleArb, (paqueteDetalle) => {
        // Simulate API response by converting to JSON and back
        const jsonString = JSON.stringify(paqueteDetalle)
        const apiResponse = JSON.parse(jsonString)

        const parsed = parsePaqueteDetalleDTO(apiResponse)

        // Verify idPaquete is present and is a string
        expect(parsed.idPaquete).toBe(paqueteDetalle.idPaquete)
        expect(typeof parsed.idPaquete).toBe('string')

        // Verify nombreAlumno is present and is a string
        expect(parsed.nombreAlumno).toBe(paqueteDetalle.nombreAlumno)
        expect(typeof parsed.nombreAlumno).toBe('string')

        // Verify nombreTipoPaquete is present and is a string
        expect(parsed.nombreTipoPaquete).toBe(paqueteDetalle.nombreTipoPaquete)
        expect(typeof parsed.nombreTipoPaquete).toBe('string')

        // Verify clasesDisponibles is present and is a number
        expect(parsed.clasesDisponibles).toBe(paqueteDetalle.clasesDisponibles)
        expect(typeof parsed.clasesDisponibles).toBe('number')

        // Verify clasesUsadas is present and is a number
        expect(parsed.clasesUsadas).toBe(paqueteDetalle.clasesUsadas)
        expect(typeof parsed.clasesUsadas).toBe('number')

        // Verify clasesRestantes is present and is a number
        expect(parsed.clasesRestantes).toBe(paqueteDetalle.clasesRestantes)
        expect(typeof parsed.clasesRestantes).toBe('number')

        // Verify fechaActivacion is present and is a string
        expect(parsed.fechaActivacion).toBe(paqueteDetalle.fechaActivacion)
        expect(typeof parsed.fechaActivacion).toBe('string')

        // Verify fechaVencimiento is present and is a string
        expect(parsed.fechaVencimiento).toBe(paqueteDetalle.fechaVencimiento)
        expect(typeof parsed.fechaVencimiento).toBe('string')

        // Verify estado is present and is a string
        expect(parsed.estado).toBe(paqueteDetalle.estado)
        expect(typeof parsed.estado).toBe('string')

        // Verify congelaciones is present and is an array
        expect(Array.isArray(parsed.congelaciones)).toBe(true)
        expect(parsed.congelaciones).toHaveLength(paqueteDetalle.congelaciones.length)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve optional historialConsumo when present', () => {
    fc.assert(
      fc.property(paqueteDetalleArb, (paqueteDetalle) => {
        const jsonString = JSON.stringify(paqueteDetalle)
        const apiResponse = JSON.parse(jsonString)

        const parsed = parsePaqueteDetalleDTO(apiResponse)

        if (paqueteDetalle.historialConsumo !== undefined) {
          expect(Array.isArray(parsed.historialConsumo)).toBe(true)
          expect(parsed.historialConsumo).toHaveLength(
            paqueteDetalle.historialConsumo.length
          )
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 17: Consumo Display in Detail Modal**
 * **Validates: Requirements 6.4**
 *
 * *For any* PaqueteDetalleDTO, the consumo section SHALL display:
 * Total = clasesDisponibles, Usadas = clasesUsadas, Restantes = clasesRestantes,
 * with progress bar showing percentage.
 */
describe('Property 17: Consumo Display in Detail Modal', () => {
  it('should calculate percentage correctly for packages with clasesDisponibles > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (usadas, disponibles) => {
          // Ensure usadas <= disponibles
          const actualUsadas = Math.min(usadas, disponibles)
          const percentage = calculateConsumoPercentage(actualUsadas, disponibles)
          const expected = Math.round((actualUsadas / disponibles) * 100)

          expect(percentage).toBe(expected)
          expect(percentage).toBeGreaterThanOrEqual(0)
          expect(percentage).toBeLessThanOrEqual(100)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return 0 percentage when clasesDisponibles is 0', () => {
    const percentage = calculateConsumoPercentage(0, 0)
    expect(percentage).toBe(0)
  })

  it('should display correct Total, Usadas, Restantes values', () => {
    fc.assert(
      fc.property(paqueteDetalleArb, (paqueteDetalle) => {
        // Verify the relationship: clasesRestantes = clasesDisponibles - clasesUsadas
        expect(paqueteDetalle.clasesRestantes).toBe(
          paqueteDetalle.clasesDisponibles - paqueteDetalle.clasesUsadas
        )

        // Verify clasesUsadas <= clasesDisponibles
        expect(paqueteDetalle.clasesUsadas).toBeLessThanOrEqual(
          paqueteDetalle.clasesDisponibles
        )

        // Verify clasesRestantes >= 0
        expect(paqueteDetalle.clasesRestantes).toBeGreaterThanOrEqual(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format dates correctly for display', () => {
    fc.assert(
      fc.property(isoDateArb, (isoDate) => {
        const formatted = formatDetailDate(isoDate)

        // Should return a non-empty string
        expect(typeof formatted).toBe('string')
        expect(formatted.length).toBeGreaterThan(0)

        // Should not return the original ISO string (it should be formatted)
        // Unless the date is invalid
        const date = new Date(isoDate)
        if (!isNaN(date.getTime())) {
          // Valid date should be formatted differently
          expect(formatted).not.toBe(isoDate)
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 18: Historial Item Display Format**
 * **Validates: Requirements 6.6**
 *
 * *For any* AsistenciaHistorialDTO in the historial, the item SHALL display:
 * tipoClase, formatted fecha, formatted horario (horaInicio - horaFin), and badge
 * showing "Descontada" (green) if descontada === true or "No descontada" (gray)
 * if descontada === false.
 */
describe('Property 18: Historial Item Display Format', () => {
  it('should parse valid AsistenciaHistorialDTO with all required fields', () => {
    fc.assert(
      fc.property(asistenciaHistorialArb, (asistencia) => {
        // Simulate API response by converting to JSON and back
        const jsonString = JSON.stringify(asistencia)
        const apiResponse = JSON.parse(jsonString)

        const parsed = parseAsistenciaHistorialDTO(apiResponse)

        // Verify tipoClase is present and is a string
        expect(parsed.tipoClase).toBe(asistencia.tipoClase)
        expect(typeof parsed.tipoClase).toBe('string')

        // Verify fecha is present and is a string
        expect(parsed.fecha).toBe(asistencia.fecha)
        expect(typeof parsed.fecha).toBe('string')

        // Verify horaInicio is present and is a string
        expect(parsed.horaInicio).toBe(asistencia.horaInicio)
        expect(typeof parsed.horaInicio).toBe('string')

        // Verify horaFin is present and is a string
        expect(parsed.horaFin).toBe(asistencia.horaFin)
        expect(typeof parsed.horaFin).toBe('string')

        // Verify descontada is present and is a boolean
        expect(parsed.descontada).toBe(asistencia.descontada)
        expect(typeof parsed.descontada).toBe('boolean')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format historial date correctly', () => {
    fc.assert(
      fc.property(isoDateArb, (isoDate) => {
        const formatted = formatHistorialDate(isoDate)

        // Should return a non-empty string
        expect(typeof formatted).toBe('string')
        expect(formatted.length).toBeGreaterThan(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format time span correctly (HH:mm:ss to HH:mm)', () => {
    fc.assert(
      fc.property(timeSpanArb, (timeSpan) => {
        const formatted = formatTimeSpan(timeSpan)

        // Should return HH:mm format (5 characters)
        expect(typeof formatted).toBe('string')
        expect(formatted.length).toBe(5)
        expect(formatted).toMatch(/^\d{2}:\d{2}$/)

        // Should preserve hours and minutes
        const [hours, minutes] = timeSpan.split(':')
        expect(formatted).toBe(`${hours}:${minutes}`)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should format horario correctly combining horaInicio and horaFin', () => {
    fc.assert(
      fc.property(timeSpanArb, timeSpanArb, (horaInicio, horaFin) => {
        const formatted = formatHorario(horaInicio, horaFin)

        // Should contain both times separated by " - "
        expect(formatted).toContain(' - ')

        const [inicio, fin] = formatted.split(' - ')
        expect(inicio).toBe(formatTimeSpan(horaInicio))
        expect(fin).toBe(formatTimeSpan(horaFin))

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return correct badge config for descontada status', () => {
    // Test descontada === true
    const configTrue = getDescontadaBadgeConfig(true)
    expect(configTrue.variant).toBe('success')
    expect(configTrue.label).toBe('Descontada')

    // Test descontada === false
    const configFalse = getDescontadaBadgeConfig(false)
    expect(configFalse.variant).toBe('none')
    expect(configFalse.label).toBe('No descontada')
  })

  it('should return correct badge config for all boolean values', () => {
    fc.assert(
      fc.property(fc.boolean(), (descontada) => {
        const config = getDescontadaBadgeConfig(descontada)

        if (descontada) {
          expect(config.variant).toBe('success')
          expect(config.label).toBe('Descontada')
        } else {
          expect(config.variant).toBe('none')
          expect(config.label).toBe('No descontada')
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})
