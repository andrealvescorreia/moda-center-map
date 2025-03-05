import type { IBanheiro } from '../../../interfaces/IBanheiro'
import type { Position } from '../../../interfaces/Position'
import { Banheiro } from '../../Banheiro'
import { LojaExternaTipoA } from '../../Loja/LojaExternaTipoA'
import BlocoBuilder from '../Builder'

export default abstract class BlocoExternoTipoABuilder extends BlocoBuilder {
  protected widthBloco = 8
  protected heightBloco = 8

  // override
  public buildBottomLeft(bottomLeft: { x: number; y: number }) {
    this._bloco.leftBottom = bottomLeft
    this._bloco.topRight = {
      y: this._bloco.leftBottom.y + this.widthBloco,
      x: this._bloco.leftBottom.x + this.heightBloco,
    }
    return this
  }

  protected bloco1to7Structure() {
    const lojasFrontal = this.createLojasFrontais(5, 0)

    const lojasLateralEsq = this.createLateralLojas(6, 10, 4, 4, -1) // 6 a 10
    const lojasLateralDir = this.createLateralLojas(11, 15, 0, 1, 1) // 11 a 15

    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros: [],
    }
  }

  protected bloco8Structure() {
    const banheiros: IBanheiro[] = []
    const lojasFrontal = this.createLojasFrontais(4, 1)

    const lojasLateralEsq = this.createLateralLojas(5, 9, 4, 4, -1) // 5 a 9
    const lojasLateralDir = this.createLateralLojas(10, 14, 0, 1, 1) // 10 a 14
    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros,
    }
  }

  protected bloco8WithBathroomsStructure() {
    const lojasFrontal = this.createLojasFrontais(4, 1)

    const lojasLateralEsq = this.createLateralLojas(5, 5, 4, 4, -1)
    const lojasLateralDir = this.createLateralLojas(6, 6, 4, 1, 1)

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
      y: this._bloco.leftBottom.y + 1,
      x: this._bloco.leftBottom.x,
    })

    const gridAreaBanheiroF = createBanheiroGridArea({
      y: this._bloco.leftBottom.y + 4,
      x: this._bloco.leftBottom.x,
    })

    const banheiroM = new Banheiro({
      setor: this._bloco.setor,
      genero: 'M',
      area: 'Externa',
      gridArea: gridAreaBanheiroM,
    })
    const banheiroF = new Banheiro({
      setor: this._bloco.setor,
      genero: 'F',
      area: 'Externa',
      gridArea: gridAreaBanheiroF,
    })

    return {
      lojas: [...lojasFrontal, ...lojasLateralEsq, ...lojasLateralDir],
      banheiros: [banheiroM, banheiroF],
    }
  }

  private createLojasFrontais(qtdLojasFrontais: number, yOffset = 0) {
    const lojasFrontal = []
    const widthLoja = 3

    for (let k = 1; k <= qtdLojasFrontais; k++) {
      const heightLoja = k % 2 === 0 ? 1 : 2
      const gridArea = []

      for (let i = 0; i < widthLoja; i++) {
        for (let j = 0; j < heightLoja; j++) {
          const y = this._bloco.leftBottom.y + j + yOffset
          const x = this._bloco.leftBottom.x + this.widthBloco - 1 - i
          gridArea.push({ y, x })
        }
      }
      if (this._bloco.setor === 'Branco' || this._bloco.setor === 'Amarelo') {
        console.error(`setor ${this._bloco.setor} não é do tipo A`)
        return []
      }
      lojasFrontal.push(
        new LojaExternaTipoA({
          setor: this._bloco.setor,
          bloco: this._bloco.numBloco,
          numLoja: k,
          gridArea,
        })
      )
      yOffset += heightLoja
    }
    return lojasFrontal
  }

  private createLateralLojas(
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
          y: this._bloco.leftBottom.y + yOffset,
          x: this._bloco.leftBottom.x + xOffset,
        },
        {
          y: this._bloco.leftBottom.y + yOffset + 1,
          x: this._bloco.leftBottom.x + xOffset,
        },
        {
          y: this._bloco.leftBottom.y + yOffset + 2,
          x: this._bloco.leftBottom.x + xOffset,
        },
      ]
      if (this._bloco.setor === 'Branco' || this._bloco.setor === 'Amarelo') {
        console.error(`setor ${this._bloco.setor} não é do tipo A`)
        return []
      }
      lojas.push(
        new LojaExternaTipoA({
          setor: this._bloco.setor,
          bloco: this._bloco.numBloco,
          numLoja: k,
          gridArea,
        })
      )
      xOffset += xOffsetStep
    }
    return lojas
  }
}
