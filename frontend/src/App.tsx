import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getUser } from './http/api'
import { useUserContext } from './providers/UserProvider'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import './App.css'
import LoadingOverlay from './components/loading-overlay'
import NavBar from './components/nav'
import { useLoadingContext } from './providers/LoadingProvider'
import RouteProvider from './providers/RouteProvider'
import NewSeller from './routes/NewSeller'
import Seller from './routes/Seller'
import Sellers from './routes/Sellers'
import UserProfile from './routes/UserProfile'

function NotFound() {
  return (
    <div>
      <h1>404 Page Not Not Found</h1>
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
        <Route path="sellers/:id" element={<Seller />} />
        <Route path="new-seller" element={<NewSeller />} />
        <Route path="user" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
