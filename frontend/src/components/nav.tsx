import { CircleUserRound, MapPin, Store } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useNavContext } from '../providers/NavProvider'

export default function NavBar() {
  const { show } = useNavContext()
  if (!show) return null
  return (
    <nav className="fixed ui  bottom-0 bg-[#FAFAFA] w-full md:w-100 px-15 h-20 flex items-center justify-between text-gray04 [&>*]:hover:cursor-pointer  ml-[50%] transform -translate-x-1/2 md:rounded-t-2xl shadow-lg">
      <NavLink to="/">
        <MapPin size={32} strokeWidth={3} />
      </NavLink>
      <NavLink to="/sellers">
        <Store size={32} strokeWidth={3} />
      </NavLink>
      <NavLink to="/user">
        <CircleUserRound size={32} strokeWidth={3} />
      </NavLink>
    </nav>
  )
}
