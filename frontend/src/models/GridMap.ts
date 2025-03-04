import type { Boxe } from '../interfaces/Boxe'
import type { Loja } from '../interfaces/Loja'
import { SetorCreator } from './SetorCreator'

export class GridMap {
  static CAMINHO = 0
  static BOXE = 1
  static LOJA_INTERNA = 2
  static RESTAURANTE = 3
  static LOJA_EXTERNA = 4
  static BANHEIRO = 5

  #yxDimensions: [number, number] = [0, 0]
  #grid: number[][] = []

  #lojas: Loja[] = []
  #boxes: Boxe[] = []

  constructor() {
    const { lojas, boxes, bounds, banheiros } = new SetorCreator()
      .setSetor('Azul')
      .setBottomLeft({ y: 0, x: 0 })
      .create()
    this.#lojas = lojas
    this.#boxes = boxes
    this.#yxDimensions = [bounds.topRight.y, bounds.topRight.x]
    //this.#banheiros = banheiros

    this.#generateGrid()
  }

  #generateGrid() {
    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () =>
      Array(this.#yxDimensions[1]).fill(0)
    )

    for (const loja of this.#lojas) {
      for (const pos of loja.gridArea) {
        this.#grid[pos.y][pos.x] = GridMap.LOJA_EXTERNA
      }
    }
    for (const box of this.#boxes) {
      this.#grid[box.positionInGrid.y][box.positionInGrid.x] = GridMap.BOXE
    }
  }

  getLojas() {
    return this.#lojas
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
    if (this.#grid[y][x] !== GridMap.BOXE) {
      console.error('Posição inválida x: ', x, ' y: ', y)
      return null
    }
    return this.#boxes.find((boxe) => {
      return boxe.positionInGrid.x === x && boxe.positionInGrid.y === y
    })
  }

  getLoja(y: number, x: number) {
    if (
      this.#grid[y][x] !== GridMap.LOJA_EXTERNA &&
      this.#grid[y][x] !== GridMap.LOJA_INTERNA
    ) {
      console.error('Posição inválida x: ', x, ' y: ', y)
      return null
    }
    return this.#lojas.find((loja) => {
      return loja.gridArea.some((pos) => pos.x === x && pos.y === y)
    })
  }
}
