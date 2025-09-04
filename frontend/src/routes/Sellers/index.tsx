import { useNetworkState } from '@uidotdev/usehooks'
import { CloudOff, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
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
  const { setLoading } = useLoadingContext()
  const [doneFetching, setDoneFetching] = useState(false)
  const { setShow } = useNavContext()
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const network = useNetworkState()

  const [searchParams, setSearchParams] = useSearchParams()
  const state = searchParams.get('state')

  const enterSearchMode = () => setSearchParams({ state: 'search' })
  const clearState = () => setSearchParams({})

  useEffect(() => {
    if (state === 'search') {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [state])

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
        setDoneFetching(true)
      }
    }
    fetchSellers()
  }, [setLoading])

  if (isSearching) {
    return (
      <SearchSeller
        onCancel={() => {
          setIsSearching(false)
          clearState()
        }}
      />
    )
  }
  return (
    <div className="h-[100dvh] w-[100dvw] fixed overflow-y-auto">
      <NavBar />

      <div className="w-full">
        <div className="py-4 md:py-3 md:mt-0 w-[100%] px-2 ml-[50%] transform -translate-x-1/2 sticky top-0 z-100 bg-white border-b border-gray-200 flex justify-center">
          <InputRoot className="w-full md:max-w-125">
            <InputIcon>
              <Search />
            </InputIcon>
            <InputField
              placeholder="Buscar"
              onClick={() => {
                setIsSearching(true)
                enterSearchMode()
              }}
            />
          </InputRoot>
        </div>

        {sellers.length === 0 && doneFetching && (
          <div className="flex justify-center items-center h-full">
            {network.online ? (
              <p className="text-gray02 text-2xl pt-10">
                Nenhum vendedor cadastrado
              </p>
            ) : (
              <div className="bg-gray05 p-2 rounded-xl px-4 flex items-center justify-center gap-2">
                <CloudOff size={24} />
                <p>Você está offline</p>
              </div>
            )}
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
