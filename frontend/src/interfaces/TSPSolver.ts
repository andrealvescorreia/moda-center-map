export interface TSPSolver {
  getPath: (
    distanceMatrix: number[][],
    optimizations?: {
      twoOpt?: boolean
      threeOpt?: boolean
    }
  ) => { route: number[]; distance: number }
  getCycle: (
    distanceMatrix: number[][],
    optimizations?: {
      twoOpt?: boolean
      threeOpt?: boolean
    }
  ) => { route: number[]; distance: number }
}
