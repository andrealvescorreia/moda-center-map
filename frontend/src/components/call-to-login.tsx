import { Link } from 'react-router-dom'

export default function CallToLogin() {
  return (
    <div className="absolute ui w-full h-12 px-5 bg-white font-bold  flex items-center justify-between">
      <span className=" font-plus-jakarta-sans italic text-gray04">
        ModaCenterMap
      </span>
      <Link
        to="/login"
        className="bg-green-primary text-white px-8 py-0.5 rounded-md"
      >
        Entrar
      </Link>
    </div>
  )
}
