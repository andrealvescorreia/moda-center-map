import { useNetworkState } from '@uidotdev/usehooks'
import { Bookmark, Pencil, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  favoriteSeller,
  getSellerByBox,
  getSellerByStore,
  sellerIsFavorite,
  unfavoriteSeller,
} from '../http/api'
import type { SellerResponse } from '../http/responses'
import { useLoadingContext } from '../providers/LoadingProvider'
import { useUserContext } from '../providers/UserProvider'
import SellerCard from '../routes/SellerPage/seller-card'
import type { BoxeSchema } from '../schemas/box'
import type { StoreSchema } from '../schemas/store'
import { colorMap, formatPhoneNumber } from '../utils/utils'
import SellerNote from './Note/seller-note'
import { IconButton } from './icon-button'
import LoadingOverlay from './loading-overlay'
import OfflineScreen from './offline-screen'
import OkModal from './ok-modal'

interface SellerProps {
  location: BoxeSchema | StoreSchema
  onClickRemoveDestiny?: () => void
}

export default function SellerByLocation({
  location,
  onClickRemoveDestiny,
}: SellerProps) {
  const [seller, setSeller] = useState<SellerResponse | undefined>()

  const [ModalComponent, setModalComponent] = useState<JSX.Element | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useUserContext()
  const { setLoading } = useLoadingContext()
  const [doneFetching, setDoneFetching] = useState(false)
  const network = useNetworkState()
  const navigate = useNavigate()

  // fetch seller
  useEffect(() => {
    setLoading(true)

    // Check if location has box_number property
    const hasBoxNumber = Object.prototype.hasOwnProperty.call(
      location,
      'box_number'
    )

    if (hasBoxNumber) {
      getSellerByBox(location as BoxeSchema)
        .then((resSeller: SellerResponse) => {
          setSeller(resSeller)
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
          setDoneFetching(true)
        })
    } else {
      getSellerByStore(location as StoreSchema)
        .then((resSeller: SellerResponse) => {
          setSeller(resSeller)
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
          setDoneFetching(true)
        })
    }
    sellerIsFavorite(seller?.id || '')
      .then((res) => {
        setIsFavorite(res.isFavorite)
      })
      .catch(console.error)
  }, [location, setLoading, seller?.id])

  async function favoriteSell() {
    if (!seller) return
    try {
      setLoading(true)
      await favoriteSeller(seller.id)
      setIsFavorite(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  async function unfavoriteSell() {
    if (!seller) return
    try {
      setLoading(true)
      await unfavoriteSeller(seller.id)
      setIsFavorite(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  function closeModal() {
    setModalOpen(false)
  }

  function copyPhoneToClipboard() {
    navigator.clipboard.writeText(seller?.phone_number || '').then(
      () => {
        setModalComponent(
          OkModal(
            `"${seller?.phone_number || ''}" copiado para a área de transferência`,
            closeModal,
            closeModal
          )
        )
        setModalOpen(true)
      },
      (err) => {
        console.error('Erro ao copiar para a área de transferência:', err)
      }
    )
  }
  if (!network.online) {
    return <OfflineScreen />
  }
  if (!seller) {
    return <LoadingOverlay />
  }
  if (!seller && doneFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray02 text-2xl pt-10">Vendedor não encontrado</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col px-5 items-center gap-3">
      {modalOpen && ModalComponent}
      <h2>
        Setor {colorMap[location.sector_color]} -{' '}
        {'box_number' in location
          ? `Rua ${location.street_letter} - Box ${location.box_number}`
          : `Bloco ${location.block_number} - Loja ${location.store_number}`}
      </h2>

      <SellerCard
        name={seller.name}
        description={(
          seller.product_categories.map((category) => category.category) || []
        ).join(', ')}
      >
        {user && (
          <button
            type="button"
            className="hover:cursor-pointer ml-auto pt-2 pr-3 mb-auto"
            onClick={() => {
              if (isFavorite) {
                unfavoriteSell()
              } else {
                favoriteSell()
              }
            }}
          >
            <Bookmark
              size={30}
              className={
                isFavorite
                  ? 'fill-green-primary text-green-primary'
                  : 'text-green-secondary'
              }
            />
          </button>
        )}
      </SellerCard>
      {seller?.phone_number && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="flex w-full justify-center items-center text-lg gap-1 text-gray02"
          onClick={copyPhoneToClipboard}
        >
          <Phone size={20} />
          <p>{formatPhoneNumber(seller.phone_number.trim())}</p>
        </div>
      )}

      <div className="flex justify-baseline gap-4 overflow-auto pb-6 pt-3">
        <RemoveFromRouteButton onClick={onClickRemoveDestiny ?? (() => {})} />
        <EditButton
          onClick={() => {
            navigate(`/sellers/${seller?.id}/edit`)
          }}
        />
      </div>

      {user && <SellerNote seller_id={seller.id} />}
    </div>
  )
}

function RemoveFromRouteButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      className="opacity-75 h-8 text-sm p-3 border-none bg-gray06 max-h-8"
    >
      <X size={18} />
      Remover da rota
    </IconButton>
  )
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      className="opacity-75 h-8 text-sm p-3 border-none bg-gray06"
    >
      <Pencil size={16} />
      Editar
    </IconButton>
  )
}
