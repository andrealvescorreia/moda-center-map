import { useEffect, useRef, useState } from 'react'
import type { Loja } from '../../interfaces/Loja'
import type { Route } from '../../interfaces/Route'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useClickContext } from '../../providers/ClickProvider'
import { SearchStore } from '../SearchStore'
import { DestinyList } from './destiny-list'

import { MapPinPlus, Navigation, PersonStanding } from 'lucide-react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const isInsideGridMap = (lat: number, lng: number) => {
      return (
        lat >= 0 &&
        lat < gridMap.getDimensions()[0] &&
        lng >= 0 &&
        lng < gridMap.getDimensions()[1]
      )
    }
    if (!clickLocation) return
    if (!isInsideGridMap(clickLocation.lat, clickLocation.lng)) return

    const y = clickLocation.lat
    let x = clickLocation.lng
    if (
      isEditingMarcadorInicio &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.BOXE
    ) {
      if (
        gridMap.getGrid()[clickLocation.lat][clickLocation.lng + 1] ===
        ModaCenterGridMap.CAMINHO
      ) {
        x = clickLocation.lng + 1
      } else if (
        gridMap.getGrid()[clickLocation.lat][clickLocation.lng - 1] ===
        ModaCenterGridMap.CAMINHO
      ) {
        x = clickLocation.lng - 1
      }
    }

    if (isEditingMarcadorInicio && gridMap.getGrid()[y][x] === 0) {
      const newRoute = {
        ...route,
        inicio: {
          position: { x, y },
          info: gridMap.findNearestBoxe(y, x),
        },
      }
      onUpdate(newRoute)
    }
    if (
      isAddingDestiny &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.BOXE
    ) {
      const boxe = gridMap.getBoxe(clickLocation.lat, clickLocation.lng)

      if (boxe === null) return
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: boxe || null,
            position: { x: clickLocation.lng, y: clickLocation.lat },
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }

    if (
      isAddingDestiny &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.LOJA
    ) {
      const loja = gridMap.getLoja(clickLocation.lat, clickLocation.lng)
      if (!loja) return
      const entrance = loja.getEntrance()
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: loja as Loja,
            position: entrance,
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdate, clickLocation])

  const removeDestiny = (index: number) => {
    const otherDestinies = route.destinos.filter(
      (destiny) => destiny.info !== bestRoute.destinos[index].info
    )

    const newRoute = {
      ...route,
      destinos: otherDestinies,
    }
    onUpdate(newRoute)
  }

  const cancel = () => {
    setIsEditingMarcadorInicio(false)
    setIsAddingDestiny(false)
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
            onCancel={cancel}
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
                    setIsAddingDestiny(false)
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

  if (isAddingDestinyFromMap) {
    return (
      <span className="ui absolute flex w-full justify-center top-3">
        <span className="w-98">
          <DialogAction
            title="Informe o local de destino"
            text="Clique em um ponto de venda no mapa"
            onAccept={() => {
              setIsAddingDestinyFromMap(false)
              setIsAddingDestiny(false)
            }}
            onCancel={() => {
              setIsAddingDestiny(false)
            }}
          />
        </span>
      </span>
    )
  }

  if (isAddingDestiny) {
    return (
      <SearchStore
        onCancel={() => {
          setIsAddingDestiny(false)
        }}
        onChooseOnMap={() => {
          setIsAddingDestinyFromMap(true)
        }}
      />
    )
  }

  return null
}

export default RouteEditor
