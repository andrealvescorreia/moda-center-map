import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import NavBar from '../../components/nav'
import { getSellers } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import SellerList from './seller-list'

export default function Sellers() {
  const [sellers, setSellers] = useState<SellerResponse[]>([])

  useEffect(() => {
    const fetchSellers = async () => {
      const sellers = await getSellers()
      setSellers(sellers)
    }
    fetchSellers()
  }, [])

  return (
    <div className="relative h-full w-full">
      <NavBar />
      <SellerList sellers={sellers} onClick={(id) => console.log(id)} />
      <NavLink
        to="/sellers/new"
        className="fixed bottom-24 ml-[50%] transform -translate-x-1/2"
      >
        <IconButton className="bg-gray06 h-14 px-8 font-semibold border-none text-green-secondary shadow-lg hover:bg-gray07">
          <Plus />
          Adicionar
        </IconButton>
      </NavLink>
    </div>
  )
}
