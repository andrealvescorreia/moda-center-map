import type { Boxe } from '../interfaces/Boxe'
import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { AreaExternaSetorLojasCreator } from './AreaExternaSetorLojasCreator'
import { BlocoLojasInternasCreator } from './BlocoLojasInternasCreator'
import { SetorBoxesCreator } from './SetorBoxesCreator'

export class SetorCreator {
  #setor: Loja['setor'] = 'Azul'
  #bottomLeft: { y: number; x: number } = { y: 0, x: 0 }

  #areaInternaBounds: { bottomLeft: Position; topRight: Position } = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  #areaLojasInternas: { bottomLeft: Position; topRight: Position } = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  #areaExternaBounds: { bottomLeft: Position; topRight: Position } = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  setSetor(setor: Loja['setor']) {
    this.#setor = setor
    return this
  }
  setBottomLeft({ y, x }: { y: number; x: number }) {
    this.#bottomLeft = { y, x }
    return this
  }

  create() {
    //!setor azul
    if (this.#setor !== 'Azul') {
      console.error(`setor ${this.#setor} ainda não suportado`)
      return {
        lojas: [],
        banheiros: [],
        boxes: [],
        bounds: { bottomLeft: { x: 0, y: 0 }, topRight: { x: 0, y: 0 } },
      }
    }

    const lojas: Loja[] = []
    const banheiros: IBanheiro[] = []

    const { lojasExternas, banheirosExternos } = this.#createLojasExternas()
    const { lojasInternas, banheirosInternos } = this.#createLojasInternas()
    const boxes: Boxe[] = this.#createBoxes()

    lojas.push(...lojasExternas, ...lojasInternas)
    banheiros.push(...banheirosExternos, ...banheirosInternos)

    const bounds = {
      bottomLeft: this.#bottomLeft,
      topRight: this.#areaInternaBounds.topRight,
    }

    return { boxes, lojas, banheiros, bounds }
  }

  #createLojasExternas() {
    const areaExternaCreator = new AreaExternaSetorLojasCreator()
      .setSetor(this.#setor)
      .setBttmLeft(this.#bottomLeft)
      .setQtdBlocos(8)
      .setPaddingLeftRight(2)

    const { lojas } = areaExternaCreator.create()

    this.#areaExternaBounds = areaExternaCreator.getBounds()

    this.#areaInternaBounds.bottomLeft = {
      x: this.#areaExternaBounds.topRight.x,
      y: this.#bottomLeft.y,
    }

    return { lojasExternas: lojas, banheirosExternos: [] } //TODO: add banheiros
  }

  #createLojasInternas() {
    const bottomLeft = {
      y: 4 * 5 + 1 + this.#areaInternaBounds.bottomLeft.y,
      x: 5 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x,
    }
    this.#areaLojasInternas = {
      bottomLeft,
      topRight: {
        y: 4 * 5 + 1 + this.#areaInternaBounds.bottomLeft.y + 14,
        x: 5 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x + 14,
      },
    }

    const blocoLojasInternasCreator = new BlocoLojasInternasCreator()
      .setSetor(this.#setor)
      .setBottomLeft(this.#areaLojasInternas.bottomLeft)

    const { lojas, banheiros } = blocoLojasInternasCreator.create()
    return { lojasInternas: lojas, banheirosInternos: banheiros } //TODO: add banheiros
  }

  #createBoxes() {
    const ignoredAreas = [
      this.#areaLojasInternas,
      {
        //praça de alimentação
        bottomLeft: {
          y: 11 * 5 + 1 + this.#areaInternaBounds.bottomLeft.y,
          x: 11 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x,
        },
        topRight: {
          y: 11 * 5 + 1 + 19 + this.#areaInternaBounds.bottomLeft.y,
          x: 11 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x + 11,
        },
      },
    ]

    const boxesCreator = new SetorBoxesCreator()
      .setSetor(this.#setor)
      .setQtdBoxesHorizontal(120)
      .setQtdRuas(16)
      .setBttmLeft(this.#areaInternaBounds.bottomLeft)
      .setIgnoredAreas(ignoredAreas)

    const { boxes } = boxesCreator.create()
    const bounds = boxesCreator.getBounds()

    this.#areaInternaBounds.topRight = bounds.topRight
    return boxes
  }
}
