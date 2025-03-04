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
      return { lojas: [] }
    }

    let lojas: Loja[] = []
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
      const blocoLojasExternas = new BlocoTipoALojasExternasCreator()
        .setBloco(iBloco)
        .setSetor(this.#setor)
        .setEdgeBtmLeftYX(edgeBtmLeftYX)
        .create()

      if (!blocoLojasExternas) {
        console.error('Não foi possível criar o Bloco: ', iBloco)
        continue
      }
      lojas = [...lojas, ...blocoLojasExternas]

      yOffset += stepY
    }
    return { lojas }
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
