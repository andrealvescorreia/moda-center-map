import type { Boxe } from '../interfaces/Boxe'
import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { AreaExternaSetorLojasCreator } from './AreaExternaSetorLojasCreator'
import BlocoFacade from './BlocoLojas/Facade'
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
    const lojas: Loja[] = []
    const banheiros: IBanheiro[] = []

    const { lojasExternas, banheirosExternos } = this.#createLojasExternas()
    const { lojasInternas, banheirosInternos, obstaculos } =
      this.#createLojasInternas()
    const boxes: Boxe[] = this.#createBoxes()

    lojas.push(...lojasExternas, ...lojasInternas)
    banheiros.push(...banheirosExternos, ...banheirosInternos)

    const bounds = {
      bottomLeft: this.#bottomLeft,
      topRight: this.#areaInternaBounds.topRight,
    }

    return { boxes, lojas, banheiros, obstaculos, bounds }
  }

  #createLojasExternas() {
    const areaExternaCreator = new AreaExternaSetorLojasCreator()
      .setSetor(this.#setor)
      .setBttmLeft(this.#bottomLeft)
      .setQtdBlocos(8)
      .setPaddingLeftRight(2)

    const { lojas, banheiros } = areaExternaCreator.create()

    this.#areaExternaBounds = areaExternaCreator.getBounds()

    this.#areaInternaBounds.bottomLeft = {
      x: this.#areaExternaBounds.topRight.x,
      y: this.#bottomLeft.y,
    }

    return { lojasExternas: lojas, banheirosExternos: banheiros }
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

    const bloco = new BlocoFacade().make(this.#setor, 9, bottomLeft)
    if (!bloco) {
      console.error('bloco não criado!')
      return { lojasInternas: [], banheirosInternos: [], obstaculos: [] }
    }

    return {
      lojasInternas: bloco.lojas,
      banheirosInternos: bloco.banheiros,
      obstaculos: bloco.obstaculos,
    }
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
