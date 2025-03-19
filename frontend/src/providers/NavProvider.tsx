import React from 'react'
import type { ReactNode } from 'react'

const NavContext = React.createContext<{
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}>({
  show: true,
  setShow: () => {},
})

const NavProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = React.useState<boolean>(true)
  return (
    <NavContext.Provider value={{ show, setShow }}>
      {children}
    </NavContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNavContext = () => React.useContext(NavContext)

export default NavProvider
