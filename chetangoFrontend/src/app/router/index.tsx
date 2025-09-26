// ============================================
// ROUTER INDEX - CHETANGO
// ============================================

import { createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { appRoutes } from './routes'
import type { AppRoute } from './routes'
import { RequireAuth, RequireRole, OnlyGuests } from './guards'

function wrap(r: AppRoute): RouteObject {
  const children = r.children?.map(wrap)
  const meta = r.meta ?? {}
  let element = r.element

  // Envolver en Suspense para lazy loading
  element = <Suspense fallback={<div>Cargando...</div>}>{element}</Suspense>

  // Aplicar guards según meta (orden: invitado -> auth -> rol)
  if (meta.onlyGuests) {
    element = (
      <>
        <OnlyGuests to={meta.redirectTo ?? '/dashboard'} />
        {element}
      </>
    )
  }
  if (meta.auth) {
    element = (
      <>
        <RequireAuth to={meta.redirectTo ?? '/login'} />
        {element}
      </>
    )
  }
  if (meta.anyRole || meta.allRole) {
    element = (
      <>
        <RequireRole 
          anyOf={meta.anyRole} 
          allOf={meta.allRole} 
          to={meta.redirectTo ?? '/dashboard'} 
        />
        {element}
      </>
    )
  }

  if (r.index) {
    return {
      index: true,
      element,
    }
  }
  
  return {
    path: r.path,
    element,
    children
  }
}

export const router = createBrowserRouter(appRoutes.map(wrap))