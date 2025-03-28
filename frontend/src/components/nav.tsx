import { CircleUserRound, MapPin, Store } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useNavContext } from '../providers/NavProvider'

export default function NavBar() {
  const { show } = useNavContext()
  if (!show) return null
  return (
    <nav className="fixed ui  bottom-0 bg-[#FAFAFA] w-full md:w-100 px-15 h-15 flex items-center justify-between text-gray04 [&>*]:hover:cursor-pointer  ml-[50%] transform -translate-x-1/2 md:rounded-t-2xl shadow-lg text-xs">
      <NavLink to="/" className="flex flex-col items-center justify-center">
        <MapPin size={28} strokeWidth={3} />
        Mapa
      </NavLink>
      <NavLink
        to="/sellers"
        className="flex flex-col items-center justify-center"
      >
        <Store size={28} strokeWidth={3} />
        Vendedores
      </NavLink>
      <NavLink to="/user" className="flex flex-col items-center justify-center">
        <CircleUserRound size={28} strokeWidth={3} />
        Você
      </NavLink>
    </nav>
  )
}
