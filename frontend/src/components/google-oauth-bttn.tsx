import axios from 'axios'
import GoogleLogo from '../assets/google-g-logo.svg'
import { Button } from './button'

export default function GoogleOAuthButton() {
  const API_URL = import.meta.env.VITE_API_URL
  async function googleOAuth() {
    try {
      const response = await axios.post(`${API_URL}/request-oauth/google`)
      window.location.href = response.data.url
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      type="button"
      onClick={() => googleOAuth()}
      className="bg-white text-black border-2 border-gray05 hover:bg-gray06"
    >
      <img
        src={GoogleLogo}
        alt="Google logo"
        className="w-5 h-5 mr-2 inline-block align-middle"
      />
      <p className="flex items-center justify-center w-full">
        Continuar com o Google
      </p>
    </Button>
  )
}
