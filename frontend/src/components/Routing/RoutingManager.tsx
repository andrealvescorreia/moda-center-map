import { useState } from 'react'
import './RoutingManager.scss'
import type { Position } from '../../interfaces/Position'
import type { Route } from '../../interfaces/Route'
import type { GridMap } from '../../models/GridMap'
import RouteButton from './RouteButton'
import RouteDrawer from './RouteDrawer'
import RouteEditor from './RouteEditor'

interface RoutingManager {
  gridMap: GridMap
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
    const bestRoute = gridMap.calculateBestRoute(
      route.inicio.position,
      route.destinos.map((destino) => destino.position)
    )

    destinosMelhorOrdem = bestRoute.destiniesBestOrder
    melhoresPassos = bestRoute.steps
  }

  return (
    <div className="route-manager">
      {!isCreatingRoute ? (
        <RouteButton onClick={() => setIsCreatingRoute(true)} />
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
