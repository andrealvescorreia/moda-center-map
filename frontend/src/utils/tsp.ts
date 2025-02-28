export function tspSolver(distanceMatrix: number[][]): number[] {
  const numPoints = distanceMatrix.length
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
      if (!visited[j] && distanceMatrix[currentPoint][j] < minDistance) {
        minDistance = distanceMatrix[currentPoint][j]
        nearest = j
      }
    }

    currentPoint = nearest
    visited[currentPoint] = true
    route.push(currentPoint)
  }

  // Refinamento 2-opt
  function twoOpt(route: number[]) {
    let improved = true
    while (improved) {
      improved = false
      for (let i = 1; i < route.length - 2; i++) {
        for (let k = i + 1; k < route.length - 1; k++) {
          const newRoute = route.slice()
          newRoute.splice(i, k - i + 1, ...route.slice(i, k + 1).reverse())

          if (calculateDistance(newRoute) < calculateDistance(route)) {
            route = newRoute
            improved = true
          }
        }
      }
    }
    return route
  }

  function calculateDistance(route: number[]) {
    let distance = 0
    for (let i = 0; i < route.length - 1; i++) {
      distance += distanceMatrix[route[i]][route[i + 1]]
    }
    return distance
  }

  // Aplica o refinamento 2-opt na rota obtida
  route = twoOpt(route)

  return route
}
