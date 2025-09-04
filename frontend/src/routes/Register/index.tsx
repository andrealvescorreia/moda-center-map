import { NavLink, Navigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { useUserContext } from '../../providers/UserProvider'
import RegistrationForm from './register-form'

export default function Register() {
  const { user } = useUserContext()
  if (user) {
    return <Navigate to="/user" replace />
  }
  return (
    <div className="flex md:justify-center items-center h-screen flex-col">
      <NavLink className="flex items-center p-4 gap-1" to={'/'}>
        <img src={Logo} alt="Logo" className="w-6" />
        <h1 className="text-2xl font-bold text-green-secondary italic font-plus-jakarta-sans">
          ModaCenterMap
        </h1>
      </NavLink>

      <RegistrationForm />
      <div className="w-full flex justify-center pt-2">
        <NavLink
          to="/login"
          className="text-green-secondary underline text-lg font-semibold"
        >
          Já possui uma conta?
        </NavLink>
      </div>
    </div>
  )
}
