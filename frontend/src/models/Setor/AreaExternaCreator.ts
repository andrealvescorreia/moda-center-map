import type { IBanheiro } from '../../interfaces/IBanheiro'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'
import BlocoFacade from '../BlocoLojas/Facade'

export class AreaExternaCreator {
  #bttmLeft!: Position
  #setor!: Loja['setor']
  #qtdBlocos!: Loja['bloco']
  #paddingLeftRight = 3
  #heightBlocoLojas!: number
  #widthBlocoLojas!: number
  #gapBetweenLojas = 2
  #paddingDown = 0

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

  #calculateBlocoDimensions() {
    const bloco = new BlocoFacade().make(this.#setor, 1, { x: 0, y: 0 })
    if (!bloco) {
      console.error('bloco não criado!')
      return
    }
    this.#heightBlocoLojas = bloco.topRight.y
    this.#widthBlocoLojas = bloco.topRight.x
  }

  #calculateQtdBlocos() {
    if (this.#setor === 'Amarelo' || this.#setor === 'Branco') {
      this.#qtdBlocos = 4
      return
    }
    this.#qtdBlocos = 8
  }

  create() {
    this.#calculateBlocoDimensions()
    this.#calculateQtdBlocos()
    if (this.#setor === 'Azul' || this.#setor === 'Laranja') {
      return this.#createAzulLaranja()
    }
    if (this.#setor === 'Verde' || this.#setor === 'Vermelho') {
      return this.#createVerdeVermelho()
    }
    return this.#createAmareloBranco()
  }

  #createBlocos({ reverse }: { reverse: boolean }) {
    let lojas: Loja[] = []
    let banheiros: IBanheiro[] = []
    const bounds = this.getBounds()
    const stepY = this.#gapBetweenLojas + this.#heightBlocoLojas
    let yOffset = 0
    const start = reverse ? this.#qtdBlocos : 1
    const end = reverse ? 1 : this.#qtdBlocos
    const step = reverse ? -1 : 1

    for (
      let iBloco = start;
      reverse ? iBloco >= end : iBloco <= end;
      iBloco += step
    ) {
      if ((reverse && iBloco === 7) || (!reverse && iBloco === 8)) {
        yOffset -= 2
      }

      const blocoBottomLeft = {
        y: bounds.bottomLeft.y + yOffset + this.#paddingDown,
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
    return {
      lojas,
      banheiros,
      bounds,
    }
  }

  #createAzulLaranja() {
    return this.#createBlocos({ reverse: false })
  }

  #createAmareloBranco() {
    this.#qtdBlocos = 4
    this.#gapBetweenLojas = 9
    this.#paddingDown = 6
    this.#paddingLeftRight -= 1
    return this.#createBlocos({ reverse: false })
  }

  #createVerdeVermelho() {
    return this.#createBlocos({ reverse: true })
  }

  getBounds() {
    const topRight: Position = {
      x: this.#bttmLeft.x + this.#widthBlocoLojas + this.#paddingLeftRight * 2,
      y:
        this.#bttmLeft.y +
        this.#heightBlocoLojas * this.#qtdBlocos +
        this.#gapBetweenLojas * (this.#qtdBlocos - 1) -
        2,
    }

    return {
      bottomLeft: this.#bttmLeft,
      topRight,
    }
  }
}
