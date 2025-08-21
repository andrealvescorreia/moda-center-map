import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'

gsap.registerPlugin(CSSPlugin)
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { ArrowLeft, CircleX, Map } from 'lucide-react'
import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { InputField, InputIcon, InputRoot } from '../../../components/input'
import { getFavorites, getSellers, searchSeller } from '../../../http/api'
import type { SellerResponse } from '../../../http/responses'
import type { Boxe } from '../../../interfaces/Boxe'
import type { Loja } from '../../../interfaces/Loja'
import { colorMap } from '../../../utils/utils'
import SellerList from '../../Sellers/seller-list'

interface SearchDestinyProps {
  onCancel?: () => void
  onChooseOnMap?: () => void
  onSellectSeller?: (
    sellerName: string,
    sellerId: string | undefined,
    location: Boxe | Loja
  ) => void
}

export function SearchDestiny({
  onChooseOnMap,
  onCancel,
  onSellectSeller,
}: SearchDestinyProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedSellers, setSearchedSellers] = useState<SellerResponse[]>([])
  const [favoriteSellers, setFavoriteSellers] = useState<SellerResponse[]>([])
  const [allSellers, setAllSellers] = useState<SellerResponse[]>([])

  const isFetchingRef = useRef(false)

  async function fetchFavoriteSellers() {
    const sellers = await getFavorites()
    setFavoriteSellers(sellers)
  }

  async function fetchAllSellers() {
    let sellers = await getSellers('order_by=name&order=asc')
    sellers = sellers.filter((seller) => {
      for (const favSeller of favoriteSellers) {
        if (seller.name === favSeller.name) return false
      }
      return true
    })
    setAllSellers(sellers)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchFavoriteSellers()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchAllSellers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteSellers])

  useEffect(() => {
    if (searchTerm.length < 3) setSearchedSellers([])
    if (isFetchingRef.current || searchTerm.length < 3) return
    isFetchingRef.current = true
    searchSeller(searchTerm)
      .then((res) => {
        isFetchingRef.current = false
        setSearchedSellers(res)
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
    let seller = searchedSellers.find((seller) => seller.id === sellerId)
    if (!seller) {
      seller = favoriteSellers.find((seller) => seller.id === sellerId)
    }
    if (!seller) {
      seller = allSellers.find((seller) => seller.id === sellerId)
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
      onSellectSeller?.(seller.name, seller.id, boxe)
    } else {
      const loja: Loja = {
        setor,
        bloco: location.block_number,
        numLoja: location.store_number,
        gridArea: [], //unknown
        getBounds: () => [], //unknown
        getEntrance: () => ({ x: 0, y: 0 }), //unknown
      }
      onSellectSeller?.(seller.name, seller.id, loja)
    }
  }

  return (
    <div
      ref={element}
      className="ui fixed w-[100dvw] max-w-[100%] h-[100dvh] bg-white"
    >
      <div className="flex flex-col bg-white">
        <div className="p-4">
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
        </div>
        {searchTerm.length === 0 && (
          <div className="w-full max-h-[90dvh] md:max-h-[85dvh] pb-50 overflow-y-auto">
            <div className="p-4">
              <ChooseOnMap onClick={onChooseOnMap} />
            </div>
            {favoriteSellers.length > 0 && (
              <div className="flex flex-col items-center justify-center pt-10">
                <h2 className="text-xl font-semibold">Vendedores Favoritos</h2>
                <SellerList
                  sellers={favoriteSellers}
                  showByLocation
                  onClick={handleSelectSeller}
                />
              </div>
            )}
            {allSellers.length > 0 && (
              <div className="flex flex-col items-center justify-center pt-10">
                <h2 className="text-xl font-semibold ">
                  {favoriteSellers.length > 0
                    ? 'Outros Vendedores'
                    : 'Vendedores'}
                </h2>
                <SellerList
                  sellers={allSellers}
                  showByLocation
                  onClick={handleSelectSeller}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <SellerList
          sellers={searchedSellers}
          showByLocation
          onClick={handleSelectSeller}
        />
      </div>
      {searchedSellers.length === 0 && searchTerm.length >= 3 && (
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
