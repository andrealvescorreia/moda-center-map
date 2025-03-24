import { useEffect, useRef, useState } from 'react'
import type { Loja } from '../../interfaces/Loja'
import type { Route } from '../../interfaces/Route'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useClickContext } from '../../providers/ClickProvider'
import { SearchStore } from './SearchSellingPoint'
import { DestinyList } from './destiny-list'

import { MapPinPlus, Navigation, PersonStanding } from 'lucide-react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { getSellerByBox, getSellerByStore } from '../../http/api'
import type { Boxe } from '../../interfaces/Boxe'
import { colorToEnglishMap } from '../../utils/utils'
import { IconButton } from '../icon-button'
import { SheetHeaderTitle } from '../sheet-header-title'
import { DialogAction } from './dialog-action'
interface RouteEditorProps {
  gridMap: ModaCenterGridMap
  route: Route
  bestRoute: Route
  onUpdate: (route: Route) => void
  onCancel: () => void
}

const RouteEditor = ({
  gridMap,
  route,
  bestRoute,
  onUpdate,
  onCancel,
}: RouteEditorProps) => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(true)
  const [isAddingDestiny, setIsAddingDestiny] = useState(false)
  const [isAddingDestinyFromMap, setIsAddingDestinyFromMap] = useState(false)
  const { clickLocation } = useClickContext()

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
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

    onUpdate({
      ...route,
      inicio: {
        position: { x: adjustedX, y },
        sellingLocation: gridMap.findNearestBoxe(y, adjustedX),
      },
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

  const addDestiny = (sellingLocation: Loja | Boxe, sellerName: string) => {
    const position =
      'rua' in sellingLocation
        ? {
            x: sellingLocation.positionInGrid.x,
            y: sellingLocation.positionInGrid.y,
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
            onCancel={() => setIsEditingMarcadorInicio(false)}
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
        <DestinyList
          route={{ ...bestRoute, inicio: route.inicio }}
          onClickRemoveDestiny={removeDestiny}
        />

        <Sheet
          ref={ref}
          isOpen={bottomSheetOpen}
          onClose={cancel}
          snapPoints={[1000, 130]}
          onCloseEnd={cancel}
          onOpenEnd={() => snapTo(1)}
          initialSnap={1}
        >
          <Sheet.Container>
            <SheetHeaderTitle onDismiss={cancel}>
              <h2 className="pl-6">Minha rota</h2>
            </SheetHeaderTitle>
            <Sheet.Content className="flex gap-3 pl-5 pt-4">
              <div className="flex gap-4 overflow-x-auto">
                <IconButton
                  className="shrink-0"
                  type="submit"
                  onClick={() => console.log('TODO')}
                  disabled={route.destinos.length === 0}
                >
                  <Navigation size={20} />
                  Iniciar
                </IconButton>

                <IconButton
                  className="shrink-0"
                  onClick={() => {
                    setIsAddingDestiny(true)
                    setIsEditingMarcadorInicio(false)
                  }}
                >
                  <MapPinPlus size={20} />
                  Adicionar parada
                </IconButton>

                <IconButton
                  className="shrink-0"
                  onClick={() => {
                    setIsEditingMarcadorInicio(true)
                    notAddingDestiny()
                  }}
                >
                  <PersonStanding size={20} />
                  Mudar ponto inicial
                </IconButton>
              </div>
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
        onSellectSeller={(sellerName, sellingLocation) => {
          const choosenLocation = gridMap.getSellingLocation(sellingLocation)
          if (!choosenLocation) {
            notAddingDestiny()
            return
          }
          addDestiny(choosenLocation, sellerName)
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
