import React from 'react'
import type { ReactNode } from 'react'

const ClickContext = React.createContext<{
  clickLocation?: ClickLocationType
  setClickLocation: React.Dispatch<
    React.SetStateAction<ClickLocationType | undefined>
  >
}>({
  clickLocation: undefined,
  setClickLocation: () => {},
})

interface ClickLocationType {
  lat: number
  lng: number
}

const ClickProvider = ({ children }: { children: ReactNode }) => {
  const [clickLocation, setClickLocation] = React.useState<ClickLocationType>()
  return (
    <ClickContext.Provider value={{ clickLocation, setClickLocation }}>
      {children}
    </ClickContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useClickContext = () => React.useContext(ClickContext)

export default ClickProvider
