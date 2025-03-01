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
    if (this.#bloco < 8) {
      return this.#blocoDe1a7()
    }
    if (
      this.#bloco === 8 &&
      (this.#setor === 'Azul' || this.#setor === 'Laranja')
    ) {
      return this.#bloco8SetorAzulELaranja()
    }
  }

  #blocoDe1a7() {
    const qtdLojasFrontais = 5
    const lojasFrontal: LojaExternaTipoA[] = []

    let yOffset = 0

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

    const lojasLateralEsq = this.#createLateralLojas(6, 10, 4, 4, -1) // 6 a 10
    const lojasLateralDir = this.#createLateralLojas(11, 15, 0, 1, 1) // 11 a 15

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

  #bloco8SetorAzulELaranja() {
    const qtdLojasFrontais = 4
    let yOffset = 0

    const lojasFrontal = []
    yOffset = 1
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

    const lojasLateralEsq = this.#createLateralLojas(5, 9, 4, 4, -1) // 5 a 9
    const lojasLateralDir = this.#createLateralLojas(10, 14, 0, 1, 1) // 10 a 14
    return [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir]
  }
}
