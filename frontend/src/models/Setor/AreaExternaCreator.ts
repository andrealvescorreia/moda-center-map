import type { IBanheiro } from '../../interfaces/IBanheiro'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'
import BlocoFacade from '../BlocoLojas/Facade'

export class AreaExternaCreator {
  #bttmLeft: Position = { y: 0, x: 0 }
  #setor: Loja['setor'] = 'Azul'
  #qtdBlocos: Loja['bloco'] = 8
  #paddingLeftRight = 2
  #heightBlocoLojas = 8
  #widthBlocoLojas = 8
  #gapBetweenLojas = 2

  setSetor(setor: Loja['setor']) {
    this.#setor = setor
    return this
  }
  setBttmLeft(bttmLeft: Position) {
    this.#bttmLeft = bttmLeft
    return this
  }
  setQtdBlocos(qtdBlocos: Loja['bloco']) {
    this.#qtdBlocos = qtdBlocos
    return this
  }
  setPaddingLeftRight(paddingLeftRight: number) {
    this.#paddingLeftRight = paddingLeftRight
    return this
  }

  create() {
    if (this.#setor === 'Branco' || this.#setor === 'Amarelo') {
      //!temp
      console.error(`setor ${this.#setor} ainda não suportado`)
      return { lojas: [], banheiros: [] }
    }

    let lojas: Loja[] = []
    let banheiros: IBanheiro[] = []
    const bounds = this.getBounds()

    const stepY = this.#gapBetweenLojas + this.#heightBlocoLojas
    let yOffset = 0

    for (let iBloco = 1; iBloco <= this.#qtdBlocos; iBloco++) {
      if (iBloco === 8) {
        yOffset -= 2
      }

      const blocoBottomLeft = {
        y: bounds.bottomLeft.y + yOffset,
        x: bounds.topRight.x - this.#widthBlocoLojas - this.#paddingLeftRight,
      }
      const bloco = new BlocoFacade().make(this.#setor, iBloco, blocoBottomLeft)

      if (!bloco) {
        console.error('bloco não criado!')
        return { lojas: [], banheiros: [] }
      }
      lojas = [...lojas, ...bloco.lojas]
      banheiros = [...banheiros, ...bloco.banheiros]

      yOffset += stepY
    }
    return { lojas, banheiros }
  }

  getBounds() {
    return {
      bottomLeft: this.#bttmLeft,
      topRight: {
        x:
          this.#bttmLeft.x + this.#widthBlocoLojas + this.#paddingLeftRight * 2,
        y:
          this.#bttmLeft.y +
          this.#heightBlocoLojas * this.#qtdBlocos +
          this.#gapBetweenLojas * (this.#qtdBlocos - 1) -
          2,
      },
    }
  }
}
