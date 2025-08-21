import type { TSPSolver } from '../interfaces/TSPSolver'

export class TSPSolverNN implements TSPSolver {
  #KNEAREST = 10 // used on 3-opt restricted. Specifies how many neighbors to consider
  #neighborList: number[][] = [] // used on 3-opt restricted.
  #distanceMatrix: number[][] = []

  /**
   * Solves the path variant of the Traveling Salesman Problem (TSP),
   * using Nearest Neighbour + optional 2-opt / 3-opt refinements.
   */
  getPath(
    distanceMatrix: number[][],
    optimizations: { twoOpt?: boolean; threeOpt?: boolean } = {
      twoOpt: true,
      threeOpt: true,
    }
  ) {
    this.#distanceMatrix = distanceMatrix
    this.#buildNeighborList(this.#KNEAREST)

    let route = this.#nearestNeighbour(false)

    if (optimizations.twoOpt) {
      route = this.#twoOpt(route, false)
    }
    if (optimizations.threeOpt) {
      route = this.#threeOptRestricted(route, false)
    }

    return { route, distance: this.#calculateDistance(route, false) }
  }

  /**
   * Solves the closed cycle variant of the TSP,
   * using Nearest Neighbour + optional 2-opt / 3-opt refinements.
   */
  getCycle(
    distanceMatrix: number[][],
    optimizations: { twoOpt?: boolean; threeOpt?: boolean } = {
      twoOpt: true,
      threeOpt: true,
    }
  ) {
    this.#distanceMatrix = distanceMatrix
    this.#buildNeighborList(this.#KNEAREST)

    let route = this.#nearestNeighbour(true) // closed cycle

    if (optimizations.twoOpt) {
      route = this.#twoOpt(route, true)
    }
    if (optimizations.threeOpt) {
      route = this.#threeOptRestricted(route, true) // cycle mode
    }

    return { route, distance: this.#calculateDistance(route, true) }
  }

  // --- Shared NN builder
  #nearestNeighbour(closeCycle: boolean): number[] {
    const numPoints = this.#distanceMatrix.length
    const visited = new Array(numPoints).fill(false)
    const route: number[] = []
    let currentPoint = 0
    visited[currentPoint] = true
    route.push(currentPoint)

    for (let i = 1; i < numPoints; i++) {
      let nearest = -1
      let minDistance = Number.POSITIVE_INFINITY
      for (let j = 0; j < numPoints; j++) {
        if (
          !visited[j] &&
          this.#distanceMatrix[currentPoint][j] < minDistance
        ) {
          minDistance = this.#distanceMatrix[currentPoint][j]
          nearest = j
        }
      }
      currentPoint = nearest
      visited[currentPoint] = true
      route.push(currentPoint)
    }

    if (closeCycle) route.push(route[0]) // close the loop
    return route
  }

  #calculateDistance(route: number[], isCycle: boolean) {
    let distance = 0
    for (let i = 0; i < route.length - 1; i++) {
      distance += this.#distanceMatrix[route[i]][route[i + 1]]
    }
    if (isCycle) {
      distance += this.#distanceMatrix[route[route.length - 1]][route[0]]
    }
    return distance
  }

  // --- 2-opt refinement
  #twoOpt(route: number[], isCycle: boolean) {
    let improved = true

    while (improved) {
      improved = false
      for (let i = 1; i < route.length - 2; i++) {
        for (let k = i + 1; k < route.length - 1; k++) {
          const newRoute = route.slice()
          newRoute.splice(i, k - i + 1, ...route.slice(i, k + 1).reverse())

          if (
            this.#calculateDistance(newRoute, isCycle) <
            this.#calculateDistance(route, isCycle)
          ) {
            route = newRoute
            improved = true
          }
        }
      }
    }
    return route
  }

  // --- Restricted 3-opt refinement
  #threeOptRestricted(route: number[], isCycle: boolean) {
    let improved = true
    while (improved) {
      improved = false
      const n = route.length

      for (let i = 0; i < n - 4; i++) {
        for (let j = i + 2; j < n - 2; j++) {
          for (let k = j + 2; k < n; k++) {
            if (!isCycle && i === 0 && k === n - 1) continue

            const a = route[i]
            const b = route[i + 1]
            const c = route[j]
            const d = route[j + 1]
            const e = route[k]

            if (
              !this.#isNeighbor(a, c) &&
              !this.#isNeighbor(b, d) &&
              !this.#isNeighbor(c, e)
            )
              continue

            const newRoutes = this.#generate3OptMoves(route, i, j, k)
            for (const newRoute of newRoutes) {
              if (
                this.#calculateDistance(newRoute, isCycle) <
                this.#calculateDistance(route, isCycle)
              ) {
                route = newRoute
                improved = true
                break
              }
            }
            if (improved) break
          }
          if (improved) break
        }
        if (improved) break
      }
    }
    return route
  }

  // --- Generate all possible 3-opt reconnections
  #generate3OptMoves(
    route: number[],
    i: number,
    j: number,
    k: number
  ): number[][] {
    const A = route.slice(0, i + 1)
    const B = route.slice(i + 1, j + 1)
    const C = route.slice(j + 1, k + 1)
    const D = route.slice(k + 1)

    return [
      [...A, ...B, ...C, ...D], // original
      [...A, ...B.reverse(), ...C, ...D],
      [...A, ...B, ...C.reverse(), ...D],
      [...A, ...B.reverse(), ...C.reverse(), ...D],
      [...A, ...C, ...B, ...D],
      [...A, ...C.reverse(), ...B, ...D],
      [...A, ...C, ...B.reverse(), ...D],
      [...A, ...C.reverse(), ...B.reverse(), ...D],
    ]
  }

  #buildNeighborList(k: number) {
    const n = this.#distanceMatrix.length
    this.#neighborList = []
    for (let i = 0; i < n; i++) {
      const neighbors = [...Array(n).keys()]
        .filter((j) => j !== i)
        .sort((a, b) => this.#distanceMatrix[i][a] - this.#distanceMatrix[i][b])
        .slice(0, k)
      this.#neighborList.push(neighbors)
    }
  }

  #isNeighbor(u: number, v: number): boolean {
    return this.#neighborList[u].includes(v)
  }
}
