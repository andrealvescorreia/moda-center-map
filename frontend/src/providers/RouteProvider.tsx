import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route } from '../interfaces/Route'

const RouteContext = React.createContext<{
  route?: Route
  setRoute: React.Dispatch<React.SetStateAction<Route | undefined>>
}>({
  route: undefined,
  setRoute: () => {},
})

function getStoredRoute() {
  const storedRoute = localStorage.getItem('local-route')
  if (storedRoute) {
    try {
      return JSON.parse(storedRoute)
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
