import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import L from 'leaflet'
import { ArrowRight, Bookmark, Phone, Plus, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Rectangle } from 'react-leaflet'
import { MapContainer } from 'react-leaflet'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { useNavigate, useParams } from 'react-router-dom'
import FlyTo from '../../components/Map/fly-to'
import MapDrawer from '../../components/MapDrawer'
import { IconButton } from '../../components/icon-button'
import { SheetHeaderTitle } from '../../components/sheet-header-title'
import {
  deleteSeller,
  favoriteSeller,
  getSeller,
  sellerIsFavorite,
  unfavoriteSeller,
} from '../../http/api'
import type {
  BoxeResponse,
  SellerResponse,
  StoreResponse,
} from '../../http/responses'
import type { Boxe } from '../../interfaces/Boxe'
import type { Destiny } from '../../interfaces/Destiny'
import type { Loja } from '../../interfaces/Loja'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import {
  colorMap,
  formatPhoneNumber,
  sellingLocationToText,
} from '../../utils/utils'
import SellerCard from './seller-card'

import { useLoadingContext } from '../../providers/LoadingProvider'
import { useRouteContext } from '../../providers/RouteProvider'
import { useUserContext } from '../../providers/UserProvider'

const modaCenterGridMap = new ModaCenterGridMap()

export default function Seller() {
  const { id } = useParams<{ id: string }>()

  const [seller, setSeller] = useState<SellerResponse | undefined>()
  const [activeSellingLocation, setActiveSellingLocation] = useState<
    Boxe | Loja | undefined
  >()
  const isMultiLocationSeller = useRef(false)
  const [ModalComponent, setModalComponent] = useState<JSX.Element | null>(
    <div className="ui absolute text-black">aA AAAAAAAAAAAAAAAAAAAAAAAAAa</div>
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useUserContext()
  const { route, setRoute } = useRouteContext()
  const { setLoading } = useLoadingContext()
  useEffect(() => {
    if (!id) return
    setLoading(true)
    getSeller(id)
      .then((resSeller) => {
        if (JSON.stringify(seller) !== JSON.stringify(resSeller)) {
          setSeller(resSeller)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    sellerIsFavorite(id)
      .then((res) => {
        setIsFavorite(res.isFavorite)
      })
      .catch(console.error)
  }, [id, seller, setLoading])

  useEffect(() => {
    if (!seller) return
    if (seller.boxes.length + seller.stores.length >= 2) {
      isMultiLocationSeller.current = true
    }

    if (seller.boxes.length > 0) {
      const location = {
        setor: colorMap[seller.boxes[0].sector_color] || 'Branco',
        numero: seller.boxes[0].box_number,
        rua: seller.boxes[0].street_letter,
      }
      const sellingLocation = modaCenterGridMap.getSellingLocation(location)
      if (sellingLocation) {
        setActiveSellingLocation(sellingLocation)
      }
    } else {
      const location = {
        setor: colorMap[seller.stores[0].sector_color] || 'Branco',
        bloco: seller.stores[0].block_number,
        numLoja: seller.stores[0].store_number,
      }
      const sellingLocation = modaCenterGridMap.getSellingLocation(location)
      if (sellingLocation) {
        setActiveSellingLocation(sellingLocation)
      }
    }
  }, [seller])

  function drawPosition() {
    if (!activeSellingLocation) return null

    const { x, y } =
      'rua' in activeSellingLocation
        ? activeSellingLocation.positionInGrid
        : activeSellingLocation.getEntrance()

    return (
      <Rectangle
        bounds={[
          [y, x],
          [y + 1, x + 1],
        ]}
        fillColor="red"
      />
    )
  }
  const navigate = useNavigate()
  function onClose() {
    navigate('/sellers')
  }
  const ref = useRef<SheetRef>(null)
  const snapTo = (i: number) => ref.current?.snapTo(i)
  function changeActiveLocation(id: string): void {
    if (!seller) return

    const newLocation =
      seller.boxes.find((box) => box.id === id) ||
      seller.stores.find((store) => store.id === id)

    if (newLocation) {
      const location =
        'box_number' in newLocation
          ? {
              setor: colorMap[newLocation.sector_color] || 'Branco',
              numero: newLocation.box_number,
              rua: newLocation.street_letter,
            }
          : {
              setor: colorMap[newLocation.sector_color] || 'Branco',
              bloco: newLocation.block_number,
              numLoja: newLocation.store_number,
            }

      const sellingLocation = modaCenterGridMap.getSellingLocation(location)
      if (sellingLocation) {
        setActiveSellingLocation(sellingLocation)
      }
    }
  }

  async function deleteSell() {
    if (!seller) return
    try {
      setLoading(true)
      await deleteSeller(seller.id)
      setModalComponent(
        OkModal(`Vendedor ${seller.name} deletado com sucesso`, () => {
          navigate('/sellers')
        })
      )
      setModalOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
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
  function sellerToDestiny() {
    if (activeSellingLocation && seller) {
      const newDestiny: Destiny = {
        position: { x: 0, y: 0 },
        sellingLocation: activeSellingLocation,
        sellerName: seller.name,
      }
      if ('rua' in activeSellingLocation) {
        newDestiny.position = activeSellingLocation.positionInGrid
      } else {
        newDestiny.position = activeSellingLocation.getEntrance()
      }
      return newDestiny
    }
    return null
  }

  function addToRoute() {
    if (activeSellingLocation && seller && route) {
      const newDestiny = sellerToDestiny()
      if (!newDestiny) return
      const found = route.destinos.find(
        (destiny: Destiny) => destiny.position === newDestiny.position
      )
      if (found) {
        setModalComponent(OkModal(`Esse local já está na rota "Minha rota"`))
        setModalOpen(true)
        return
      }

      const newRoute = {
        ...route,
        destinos: [...route.destinos, newDestiny],
      }
      setRoute(newRoute)
      setModalComponent(
        OkModal(`Vendedor ${seller.name} adicionado à "Minha rota"`)
      )
      setModalOpen(true)
    }
  }

  function DeleteSellerModal() {
    return (
      <Dialog
        open={true}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Deletar Vendedor</DialogTitle>
        <DialogContent>
          <p className="text-gray02">
            Tem certeza que deseja deletar o vendedor {seller?.name}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} autoFocus>
            CANCELAR
          </Button>
          <Button onClick={() => deleteSell()} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  function OkModal(text: string, onOK?: () => void) {
    return (
      <Dialog open={true} onClose={() => setModalOpen(false)}>
        <DialogContent>
          <p className="text-gray02">{text}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false)
              if (onOK) onOK()
            }}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
      {modalOpen && ModalComponent}
      <Sheet
        ref={ref}
        isOpen={true}
        onClose={onClose}
        snapPoints={[
          isMultiLocationSeller.current ? 1000 : 230,
          isMultiLocationSeller.current ? 380 : 230,
          140,
        ]}
        onCloseEnd={onClose}
        onOpenEnd={() => snapTo(1)}
        initialSnap={1}
      >
        <Sheet.Container>
          <SheetHeaderTitle onDismiss={onClose}>
            {activeSellingLocation && (
              <h2 className="text-base text-center text-gray02 pt-5 w-80 max-w-[70%] absolute p-0 ml-[50%] -translate-x-1/2">
                Setor {activeSellingLocation.setor} -{' '}
                {'numero' in activeSellingLocation
                  ? `Rua ${activeSellingLocation.rua} - Box ${activeSellingLocation.numero}`
                  : `Bloco ${activeSellingLocation.bloco} - Loja ${activeSellingLocation.numLoja}`}
              </h2>
            )}
          </SheetHeaderTitle>
          <Sheet.Content className="flex gap-3 pl-5 pt-2 mt-4 md:w-120 ">
            {seller && (
              <SellerCard
                name={seller.name}
                description={(
                  seller.product_categories.map(
                    (category) => category.category
                  ) || []
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
            )}
            {seller?.phone_number && (
              <div className="flex w-full justify-center items-center text-xl gap-2 text-gray02">
                <Phone size={24} />
                <p>{formatPhoneNumber(seller.phone_number.trim())}</p>
              </div>
            )}

            <div className="flex justify-baseline gap-6">
              <AddToRouteButton
                onClick={() => {
                  addToRoute()
                }}
              />
              <DeleteButton
                onClick={() => {
                  snapTo(2)
                  setModalComponent(DeleteSellerModal())
                  setModalOpen(true)
                }}
              />
            </div>
            {isMultiLocationSeller.current && (
              <div className="pt-5">
                <h3 className="text-lg font-semibold text-gray02">
                  Outros locais
                </h3>
                <ul>
                  {seller?.boxes.map((box) => (
                    <LocationItem
                      key={box.id}
                      location={box}
                      onClick={() => changeActiveLocation(box.id)}
                    />
                  ))}
                  {seller?.stores.map((store) => (
                    <LocationItem
                      key={store.id}
                      location={store}
                      onClick={() => changeActiveLocation(store.id)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={modaCenterGridMap.getBounds()}
        zoom={5}
        maxZoom={6}
        minZoom={1}
      >
        <MapDrawer gridMap={modaCenterGridMap} />
        {activeSellingLocation && (
          <FlyTo
            position={
              'rua' in activeSellingLocation
                ? {
                    ...activeSellingLocation.positionInGrid,
                    y: activeSellingLocation.positionInGrid.y - 4,
                  }
                : {
                    ...activeSellingLocation.getEntrance(),
                    y: activeSellingLocation.getEntrance().y - 4,
                  }
            }
            zoom={5}
          />
        )}

        {drawPosition()}
      </MapContainer>
    </div>
  )

  function DeleteButton({ onClick }: { onClick: () => void }) {
    return (
      <IconButton
        className="opacity-65 text-danger border-danger h-7 text-sm p-2"
        onClick={onClick}
      >
        <Trash2 size={18} />
        Deletar
      </IconButton>
    )
  }

  function AddToRouteButton({ onClick }: { onClick: () => void }) {
    return (
      <IconButton onClick={onClick} className="opacity-75 h-7 text-sm p-2">
        <Plus size={18} />
        Adicionar à rota
      </IconButton>
    )
  }

  function LocationItem({
    location,
    onClick,
  }: { location: BoxeResponse | StoreResponse; onClick?: () => void }) {
    const text = sellingLocationToText(location)

    return (
      <li className="text-gray02 py-1.5 pr-3 flex items-center">
        {text}{' '}
        <button
          type="button"
          className="bg-gray06 rounded-2xl p-0.5 ml-auto hover:cursor-pointer"
          onClick={onClick}
        >
          <ArrowRight size={26} className="text-green-primary" />
        </button>
      </li>
    )
  }
}
