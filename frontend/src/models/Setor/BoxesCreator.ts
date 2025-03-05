import type { Boxe } from '../../interfaces/Boxe'
import type { Position } from '../../interfaces/Position'

export class BoxesCreator {
  #setor: Boxe['setor'] = 'Azul'
  #bttmLeft = { y: 0, x: 0 }
  #qtdBoxesHorizontal = 120
  #qtdRuas = 16 // A-P
  #ignoredAreas: { bottomLeft: Position; topRight: Position }[] = []

  setSetor(
    setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde' | 'Amarelo' | 'Branco'
  ) {
    this.#setor = setor
    return this
  }
  setBttmLeft({ y, x }: { y: number; x: number }) {
    this.#bttmLeft = { y, x }
    return this
  }
  setQtdBoxesHorizontal(qtdBoxesHorizontal: number) {
    this.#qtdBoxesHorizontal = qtdBoxesHorizontal
    return this
  }
  setQtdRuas(qtdRuas: number) {
    this.#qtdRuas = qtdRuas
    return this
  }
  setIgnoredAreas(
    ignoredAreas: { bottomLeft: Position; topRight: Position }[]
  ) {
    this.#ignoredAreas = ignoredAreas
    return this
  }
  addIgnoredArea({
    bttmLeft,
    topRight,
  }: { bttmLeft: Position; topRight: Position }) {
    this.#ignoredAreas.push({ bottomLeft: bttmLeft, topRight })
    return this
  }

  #isInIgnoredArea = (y: number, x: number) => {
    return this.#ignoredAreas.some(
      ({ bottomLeft: bttmLeft, topRight }) =>
        y >= bttmLeft.y && y <= topRight.y && x >= bttmLeft.x && x <= topRight.x
    )
  }

  #getRuaDoBoxe = (y: number, x: number) => {
    const letterPCharCode = 'P'.charCodeAt(0)

    const offset = Math.floor((x - this.#bttmLeft.x - 2) / 3)
    const ruaCharCode = letterPCharCode - offset - 1
    return String.fromCharCode(ruaCharCode)
  }

  #getNumeroDoBoxe = (y: number, x: number) => {
    const xOffSet = x - this.#bttmLeft.x - 1
    const yOffset = y - this.#bttmLeft.y

    const valorY = yOffset * 2 - Number.parseInt((yOffset / 5).toString()) * 2
    const valorX = xOffSet - 3 * Number.parseInt((xOffSet / 3).toString())
    return valorY - 1 + valorX
  }

  #getBoxe(y: number, x: number) {
    return {
      setor: this.#setor,
      rua: this.#getRuaDoBoxe(y, x),
      numero: this.#getNumeroDoBoxe(y, x),
      positionInGrid: { y, x },
    }
  }

  create() {
    const boxes: Boxe[] = []
    const bounds = this.getBounds()

    const stepX = 3
    const stepY = 5
    const boxWidth = 2
    const boxHeight = 4
    for (let i = bounds.bttmLeft.x + 1; i < bounds.topRight.x; i += stepX) {
      for (let j = bounds.bttmLeft.y + 1; j < bounds.topRight.y; j += stepY) {
        for (let x = i; x < i + boxWidth && x < bounds.topRight.x; x++) {
          for (let y = j; y < j + boxHeight && y < bounds.topRight.y; y++) {
            if (this.#isInIgnoredArea(y, x)) continue
            boxes.push(this.#getBoxe(y, x))
          }
        }
      }
    }

    return { boxes }
  }

  getBounds() {
    const topRight = {
      y: this.#qtdBoxesHorizontal / 1.6 + this.#bttmLeft.y + 1,
      x: (this.#qtdRuas - 1) * 3 + this.#bttmLeft.x + 1,
    }

    return {
      bttmLeft: this.#bttmLeft,
      topRight,
    }
  }
}
