import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { getUser } from './http/api'
import { useUserContext } from './providers/UserProvider'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import './App.css'
import { Frown } from 'lucide-react'
import LoadingOverlay from './components/loading-overlay'
import NavBar from './components/nav'
import { useLoadingContext } from './providers/LoadingProvider'
import EditSeller from './routes/EditSeller'
import NewSeller from './routes/NewSeller'
import SellerPage from './routes/SellerPage'
import Sellers from './routes/Sellers'
import UserProfile from './routes/UserProfile'

function NotFound() {
  return (
    <div>
      <h1 className="flex items-center justify-center flex-col text-2xl h-screen">
        404 Page Not Found
        <Frown size={35} />
      </h1>
    </div>
  )
}
export default function App() {
  const { setUser } = useUserContext()
  const { setLoading } = useLoadingContext()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await getUser()
        setUser(response.data)
      } catch (error) {
        setUser(undefined)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [setUser, setLoading])

  return (
    <BrowserRouter>
      <NavBar />
      <Content />
    </BrowserRouter>
  )
}

const Content = () => {
  const { loading } = useLoadingContext()

  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location.search !== displayLocation.search) setDisplayLocation(location)

    if (location.pathname !== displayLocation.pathname)
      setTransitionStage('fadeOut')
  }, [location, displayLocation])

  return (
    <div
      className={`${transitionStage} w-[100dvw] h-[100dvh]`}
      onAnimationEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn')
          setDisplayLocation(location)
        }
      }}
    >
      {loading && <LoadingOverlay />}
      <Routes location={displayLocation}>
        <Route path="" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="sellers/:id" element={<SellerPage />} />

        <Route path="sellers/:id/edit" element={<EditSeller />} />
        <Route path="new-seller" element={<NewSeller />} />
        <Route path="user" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
