import PF from 'pathfinding'
import type { Destiny } from '../interfaces/Destiny'
import type { Position } from '../interfaces/Position'
import type { TSPSolver } from '../interfaces/TSPSolver'
import { ModaCenterGridMap } from './ModaCenterGridMap'

export class RouteCalculator {
  #grid: number[][]
  #tspSolver: TSPSolver

  constructor({ grid, tspSolver }: { grid: number[][]; tspSolver: TSPSolver }) {
    this.#grid = structuredClone(grid)
    this.#tspSolver = tspSolver
  }

  setGrid(grid: number[][]) {
    this.#grid = structuredClone(grid)
  }

  calculateBestRoute({
    startPos,
    destinies,
  }: { startPos: Destiny; destinies: Destiny[] }) {
    if (
      startPos.position.x < 0 ||
      startPos.position.y < 0 ||
      startPos.position.x >= this.#grid[0].length ||
      startPos.position.y >= this.#grid.length ||
      this.#grid[startPos.position.y][startPos.position.x] !==
      ModaCenterGridMap.CAMINHO
    ) {
      console.error(
        'Posição inicial inválida x: ',
        startPos.position.x,
        ' y: ',
        startPos.position.y
      )
    }
    const auxGrid = structuredClone(this.#grid)
    for (const dest of destinies) {
      if (
        dest.position.x < 0 ||
        dest.position.y < 0 ||
        dest.position.x >= this.#grid[0].length ||
        dest.position.y >= this.#grid.length ||
        (this.#grid[dest.position.y][dest.position.x] !==
          ModaCenterGridMap.BOXE &&
          this.#grid[dest.position.y][dest.position.x] !==
          ModaCenterGridMap.LOJA)
      ) {
        console.error(
          `Posição de destino inválida x: ${dest.position.x} y: ${dest.position.y}`
        )
        console.log(this.#grid[dest.position.y][dest.position.x])
      }
      auxGrid[dest.position.y][dest.position.x] = 0
    }

    const destinos = [startPos, ...destinies]

    const destiniesBestOrder = this.#calculateBestOrder(destinos, auxGrid)
    const steps = this.#calculateBestSteps(destiniesBestOrder, auxGrid)

    return {
      destiniesBestOrder,
      steps,
    }
  }

  #calculateBestOrder(destinos: Destiny[], grid: number[][]) {
    // matriz 2d reflexiva com as distancias entre cada par de destinos
    const distancias = Array.from({ length: destinos.length }, () =>
      Array(destinos.length).fill(0)
    )
    const finder = new PF.AStarFinder()
    // preenche a matriz de distancias de forma reflexiva
    for (let i = 0; i < destinos.length; i++) {
      for (let j = i + 1; j < destinos.length; j++) {
        if (destinos.length <= 20) {
          const path = finder.findPath(
            destinos[i].position.x,
            destinos[i].position.y,
            destinos[j].position.x,
            destinos[j].position.y,
            new PF.Grid(grid)
          )
          distancias[i][j] = path.length
          distancias[j][i] = path.length
        } else {
          // for large quantity of destinies, use an approximation of the distances to reduce computation time
          const distanceResult = this.#calculateDistance({
            p1: { x: destinos[i].position.x, y: destinos[i].position.y },
            p2: { x: destinos[j].position.x, y: destinos[j].position.y },
          })
          distancias[i][j] = distanceResult.adjustedDistance
          distancias[j][i] = distanceResult.adjustedDistance
        }
      }
    }
    const result = this.#tspSolver.getPath(distancias, {
      twoOpt: true,
      threeOpt: destinos.length < 30,
    })
    const indicesMelhorCaminho = result.route
    const destiniesBestOrder = indicesMelhorCaminho.map(
      (i: number) => destinos[i]
    )
    return destiniesBestOrder
  }

  #calculateBestSteps(destinos: Destiny[], grid: number[][]) {
    const finder = new PF.AStarFinder()
    let steps: Position[] = [
      { x: destinos[0].position.x, y: destinos[0].position.y },
    ]
    for (let i = 0; i < destinos.length - 1; i++) {
      const path = finder.findPath(
        destinos[i].position.x,
        destinos[i].position.y,
        destinos[i + 1].position.x,
        destinos[i + 1].position.y,
        new PF.Grid(grid)
      )

      path.shift() // remove repeated

      steps = [
        ...steps,
        ...path.map((p) => {
          return { x: p[0], y: p[1] }
        }),
      ]
    }
    return steps
  }

  #calculateDistance({
    p1,
    p2,
  }: {
    p1: { x: number; y: number }
    p2: { x: number; y: number }
  }) {
    const oppositeLeg = Math.abs(p2.y - p1.y)
    const adjacentLeg = Math.abs(p2.x - p1.x)

    const angleDeg = (Math.atan2(oppositeLeg, adjacentLeg) * 180) / Math.PI
    const distance = Math.sqrt(oppositeLeg ** 2 + adjacentLeg ** 2)
    const normalizedVector = {
      x: adjacentLeg / distance,
      y: oppositeLeg / distance,
    }

    // How straigh the angle between p1 and p2 is. ranges from 0 to 1.
    // 0 means an accute angle like 45 degrees
    // 1 means straitgh angles like 90 or 0 degrees
    const angleStraitghness = Math.abs(normalizedVector.x - normalizedVector.y)

    const multiplicationFactor = 1.5 - angleStraitghness / 2

    // The adjustedDistance increases as the angle becomes less straight, simulating the likelihood of encountering obstacles.
    const adjustedDistance = distance * multiplicationFactor
    return {
      angleDeg,
      angleStraitghness,
      distance,
      adjustedDistance,
    }
  }
}
