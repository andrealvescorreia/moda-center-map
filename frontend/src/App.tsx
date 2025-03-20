import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getUser } from './http/api'
import { useUserContext } from './providers/UserProvider'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import './App.css'
import NavBar from './components/nav'
import NewSeller from './routes/NewSeller'
import Sellers from './routes/Sellers'

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser()
        setUser(response.data)
      } catch (error) {
        setUser(undefined)
        console.log(error)
      }
    }
    fetchUser()
  }, [setUser])

  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="sellers" element={<Sellers />} />
      <Route path="sellers/new" element={<NewSeller />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
