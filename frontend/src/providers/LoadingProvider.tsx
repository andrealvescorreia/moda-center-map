import React from 'react'
import type { ReactNode } from 'react'

const LoadingContext = React.createContext<{
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}>({
  loading: false,
  setLoading: () => {},
})

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLoadingContext = () => React.useContext(LoadingContext)

export default LoadingProvider
