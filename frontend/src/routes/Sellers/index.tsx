import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import NavBar from '../../components/nav'
import { getSellers } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import SellerList from './seller-list'

export default function Sellers() {
  const [sellers, setSellers] = useState<SellerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchSellers = async () => {
      const sellers = await getSellers()
      setSellers(sellers)
      setLoading(false)
    }
    fetchSellers()
  }, [])

  return (
    <div className="relative h-full w-full">
      <NavBar />
      <div className="flex justify-center items-center h-18">
        <h1 className="text-2xl">Vendedores</h1>
      </div>
      {sellers.length === 0 && !loading && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray02 text-2xl pt-10">
            Nenhum vendedor cadastrado
          </p>
        </div>
      )}
      <SellerList
        sellers={sellers}
        onClick={(id) => navigate(`/sellers/${id}`)}
      />
      <NavLink
        to="/new-seller"
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
