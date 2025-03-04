import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { Banheiro } from './Banheiro'
import { LojaInterna } from './LojaInterna'
import { StructureReflector } from './StructureReflector'

export class BlocoLojasInternasCreator {
  #setor: Loja['setor'] = 'Azul'
  #bottomLeft = { y: 0, x: 0 }

  setSetor(setor: Loja['setor']) {
    this.#setor = setor
    return this
  }

  setBottomLeft({ y, x }: { y: number; x: number }) {
    this.#bottomLeft = { y, x }
    return this
  }

  create() {
    const { lojas, banheiros } = this.#createBloco9()

    const reflector = new StructureReflector()
      .setObjs([...lojas, ...banheiros])
      .setBounds(this.getBounds())

    switch (this.#setor) {
      case 'Azul':
        return { lojas, banheiros }
      case 'Laranja':
        return reflector.reflect({
          reflectX: true,
          reflectY: false,
        })
      case 'Vermelho':
        return reflector.reflect({
          reflectX: false,
          reflectY: true,
        })
      case 'Verde':
        return reflector.reflect({
          reflectX: true,
          reflectY: true,
        })
      case 'Amarelo':
        return reflector.reflect({
          reflectX: false,
          reflectY: true,
        })
      case 'Branco':
        return reflector.reflect({
          reflectX: true,
          reflectY: true,
        })
      default:
        console.error(`Setor inválido: ${this.#setor}`)
        return { lojas, banheiros }
    }
  }

  #createBloco9() {
    //bloco 9 setor azul
    const lojas: Loja[] = []
    const banheiros: IBanheiro[] = []
    const bounds = this.getBounds()

    const qtdLojasLateralDireita = 5
    const qtdLojasLateralEsquerda = 5
    const qtdLojasCima = 5
    const qtdLojasBaixo = 4

    const createLoja = (
      numLoja: number,
      bottomLeft: Position,
      width = 2,
      height = 2
    ) => {
      const { y, x } = bottomLeft

      const gridArea = []

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          gridArea.push({ y: y + i, x: x + j })
        }
      }
      return new LojaInterna({ setor: this.#setor, numLoja, gridArea })
    }

    const createBanheiro = (
      genero: Banheiro['genero'],
      bottomLeft: Position,
      width = 4,
      height = 2
    ) => {
      const area = 'Interna'
      const { y, x } = bottomLeft

      const gridArea = []

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          gridArea.push({ y: y + i, x: x + j })
        }
      }
      return new Banheiro({
        setor: this.#setor,
        genero,
        area,
        gridArea,
      })
    }

    for (let i = 1; i <= qtdLojasLateralDireita; i++) {
      const x = bounds.topRight.x - 2
      const y = bounds.bottomLeft.y + i * 2
      lojas.push(createLoja(i, { y, x }))
    }
    let xOffset = 0
    for (let i = 1; i <= qtdLojasCima; i++) {
      if (i === 3) {
        xOffset = 4
      }
      const x = bounds.topRight.x - 2 * i - xOffset
      const y = bounds.topRight.y - 2
      lojas.push(createLoja(i + 5, { y, x }))
    }
    for (let i = 1; i <= qtdLojasLateralEsquerda; i++) {
      const x = bounds.bottomLeft.x
      const y = bounds.topRight.y - 2 * i - 2
      lojas.push(createLoja(i + 10, { y, x }))
    }
    xOffset = 0

    for (let i = 1; i <= qtdLojasBaixo; i++) {
      let width = 3
      if (i > 2) {
        width = 2
        xOffset = 7
      }
      const x = bounds.bottomLeft.x + width * i - 3 + xOffset
      const y = bounds.bottomLeft.y
      lojas.push(createLoja(i + 15, { y, x }, width))
    }

    banheiros.push(
      //baixo
      createBanheiro('F', {
        y: bounds.bottomLeft.y,
        x: bounds.bottomLeft.x + 6,
      })
    )
    banheiros.push(
      //cima
      createBanheiro('M', {
        y: bounds.topRight.y - 2,
        x: bounds.bottomLeft.x + 6,
      })
    )

    return { lojas, banheiros }
  }

  getBounds() {
    return {
      bottomLeft: this.#bottomLeft,
      topRight: {
        y: this.#bottomLeft.y + 14,
        x: this.#bottomLeft.x + 14,
      },
    }
  }
}
