import { LogOut } from 'lucide-react'
import { IconButton } from '../../components/icon-button'
import LandingPage from '../../components/landing-page'
import NavBar from '../../components/nav'
import { logoutUser } from '../../http/api'
import { useUserContext } from '../../providers/UserProvider'

export default function UserProfile() {
  const { user, setUser } = useUserContext()

  async function logOff() {
    await logoutUser()
    setUser(undefined)
  }

  return (
    <>
      {user ? (
        <span>
          <NavBar />

          <div className="flex flex-col items-center justify-center  space-y-4">
            <h1 className="text-3xl font-semibold p-5">Minha Conta</h1>
            <h2 className="text-2xl pb-5">Olá, {user?.username}.</h2>
            <IconButton onClick={logOff} className="text-danger border-danger">
              <LogOut size={24} />
              Sair
            </IconButton>
          </div>
        </span>
      ) : (
        <LandingPage />
      )}
    </>
  )
}
