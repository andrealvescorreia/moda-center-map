import { useState } from 'react'
import type { Position } from '../../interfaces/Position'
import type { Route } from '../../interfaces/Route'
import type { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { RouteCalculator } from '../../models/RouteCalculator'
import { TSPSolverNN } from '../../models/TSPSolverNN'
import RouteButton from './RouteButton'
import RouteDrawer from './RouteDrawer'
import RouteEditor from './RouteEditor'

interface RoutingManager {
  gridMap: ModaCenterGridMap
}

const RoutingManager = ({ gridMap }: RoutingManager) => {
  const [isCreatingRoute, setIsCreatingRoute] = useState(false)

  const [route, setRoute] = useState<Route>({
    inicio: null,
    destinos: [],
  })

  let destinosMelhorOrdem: Position[] = []
  let melhoresPassos: Position[] = []

  if (route.inicio && route.destinos.length > 0) {
    const routeCalculator = new RouteCalculator({
      grid: gridMap.getGrid(),
      tspSolver: new TSPSolverNN(),
    })

    const bestRoute = routeCalculator.calculateBestRoute({
      startPos: route.inicio.position,
      destinies: route.destinos.map((destino) => destino.position),
    })

    destinosMelhorOrdem = bestRoute.destiniesBestOrder
    melhoresPassos = bestRoute.steps
  }

  return (
    <div className="ui">
      {!isCreatingRoute ? (
        <RouteButton
          onClick={() => setIsCreatingRoute(true)}
          className="absolute bottom-30 right-7"
        />
      ) : (
        <RouteEditor
          gridMap={gridMap}
          route={route}
          onUpdate={(route) => setRoute(route)}
          onCancel={() => {
            setIsCreatingRoute(false)
            setRoute({
              inicio: null,
              destinos: [],
            })
          }}
        />
      )}
      {route.inicio && (
        <RouteDrawer
          inicio={route.inicio.position}
          destinos={destinosMelhorOrdem}
          passos={melhoresPassos}
        />
      )}
    </div>
  )
}

export default RoutingManager
