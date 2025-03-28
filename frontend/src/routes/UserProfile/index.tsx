import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import LandingPage from '../../components/landing-page'
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
  useEffect(() => {
    setShow(true)
  }, [setShow])
  async function fetchFavoriteSellers() {
    const sellers = await getFavorites()
    setFavoriteSellers(sellers)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchFavoriteSellers()
  }, [])

  async function logOff() {
    await logoutUser()
    setUser(undefined)
  }

  return (
    <>
      {user ? (
        <span>
          <NavBar />

          <div className="flex flex-col items-center justify-center  space-y-4">
            <h1 className="text-3xl font-semibold p-5">Minha Conta</h1>
            <h2 className="text-2xl pb-5">Olá, {user?.username}.</h2>
            <IconButton onClick={logOff} className="text-danger border-danger">
              <LogOut size={24} />
              Sair
            </IconButton>
          </div>
          {favoriteSellers.length > 0 && (
            <div className="flex flex-col items-center justify-center pt-10">
              <h2 className="text-xl font-semibold ">Vendedores Favoritos</h2>
              <SellerList
                sellers={favoriteSellers}
                onClick={(sellerId) => navigate(`/sellers/${sellerId}`)}
              />
            </div>
          )}
        </span>
      ) : (
        <LandingPage />
      )}
    </>
  )
}
