import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { Button } from './button'

export default function LandingPage() {
  return (
    <div className=" w-full h-full flex-col flex items-center justify-center p-2 gap-20 md:gap-10">
      <NavLink className="flex pt-4" to="/">
        <img src={Logo} alt="Logo" className="w-6" />
        <h1 className="text-3xl font-bold text-green-secondary italic font-plus-jakarta-sans text-center">
          ModaCenterMap
        </h1>
      </NavLink>
      <h2 className="text-3xl text-center md:w-100 text-black px-3">
        Entre no <i>ModaCenterMap</i> para salvar seus vendedores favoritos.
      </h2>
      <div className="w-full flex flex-col gap-4 items-center h-full pt-23 md:pt-2">
        <NavLink to="/login" className="w-80">
          <Button className="justify-center text-xl">Entrar</Button>
        </NavLink>
        Ou
        <NavLink to="/register" className="w-80">
          <Button className="justify-center text-xl bg-white text-green-secondary border-2 hover:text-white hover:bg-green-primary">
            Criar conta
          </Button>
        </NavLink>
      </div>
    </div>
  )
}
