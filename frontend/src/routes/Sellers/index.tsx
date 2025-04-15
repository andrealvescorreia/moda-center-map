import { Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import NavBar from '../../components/nav'
import { getSellers } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import { useLoadingContext } from '../../providers/LoadingProvider'
import { useNavContext } from '../../providers/NavProvider'
import SearchSeller from '../Home/search-seller'
import SellerList from './seller-list'

export default function Sellers() {
  const [sellers, setSellers] = useState<SellerResponse[]>([])
  const { loading, setLoading } = useLoadingContext()
  const { setShow } = useNavContext()
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    setShow(true)
  }, [setShow])

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true)
        const sellers = await getSellers('order_by=name&order=asc')
        setSellers(sellers)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [setLoading])

  if (isSearching) {
    return <SearchSeller onCancel={() => setIsSearching(false)} />
  }
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <NavBar />

      <div className="w-full">
        <div className="flex justify-center items-center h-18">
          <h1 className="text-2xl font-semibold">Vendedores</h1>
        </div>
        <div className="pb-4 md:absolute md:mt-0 mt-2 w-full px-2 md:max-w-125 md:top-0 ml-[50%] transform -translate-x-1/2">
          <InputRoot>
            <InputIcon>
              <Search />
            </InputIcon>
            <InputField
              placeholder="Buscar"
              onClick={() => setIsSearching(true)}
            />
          </InputRoot>
        </div>

        {sellers.length === 0 && !loading && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray02 text-2xl pt-10">
              Nenhum vendedor cadastrado
            </p>
          </div>
        )}
        <div className="pb-50">
          <SellerList
            sellers={sellers}
            onClick={(id) => navigate(`/sellers/${id}`)}
          />
        </div>
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
