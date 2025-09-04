import { useNetworkState } from '@uidotdev/usehooks'
import { CloudOff, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import NavBar from '../../components/nav'
import { getFavorites, logoutUser } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import { useNavContext } from '../../providers/NavProvider'
import { useUserContext } from '../../providers/UserProvider'
import SellerList from '../Sellers/seller-list'

export default function UserProfile() {
  const { user, setUser } = useUserContext()
  const [favoriteSellers, setFavoriteSellers] = useState<SellerResponse[]>([])
  const navigate = useNavigate()
  const { setShow } = useNavContext()
  const network = useNetworkState()

  useEffect(() => {
    setShow(true)
  }, [setShow])

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  async function fetchFavoriteSellers() {
    const sellers = await getFavorites()
    setFavoriteSellers(sellers)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (user) fetchFavoriteSellers()
  }, [user])

  async function logOff() {
    setUser(undefined)
    await logoutUser()
  }

  if (!user) return null

  return (
    <span>
      <NavBar />

      <div className="flex flex-col items-center justify-center  space-y-4">
        <h1 className="text-3xl font-semibold p-5">Minha Conta</h1>
        <h2 className="text-2xl">
          Olá,{' '}
          {user?.type === 'local' ? user.username : user.name?.split(' ')[0]}
        </h2>
        {network.online ? (
          <IconButton onClick={logOff} className="text-danger border-danger">
            <LogOut size={24} />
            Sair
          </IconButton>
        ) : (
          <div className="bg-gray05 p-2 rounded-xl px-4 flex items-center justify-center gap-2">
            <CloudOff size={24} />
            <p className="">Você está offline</p>
          </div>
        )}
      </div>
      {favoriteSellers.length > 0 && (
        <div className="flex flex-col items-center justify-center pt-10 pb-50">
          <h2 className="text-xl font-semibold ">Vendedores Favoritos</h2>
          <SellerList
            sellers={favoriteSellers}
            onClick={(sellerId) => navigate(`/sellers/${sellerId}`)}
          />
        </div>
      )}
    </span>
  )
}
