import React, { useState } from 'react'
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
  const [route, setRoute] = useState<Route>()

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRouteContext = () => React.useContext(RouteContext)

export default RouteProvider
