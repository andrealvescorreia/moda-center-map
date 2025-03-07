import PF from 'pathfinding'
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
  }: { startPos: Position; destinies: Position[] }) {
    if (
      startPos.x < 0 ||
      startPos.y < 0 ||
      startPos.x >= this.#grid[0].length ||
      startPos.y >= this.#grid.length ||
      this.#grid[startPos.y][startPos.x] !== ModaCenterGridMap.CAMINHO
    ) {
      console.error(
        'Posição inicial inválida x: ',
        startPos.x,
        ' y: ',
        startPos.y
      )
    }
    const auxGrid = structuredClone(this.#grid)
    for (const dest of destinies) {
      if (
        dest.x < 0 ||
        dest.y < 0 ||
        dest.x >= this.#grid[0].length ||
        dest.y >= this.#grid.length ||
        (this.#grid[dest.y][dest.x] !== ModaCenterGridMap.BOXE &&
          this.#grid[dest.y][dest.x] !== ModaCenterGridMap.LOJA)
      ) {
        console.error(`Posição de destino inválida x: ${dest.x} y: ${dest.y}`)
        console.log(this.#grid[dest.y][dest.x])
      }
      auxGrid[dest.y][dest.x] = 0
    }

    const destinos = [startPos, ...destinies]

    const destiniesBestOrder = this.#calculateBestOrder(destinos, auxGrid)
    const steps = this.#calculateBestSteps(destiniesBestOrder, auxGrid)

    return {
      destiniesBestOrder,
      steps,
    }
  }

  #calculateBestOrder(destinos: Position[], grid: number[][]) {
    // matriz 2d reflexiva com as distancias entre cada par de destinos
    const distancias = Array.from({ length: destinos.length }, () =>
      Array(destinos.length).fill(0)
    )
    const finder = new PF.AStarFinder()

    // preenche a matriz de distancias de forma reflexiva
    for (let i = 0; i < destinos.length; i++) {
      for (let j = i + 1; j < destinos.length; j++) {
        const path = finder.findPath(
          destinos[i].x,
          destinos[i].y,
          destinos[j].x,
          destinos[j].y,
          new PF.Grid(grid)
        )
        distancias[i][j] = path.length
        distancias[j][i] = path.length
      }
    }
    const indicesMelhorCaminho = this.#tspSolver.solve(distancias)
    const destiniesBestOrder = indicesMelhorCaminho.map(
      (i: number) => destinos[i]
    )
    return destiniesBestOrder
  }

  #calculateBestSteps(destinos: Position[], grid: number[][]) {
    const finder = new PF.AStarFinder()
    let steps: Position[] = [{ x: destinos[0].x, y: destinos[0].y }]
    for (let i = 0; i < destinos.length - 1; i++) {
      const path = finder.findPath(
        destinos[i].x,
        destinos[i].y,
        destinos[i + 1].x,
        destinos[i + 1].y,
        new PF.Grid(grid)
      )

      path.shift() // remove repetido

      steps = [
        ...steps,
        ...path.map((p) => {
          return { x: p[0], y: p[1] }
        }),
      ]
    }
    return steps
  }
}
