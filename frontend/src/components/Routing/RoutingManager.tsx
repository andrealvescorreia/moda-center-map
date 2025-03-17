import { useCallback, useEffect, useState } from 'react'
import type { Destiny } from '../../interfaces/Destiny'
import type { Position } from '../../interfaces/Position'
import type { Route } from '../../interfaces/Route'
import type { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { RouteCalculator } from '../../models/RouteCalculator'
import { TSPSolverNN } from '../../models/TSPSolverNN'
import RouteButton from './RouteButton'
import RouteEditor from './RouteEditor'

interface RoutingManager {
  gridMap: ModaCenterGridMap
  onUpdateRoute: (route: {
    inicio: Position | null
    destinos: Destiny[]
    passos: Position[]
  }) => void
}

const RoutingManager = ({ gridMap, onUpdateRoute }: RoutingManager) => {
  const [isCreatingRoute, setIsCreatingRoute] = useState(false)

  const [route, setRoute] = useState<Route>({
    inicio: null,
    destinos: [],
  })
  const [bestRoute, setBestRoute] = useState<Route>({
    inicio: null,
    destinos: [],
  })

  const handleUpdate = useCallback((route: Route) => setRoute(route), [])

  useEffect(() => {
    let destinosMelhorOrdem: Destiny[] = []
    let melhoresPassos: Position[] = []

    if (route.inicio && route.destinos.length > 0) {
      const routeCalculator = new RouteCalculator({
        grid: gridMap.getGrid(),
        tspSolver: new TSPSolverNN(),
      })

      const optimalRoute = routeCalculator.calculateBestRoute({
        startPos: route.inicio,
        destinies: route.destinos,
      })

      destinosMelhorOrdem = optimalRoute.destiniesBestOrder
      melhoresPassos = optimalRoute.steps
      setBestRoute({
        inicio: route.inicio,
        destinos: destinosMelhorOrdem.slice(1),
      })
    } else {
      setBestRoute({
        inicio: null,
        destinos: [],
      })
    }
    onUpdateRoute({
      inicio: route.inicio?.position || null,
      destinos: destinosMelhorOrdem,
      passos: melhoresPassos,
    })
  }, [route, onUpdateRoute, gridMap])

  return (
    <div>
      {!isCreatingRoute ? (
        <span className="absolute 100dvh 100dvw ui bottom-9 right-5">
          <RouteButton
            onClick={() => setIsCreatingRoute(true)}
            className="relative"
          />
        </span>
      ) : (
        <RouteEditor
          gridMap={gridMap}
          route={route}
          bestRoute={bestRoute}
          onUpdate={handleUpdate}
          onCancel={() => {
            setIsCreatingRoute(false)
            setRoute({
              inicio: null,
              destinos: [],
            })
          }}
        />
      )}
    </div>
  )
}

export default RoutingManager
