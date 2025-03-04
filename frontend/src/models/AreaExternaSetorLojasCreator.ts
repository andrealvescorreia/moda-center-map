import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { BlocoTipoALojasExternasCreator } from './BlocoTipoALojasExternasCreator'

export class AreaExternaSetorLojasCreator {
  #bttmLeft: Position = { y: 0, x: 0 }
  #setor: Loja['setor'] = 'Azul'
  #qtdBlocos: Loja['bloco'] = 8
  #paddingLeftRight = 2
  #heightBlocoLojasExternas = 8
  #widthBlocoLojasExternas = 8
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

    const stepY = this.#gapBetweenLojas + this.#heightBlocoLojasExternas
    let yOffset = 0

    for (let iBloco = 1; iBloco <= this.#qtdBlocos; iBloco++) {
      if (iBloco === 8) {
        yOffset -= 2
      }
      const edgeBtmLeftYX: [number, number] = [
        bounds.bottomLeft.y + yOffset,
        bounds.topRight.x -
          this.#widthBlocoLojasExternas -
          this.#paddingLeftRight,
      ] // !setor azul
      const bloco = new BlocoTipoALojasExternasCreator()
        .setBloco(iBloco)
        .setSetor(this.#setor)
        .setEdgeBtmLeftYX(edgeBtmLeftYX)
        .create()

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
          this.#bttmLeft.x +
          this.#widthBlocoLojasExternas +
          this.#paddingLeftRight * 2,
        y:
          this.#bttmLeft.y +
          this.#heightBlocoLojasExternas * this.#qtdBlocos +
          this.#gapBetweenLojas * (this.#qtdBlocos - 1) -
          2,
      },
    }
  }
}
