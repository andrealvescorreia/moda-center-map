import { LojaExternaTipoA } from './LojaExternaTipoA'

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
        return this.#createBlocoSetorAzul() //temp
      case 'Laranja':
        return this.#createBlocoSetorLaranja()
      case 'Vermelho':
        return this.#createBlocoSetorVermelho()
      case 'Verde':
        return this.#createBlocoSetorVerde()
      default:
        console.error(`Setor ${this.#setor} não é válido`)
        return []
    }
  }

  #createBlocoSetorAzul() {
    if (this.#bloco < 8) {
      return this.#blocoDe1a7()
    }
    if (this.#bloco === 8) {
      return this.#bloco8()
    }
  }

  #createBlocoSetorVermelho() {
    if (this.#bloco < 8) {
      return this.#blocoDe1a7()
    }
    if (this.#bloco === 8) {
      return this.#bloco8Reduzido()
    }
  }

  #createBlocoSetorLaranja() {
    if (this.#bloco < 8) {
      return this.#reflectAroundXAxis(this.#blocoDe1a7())
    }
    if (this.#bloco === 8) {
      return this.#reflectAroundXAxis(this.#bloco8())
    }
  }

  #createBlocoSetorVerde() {
    if (this.#bloco < 8) {
      return this.#reflectAroundXAxis(this.#blocoDe1a7())
    }
    if (this.#bloco === 8) {
      return this.#reflectAroundXAxis(this.#bloco8Reduzido())
    }
  }

  #blocoDe1a7() {
    const lojasFrontal = this.#createLojasFrontais(5, 0)

    const lojasLateralEsq = this.#createLateralLojas(6, 10, 4, 4, -1) // 6 a 10
    const lojasLateralDir = this.#createLateralLojas(11, 15, 0, 1, 1) // 11 a 15

    return [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir]
  }

  #bloco8() {
    const lojasFrontal = this.#createLojasFrontais(4, 1)

    const lojasLateralEsq = this.#createLateralLojas(5, 9, 4, 4, -1) // 5 a 9
    const lojasLateralDir = this.#createLateralLojas(10, 14, 0, 1, 1) // 10 a 14
    return [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir]
  }

  #bloco8Reduzido() {
    const lojasFrontal = this.#createLojasFrontais(4, 1)

    const lojasLateralEsq = this.#createLateralLojas(5, 5, 4, 4, -1)
    const lojasLateralDir = this.#createLateralLojas(6, 6, 4, 1, 1)
    return [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir]
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

  //TODO: refactor to use reflect method from StructureReflector
  #reflectAroundXAxis(lojas: LojaExternaTipoA[]) {
    const center = {
      y: this.#edgeBtmLeftYX[0] + Math.floor(this.#widthBloco / 2),
      x: this.#edgeBtmLeftYX[1] + Math.floor(this.#widthBloco / 2),
    }

    for (let i = 0; i < lojas.length; i++) {
      const loja = lojas[i]
      const gridArea = loja.gridArea.map(({ y, x }) => {
        return {
          y,
          x: center.x - (x - center.x) - 1,
        }
      })
      loja.gridArea = gridArea
    }
    return lojas
  }
}
