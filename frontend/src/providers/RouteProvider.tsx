import { useLocalStorage } from '@uidotdev/usehooks'
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

const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [storedRoute, saveStoredRoute] = useLocalStorage<Route>('route', {
    inicio: null,
    destinos: [],
    passos: [],
  })
  const [route, setRoute] = useState<Route | undefined>(storedRoute)
  useEffect(() => {
    if (route) {
      saveStoredRoute(route)
    }
  }, [route, saveStoredRoute])
  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRouteContext = () => React.useContext(RouteContext)

export default RouteProvider
