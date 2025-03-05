import type { IBanheiro } from '../../../interfaces/IBanheiro'
import type { IObstaculo } from '../../../interfaces/IObstaculo'
import type { Loja } from '../../../interfaces/Loja'
import type { Position } from '../../../interfaces/Position'
import { Banheiro } from '../../Banheiro'
import { LojaInterna } from '../../Loja/LojaInterna'
import Obstaculo from '../../Obstaculo'
import BlocoBuilder from '../Builder'

export default abstract class BlocoInternoBuilder extends BlocoBuilder {
  protected widthBloco = 14
  protected heightBloco = 14
  protected widthLoja = 3
  protected heightLoja = 3

  //override
  public buildBottomLeft(bottomLeft: Position) {
    this._bloco.leftBottom = bottomLeft

    this._bloco.topRight = {
      y: this._bloco.leftBottom.y + this.widthBloco,
      x: this._bloco.leftBottom.x + this.heightBloco,
    }
    return this
  }

  protected blocoInternoStructure() {
    const lojas = this.createLojas()
    const banheiros = this.createBanheiros()
    const obstaculos = this.createObstaculos()
    return { lojas, banheiros, obstaculos }
  }

  protected createObstaculos() {
    const obstaculo: IObstaculo = new Obstaculo()

    for (
      let i = this._bloco.leftBottom.y + 1;
      i < this._bloco.topRight.y - this.heightLoja;
      i++
    ) {
      for (
        let j = this._bloco.leftBottom.x + 1;
        j < this._bloco.topRight.x - this.widthLoja;
        j++
      ) {
        obstaculo.gridArea.push({ y: i + 1, x: j + 1 })
      }
    }

    return [obstaculo]
  }

  protected createBanheiros() {
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
        setor: this._bloco.setor,
        genero,
        area,
        gridArea,
      })
    }

    const banheiros: IBanheiro[] = []
    banheiros.push(
      //baixo
      createBanheiro('F', {
        y: this._bloco.leftBottom.y,
        x: this._bloco.leftBottom.x + 6,
      })
    )
    banheiros.push(
      //cima
      createBanheiro('M', {
        y: this._bloco.topRight.y - 2,
        x: this._bloco.leftBottom.x + 6,
      })
    )

    return banheiros
  }

  protected createLojas() {
    const lojas: Loja[] = []

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

      return new LojaInterna({ setor: this._bloco.setor, numLoja, gridArea })
    }

    for (let i = 1; i <= qtdLojasLateralDireita; i++) {
      const x = this._bloco.topRight.x - 2
      const y = this._bloco.leftBottom.y + i * 2
      lojas.push(createLoja(i, { y, x }))
    }
    let xOffset = 0
    for (let i = 1; i <= qtdLojasCima; i++) {
      if (i === 3) {
        xOffset = 4
      }
      const x = this._bloco.topRight.x - 2 * i - xOffset
      const y = this._bloco.topRight.y - 2
      lojas.push(createLoja(i + 5, { y, x }))
    }
    for (let i = 1; i <= qtdLojasLateralEsquerda; i++) {
      const x = this._bloco.leftBottom.x
      const y = this._bloco.topRight.y - 2 * i - 2
      lojas.push(createLoja(i + 10, { y, x }))
    }
    xOffset = 0

    for (let i = 1; i <= qtdLojasBaixo; i++) {
      let width = 3
      if (i > 2) {
        width = 2
        xOffset = 7
      }
      const x = this._bloco.leftBottom.x + width * i - 3 + xOffset
      const y = this._bloco.leftBottom.y
      lojas.push(createLoja(i + 15, { y, x }, width))
    }

    return lojas
  }
}
