import type { Boxe } from '../../interfaces/Boxe'
import type { IBanheiro } from '../../interfaces/IBanheiro'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'
import BlocoFacade from '../BlocoLojas/Facade'
import { AreaExternaCreator } from './AreaExternaCreator'
import { BoxesCreator } from './BoxesCreator'
import Setor from './Setor'

export class SetorCreator {
  #setor!: Loja['setor']
  #bottomLeft!: { y: number; x: number }

  #areaExternaBounds!: { bottomLeft: Position; topRight: Position }
  #areaInternaBounds!: { bottomLeft: Position; topRight: Position }
  #areaLojasInternas!: { bottomLeft: Position; topRight: Position }

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

    const setor = new Setor()
    Object.assign(setor, {
      cor: this.#setor,
      lojas,
      boxes,
      banheiros,
      obstaculos,
      leftBottom: bounds.bottomLeft,
      topRight: bounds.topRight,
    })

    return setor
  }

  #createLojasExternas() {
    const areaExternaCreator = new AreaExternaCreator()
      .setSetor(this.#setor)
      .setBttmLeft(this.#bottomLeft)
      .setQtdBlocos(8)
      .setPaddingLeftRight(2)

    const { lojas, banheiros } = areaExternaCreator.create()

    this.#areaExternaBounds = areaExternaCreator.getBounds()

    this.#areaInternaBounds = {
      bottomLeft: {
        x: this.#areaExternaBounds.topRight.x,
        y: this.#bottomLeft.y,
      },
      topRight: {
        x: 0,
        y: 0,
      },
    }
    return { lojasExternas: lojas, banheirosExternos: banheiros }
  }

  #createLojasInternas() {
    const bottomLeft = {
      y: 4 * 5 + 1 + this.#areaInternaBounds.bottomLeft.y,
      x: 5 * 3 + 1 + this.#areaInternaBounds.bottomLeft.x,
    }
    const bloco = new BlocoFacade().make(this.#setor, 9, bottomLeft)
    if (!bloco) {
      console.error('bloco não criado!')
      return { lojasInternas: [], banheirosInternos: [], obstaculos: [] }
    }
    this.#areaLojasInternas = {
      bottomLeft,
      topRight: bloco.topRight,
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

    const boxesCreator = new BoxesCreator()
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
