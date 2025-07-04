import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Destiny } from '../../../interfaces/Destiny'
import type { Position } from '../../../interfaces/Position'
import type { Route } from '../../../interfaces/Route'
import type { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { RouteCalculator } from '../../../models/RouteCalculator'
import { TSPSolverNN } from '../../../models/TSPSolverNN'
import { useRouteContext } from '../../../providers/RouteProvider'
import RouteEditor from './RouteEditor'
import RouteFollower from './RouteFollower'

interface RoutingManager {
  gridMap: ModaCenterGridMap
  onStopManagingRoute: () => void
}

const RoutingManager = forwardRef(
  ({ gridMap, onStopManagingRoute }: RoutingManager, ref) => {
    const { route, setRoute } = useRouteContext()
    const [isCreatingRoute, setIsCreatingRoute] = useState(true)
    const [isFollowingRoute, setIsFollowingRoute] = useState(false)

    const [bestRoute, setBestRoute] = useState<Route>({
      inicio: null,
      destinos: route?.destinos || [],
    })

    useImperativeHandle(ref, () => ({
      handleUpdate,
    }))

    const handleUpdate = (newRoute: Route) => {
      if (!newRoute) return
      if (!newRoute?.inicio && newRoute?.destinos.length >= 0) {
        setRoute(newRoute)
        setBestRoute(newRoute)
        return
      }
      if (newRoute.destinos.length === 0) {
        const newBestRoute = { ...newRoute, passos: [] }
        if (JSON.stringify(route) !== JSON.stringify(newBestRoute)) {
          setRoute(newBestRoute)
        }
        setBestRoute(newRoute)
        return
      }

      let destinosMelhorOrdem: Destiny[] = []
      let melhoresPassos: Position[] = []

      const removeDuplicates = (arr: Destiny[]) => {
        const seen = new Set()
        return arr.filter((item) => {
          const key = JSON.stringify(item.position)
          return seen.has(key) ? false : seen.add(key)
        })
      }

      newRoute.destinos = removeDuplicates(newRoute.destinos)

      if (newRoute.inicio) {
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

    function cancelRoute() {
      setIsCreatingRoute(false)
      setIsFollowingRoute(false)
      onStopManagingRoute()
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (route) {
        handleUpdate(route)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <>
        {isCreatingRoute && !isFollowingRoute && (
          <RouteEditor
            gridMap={gridMap}
            route={route || { inicio: null, destinos: [] }}
            bestRoute={bestRoute}
            onUpdate={(newRoute) => {
              handleUpdate(newRoute)
            }}
            onCancel={cancelRoute}
            onStart={() => setIsFollowingRoute(true)}
          />
        )}
        {isFollowingRoute && route && (
          <RouteFollower
            route={route}
            onCancel={() => setIsFollowingRoute(false)}
            onFinish={() => {
              handleUpdate({ inicio: null, destinos: [] })
              cancelRoute()
            }}
            onChooseToEdit={() => {
              setIsCreatingRoute(true)
              setIsFollowingRoute(false)
            }}
            onUpdateRoute={handleUpdate}
            gridMap={gridMap}
          />
        )}
      </>
    )
  }
)
export default RoutingManager
