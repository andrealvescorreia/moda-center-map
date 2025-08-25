import { MapPinPlus, Navigation, PersonStanding, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { DestinyList } from '../../../components/Routing/destiny-list'
import { DialogAction } from '../../../components/Routing/dialog-action'
import ActionModal from '../../../components/action-modal'
import { IconButton } from '../../../components/icon-button'
import { SheetHeaderTitle } from '../../../components/sheet-header-title'
import { getSellerByBox, getSellerByStore } from '../../../http/api'
import type { Boxe } from '../../../interfaces/Boxe'
import type { Destiny } from '../../../interfaces/Destiny'
import type { Loja } from '../../../interfaces/Loja'
import type { Route } from '../../../interfaces/Route'
import { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { useClickContext } from '../../../providers/ClickProvider'
import { useRouteContext } from '../../../providers/RouteProvider'
import { colorToEnglishMap } from '../../../utils/utils'
import RouteContent from './RouteContent'
import { SearchDestiny } from './SearchDestiny'
import {
  addDestiny,
  changeStartingPoint,
  getClearRoute,
  removeDestiny,
} from './route-service'

interface RouteEditorProps {
  gridMap: ModaCenterGridMap
  onCancel: () => void
  onStart: () => void
}

const RouteEditor = ({ gridMap, onCancel, onStart }: RouteEditorProps) => {
  const { route, setRoute } = useRouteContext()
  if (!route) return null
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(
    route.inicio === null
  )
  const [isAddingDestiny, setIsAddingDestiny] = useState(false)
  const [isAddingDestinyFromMap, setIsAddingDestinyFromMap] = useState(false)
  const { clickLocation } = useClickContext()

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const ref = useRef<SheetRef>(null)

  useEffect(() => {
    if (!isAddingDestiny && !!route.inicio) {
      setBottomSheetOpen(true)
    }
  }, [isAddingDestiny, route.inicio])

  function notAddingDestiny() {
    setIsAddingDestiny(false)
    setIsAddingDestinyFromMap(false)
  }

  function editRouteStartPoint(click: { lat: number; lng: number }) {
    const { lat: y, lng: x } = click
    const isBoxe = gridMap.getGrid()[y][x] === ModaCenterGridMap.BOXE
    const isCaminho = (lat: number, lng: number) =>
      gridMap.getGrid()[lat][lng] === ModaCenterGridMap.CAMINHO

    const adjustedX = isBoxe
      ? ([x + 1, x - 1].find((lng) => isCaminho(y, lng)) ?? x)
      : x

    if (!isCaminho(y, adjustedX)) return
    if (!route) return
    const newRoute = changeStartingPoint(route, {
      position: { x: adjustedX, y },
      sellingLocation: gridMap.findNearestBoxe(y, adjustedX),
    })
    setRoute(newRoute)
  }

  function deleteRoute() {
    setRoute(getClearRoute())
  }

  //seller-service
  async function getSellerBySellingLocation(sellingLocation: Loja | Boxe) {
    const sector_color = colorToEnglishMap[sellingLocation.setor]
    if ('rua' in sellingLocation) {
      const req = {
        sector_color,
        street_letter: sellingLocation.rua,
        box_number: sellingLocation.numero,
      }

      try {
        const seller = await getSellerByBox(req)
        return seller
      } catch (error) {
        console.log(error)
        return null
      }
    } else {
      const req = {
        sector_color,
        block_number: sellingLocation.bloco,
        store_number: sellingLocation.numLoja,
      }
      try {
        const seller = await getSellerByStore(req)
        return seller
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }

  //route-service
  async function getDestinyFromMap(pos: { lat: number; lng: number }) {
    const gridValue = gridMap.getGrid()[pos.lat][pos.lng]

    if (
      gridValue !== ModaCenterGridMap.BOXE &&
      gridValue !== ModaCenterGridMap.LOJA
    ) {
      console.error('The location clicked is not a selling location')
      return null
    }
    const sellingLocation =
      gridValue === ModaCenterGridMap.BOXE
        ? gridMap.getBoxe(pos.lat, pos.lng)
        : gridMap.getLoja(pos.lat, pos.lng)

    if (!sellingLocation) return null

    const position =
      gridValue === ModaCenterGridMap.BOXE
        ? { x: pos.lng, y: pos.lat }
        : (sellingLocation as Loja).getEntrance()

    const seller = await getSellerBySellingLocation(sellingLocation)
    const destiny: Destiny = {
      sellingLocation,
      position,
      sellerName: seller?.name || '<Sem vendedor>',
      sellerId: seller?.id,
    }
    return destiny
  }

  //route-service
  async function addDestinyFromMap(click: { lat: number; lng: number }) {
    if (!route) return
    const destiny = await getDestinyFromMap(click)
    const newRoute = destiny ? addDestiny(route, destiny) : route
    setRoute(newRoute)
    notAddingDestiny()
  }

  const createDestiny = (
    sellingLocation: Loja | Boxe,
    sellerName: string,
    sellerId: string | undefined
  ) => {
    const position =
      'rua' in sellingLocation
        ? {
            y: sellingLocation.positionInGrid.y,
            x: sellingLocation.positionInGrid.x,
          }
        : sellingLocation.getEntrance()

    const destiny: Destiny = {
      sellingLocation,
      position,
      sellerName,
      sellerId,
    }
    return destiny
  }

  const addADestiny = (destiny: Destiny) => {
    const newRoute = addDestiny(route, destiny)
    setRoute(newRoute)
  }

  const removeADestiny = (index: number) => {
    const newRoute = removeDestiny(route, index)
    setRoute(newRoute)
  }

  const cancel = () => {
    setIsEditingMarcadorInicio(false)
    notAddingDestiny()
    onCancel()
  }

  function onClickMap() {
    if (!clickLocation) return
    if (!gridMap.isInsideGridMap(clickLocation.lat, clickLocation.lng)) return

    if (isEditingMarcadorInicio) editRouteStartPoint(clickLocation)
    if (isAddingDestinyFromMap) addDestinyFromMap(clickLocation)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onClickMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickLocation])

  if (isEditingMarcadorInicio) {
    return (
      <span className="ui absolute flex w-full justify-center top-3">
        <span className="w-98">
          <DialogAction
            title="Informe o local de início"
            text="Clique em um ponto caminhável no mapa"
            onAccept={() => setIsEditingMarcadorInicio(false)}
            onCancel={() => {
              setIsEditingMarcadorInicio(false)
              if (route.inicio === null) cancel()
            }}
            acceptEnabled={route.inicio !== null}
          />
        </span>
      </span>
    )
  }

  const snapTo = (i: number) => ref.current?.snapTo(i)
  if (!isAddingDestiny && route.inicio) {
    return (
      <span>
        {modalOpen && (
          <ActionModal
            title="Limpar a rota"
            content="Deseja remover todos os destinos da rota?"
            onConfirm={() => {
              deleteRoute()
              setModalOpen(false)
              onCancel()
            }}
            onCancel={() => setModalOpen(false)}
          />
        )}

        <div className="ui ml-[50%] -translate-x-1/2 absolute w-[95%] flex justify-center items-center top-1 shadow max-h-45 overflow-auto md:size-0">
          <DestinyList
            route={{ ...route, inicio: route.inicio }}
            onClickRemoveDestiny={removeADestiny}
            reducedView={true}
          />
        </div>

        <Sheet
          ref={ref}
          isOpen={bottomSheetOpen}
          onClose={() => snapTo(2)}
          snapPoints={[1, 360, 85]}
          onOpenEnd={() => snapTo(window.innerWidth > 768 ? 0 : 2)}
          initialSnap={window.innerWidth > 768 ? 0 : 2} // Adjust initial snap based on screen size
          className="md:max-w-80"
        >
          <Sheet.Container>
            <SheetHeaderTitle onDismiss={cancel}>
              <h2 className="pl-4 text-[1.3rem] md:text-lg">Minha rota</h2>
            </SheetHeaderTitle>
            <Sheet.Content className="flex gap-3 pl-5 pt-2.5 md:pl-2">
              <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:pr-3 md:h-38 min-h-10 pr-5">
                <IconButton
                  className="shrink-0 h-8 md:h-7 text-sm md:text-xs"
                  type="submit"
                  onClick={onStart}
                  disabled={route.destinos.length === 0}
                >
                  <Navigation size={20} />
                  Iniciar
                </IconButton>

                <IconButton
                  className="shrink-0 h-8 md:h-7 text-sm md:text-xs"
                  onClick={() => {
                    setIsAddingDestiny(true)
                    setIsEditingMarcadorInicio(false)
                  }}
                >
                  <MapPinPlus size={20} />
                  Adicionar parada
                </IconButton>

                <IconButton
                  className="shrink-0 h-8 text-sm md:h-7 md:text-xs"
                  onClick={() => {
                    setIsEditingMarcadorInicio(true)
                    notAddingDestiny()
                  }}
                >
                  <PersonStanding size={20} />
                  Mudar inicio
                </IconButton>

                <IconButton
                  className="shrink-0 h-8 text-sm md:h-7 md:text-xs"
                  type="reset"
                  onClick={() => setModalOpen(true)}
                >
                  <Trash size={20} />
                  Limpar
                </IconButton>
              </div>
              {
                // https://github.com/Temzasse/react-modal-sheet/issues/154
              }
              <Sheet.Scroller>
                <RouteContent />
              </Sheet.Scroller>
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      </span>
    )
  }

  if (isAddingDestiny && !isAddingDestinyFromMap) {
    return (
      <SearchDestiny
        onCancel={notAddingDestiny}
        onChooseOnMap={() => {
          setIsAddingDestinyFromMap(true)
        }}
        onSellectSeller={(sellerName, sellerId, sellingLocation) => {
          const choosenLocation = gridMap.getSellingLocation(sellingLocation)
          if (!choosenLocation) {
            notAddingDestiny()
            return
          }
          const destiny = createDestiny(choosenLocation, sellerName, sellerId)
          addADestiny(destiny)
          notAddingDestiny()
        }}
      />
    )
  }
  if (isAddingDestinyFromMap) {
    return (
      <span className="ui absolute flex w-full justify-center top-3">
        <span className="w-98">
          <DialogAction
            title="Informe o local de destino"
            text="Clique em um ponto de venda no mapa"
            onAccept={notAddingDestiny}
            onCancel={notAddingDestiny}
          />
        </span>
      </span>
    )
  }

  return null
}

export default RouteEditor
