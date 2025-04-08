import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import NavBar from '../../components/nav'
import { getSellers } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import { useLoadingContext } from '../../providers/LoadingProvider'
import { useNavContext } from '../../providers/NavProvider'
import SellerList from './seller-list'

export default function Sellers() {
  const [sellers, setSellers] = useState<SellerResponse[]>([])
  const { loading, setLoading } = useLoadingContext()
  const { setShow } = useNavContext()
  const navigate = useNavigate()
  useEffect(() => {
    setShow(true)
  }, [setShow])

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true)
      const sellers = await getSellers('order_by=name&order=asc')
      setSellers(sellers)
      setLoading(false)
    }
    fetchSellers()
  }, [setLoading])

  return (
    <div className="h-[100dvh] w-[100dvw]">
      <NavBar />

      <div className="w-full">
        <div className="flex justify-center items-center h-18">
          <h1 className="text-2xl font-semibold">Vendedores</h1>
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
          className="fixed bottom-18 ml-[50%] transform -translate-x-1/2"
        >
          <IconButton className="bg-gray06 h-14 px-8 font-semibold border-none text-green-secondary shadow-lg hover:bg-gray07">
            <Plus />
            Adicionar
          </IconButton>
        </NavLink>
      </div>
    </div>
  )
}
