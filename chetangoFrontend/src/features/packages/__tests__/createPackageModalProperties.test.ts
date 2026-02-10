// ============================================
// PROPERTY-BASED TESTS - CREATE PACKAGE MODAL
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
    calculateFechaFin,
    formatAlumnoDisplay,
    formatTipoPaqueteDisplay,
    getTodayDate,
    validateRequiredFields,
} from '../components/admin/CreatePackageModal'
import type { AlumnoDTO, PaqueteFormData, TipoPaqueteDTO } from '../types/packageTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid date strings in YYYY-MM-DD format
 */
const validDateArb: fc.Arbitrary<string> = fc
  .integer({ min: 2020, max: 2030 })
  .chain((year) =>
    fc.integer({ min: 1, max: 12 }).chain((month) =>
      fc.integer({ min: 1, max: 28 }).map((day) => {
        const monthStr = month.toString().padStart(2, '0')
        const dayStr = day.toString().padStart(2, '0')
        return `${year}-${monthStr}-${dayStr}`
      })
    )
  )

/**
 * Generate valid dias vigencia (positive integers)
 */
const diasVigenciaArb: fc.Arbitrary<number> = fc.integer({ min: 1, max: 365 })

/**
 * Generate valid AlumnoDTO objects
 */
const alumnoArb: fc.Arbitrary<AlumnoDTO> = fc.record({
  idAlumno: fc.uuid(),
  idUsuario: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 100 }),
  correo: fc.emailAddress(),
  numeroDocumento: fc.stringMatching(/^[0-9A-Za-z]{5,20}$/),
  telefono: fc.option(fc.string({ minLength: 7, maxLength: 15 }), { nil: undefined }),
})

/**
 * Generate valid TipoPaqueteDTO objects
 */
const tipoPaqueteArb: fc.Arbitrary<TipoPaqueteDTO> = fc.record({
  idTipoPaquete: fc.uuid(),
  nombre: fc.string({ minLength: 1, maxLength: 50 }),
  numeroClases: fc.integer({ min: 1, max: 100 }),
  diasVigencia: fc.integer({ min: 1, max: 365 }),
  precio: fc.float({ min: 0, max: 100000, noNaN: true }),
  activo: fc.boolean(),
})

// ============================================
// PROPERTY TESTS
// ============================================

/**
 * **Feature: admin-packages-integration, Property 13: Fecha Fin Auto-Calculation**
 * **Validates: Requirements 5.3**
 *
 * *For any* tipo paquete selection in the create form, the fecha fin SHALL be
 * calculated as `fechaInicio + diasVigencia` days from the selected tipo paquete.
 */
describe('Property 13: Fecha Fin Auto-Calculation', () => {
  it('should calculate fecha fin as fechaInicio + diasVigencia days', () => {
    fc.assert(
      fc.property(validDateArb, diasVigenciaArb, (fechaInicio, diasVigencia) => {
        const fechaFin = calculateFechaFin(fechaInicio, diasVigencia)

        // Parse dates
        const startDate = new Date(fechaInicio)
        const endDate = new Date(fechaFin)

        // Calculate expected end date
        const expectedEndDate = new Date(startDate)
        expectedEndDate.setDate(expectedEndDate.getDate() + diasVigencia)

        // Compare dates (ignoring time)
        expect(endDate.toISOString().split('T')[0]).toBe(
          expectedEndDate.toISOString().split('T')[0]
        )

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return empty string for empty fechaInicio', () => {
    fc.assert(
      fc.property(diasVigenciaArb, (diasVigencia) => {
        const fechaFin = calculateFechaFin('', diasVigencia)
        expect(fechaFin).toBe('')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return empty string for zero or negative diasVigencia', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: -365, max: 0 }),
        (fechaInicio, diasVigencia) => {
          const fechaFin = calculateFechaFin(fechaInicio, diasVigencia)
          expect(fechaFin).toBe('')
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty string for invalid date string', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => isNaN(Date.parse(s))),
        diasVigenciaArb,
        (invalidDate, diasVigencia) => {
          const fechaFin = calculateFechaFin(invalidDate, diasVigencia)
          expect(fechaFin).toBe('')
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should produce a date that is exactly diasVigencia days after fechaInicio', () => {
    fc.assert(
      fc.property(validDateArb, diasVigenciaArb, (fechaInicio, diasVigencia) => {
        const fechaFin = calculateFechaFin(fechaInicio, diasVigencia)

        const startDate = new Date(fechaInicio)
        const endDate = new Date(fechaFin)

        // Calculate difference in days
        const diffTime = endDate.getTime() - startDate.getTime()
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

        expect(diffDays).toBe(diasVigencia)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should always return a date in YYYY-MM-DD format when valid inputs', () => {
    fc.assert(
      fc.property(validDateArb, diasVigenciaArb, (fechaInicio, diasVigencia) => {
        const fechaFin = calculateFechaFin(fechaInicio, diasVigencia)

        // Check format: YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        expect(fechaFin).toMatch(dateRegex)

        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-packages-integration, Property 15: Form Validation - Required Fields**
 * **Validates: Requirements 5.7**
 *
 * *For any* form submission attempt where `idAlumno`, `idTipoPaquete`, or `fechaInicio`
 * is empty, the submission SHALL be prevented and validation errors SHALL be displayed.
 */
describe('Property 15: Form Validation - Required Fields', () => {
  it('should return error for empty idAlumno', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        validDateArb,
        fc.string(),
        (idTipoPaquete, fechaInicio, notasInternas) => {
          const formData: PaqueteFormData = {
            idAlumno: '',
            idTipoPaquete,
            fechaInicio,
            fechaFin: '',
            notasInternas,
          }

          const errors = validateRequiredFields(formData)

          expect(errors.idAlumno).toBeDefined()
          expect(errors.idAlumno).toBe('El alumno es requerido')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return error for empty idTipoPaquete', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        validDateArb,
        fc.string(),
        (idAlumno, fechaInicio, notasInternas) => {
          const formData: PaqueteFormData = {
            idAlumno,
            idTipoPaquete: '',
            fechaInicio,
            fechaFin: '',
            notasInternas,
          }

          const errors = validateRequiredFields(formData)

          expect(errors.idTipoPaquete).toBeDefined()
          expect(errors.idTipoPaquete).toBe('El tipo de paquete es requerido')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return error for empty fechaInicio', () => {
    fc.assert(
      fc.property(fc.uuid(), fc.uuid(), fc.string(), (idAlumno, idTipoPaquete, notasInternas) => {
        const formData: PaqueteFormData = {
          idAlumno,
          idTipoPaquete,
          fechaInicio: '',
          fechaFin: '',
          notasInternas,
        }

        const errors = validateRequiredFields(formData)

        expect(errors.fechaInicio).toBeDefined()
        expect(errors.fechaInicio).toBe('La fecha de inicio es requerida')

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return no errors when all required fields are filled', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        validDateArb,
        fc.string(),
        (idAlumno, idTipoPaquete, fechaInicio, notasInternas) => {
          const formData: PaqueteFormData = {
            idAlumno,
            idTipoPaquete,
            fechaInicio,
            fechaFin: '',
            notasInternas,
          }

          const errors = validateRequiredFields(formData)

          expect(errors.idAlumno).toBeUndefined()
          expect(errors.idTipoPaquete).toBeUndefined()
          expect(errors.fechaInicio).toBeUndefined()
          expect(Object.keys(errors)).toHaveLength(0)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return multiple errors when multiple required fields are empty', () => {
    const formData: PaqueteFormData = {
      idAlumno: '',
      idTipoPaquete: '',
      fechaInicio: '',
      fechaFin: '',
      notasInternas: '',
    }

    const errors = validateRequiredFields(formData)

    expect(errors.idAlumno).toBeDefined()
    expect(errors.idTipoPaquete).toBeDefined()
    expect(errors.fechaInicio).toBeDefined()
    expect(Object.keys(errors)).toHaveLength(3)
  })

  it('should treat whitespace-only strings as empty', () => {
    // Generate whitespace-only strings using array of whitespace chars
    const whitespaceArb = fc
      .array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 })
      .map((chars) => chars.join(''))

    fc.assert(
      fc.property(whitespaceArb, whitespaceArb, whitespaceArb, (idAlumno, idTipoPaquete, fechaInicio) => {
        const formData: PaqueteFormData = {
          idAlumno,
          idTipoPaquete,
          fechaInicio,
          fechaFin: '',
          notasInternas: '',
        }

        const errors = validateRequiredFields(formData)

        // All whitespace-only fields should be treated as empty
        expect(errors.idAlumno).toBeDefined()
        expect(errors.idTipoPaquete).toBeDefined()
        expect(errors.fechaInicio).toBeDefined()

        return true
      }),
      { numRuns: 100 }
    )
  })
})

// ============================================
// ADDITIONAL HELPER FUNCTION TESTS
// ============================================

describe('getTodayDate', () => {
  it('should return a date in YYYY-MM-DD format', () => {
    const today = getTodayDate()
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    expect(today).toMatch(dateRegex)
  })

  it('should return today\'s date', () => {
    const today = getTodayDate()
    const expected = new Date().toISOString().split('T')[0]
    expect(today).toBe(expected)
  })
})

describe('formatAlumnoDisplay', () => {
  it('should format alumno as nombre - numeroDocumento', () => {
    fc.assert(
      fc.property(alumnoArb, (alumno) => {
        const display = formatAlumnoDisplay(alumno)
        const expected = `${alumno.nombre} - ${alumno.numeroDocumento}`
        expect(display).toBe(expected)
        return true
      }),
      { numRuns: 100 }
    )
  })
})

describe('formatTipoPaqueteDisplay', () => {
  it('should format tipo paquete as nombre (numeroClases clases)', () => {
    fc.assert(
      fc.property(tipoPaqueteArb, (tipo) => {
        const display = formatTipoPaqueteDisplay(tipo)
        const expected = `${tipo.nombre} (${tipo.numeroClases} clases)`
        expect(display).toBe(expected)
        return true
      }),
      { numRuns: 100 }
    )
  })
})
