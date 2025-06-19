import {
  faPerson,
  faPersonWalkingArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Check, MapPinned, MoveUp } from 'lucide-react'
import { useRef } from 'react'
import { Sheet, type SheetRef } from 'react-modal-sheet'
import { IconButton } from '../../../components/icon-button'
import { SheetHeaderTitle } from '../../../components/sheet-header-title'
import type { Boxe } from '../../../interfaces/Boxe'
import type { Loja } from '../../../interfaces/Loja'
import type { Position } from '../../../interfaces/Position'
import type { Route } from '../../../interfaces/Route'
import { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { useRouteContext } from '../../../providers/RouteProvider'

export default function RouteFollower({
  onCancel,
  onFinish,
  onChooseToEdit,
  gridMap,
  onUpdateRoute,
}: {
  onCancel: () => void
  onFinish: () => void
  onChooseToEdit: () => void
  gridMap: ModaCenterGridMap
  onUpdateRoute: (newRoute: Route) => void
}) {
  const { route } = useRouteContext()
  const ref = useRef<SheetRef>(null)

  if (!route) return null

  function locationToText(sellingLocation: Boxe | Loja | null | undefined) {
    if (!sellingLocation) return ''

    if ('rua' in sellingLocation) {
      const { rua, numero, setor } = sellingLocation
      return `Setor ${setor}, Rua ${rua}, Boxe ${numero}`
    }
    const { bloco, numLoja, setor } = sellingLocation
    return `Setor ${setor}, Bloco ${bloco}, Loja ${numLoja}`
  }

  const inicioText = locationToText(route.inicio?.sellingLocation)
  function gerNearestFreePath(position: Position) {
    const grid = gridMap.getGrid()
    const { x, y } = position
    const isCaminho = (lat: number, lng: number) =>
      grid[lat][lng] === ModaCenterGridMap.CAMINHO

    if (isCaminho(y, x)) return { x, y }
    if (isCaminho(y, x + 1)) return { x: x + 1, y }
    if (isCaminho(y, x - 1)) return { x: x - 1, y }
    if (isCaminho(y + 1, x)) return { x, y: y + 1 }
    if (isCaminho(y - 1, x)) return { x, y: y - 1 }

    return { x, y }
  }

  const currentDestiny = route.destinos[0]
  const nextDestiny = route.destinos.length > 1 ? route.destinos[1] : null

  function handleNextDestiny() {
    if (!route) return
    const newRoute = { ...route }
    newRoute.inicio = {
      position: gerNearestFreePath(currentDestiny.position),
      sellingLocation: currentDestiny.sellingLocation,
    }
    newRoute.destinos = newRoute.destinos.slice(1)
    //setRoute(newRoute)
    onUpdateRoute(newRoute)
  }

  const snapTo = (i: number) => ref.current?.snapTo(i)
  return (
    <div>
      <div className="ui absolute top-0 w-[90%] md:max-w-110 ml-[50%] mt-4 -translate-x-1/2">
        <div className="w-full bg-[#4CA866] text-white  flex items-center p-2 rounded-t-2xl rounded-br-2xl gap-2">
          <MoveUp size={40} strokeWidth={3} />
          <span>
            <h2 className="text-2xl font-semibold">
              {currentDestiny.sellerName}
            </h2>
            <p className="text-lg -mt-1 font-light">
              {locationToText(currentDestiny.sellingLocation)}
            </p>
          </span>
        </div>
        {nextDestiny && (
          <div className="bg-green-secondary text-white p-2 w-[70%] px-3 rounded-b-2xl">
            <p className="font-light">
              Depois, <b> {nextDestiny.sellerName}</b>{' '}
            </p>
            <p className="text-sm -mt-1.5 text-gray06 font-light">
              {locationToText(nextDestiny.sellingLocation)}
            </p>
          </div>
        )}
      </div>
      <Sheet
        ref={ref}
        isOpen={true}
        snapPoints={[120]}
        onClose={() => snapTo(0)}
        onOpenEnd={() => snapTo(0)}
        initialSnap={0}
        className="md:max-w-95  md:ml-[50%] md:-translate-x-1/2"
      >
        <Sheet.Container>
          <SheetHeaderTitle onDismiss={onCancel}>
            <div className="pl-2 flex items-center gap-1.5 text-gray02">
              <FontAwesomeIcon icon={faPerson} className="size-3" />
              <h2 className="text-lg"> {inicioText} </h2>
            </div>
          </SheetHeaderTitle>
          <Sheet.Content className="flex gap-3 pl-5 pt-4">
            <div className="flex gap-4 overflow-x-auto ">
              <IconButton
                className="shrink-0"
                type="submit"
                onClick={
                  route.destinos.length > 1 ? handleNextDestiny : onFinish
                }
              >
                {route.destinos.length > 1 ? (
                  <FontAwesomeIcon icon={faPersonWalkingArrowRight} />
                ) : (
                  <Check strokeWidth={4} size={25} />
                )}
                {route.destinos.length > 1 ? 'Avançar' : 'Finalizar'}
              </IconButton>

              <IconButton className="shrink-0" onClick={onChooseToEdit}>
                <MapPinned size={25} />
                Editar rota
              </IconButton>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  )
}
