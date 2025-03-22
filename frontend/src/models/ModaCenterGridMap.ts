import type ModaCenter from './ModaCenter'
import ModaCenterCreator from './ModaCenterCreator'

export class ModaCenterGridMap {
  static CAMINHO = 0
  static BOXE = 1
  static LOJA = 2
  static OBSTACULO = 3
  static BANHEIRO = 5

  #yxDimensions: [number, number] = [0, 0]
  #grid: number[][] = []

  #modaCenter: ModaCenter

  constructor() {
    this.#modaCenter = new ModaCenterCreator().create()
    this.#yxDimensions = [
      this.#modaCenter.topRight.y,
      this.#modaCenter.topRight.x,
    ]
    this.#generateGrid()
  }

  #generateGrid() {
    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () =>
      Array(this.#yxDimensions[1]).fill(0)
    )

    for (const loja of this.#modaCenter.lojas) {
      for (const pos of loja.gridArea) {
        this.#grid[pos.y][pos.x] = ModaCenterGridMap.LOJA
      }
    }
    for (const box of this.#modaCenter.boxes) {
      this.#grid[box.positionInGrid.y][box.positionInGrid.x] =
        ModaCenterGridMap.BOXE
    }
    for (const banheiro of this.#modaCenter.banheiros) {
      for (const pos of banheiro.gridArea) {
        this.#grid[pos.y][pos.x] = ModaCenterGridMap.BANHEIRO
      }
    }
    for (const obstaculo of this.#modaCenter.obstaculos) {
      for (const pos of obstaculo.gridArea) {
        this.#grid[pos.y][pos.x] = ModaCenterGridMap.OBSTACULO
      }
    }
  }

  getLojas() {
    return this.#modaCenter.lojas
  }

  getObstaculos() {
    return this.#modaCenter.obstaculos
  }

  getGrid() {
    return structuredClone(this.#grid)
  }
  getDimensions() {
    return this.#yxDimensions
  }
  getBounds() {
    const bounds: L.LatLngBoundsLiteral = [
      [0, 0],
      [this.#yxDimensions[0], this.#yxDimensions[1]],
    ]
    return bounds
  }

  getBoxe(y: number, x: number) {
    if (this.#grid[y][x] !== ModaCenterGridMap.BOXE) {
      console.error('Posição inválida x: ', x, ' y: ', y)
      return null
    }
    return this.#modaCenter.boxes.find((boxe) => {
      return boxe.positionInGrid.x === x && boxe.positionInGrid.y === y
    })
  }

  getSellingLocation(
    sellingLocation:
      | { setor: string; numero: number; rua: string }
      | { setor: string; numLoja: number; bloco: number }
  ) {
    if ('rua' in sellingLocation) {
      for (const box of this.#modaCenter.boxes) {
        if (
          box.numero === sellingLocation.numero &&
          box.setor === sellingLocation.setor &&
          box.rua === sellingLocation.rua
        ) {
          return box
        }
      }
    } else {
      for (const loja of this.#modaCenter.lojas) {
        if (
          loja.numLoja === sellingLocation.numLoja &&
          loja.setor === sellingLocation.setor &&
          loja.bloco === sellingLocation.bloco
        ) {
          return loja
        }
      }
    }
    return undefined
  }

  getBanheiros() {
    return this.#modaCenter.banheiros
  }

  getLoja(y: number, x: number) {
    if (this.#grid[y][x] !== ModaCenterGridMap.LOJA) {
      console.error('Posição inválida x: ', x, ' y: ', y)
      return null
    }
    return this.#modaCenter.lojas.find((loja) => {
      return loja.gridArea.some((pos) => pos.x === x && pos.y === y)
    })
  }

  findNearestBoxe(y: number, x: number) {
    let nearestBoxe = null
    let minDistance = Number.MAX_VALUE
    for (const boxe of this.#modaCenter.boxes) {
      const distance =
        Math.abs(boxe.positionInGrid.x - x) +
        Math.abs(boxe.positionInGrid.y - y)
      if (distance < minDistance) {
        minDistance = distance
        nearestBoxe = boxe
      }
    }
    return nearestBoxe
  }
}
