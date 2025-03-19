import Logo from '../../assets/logo.png'
import RegistrationForm from './register-form'

export default function Register() {
  return (
    <div className="flex md:justify-center md:items-center h-screen flex-col">
      <div className="flex items-center p-2 gap-1">
        <img src={Logo} alt="Logo" className="w-6" />
        <h1 className="text-2xl font-bold text-green-secondary italic font-plus-jakarta-sans">
          ModaCenterMap
        </h1>
      </div>

      <RegistrationForm />
    </div>
  )
}
