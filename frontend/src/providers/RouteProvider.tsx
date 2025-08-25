import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route } from '../interfaces/Route'
import { ModaCenterGridMap } from '../models/ModaCenterGridMap'

const RouteContext = React.createContext<{
  route?: Route
  setRoute: React.Dispatch<React.SetStateAction<Route | undefined>>
}>({
  route: undefined,
  setRoute: () => {},
})

const gridMap = new ModaCenterGridMap()

function getStoredRoute() {
  const storedRoute = localStorage.getItem('local-route')
  if (storedRoute) {
    try {
      const route: Route = JSON.parse(storedRoute)
      if (!route) return undefined
      for (const destino of route.destinos) {
        if (!destino.sellingLocation) continue
        const restoredSellingLocation = gridMap.getSellingLocation(
          destino.sellingLocation
        )
        if (!restoredSellingLocation) return undefined
        // when the sellingLocation is a Store that was restored from localStorage,
        // it does not have the getEntrance() method. So we must restore it.
        destino.sellingLocation = restoredSellingLocation
      }
      return route as Route
    } catch (e) {
      console.error('Failed to parse stored route:', e)
    }
  }
  return undefined
}

function setStoredRoute(route: Route) {
  localStorage.setItem('local-route', JSON.stringify(route))
}

const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<Route | undefined>(undefined)

  useEffect(() => {
    //retrieve storedRoute on load
    const storedRoute = getStoredRoute()
    if (storedRoute) setRoute(storedRoute)
  }, [])

  useEffect(() => {
    if (route) setStoredRoute(route)
  }, [route])

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRouteContext = () => React.useContext(RouteContext)

export default RouteProvider
