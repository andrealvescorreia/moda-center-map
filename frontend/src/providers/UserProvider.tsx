import React from 'react'
import type { ReactNode } from 'react'
import type User from '../interfaces/User'

const UserContext = React.createContext<{
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}>({
  user: undefined,
  setUser: () => {},
})

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User>()
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => React.useContext(UserContext)

export default UserProvider
