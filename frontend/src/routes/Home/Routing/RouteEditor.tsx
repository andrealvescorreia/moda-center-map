import { useEffect, useRef, useState } from 'react'
import { DestinyList } from '../../../components/Routing/destiny-list'
import type { Loja } from '../../../interfaces/Loja'
import type { Route } from '../../../interfaces/Route'
import { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { useClickContext } from '../../../providers/ClickProvider'
import { SearchStore } from './SearchSellingPoint'

import {
  ArrowLeft,
  MapPinPlus,
  Navigation,
  PersonStanding,
  Trash,
} from 'lucide-react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { DialogAction } from '../../../components/Routing/dialog-action'
import ActionModal from '../../../components/action-modal'
import { IconButton } from '../../../components/icon-button'
import SellerByLocation from '../../../components/seller-by-location'
import { SheetHeaderTitle } from '../../../components/sheet-header-title'
import { getSellerByBox, getSellerByStore } from '../../../http/api'
import type { Boxe } from '../../../interfaces/Boxe'
import type { BoxeSchema } from '../../../schemas/box'
import type { StoreSchema } from '../../../schemas/store'
import { colorToEnglishMap } from '../../../utils/utils'
interface RouteEditorProps {
  gridMap: ModaCenterGridMap
  route: Route
  bestRoute: Route
  onUpdate: (route: Route) => void
  onCancel: () => void
  onStart: () => void
}

const RouteEditor = ({
  gridMap,
  route,
  bestRoute,
  onUpdate,
  onCancel,
  onStart,
}: RouteEditorProps) => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(
    route.inicio === null
  )
  const [isAddingDestiny, setIsAddingDestiny] = useState(false)
  const [isAddingDestinyFromMap, setIsAddingDestinyFromMap] = useState(false)
  const { clickLocation } = useClickContext()

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [destinyView, setDestinyView] = useState<Loja | Boxe | null>(null)

  const [convertedDestinyView, setConvertedDestinyView] = useState<
    StoreSchema | BoxeSchema | null
  >(null)

  const ref = useRef<SheetRef>(null)

  useEffect(() => {
    if (destinyView === null) {
      setConvertedDestinyView(null)
      return
    }
    const convertedDestiny =
      'numero' in destinyView
        ? {
            box_number: destinyView.numero,
            sector_color: colorToEnglishMap[destinyView.setor],
            street_letter: destinyView.rua,
          }
        : {
            block_number: destinyView.bloco,
            store_number: destinyView.numLoja,
            sector_color: colorToEnglishMap[destinyView.setor],
          }
    setConvertedDestinyView(convertedDestiny)
  }, [destinyView])

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

    onUpdate({
      ...route,
      inicio: {
        position: { x: adjustedX, y },
        sellingLocation: gridMap.findNearestBoxe(y, adjustedX),
      },
    })
  }

  function deleteRoute() {
    onUpdate({
      inicio: null,
      destinos: [],
      passos: [],
    })
  }

  async function getSellerName(sellingLocation: Loja | Boxe) {
    const sector_color = colorToEnglishMap[sellingLocation.setor]
    if ('rua' in sellingLocation) {
      const req = {
        sector_color,
        street_letter: sellingLocation.rua,
        box_number: sellingLocation.numero,
      }

      try {
        const seller = await getSellerByBox(req)
        return seller.name
      } catch (error) {
        console.log(error)
        return '<Sem Vendedor>'
      }
    } else {
      const req = {
        sector_color,
        block_number: sellingLocation.bloco,
        store_number: sellingLocation.numLoja,
      }
      try {
        const seller = await getSellerByStore(req)
        return seller.name
      } catch (error) {
        console.log(error)
        return '<Sem Vendedor>'
      }
    }
  }

  async function addDestinationFromMap(click: { lat: number; lng: number }) {
    const gridValue = gridMap.getGrid()[click.lat][click.lng]

    if (
      gridValue === ModaCenterGridMap.BOXE ||
      gridValue === ModaCenterGridMap.LOJA
    ) {
      const sellingLocation =
        gridValue === ModaCenterGridMap.BOXE
          ? gridMap.getBoxe(click.lat, click.lng)
          : gridMap.getLoja(click.lat, click.lng)

      if (!sellingLocation) return

      const position =
        gridValue === ModaCenterGridMap.BOXE
          ? { x: click.lng, y: click.lat }
          : (sellingLocation as Loja).getEntrance()

      const sellerName = await getSellerName(sellingLocation)
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            sellingLocation,
            position,
            sellerName,
          },
        ],
      }

      onUpdate(newRoute)
      notAddingDestiny()
    }
  }

  function isInsideGridMap(lat: number, lng: number) {
    const [rows, cols] = gridMap.getDimensions()
    return lat >= 0 && lat < rows && lng >= 0 && lng < cols
  }

  function onClickMap() {
    if (!clickLocation) return
    if (!isInsideGridMap(clickLocation.lat, clickLocation.lng)) return

    if (isEditingMarcadorInicio) editRouteStartPoint(clickLocation)
    if (isAddingDestinyFromMap) addDestinationFromMap(clickLocation)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onClickMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickLocation])

  const removeDestiny = (index: number) => {
    const otherDestinies = route.destinos.filter(
      (destiny) =>
        destiny.sellingLocation !== bestRoute.destinos[index].sellingLocation
    )
    const newRoute = {
      ...route,
      destinos: otherDestinies,
    }
    onUpdate(newRoute)
  }

  const addDestiny = (
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

    onUpdate({
      ...route,
      destinos: [
        ...route.destinos,
        {
          sellingLocation,
          position,
          sellerName,
          sellerId,
        },
      ],
    })
  }

  const cancel = () => {
    setIsEditingMarcadorInicio(false)
    notAddingDestiny()
    onCancel()
  }

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
            route={{ ...bestRoute, inicio: route.inicio }}
            onClickRemoveDestiny={removeDestiny}
            reducedView={true}
          />
        </div>

        {convertedDestinyView && (
          <div className="w-full h-full fixed bg-white z-[99999] flex flex-col">
            <button
              type="button"
              className="self-start m-3"
              onClick={() => setDestinyView(null)}
            >
              <ArrowLeft className="text-gray04" size={28} />
            </button>
            <SellerByLocation
              location={convertedDestinyView}
              onClickRemoveDestiny={() => {
                if (!convertedDestinyView) return
                const destinyIndex = route.destinos.findIndex(
                  (destiny) => destiny.sellingLocation === destinyView
                )
                console.log('destinyIndex', destinyIndex)
                if (destinyIndex === -1) return
                removeDestiny(destinyIndex)

                setDestinyView(null)
                setConvertedDestinyView(null)
              }}
            />
          </div>
        )}

        <Sheet
          ref={ref}
          isOpen={bottomSheetOpen}
          onClose={() => snapTo(1)}
          snapPoints={[1, 85]}
          onOpenEnd={() => snapTo(window.innerWidth > 768 ? 0 : 1)}
          initialSnap={window.innerWidth > 768 ? 0 : 1} // Adjust initial snap based on screen size
          className="md:max-w-80"
        >
          <Sheet.Container>
            <SheetHeaderTitle onDismiss={cancel}>
              <h2 className="pl-4 text-[1.3rem] md:text-lg">Minha rota</h2>
            </SheetHeaderTitle>
            <Sheet.Content className="flex gap-3 pl-5 pt-2.5 md:pl-2">
              <div className="flex gap-3 overflow-x-auto pb-3 md:flex-col md:pr-3 md:h-38 min-h-10 pr-5">
                <IconButton
                  className="shrink-0 h-8 md:h-7 text-sm  md:text-xs"
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
                <div className="pr-3 md:text-xs pb-15">
                  <DestinyList
                    route={{ ...bestRoute, inicio: route.inicio }}
                    onClickRemoveDestiny={removeDestiny}
                    onClickDestiny={(destiny) => {
                      if (!destiny.sellingLocation) return
                      setDestinyView(destiny.sellingLocation)
                    }}
                  />
                </div>
              </Sheet.Scroller>
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      </span>
    )
  }

  if (isAddingDestiny && !isAddingDestinyFromMap) {
    return (
      <SearchStore
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
          addDestiny(choosenLocation, sellerName, sellerId)
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
