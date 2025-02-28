export interface TSPSolver {
  solve: (distanceMatrix: number[][]) => number[]
}
