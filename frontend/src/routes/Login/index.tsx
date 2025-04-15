import { NavLink, Navigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { useUserContext } from '../../providers/UserProvider'
import LoginForm from './login-form'

export default function Login() {
  const { user } = useUserContext()
  if (user) {
    return <Navigate to="/user" replace />
  }

  return (
    <div className="flex md:justify-center md:items-center h-screen flex-col">
      <NavLink className="flex items-center p-2 gap-1" to={'/'}>
        <img src={Logo} alt="Logo" className="w-6" />
        <h1 className="text-2xl font-bold text-green-secondary italic font-plus-jakarta-sans">
          ModaCenterMap
        </h1>
      </NavLink>

      <LoginForm />
      <div className="w-full flex justify-center pt-2 ">
        <NavLink
          to="/register"
          className="text-green-secondary text-lg underline font-semibold"
        >
          Ainda não tem uma conta?
        </NavLink>
      </div>
    </div>
  )
}
