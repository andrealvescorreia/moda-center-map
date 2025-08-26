import { TSPSolverNN } from 'tsp-solver-nn'
import type { Destiny } from '../../../interfaces/Destiny'
import type { Position } from '../../../interfaces/Position'
import type { Route } from '../../../interfaces/Route'
import { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { RouteCalculator } from '../../../models/RouteCalculator'

export function addDestiny(route: Route, destiny: Destiny) {
  route.destinos.push(destiny)
  const newRoute = handleUpdate(route)
  return newRoute
}

export function removeDestiny(route: Route, destinyIndex: number) {
  route.destinos.splice(destinyIndex, 1)
  const newRoute = handleUpdate(route)
  return newRoute
}

export function changeStartingPoint(route: Route, newStartingPoint: Destiny) {
  route.inicio = newStartingPoint
  const newRoute = handleUpdate(route)
  return newRoute
}

export function getClearRoute() {
  return {
    inicio: null,
    destinos: [],
    passos: [],
  }
}

const handleUpdate = (newRoute: Route) => {
  if (!newRoute?.inicio) {
    // might happen when destinies where added from
    // the seller's page before the starting point was set.
    return { ...newRoute, passos: [] }
  }
  if (newRoute.destinos.length === 0) {
    return { ...newRoute, passos: [] }
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

  const gridMap = new ModaCenterGridMap()
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
  const newBestRoute = {
    inicio: newRoute.inicio,
    destinos: destinosMelhorOrdem.slice(1),
    passos: melhoresPassos,
  }
  return newBestRoute
}
