import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'

gsap.registerPlugin(CSSPlugin)
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { ArrowLeft, CircleX, Map } from 'lucide-react'
import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { getFavorites, searchSeller } from '../../http/api'
import type { SellerResponse } from '../../http/responses'
import type { Boxe } from '../../interfaces/Boxe'
import type { Loja } from '../../interfaces/Loja'
import SellerList from '../../routes/Sellers/seller-list'
import { colorMap } from '../../utils/utils'
import { InputField, InputIcon, InputRoot } from '../input'

interface SearchStoreProps {
  onCancel?: () => void
  onChooseOnMap?: () => void
  onSellectSeller?: (sellerName: string, location: Boxe | Loja) => void
}

export function SearchStore({
  onChooseOnMap,
  onCancel,
  onSellectSeller,
}: SearchStoreProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sellers, setSellers] = useState<SellerResponse[]>([])
  const [favoriteSellers, setFavoriteSellers] = useState<SellerResponse[]>([])
  const isFetchingRef = useRef(false)

  async function fetchFavoriteSellers() {
    const sellers = await getFavorites()
    setFavoriteSellers(sellers)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchFavoriteSellers()
  }, [])

  useEffect(() => {
    if (searchTerm.length < 3) setSellers([])
    if (isFetchingRef.current || searchTerm.length < 3) return
    isFetchingRef.current = true
    searchSeller(searchTerm)
      .then((res) => {
        isFetchingRef.current = false
        setSellers(res)
      })
      .catch(console.error)
  }, [searchTerm])

  const element = useRef<HTMLDivElement>(null)
  useEffect(() => {
    gsap.fromTo(
      element.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    )
  }, [])

  function handleSelectSeller(sellerId: string, locationId?: string) {
    let seller = sellers.find((seller) => seller.id === sellerId)
    if (!seller) {
      seller = favoriteSellers.find((seller) => seller.id === sellerId)
    }
    if (!seller) return
    const location =
      seller.boxes.find((box) => box.id === locationId) ||
      seller.stores.find((store) => store.id === locationId)
    if (!location) return

    const setor = colorMap[location.sector_color] || 'Branco'
    if ('street_letter' in location) {
      const boxe: Boxe = {
        setor,
        rua: location.street_letter,
        numero: location.box_number,
        positionInGrid: { x: 0, y: 0 }, //unknown
      }
      onSellectSeller?.(seller.name, boxe)
    } else {
      const loja: Loja = {
        setor,
        bloco: location.block_number,
        numLoja: location.store_number,
        gridArea: [], //unknown
        getBounds: () => [], //unknown
        getEntrance: () => ({ x: 0, y: 0 }), //unknown
      }
      onSellectSeller?.(seller.name, loja)
    }
  }

  return (
    <div
      ref={element}
      className="ui absolute 100dvh 100dvw w-full h-full bg-white"
    >
      <div className="flex flex-col gap-4 p-4">
        <InputRoot>
          <InputIcon>
            <ArrowLeft className="cursor-pointer" onClick={onCancel} />
          </InputIcon>
          <InputField
            placeholder="Informe o destino"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputIcon>
            {searchTerm.length > 0 && (
              <InputIcon>
                <CircleX
                  className="cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              </InputIcon>
            )}
          </InputIcon>
        </InputRoot>
        {searchTerm.length === 0 && <ChooseOnMap onClick={onChooseOnMap} />}
        {searchTerm.length === 0 && favoriteSellers.length > 0 && (
          <div className="flex flex-col items-center justify-center pt-10">
            <h2 className="text-xl font-semibold ">Vendedores Favoritos</h2>
            <SellerList
              sellers={favoriteSellers}
              showByLocation
              onClick={handleSelectSeller}
            />
          </div>
        )}
      </div>
      <div>
        <SellerList
          sellers={sellers}
          showByLocation
          onClick={handleSelectSeller}
        />
      </div>
      {sellers.length === 0 && searchTerm.length >= 3 && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-03">Nenhum resultado encontrado</p>
        </div>
      )}
    </div>
  )
}

type ChooseOnMapProps = ComponentProps<'button'>
function ChooseOnMap(props: ChooseOnMapProps) {
  return (
    <button
      className="w-full hover:cursor-pointer bg-gray01 flex items-center gap-3 p-4 rounded-sm shadow-md hover:bg-gray07"
      type="button"
      {...props}
    >
      <Map />
      Escolher no mapa
    </button>
  )
}
