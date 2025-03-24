import L from 'leaflet'
import { ArrowRight, Phone, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Rectangle, useMap } from 'react-leaflet'
import { MapContainer } from 'react-leaflet'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '../../components/icon-button'
import { SheetHeaderTitle } from '../../components/sheet-header-title'
import { deleteSeller, getSeller } from '../../http/api'
import type {
  BoxeResponse,
  SellerResponse,
  StoreResponse,
} from '../../http/responses'
import type { Boxe } from '../../interfaces/Boxe'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import {
  colorMap,
  formatPhoneNumber,
  sellingLocationToText,
} from '../../utils/utils'
import SellerCard from './seller-card'

const modaCenterGridMap = new ModaCenterGridMap()

function SetView({ position }: { position: Position }) {
  const map = useMap()
  if (!position) return null
  map.setView(L.latLng(position.y, position.x), 5)
  return null
}

export default function Seller() {
  const { id } = useParams<{ id: string }>()

  const [seller, setSeller] = useState<SellerResponse | undefined>()
  const [activeSellingLocation, setActiveSellingLocation] = useState<
    Boxe | Loja | undefined
  >()
  const isMultiLocationSeller = useRef(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getSeller(id)
      .then((resSeller) => {
        if (JSON.stringify(seller) !== JSON.stringify(resSeller)) {
          setSeller(resSeller)
        }
      })
      .catch(console.error)
  }, [id, seller])

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
      await deleteSeller(seller.id)
      alert('Vendedor deletado com sucesso')
      navigate('/sellers')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
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
              <h2 className="text-lg text-center text-gray02 pt-4 w-80 absolute p-0 ml-[50%] -translate-x-1/2">
                Setor {activeSellingLocation.setor} -{' '}
                {'numero' in activeSellingLocation
                  ? `Rua ${activeSellingLocation.rua} - Box ${activeSellingLocation.numero}`
                  : `Bloco ${activeSellingLocation.bloco} - Loja ${activeSellingLocation.numLoja}`}
              </h2>
            )}
          </SheetHeaderTitle>
          <Sheet.Content className="flex gap-3 pl-5 pt-5">
            {seller && (
              <SellerCard
                name={seller.name}
                description={(
                  seller.product_categories.map(
                    (category) => category.category
                  ) || []
                ).join(', ')}
              />
            )}
            {seller?.phone_number && (
              <div className="flex w-full justify-center items-center text-xl gap-2 text-gray02">
                <Phone size={24} />
                <p>{formatPhoneNumber(seller.phone_number.trim())}</p>
              </div>
            )}

            <DeleteButton
              onClick={() => {
                snapTo(2)
                setModalOpen(true)
              }}
            />
            {modalOpen && (
              <DialogAction
                title="Deseja realmente deletar esse vendedor?"
                onClose={() => {
                  snapTo(1)
                  setModalOpen(false)
                }}
                onAccept={() => {
                  deleteSell()
                  setModalOpen(false)
                }}
              />
            )}
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
        <GridDrawer gridMap={modaCenterGridMap} />
        {activeSellingLocation && (
          <SetView
            position={
              'rua' in activeSellingLocation
                ? activeSellingLocation.positionInGrid
                : activeSellingLocation.getEntrance()
            }
          />
        )}

        {drawPosition()}
      </MapContainer>
    </div>
  )
}

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import GridDrawer from '../../components/GridDrawer'
function DialogAction({
  onClose,
  onAccept,
  title,
  children,
}: {
  onClose: () => void
  onAccept: () => void
  title: string
  children?: React.ReactNode
}) {
  const handleClose = () => {
    onClose()
  }
  const handleAccept = () => {
    onAccept()
  }
  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          CANCELAR
        </Button>
        <Button onClick={handleAccept} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      className="mr-auto opacity-65 text-danger border-danger h-7 text-sm p-2"
      onClick={onClick}
    >
      <Trash2 size={18} />
      Deletar
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
