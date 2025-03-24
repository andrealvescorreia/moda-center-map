import { useEffect, useState } from 'react'
import type { Destiny } from '../../interfaces/Destiny'
import type { Position } from '../../interfaces/Position'
import type { Route } from '../../interfaces/Route'
import type { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { RouteCalculator } from '../../models/RouteCalculator'
import { TSPSolverNN } from '../../models/TSPSolverNN'
import { useNavContext } from '../../providers/NavProvider'
import { useRouteContext } from '../../providers/RouteProvider'
import RouteEditor from './RouteEditor'
import RouteButton from './route-button'

interface RoutingManager {
  gridMap: ModaCenterGridMap
}

const RoutingManager = ({ gridMap }: RoutingManager) => {
  const { setShow } = useNavContext()
  const { route, setRoute } = useRouteContext()
  const [isCreatingRoute, setIsCreatingRoute] = useState(false)

  const [bestRoute, setBestRoute] = useState<Route>({
    inicio: null,
    destinos: [],
  })

  const handleUpdate = (newRoute: Route) => {
    if (!newRoute) return
    let destinosMelhorOrdem: Destiny[] = []
    let melhoresPassos: Position[] = []

    if (newRoute.inicio && newRoute.destinos.length > 0) {
      const routeCalculator = new RouteCalculator({
        grid: gridMap.getGrid(),
        tspSolver: new TSPSolverNN(),
      })

      const optimalRoute = routeCalculator.calculateBestRoute({
        startPos: newRoute.inicio,
        destinies: newRoute.destinos,
      })

      destinosMelhorOrdem = optimalRoute.destiniesBestOrder
      melhoresPassos = optimalRoute.steps
      setBestRoute({
        inicio: newRoute.inicio,
        destinos: destinosMelhorOrdem.slice(1),
      })
    } else {
      setBestRoute({
        inicio: null,
        destinos: [],
      })
    }
    const newBestRoute = {
      inicio: newRoute.inicio,
      destinos: destinosMelhorOrdem.slice(1),
      passos: melhoresPassos,
    }
    if (JSON.stringify(route) !== JSON.stringify(newBestRoute)) {
      setRoute(newBestRoute)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (route) handleUpdate(route)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route])

  useEffect(() => {
    if (!isCreatingRoute) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [isCreatingRoute, setShow])

  function cancelRoute() {
    setIsCreatingRoute(false)
    setRoute({
      inicio: null,
      destinos: [],
      passos: [],
    })
  }

  return (
    <div>
      {!isCreatingRoute ? (
        <span className="absolute 100dvh 100dvw ui bottom-29 right-5">
          <RouteButton
            onClick={() => setIsCreatingRoute(true)}
            className="relative"
          />
        </span>
      ) : (
        <RouteEditor
          gridMap={gridMap}
          route={route || { inicio: null, destinos: [] }}
          bestRoute={bestRoute}
          onUpdate={(newRoute) => {
            handleUpdate(newRoute)
          }}
          onCancel={cancelRoute}
        />
      )}
    </div>
  )
}

export default RoutingManager
