import { ArrowLeft, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import { searchSeller } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import SellerList from '../Sellers/seller-list'
interface SearchProps {
  onCancel?: () => void
}

export default function Search({ onCancel }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sellers, setSellers] = useState<SellerResponse[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchTerm.length < 3) return
    setIsFetching(true)
    searchSeller(searchTerm)
      .then((res) => {
        setSellers(res)
      })
      .catch(console.error)
      .finally(() => {
        setIsFetching(false)
      })
  }, [searchTerm])

  return (
    <div className="ui absolute 100dvh 100dvw w-full h-full bg-white">
      <div className="md:absolute md:mt-0 mt-5   w-full px-5 md:max-w-125 md:top-0 ml-[50%] transform -translate-x-1/2">
        <InputRoot>
          <InputIcon>
            <ArrowLeft className="cursor-pointer" onClick={onCancel} />
          </InputIcon>
          <InputField
            placeholder="Busque pontos de venda"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.length > 0 && (
            <InputIcon>
              <CircleX
                className="cursor-pointer"
                onClick={() => setSearchTerm('')}
              />
            </InputIcon>
          )}
        </InputRoot>
      </div>
      <div>
        <SellerList
          sellers={sellers}
          onClick={(id) => {
            navigate(`/sellers/${id}`)
          }}
        />
      </div>
      {sellers.length === 0 && searchTerm.length >= 3 && !isFetching && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-03">Nenhum resultado encontrado</p>
        </div>
      )}
    </div>
  )
}
