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

  if (!user) return <LandingPage />

  return (
    <div>
      <NavBar />
      <h1>User Profile</h1>
      <p>Olá, {user?.username}</p>
      <button type="button" onClick={logOff}>
        Sair
      </button>
    </div>
  )
}
