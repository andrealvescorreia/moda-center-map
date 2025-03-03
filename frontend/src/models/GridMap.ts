import type { Boxe } from '../interfaces/Boxe'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { AreaExternaSetorLojasCreator } from './AreaExternaSetorLojasCreator'
import { AreaInternaSetorBoxesCreator } from './AreaInternaSetorBoxesCreator'

export class GridMap {
  static CAMINHO = 0
  static BOXE = 1
  static LOJA_INTERNA = 2
  static RESTAURANTE = 3
  static LOJA_EXTERNA = 4
  static BANHEIRO = 5

  #yxDimensions: [number, number] = [0, 0]
  #grid: number[][] = []

  #lojasExternas: Loja[] = []
  #boxes: Boxe[] = []

  #areaInternaBounds: { bottomLeft: Position; topRight: Position } = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  #areaExternaBounds: { bottomLeft: Position; topRight: Position } = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  constructor() {
    this.#createLojasExternas()
    this.#createBoxes()
    //this.#fillGridWithLojasInternasEBanheiros()
    //this.#fillGridWithPraçasDeAlimentação()
    this.#generateGrid()
  }

  #generateGrid() {
    this.#yxDimensions = [
      this.#areaInternaBounds.topRight.y,
      this.#areaInternaBounds.topRight.x,
    ]
    console.log('yxDimensions: ', this.#yxDimensions)

    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () =>
      Array(this.#yxDimensions[1]).fill(0)
    )

    for (const loja of this.#lojasExternas) {
      for (const pos of loja.gridArea) {
        this.#grid[pos.y][pos.x] = GridMap.LOJA_EXTERNA
      }
    }
    for (const box of this.#boxes) {
      this.#grid[box.positionInGrid.y][box.positionInGrid.x] = GridMap.BOXE
    }
  }

  #createLojasExternas() {
    const areaExternaCreator = new AreaExternaSetorLojasCreator()
      .setSetor('Azul')
      .setBttmLeft({ x: 0, y: 0 })
      .setQtdBlocos(8)
      .setPaddingLeftRight(2)

    const { lojas } = areaExternaCreator.create()
    this.#lojasExternas = [...this.#lojasExternas, ...lojas]

    this.#areaExternaBounds = areaExternaCreator.getBounds()

    this.#areaInternaBounds.bottomLeft = {
      x: this.#areaExternaBounds.topRight.x,
      y: 0,
    }
  }

  #createBoxes() {
    const btmLeftAreaLojasInternas = {
      y: 4 * 5 + 1,
      x: 5 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x,
    }

    const topRightAreaLojasInternas = {
      y: btmLeftAreaLojasInternas.y + 14,
      x: btmLeftAreaLojasInternas.x + 14,
    }

    const bttmLeftAreaPraçaAlimentação = {
      y: 11 * 5 + 1,
      x: 11 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x,
    }

    const topRightAreaPraçaAlimentação = {
      y: bttmLeftAreaPraçaAlimentação.y + 19,
      x: bttmLeftAreaPraçaAlimentação.x + 11,
    }

    const setorCreator = new AreaInternaSetorBoxesCreator()
      .setSetor('Azul')
      .setBttmLeft(this.#areaInternaBounds.bottomLeft)
      .addIgnoredArea({
        bttmLeft: btmLeftAreaLojasInternas,
        topRight: topRightAreaLojasInternas,
      })
      .addIgnoredArea({
        bttmLeft: bttmLeftAreaPraçaAlimentação,
        topRight: topRightAreaPraçaAlimentação,
      })

    const { boxes } = setorCreator.create()
    const bounds = setorCreator.getBounds()

    this.#areaInternaBounds.topRight = bounds.topRight

    this.#boxes = boxes
  }

  getLojasExternas() {
    return this.#lojasExternas
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

  getLojaExterna(y: number, x: number) {
    return this.#lojasExternas.find((loja) => {
      return loja.gridArea.some((pos) => pos.x === x && pos.y === y)
    })
  }
}
