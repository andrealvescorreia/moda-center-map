import { createBlocoLojasExternas } from '../functions/createBlocoLojasExternas'
import type { Position } from '../interfaces/Position'
import type { LojaExterna } from './LojaExterna'

export class GridMap {
  #yxDimensions: [number, number]
  #grid: number[][]

  static CAMINHO = 0
  static BOXE = 1
  static LOJAS_INTERNAS = 2
  static RESTAURANTES = 3
  static LOJAS_EXTERNAS = 4
  static BANHEIROS = 5

  #widthHeightBlocoLojasExternas = [8, 8]
  #gapBetweenLojasExternasAndBoxes = 1

  #boxesAreaAzulLeftBottomCorner: Position = {
    x:
      this.#widthHeightBlocoLojasExternas[0] +
      this.#gapBetweenLojasExternasAndBoxes * 2,
    y: 0,
  }

  #lojasExternas: LojaExterna[] = []

  constructor() {
    this.#yxDimensions = [
      15 * 5 + 1,
      15 * 3 +
        1 +
        this.#widthHeightBlocoLojasExternas[0] +
        this.#gapBetweenLojasExternasAndBoxes * 2,
    ]

    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () =>
      Array(this.#yxDimensions[1]).fill(0)
    )
    this.#fillGridWithBoxes()
    this.#fillGridWithLojasInternasEBanheiros()
    this.#fillGridWithPraçasDeAlimentação()
    this.#fillGridWithLojasExternas()
  }

  #fillGridWithBoxes() {
    const stepX = 3
    const stepY = 5
    const boxWidth = 2
    const boxHeight = 4
    for (
      let i = this.#boxesAreaAzulLeftBottomCorner.x + 1;
      i < this.#yxDimensions[1];
      i += stepX
    ) {
      for (
        let j = this.#boxesAreaAzulLeftBottomCorner.y + 1;
        j < this.#yxDimensions[0];
        j += stepY
      ) {
        for (let x = i; x < i + boxWidth && x < this.#yxDimensions[1]; x++) {
          for (let y = j; y < j + boxHeight && y < this.#yxDimensions[0]; y++) {
            this.#grid[y][x] = GridMap.BOXE
          }
        }
      }
    }
  }

  #fillGridWithLojasExternas() {
    const gapBetweenBlocosLojasExternas = 2
    const stepY =
      gapBetweenBlocosLojasExternas + this.#widthHeightBlocoLojasExternas[1]
    let yOffset = 0

    for (let i = 1; i <= 7; i++) {
      const edgeBtmLeftYX: [number, number] = [
        0 + yOffset,
        this.#boxesAreaAzulLeftBottomCorner.x -
          this.#widthHeightBlocoLojasExternas[0] -
          this.#gapBetweenLojasExternasAndBoxes,
      ] // !setor azul
      const bloco1LojasExternas = createBlocoLojasExternas(
        'Azul',
        i,
        edgeBtmLeftYX
      )
      this.#lojasExternas = [...this.#lojasExternas, ...bloco1LojasExternas]

      for (const loja of bloco1LojasExternas) {
        for (const pos of loja.gridArea) {
          this.#grid[pos.y][pos.x] = GridMap.LOJAS_EXTERNAS
        }
      }
      yOffset += stepY
    }
  }

  getLojasExternas() {
    return this.#lojasExternas
  }

  #fillGridWithLojasInternasEBanheiros() {
    const areaHeight = 14
    const areaWidth = 14

    // !vale para setor azul e laranja
    const edgeBtmLeft = {
      y: 4 * 5 + 1,
      x: 5 * 3 + 1 + this.#boxesAreaAzulLeftBottomCorner.x,
    }

    for (let i = 0; i < areaWidth; i++) {
      for (let j = 0; j < areaHeight; j++) {
        this.#grid[edgeBtmLeft.y + j][edgeBtmLeft.x + i] =
          GridMap.LOJAS_INTERNAS
      }
    }
  }

  #fillGridWithPraçasDeAlimentação() {
    const areaHeight = 19
    const areaWidth = 11

    const edgeBtmLeftYX = [
      11 * 5 + 1,
      11 * 3 + 1 + this.#boxesAreaAzulLeftBottomCorner.x,
    ] // !setor azul

    for (let i = 0; i < areaHeight; i++) {
      for (let j = 0; j < areaWidth; j++) {
        if (j < areaWidth / 2)
          this.#grid[edgeBtmLeftYX[0] + i][edgeBtmLeftYX[1] + j] =
            GridMap.CAMINHO
        else
          this.#grid[edgeBtmLeftYX[0] + i][edgeBtmLeftYX[1] + j] =
            GridMap.RESTAURANTES
      }
    }
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
    return {
      setor: 'Azul',
      rua: this.#getRuaDoBoxe(y, x),
      numero: this.#getNumeroDoBoxe(y, x),
    }
  }

  #getRuaDoBoxe = (y: number, x: number) => {
    const letterPCharCode = 'P'.charCodeAt(0)

    const offset = Math.floor(
      (x - this.#boxesAreaAzulLeftBottomCorner.x - 2) / 3
    )
    const ruaCharCode = letterPCharCode - offset - 1
    return String.fromCharCode(ruaCharCode)
  }

  getLojaExterna(y: number, x: number) {
    return this.#lojasExternas.find((loja) => {
      return loja.gridArea.some((pos) => pos.x === x && pos.y === y)
    })
  }

  #getNumeroDoBoxe = (y: number, x: number) => {
    const xOffSet = x - this.#boxesAreaAzulLeftBottomCorner.x - 1
    const yOffset = y - this.#boxesAreaAzulLeftBottomCorner.y

    const valorY = yOffset * 2 - Number.parseInt((yOffset / 5).toString()) * 2
    const valorX = xOffSet - 3 * Number.parseInt((xOffSet / 3).toString())
    return valorY - 1 + valorX
  }
}
