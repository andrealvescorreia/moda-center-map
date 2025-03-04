import type { Banheiro } from '../interfaces/Banheiro'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import { LojaInterna } from './LojaInterna'

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
    //bloco 9 setor azul
    const lojas: Loja[] = []
    const banheiros: Banheiro[] = []
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

    return { lojas, banheiros }
  }

  /*#rotateAroundCenter(lojas: Loja[]) {
    const center = {
      y: this.#bottomLeft.y + 7,
      x: this.#bottomLeft.x + 7,
    }

    return lojas.map((loja) => {
      const gridArea = loja.gridArea.map(({ y, x }) => {
        const yDiff = y - center.y
        const xDiff = x - center.x
        return { y: center.y - xDiff, x: center.x + yDiff }
      })

      return new LojaInterna({ ...loja, gridArea })
    })
  }*/

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
