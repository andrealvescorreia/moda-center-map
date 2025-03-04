import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Position } from '../interfaces/Position'
import { Banheiro } from './Banheiro'
import { LojaExternaTipoA } from './LojaExternaTipoA'
import { StructureReflector } from './StructureReflector'

export class BlocoTipoALojasExternasCreator {
  #setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde' = 'Azul'
  #bloco = 1
  #widthLoja = 3
  #edgeBtmLeftYX = [0, 0]
  #widthBloco = 8

  setSetor(setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde') {
    this.#setor = setor
    return this
  }
  setBloco(bloco: number) {
    this.#bloco = bloco
    return this
  }
  setEdgeBtmLeftYX(edgeBtmLeftYX: [number, number]) {
    this.#edgeBtmLeftYX = edgeBtmLeftYX
    return this
  }
  create() {
    switch (this.#setor) {
      case 'Azul':
        return this.#createBlocoSetorAzul()
      case 'Laranja':
        return this.#createBlocoSetorLaranja()
      case 'Vermelho':
        return this.#createBlocoSetorVermelho()
      case 'Verde':
        return this.#createBlocoSetorVerde()
      default: {
        console.error(`Setor ${this.#setor} não é válido`)
        return { lojas: [], banheiros: [] }
      }
    }
  }

  #createBlocoSetorAzul() {
    return this.#bloco === 8 ? this.#bloco8() : this.#blocoDe1a7()
  }

  #createBlocoSetorVermelho() {
    return this.#bloco === 8 ? this.#bloco8Reduzido() : this.#blocoDe1a7()
  }

  #createBlocoSetorLaranja() {
    const { lojas, banheiros } =
      this.#bloco === 8 ? this.#bloco8() : this.#blocoDe1a7()

    const reflector = new StructureReflector()
      .setObjs([...lojas, ...banheiros])
      .setBounds(this.getBounds())
    reflector.reflect({
      reflectX: true,
      reflectY: false,
    })
    return { lojas, banheiros }
  }

  #createBlocoSetorVerde() {
    const { lojas, banheiros } =
      this.#bloco === 8 ? this.#bloco8Reduzido() : this.#blocoDe1a7()

    const reflector = new StructureReflector()
      .setObjs([...lojas, ...banheiros])
      .setBounds(this.getBounds())
    reflector.reflect({
      reflectX: true,
      reflectY: true,
    })
    return { lojas, banheiros }
  }

  getBounds() {
    return {
      bottomLeft: { y: this.#edgeBtmLeftYX[0], x: this.#edgeBtmLeftYX[1] },
      topRight: {
        y: this.#edgeBtmLeftYX[0] + this.#widthBloco,
        x: this.#edgeBtmLeftYX[1] + this.#widthBloco,
      },
    }
  }

  #blocoDe1a7() {
    const lojasFrontal = this.#createLojasFrontais(5, 0)

    const lojasLateralEsq = this.#createLateralLojas(6, 10, 4, 4, -1) // 6 a 10
    const lojasLateralDir = this.#createLateralLojas(11, 15, 0, 1, 1) // 11 a 15

    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros: [],
    }
  }

  #bloco8() {
    const banheiros: IBanheiro[] = []
    const lojasFrontal = this.#createLojasFrontais(4, 1)

    const lojasLateralEsq = this.#createLateralLojas(5, 9, 4, 4, -1) // 5 a 9
    const lojasLateralDir = this.#createLateralLojas(10, 14, 0, 1, 1) // 10 a 14
    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros,
    }
  }

  #bloco8Reduzido() {
    const lojasFrontal = this.#createLojasFrontais(4, 1)

    const lojasLateralEsq = this.#createLateralLojas(5, 5, 4, 4, -1)
    const lojasLateralDir = this.#createLateralLojas(6, 6, 4, 1, 1)

    const createBanheiroGridArea = (bottomLeft: Position) => {
      const gridArea = []
      const width = 3
      const height = 3
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          gridArea.push({ y: bottomLeft.y + i, x: bottomLeft.x + j })
        }
      }
      return gridArea
    }

    const gridAreaBanheiroM = createBanheiroGridArea({
      y: this.#edgeBtmLeftYX[0] + 1,
      x: this.#edgeBtmLeftYX[1],
    })

    const gridAreaBanheiroF = createBanheiroGridArea({
      y: this.#edgeBtmLeftYX[0] + 4,
      x: this.#edgeBtmLeftYX[1],
    })

    const banheiroM = new Banheiro({
      setor: this.#setor,
      genero: 'M',
      area: 'Externa',
      gridArea: gridAreaBanheiroM,
    })
    const banheiroF = new Banheiro({
      setor: this.#setor,
      genero: 'F',
      area: 'Externa',
      gridArea: gridAreaBanheiroF,
    })

    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros: [banheiroM, banheiroF],
    }
  }

  #createLoja = (numLoja: number, gridArea: { y: number; x: number }[]) => {
    return new LojaExternaTipoA({
      setor: this.#setor,
      bloco: this.#bloco,
      numLoja,
      gridArea,
    })
  }

  #createLojasFrontais(qtdLojasFrontais: number, yOffset = 0) {
    const lojasFrontal = []

    for (let k = 1; k <= qtdLojasFrontais; k++) {
      const heightLoja = k % 2 === 0 ? 1 : 2
      const gridArea = []

      for (let i = 0; i < this.#widthLoja; i++) {
        for (let j = 0; j < heightLoja; j++) {
          const y = this.#edgeBtmLeftYX[0] + j + yOffset
          const x = this.#edgeBtmLeftYX[1] + this.#widthBloco - 1 - i
          gridArea.push({ y, x })
        }
      }
      lojasFrontal.push(this.#createLoja(k, gridArea))
      yOffset += heightLoja
    }
    return lojasFrontal
  }

  #createLateralLojas(
    start: number,
    end: number,
    xOffsetStart: number,
    yOffsetStart: number,
    xOffsetStep: number
  ) {
    const lojas = []
    let xOffset = xOffsetStart
    const yOffset = yOffsetStart
    for (let k = start; k <= end; k++) {
      const gridArea = [
        {
          y: this.#edgeBtmLeftYX[0] + yOffset,
          x: this.#edgeBtmLeftYX[1] + xOffset,
        },
        {
          y: this.#edgeBtmLeftYX[0] + yOffset + 1,
          x: this.#edgeBtmLeftYX[1] + xOffset,
        },
        {
          y: this.#edgeBtmLeftYX[0] + yOffset + 2,
          x: this.#edgeBtmLeftYX[1] + xOffset,
        },
      ]
      lojas.push(this.#createLoja(k, gridArea))
      xOffset += xOffsetStep
    }
    return lojas
  }
}
