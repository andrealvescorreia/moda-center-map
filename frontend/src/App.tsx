import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
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
import RouteProvider from './providers/RouteProvider'
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
      <NavBar />
    </div>
  )
}
export default function App() {
  const { setUser } = useUserContext()
  const { loading, setLoading } = useLoadingContext()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await getUser()
        setUser(response.data)
      } catch (error) {
        setUser(undefined)
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [setUser, setLoading])

  return (
    <>
      {loading && <LoadingOverlay />}
      <Routes>
        <Route
          path=""
          element={
            <RouteProvider>
              <Home />
            </RouteProvider>
          }
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="sellers" element={<Sellers />} />
        <Route
          path="sellers/:id"
          element={
            <RouteProvider>
              <SellerPage />
            </RouteProvider>
          }
        />

        <Route path="sellers/:id/edit" element={<EditSeller />} />
        <Route path="new-seller" element={<NewSeller />} />
        <Route path="user" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
