import PF from 'pathfinding'
import type { Position } from '../interfaces/Position'
import type { TSPSolver } from '../interfaces/TSPSolver'
import { ModaCenterGridMap } from './ModaCenterGridMap'
import { Destiny } from '../interfaces/Destiny'

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
      this.#grid[startPos.position.y][startPos.position.x] !== ModaCenterGridMap.CAMINHO
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
        (this.#grid[dest.position.y][dest.position.x] !== ModaCenterGridMap.BOXE &&
          this.#grid[dest.position.y][dest.position.x] !== ModaCenterGridMap.LOJA)
      ) {
        console.error(`Posição de destino inválida x: ${dest.position.x} y: ${dest.position.y}`)
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
        const path = finder.findPath(
          destinos[i].position.x,
          destinos[i].position.y,
          destinos[j].position.x,
          destinos[j].position.y,
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

  #calculateBestSteps(destinos: Destiny[], grid: number[][]) {
    const finder = new PF.AStarFinder()
    let steps: Position[] = [{ x: destinos[0].position.x, y: destinos[0].position.y }]
    for (let i = 0; i < destinos.length - 1; i++) {
      const path = finder.findPath(
        destinos[i].position.x,
        destinos[i].position.y,
        destinos[i + 1].position.x,
        destinos[i + 1].position.y,
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
