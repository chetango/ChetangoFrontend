// ============================================
// PROPERTY-BASED TESTS - USE ADMIN CLASSES HOOK
// ============================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
    calculateStats,
    filterClases,
    getClaseEstado,
    groupClasesByDate,
} from '../hooks/useAdminClasses'
import type { ClaseListItemDTO } from '../types/classTypes'

// ============================================
// ARBITRARIES FOR GENERATING TEST DATA
// ============================================

/**
 * Generate valid ISO 8601 date strings (YYYY-MM-DD)
 */
const isoDateArb = fc
  .tuple(
    fc.integer({ min: 2020, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(([y, m, d]) => `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`)

/**
 * Generate valid time strings in HH:mm:ss format
 */
const timeStringArb = fc
  .tuple(
    fc.integer({ min: 0, max: 23 }),
    fc.integer({ min: 0, max: 59 }),
    fc.integer({ min: 0, max: 59 })
  )
  .map(
    ([h, m, s]) =>
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  )

/**
 * Generate valid ClaseListItemDTO objects
 */
const claseListItemArb: fc.Arbitrary<ClaseListItemDTO> = fc.record({
  idClase: fc.uuid(),
  fecha: isoDateArb.map((d) => `${d}T00:00:00`),
  horaInicio: timeStringArb,
  horaFin: timeStringArb,
  tipoClase: fc.constantFrom('Tango', 'Milonga', 'Vals', 'Practica'),
  idProfesorPrincipal: fc.uuid(),
  nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }),
  cupoMaximo: fc.integer({ min: 1, max: 50 }),
  totalAsistencias: fc.integer({ min: 0, max: 50 }),
  estado: fc.constantFrom('Programada', 'EnCurso', 'Completada', 'Cancelada'),
})

/**
 * Generate array of ClaseListItemDTO with same date
 */
const clasesWithSameDateArb = (date: string) =>
  fc.array(
    fc.record({
      idClase: fc.uuid(),
      fecha: fc.constant(`${date}T00:00:00`),
      horaInicio: timeStringArb,
      horaFin: timeStringArb,
      tipoClase: fc.constantFrom('Tango', 'Milonga', 'Vals', 'Practica'),
      idProfesorPrincipal: fc.uuid(),
      nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }),
      cupoMaximo: fc.integer({ min: 1, max: 50 }),
      totalAsistencias: fc.integer({ min: 0, max: 50 }),
      estado: fc.constantFrom('Programada', 'EnCurso', 'Completada', 'Cancelada'),
    }),
    { minLength: 1, maxLength: 10 }
  )

// ============================================
// PROPERTY 5: Classes Grouped by Date
// Feature: admin-classes-integration
// Validates: Requirements 3.4
// ============================================

/**
 * **Feature: admin-classes-integration, Property 5: Classes Grouped by Date**
 * **Validates: Requirements 3.4**
 *
 * *For any* list of classes returned from the API, the UI SHALL group them by date
 * and sort each group by horaInicio ascending.
 */
describe('Property 5: Classes Grouped by Date', () => {
  it('should group all classes by their date', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 0, maxLength: 20 }), (clases) => {
        const grouped = groupClasesByDate(clases)

        // Every class should be in exactly one group
        let totalInGroups = 0
        Object.values(grouped).forEach((group) => {
          totalInGroups += group.length
        })
        expect(totalInGroups).toBe(clases.length)

        // Each group key should match the date of all classes in that group
        Object.entries(grouped).forEach(([date, groupClases]) => {
          groupClases.forEach((clase) => {
            expect(clase.fecha.split('T')[0]).toBe(date)
          })
        })

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should sort classes within each group by horaInicio ascending', () => {
    fc.assert(
      fc.property(isoDateArb, (date) => {
        return fc.assert(
          fc.property(clasesWithSameDateArb(date), (clases) => {
            const grouped = groupClasesByDate(clases)
            const group = grouped[date]

            if (group && group.length > 1) {
              for (let i = 1; i < group.length; i++) {
                expect(group[i].horaInicio >= group[i - 1].horaInicio).toBe(true)
              }
            }

            return true
          }),
          { numRuns: 10 }
        )
      }),
      { numRuns: 10 }
    )
  })

  it('should return empty object for empty input', () => {
    const grouped = groupClasesByDate([])
    expect(grouped).toEqual({})
  })

  it('should preserve all class properties after grouping', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 1, maxLength: 10 }), (clases) => {
        const grouped = groupClasesByDate(clases)

        // Flatten grouped classes
        const flattenedClases: ClaseListItemDTO[] = []
        Object.values(grouped).forEach((group) => {
          flattenedClases.push(...group)
        })

        // Each original class should exist in flattened result
        clases.forEach((originalClase) => {
          const found = flattenedClases.find((c) => c.idClase === originalClase.idClase)
          expect(found).toBeDefined()
          expect(found?.tipoClase).toBe(originalClase.tipoClase)
          expect(found?.cupoMaximo).toBe(originalClase.cupoMaximo)
        })

        return true
      }),
      { numRuns: 100 }
    )
  })
})


// ============================================
// PROPERTY 7: Estado Badge Mapping
// Feature: admin-classes-integration
// Validates: Requirements 3.5
// ============================================

/**
 * **Feature: admin-classes-integration, Property 7: Estado Badge Mapping**
 * **Validates: Requirements 3.5**
 *
 * *For any* clase, the estado badge SHALL be: "Hoy" (red) if fecha equals today,
 * "Programada" (purple) if fecha is future, "Completada" (green) if fecha is past.
 */
describe('Property 7: Estado Badge Mapping', () => {
  it('should return "hoy" for classes with today\'s date', () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const hoyStr = hoy.toISOString().split('T')[0]

    fc.assert(
      fc.property(timeStringArb, () => {
        const estado = getClaseEstado(`${hoyStr}T00:00:00`)
        expect(estado).toBe('hoy')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return "programada" for classes with future dates', () => {
    // Generate dates in the future (next year to be safe)
    const futureYear = new Date().getFullYear() + 1
    const futureDateArb = fc
      .tuple(fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }))
      .map(([m, d]) => `${futureYear}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`)

    fc.assert(
      fc.property(futureDateArb, (fecha) => {
        const estado = getClaseEstado(`${fecha}T00:00:00`)
        expect(estado).toBe('programada')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return "completada" for classes with past dates', () => {
    // Generate dates in the past (last year to be safe)
    const pastYear = new Date().getFullYear() - 1
    const pastDateArb = fc
      .tuple(fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }))
      .map(([m, d]) => `${pastYear}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`)

    fc.assert(
      fc.property(pastDateArb, (fecha) => {
        const estado = getClaseEstado(`${fecha}T00:00:00`)
        expect(estado).toBe('completada')
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should only return valid estado values', () => {
    fc.assert(
      fc.property(isoDateArb, (fecha) => {
        const estado = getClaseEstado(`${fecha}T00:00:00`)
        expect(['hoy', 'programada', 'completada', 'cancelada']).toContain(estado)
        return true
      }),
      { numRuns: 100 }
    )
  })
})

// ============================================
// PROPERTY 14: Search Filter Behavior
// Feature: admin-classes-integration
// Validates: Requirements 8.1, 8.7
// ============================================

/**
 * **Feature: admin-classes-integration, Property 14: Search Filter Behavior**
 * **Validates: Requirements 8.1, 8.7**
 *
 * *For any* search term entered, the filtered results SHALL include only classes
 * whose tipoClase contains the search term (case-insensitive).
 */
describe('Property 14: Search Filter Behavior', () => {
  it('should return all classes when search term is empty', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 0, maxLength: 20 }), (clases) => {
        const filtered = filterClases(clases, '', 'todos', '')
        expect(filtered.length).toBe(clases.length)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should filter classes by tipoClase case-insensitively', () => {
    fc.assert(
      fc.property(
        fc.array(claseListItemArb, { minLength: 1, maxLength: 20 }),
        fc.constantFrom('tango', 'TANGO', 'Tango', 'TaNgO', 'milonga', 'MILONGA'),
        (clases, searchTerm) => {
          const filtered = filterClases(clases, searchTerm, 'todos', '')

          // All filtered classes should contain the search term (case-insensitive)
          filtered.forEach((clase) => {
            expect(clase.tipoClase.toLowerCase()).toContain(searchTerm.toLowerCase())
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no classes match search term', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 0, maxLength: 10 }), (clases) => {
        // Use a search term that won't match any of our test tipos
        const filtered = filterClases(clases, 'ZZZZNONEXISTENT', 'todos', '')
        expect(filtered.length).toBe(0)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should filter by tipo when filterTipo is not "todos"', () => {
    fc.assert(
      fc.property(
        fc.array(claseListItemArb, { minLength: 1, maxLength: 20 }),
        fc.constantFrom('Tango', 'Milonga', 'Vals', 'Practica'),
        (clases, filterTipo) => {
          const filtered = filterClases(clases, '', filterTipo, '')

          // All filtered classes should have the exact tipo
          filtered.forEach((clase) => {
            expect(clase.tipoClase).toBe(filterTipo)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should filter by fecha when filterFecha is provided', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 1, maxLength: 20 }), isoDateArb, (clases, filterFecha) => {
        const filtered = filterClases(clases, '', 'todos', filterFecha)

        // All filtered classes should have fecha starting with filterFecha
        filtered.forEach((clase) => {
          expect(clase.fecha.startsWith(filterFecha)).toBe(true)
        })

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should combine multiple filters correctly', () => {
    fc.assert(
      fc.property(
        fc.array(claseListItemArb, { minLength: 1, maxLength: 20 }),
        fc.constantFrom('Tango', 'Milonga'),
        isoDateArb,
        (clases, filterTipo, filterFecha) => {
          const filtered = filterClases(clases, '', filterTipo, filterFecha)

          // All filtered classes should match both filters
          filtered.forEach((clase) => {
            expect(clase.tipoClase).toBe(filterTipo)
            expect(clase.fecha.startsWith(filterFecha)).toBe(true)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ============================================
// PROPERTY 15: Stats Calculation Accuracy
// Feature: admin-classes-integration
// Validates: Requirements 9.1, 9.2
// ============================================

/**
 * **Feature: admin-classes-integration, Property 15: Stats Calculation Accuracy**
 * **Validates: Requirements 9.1, 9.2**
 *
 * *For any* loaded classes list, the stats SHALL correctly calculate:
 * clasesHoy (classes with today's date), clasesSemana (classes within next 7 days).
 */
describe('Property 15: Stats Calculation Accuracy', () => {
  it('should count clasesHoy correctly', () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const hoyStr = hoy.toISOString().split('T')[0]

    // Generate some classes for today
    const clasesHoyArb = fc.array(
      fc.record({
        idClase: fc.uuid(),
        fecha: fc.constant(`${hoyStr}T00:00:00`),
        horaInicio: timeStringArb,
        horaFin: timeStringArb,
        tipoClase: fc.constantFrom('Tango', 'Milonga'),
        idProfesorPrincipal: fc.uuid(),
        nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }),
        cupoMaximo: fc.integer({ min: 1, max: 50 }),
        totalAsistencias: fc.integer({ min: 0, max: 50 }),
        estado: fc.constantFrom('Programada', 'EnCurso', 'Completada', 'Cancelada'),
      }),
      { minLength: 0, maxLength: 10 }
    )

    fc.assert(
      fc.property(clasesHoyArb, (clases) => {
        const stats = calculateStats(clases)
        expect(stats.clasesHoy).toBe(clases.length)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return zero for clasesHoy when no classes are today', () => {
    // Generate classes for past dates only
    const pastYear = new Date().getFullYear() - 1
    const pastClasesArb = fc.array(
      fc.record({
        idClase: fc.uuid(),
        fecha: fc
          .tuple(fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }))
          .map(([m, d]) => `${pastYear}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T00:00:00`),
        horaInicio: timeStringArb,
        horaFin: timeStringArb,
        tipoClase: fc.constantFrom('Tango', 'Milonga'),
        idProfesorPrincipal: fc.uuid(),
        nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }),
        cupoMaximo: fc.integer({ min: 1, max: 50 }),
        totalAsistencias: fc.integer({ min: 0, max: 50 }),
        estado: fc.constantFrom('Programada', 'EnCurso', 'Completada', 'Cancelada'),
      }),
      { minLength: 0, maxLength: 10 }
    )

    fc.assert(
      fc.property(pastClasesArb, (clases) => {
        const stats = calculateStats(clases)
        expect(stats.clasesHoy).toBe(0)
        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should return stats object with all required fields', () => {
    fc.assert(
      fc.property(fc.array(claseListItemArb, { minLength: 0, maxLength: 20 }), (clases) => {
        const stats = calculateStats(clases)

        expect(typeof stats.clasesHoy).toBe('number')
        expect(typeof stats.clasesSemana).toBe('number')
        expect(typeof stats.clasesCanceladas).toBe('number')

        expect(stats.clasesHoy).toBeGreaterThanOrEqual(0)
        expect(stats.clasesSemana).toBeGreaterThanOrEqual(0)
        expect(stats.clasesCanceladas).toBeGreaterThanOrEqual(0)

        return true
      }),
      { numRuns: 100 }
    )
  })

  it('should have clasesSemana >= clasesHoy (today is within the week)', () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const hoyStr = hoy.toISOString().split('T')[0]

    // Generate mix of today and future classes
    const mixedClasesArb = fc.array(
      fc.record({
        idClase: fc.uuid(),
        fecha: fc.oneof(
          fc.constant(`${hoyStr}T00:00:00`),
          // Future dates within a week
          fc.integer({ min: 1, max: 6 }).map((days) => {
            const future = new Date(hoy.getTime() + days * 24 * 60 * 60 * 1000)
            return `${future.toISOString().split('T')[0]}T00:00:00`
          })
        ),
        horaInicio: timeStringArb,
        horaFin: timeStringArb,
        tipoClase: fc.constantFrom('Tango', 'Milonga'),
        idProfesorPrincipal: fc.uuid(),
        nombreProfesor: fc.string({ minLength: 3, maxLength: 50 }),
        cupoMaximo: fc.integer({ min: 1, max: 50 }),
        totalAsistencias: fc.integer({ min: 0, max: 50 }),
        estado: fc.constantFrom('Programada', 'EnCurso', 'Completada', 'Cancelada'),
      }),
      { minLength: 0, maxLength: 20 }
    )

    fc.assert(
      fc.property(mixedClasesArb, (clases) => {
        const stats = calculateStats(clases)
        expect(stats.clasesSemana).toBeGreaterThanOrEqual(stats.clasesHoy)
        return true
      }),
      { numRuns: 100 }
    )
  })
})
