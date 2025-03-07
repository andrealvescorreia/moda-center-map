import { LojaExternaTipoB } from '../../Loja/LojaExternaTipoB'
import BlocoBuilder from '../Builder'

export default abstract class BlocoExternoTipoBBuilder extends BlocoBuilder {
  protected widthBloco = 10
  protected heightBloco = 10
  protected widthLoja = 3

  // override
  public buildBottomLeft(bottomLeft: { x: number; y: number }) {
    this._bloco.leftBottom = bottomLeft
    this._bloco.topRight = {
      y: this._bloco.leftBottom.y + this.widthBloco,
      x: this._bloco.leftBottom.x + this.heightBloco,
    }
    return this
  }

  private createLojaGridArea(
    bottomLeft: { x: number; y: number },
    vertical: boolean
  ) {
    const gridArea = []
    for (let i = 0; i < this.widthLoja; i++) {
      gridArea.push({
        x: bottomLeft.x + (!vertical ? i : 0),
        y: bottomLeft.y + (vertical ? i : 0),
      })
    }
    return gridArea
  }

  protected blocoStructure(numBloco: number) {
    const lojas: LojaExternaTipoB[] = []

    const addLojas = (
      start: number,
      end: number,
      getLeftBottom: (i: number) => { x: number; y: number },
      vertical: boolean
    ) => {
      for (let i = start; i <= end; i++) {
        const lojaLeftBottom = getLeftBottom(i)
        lojas.push(
          new LojaExternaTipoB({
            setor: this._bloco.setor as 'Amarelo' | 'Branco',
            bloco: numBloco,
            numLoja: i,
            gridArea: this.createLojaGridArea(lojaLeftBottom, vertical),
          })
        )
      }
    }

    // lojas frontal esq
    addLojas(
      1,
      3,
      (i) => ({
        y: this._bloco.leftBottom.y - 1 + i,
        x: this._bloco.leftBottom.x + 7,
      }),
      false
    )

    // lojas lateral esq
    addLojas(
      4,
      7,
      (i) => ({
        y: this._bloco.leftBottom.y,
        x: this._bloco.leftBottom.x + 6 - i + 4,
      }),
      true
    )

    // lojas fundos
    addLojas(
      8,
      11,
      (i) => ({
        y: this._bloco.leftBottom.y + 3 + (i - 8),
        x: this._bloco.leftBottom.x,
      }),
      false
    )

    // lojas lateral dir
    addLojas(
      12,
      15,
      (i) => ({
        y: this._bloco.leftBottom.y + 7,
        x: this._bloco.leftBottom.x + 3 + (i - 12),
      }),
      true
    )

    // lojas frontal dir
    addLojas(
      16,
      18,
      (i) => ({
        y: this._bloco.leftBottom.y + 7 + (i - 16),
        x: this._bloco.leftBottom.x + 7,
      }),
      false
    )

    return lojas
  }
}
