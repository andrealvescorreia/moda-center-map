import type { TSPSolver } from '../interfaces/TSPSolver'

export class TSPSolverNN implements TSPSolver {
  #distanceMatrix: number[][] = []

  /**
   *
   * @param distanceMatrix - A 2D reflexive matrix containing the distances between each pair of points.
   *                         The matrix should be symmetric, where distanceMatrix[i][j] represents the distance between point i and point j.
   */
  setDistanceMatrix(distanceMatrix: number[][]) {
    // TODO: validate distanceMatrix
    this.#distanceMatrix = distanceMatrix
  }

  /**
   * Solves the Traveling Salesman Problem (TSP) using the Nearest Neighbourhood heuristic
   * followed by a 2-opt refinement.
   *
   * @param distanceMatrix - A 2D reflexive matrix containing the distances between each pair of points.
   *                         The matrix should be symmetric, where distanceMatrix[i][j] represents the distance between point i and point j.
   * @returns An array representing the order of points in the optimized route.
   */
  solve(distanceMatrix: number[][]): number[] {
    this.setDistanceMatrix(distanceMatrix)
    const numPoints = this.#distanceMatrix.length
    const visited = new Array(numPoints).fill(false)
    let route = []
    let currentPoint = 0
    visited[currentPoint] = true
    route.push(currentPoint)

    // Vizinho Mais Próximo
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

    // Aplica o refinamento 2-opt na rota obtida
    route = this.#twoOpt(route)

    return route
  }

  // Refinamento 2-opt
  #twoOpt(route: number[]) {
    let improved = true
    while (improved) {
      improved = false
      for (let i = 1; i < route.length - 2; i++) {
        for (let k = i + 1; k < route.length - 1; k++) {
          const newRoute = route.slice()
          newRoute.splice(i, k - i + 1, ...route.slice(i, k + 1).reverse())

          if (
            this.#calculateDistance(newRoute) < this.#calculateDistance(route)
          ) {
            route = newRoute
            improved = true
          }
        }
      }
    }
    return route
  }

  #calculateDistance(route: number[]) {
    let distance = 0
    for (let i = 0; i < route.length - 1; i++) {
      distance += this.#distanceMatrix[route[i]][route[i + 1]]
    }
    return distance
  }
}
