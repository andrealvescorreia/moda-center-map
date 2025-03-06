import type { Boxe } from '../interfaces/Boxe'
import type { IBanheiro } from '../interfaces/IBanheiro'
import type { IObstaculo } from '../interfaces/IObstaculo'
import type { Loja } from '../interfaces/Loja'
import SetorFacade from './Setor/Facade'

export class GridMap {
  static CAMINHO = 0
  static BOXE = 1
  static LOJA = 2
  static OBSTACULO = 3
  static BANHEIRO = 5

  #yxDimensions: [number, number] = [0, 0]
  #grid: number[][] = []

  #lojas: Loja[] = []
  #boxes: Boxe[] = []
  #banheiros: IBanheiro[] = []
  #obstaculos: IObstaculo[] = []

  constructor() {
    //exemplo
    const setorAzul = new SetorFacade().make('Vermelho', { x: 0, y: 0 })
    this.#banheiros = setorAzul.banheiros
    this.#lojas = setorAzul.lojas
    this.#obstaculos = setorAzul.obstaculos
    this.#boxes = setorAzul.boxes

    const setorLaranja = new SetorFacade().make('Verde', {
      x: setorAzul.topRight.x,
      y: 0,
    })
    this.#banheiros = this.#banheiros.concat(setorLaranja.banheiros)
    this.#lojas = this.#lojas.concat(setorLaranja.lojas)
    this.#obstaculos = this.#obstaculos.concat(setorLaranja.obstaculos)
    this.#boxes = this.#boxes.concat(setorLaranja.boxes)

    this.#yxDimensions = [setorLaranja.topRight.y, setorLaranja.topRight.x]

    this.#generateGrid()
  }

  #generateGrid() {
    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () =>
      Array(this.#yxDimensions[1]).fill(0)
    )

    for (const loja of this.#lojas) {
      for (const pos of loja.gridArea) {
        this.#grid[pos.y][pos.x] = GridMap.LOJA
      }
    }
    for (const box of this.#boxes) {
      this.#grid[box.positionInGrid.y][box.positionInGrid.x] = GridMap.BOXE
    }
    for (const banheiro of this.#banheiros) {
      for (const pos of banheiro.gridArea) {
        this.#grid[pos.y][pos.x] = GridMap.BANHEIRO
      }
    }
    for (const obstaculo of this.#obstaculos) {
      for (const pos of obstaculo.gridArea) {
        this.#grid[pos.y][pos.x] = GridMap.OBSTACULO
      }
    }
  }

  getLojas() {
    return this.#lojas
  }

  getObstaculos() {
    return this.#obstaculos
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

  getBanheiros() {
    return this.#banheiros
  }

  getLoja(y: number, x: number) {
    if (this.#grid[y][x] !== GridMap.LOJA) {
      console.error('Posição inválida x: ', x, ' y: ', y)
      return null
    }
    return this.#lojas.find((loja) => {
      return loja.gridArea.some((pos) => pos.x === x && pos.y === y)
    })
  }
}
