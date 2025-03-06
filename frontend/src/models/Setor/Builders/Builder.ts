import type { Bounds } from '../../../interfaces/Bounds'
import type { Position } from '../../../interfaces/Position'
import BlocoFacade from '../../BlocoLojas/Facade'
import BoxesSetorFacade from '../../BoxesSetor/Facade'
import { AreaExternaCreator } from '../AreaExternaCreator'
import { PracaDeAlimentacaoCreator } from '../PracaDeAlimentacaoCreator'
import Setor from '../Setor'

export default abstract class SetorBuilder {
  protected _setor: Setor = new Setor()
  protected areaExternaBounds: Bounds = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }
  protected areaInternaBounds: Bounds = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }
  protected areaBlocoInterno: Bounds = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }
  protected areaPracaDeAlimentacao: Bounds = {
    bottomLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
  }

  buildBottomLeft(bottomLeft: Position) {
    this._setor.leftBottom = bottomLeft
    return this
  }
  public abstract buildValores(): SetorBuilder

  public getResult() {
    this.verifyIfEverythingInsideSetorBounds()
    return this._setor
  }

  // protected methods

  protected buildAreaExterna(bottomLeft: Position) {
    const areaExterna = new AreaExternaCreator()
      .setSetor(this._setor.cor)
      .setBttmLeft(bottomLeft)
      .create()

    if (areaExterna.bounds) {
      this.areaExternaBounds = areaExterna.bounds
    } else {
      console.error('Erro ao criar área externa')
    }

    this._setor.lojas.push(...areaExterna.lojas)
    this._setor.banheiros.push(...areaExterna.banheiros)
  }

  protected buildAreaInternaBounds(leftBottom: Position) {
    const boxesSetorAux = new BoxesSetorFacade().make(
      this._setor.cor,
      leftBottom,
      []
    )

    if (!boxesSetorAux) {
      console.error('Erro ao criar boxes do setor')
      return
    }
    this.areaInternaBounds = {
      bottomLeft: boxesSetorAux.leftBottom,
      topRight: boxesSetorAux.topRight,
    }
  }

  protected buildPracaDeAlimentacao(bottomLeft: Position) {
    const pracaDeAlimentacao = new PracaDeAlimentacaoCreator()
      .setLeftBottom(bottomLeft)
      .setSetor(this._setor.cor)
      .create()

    this._setor.obstaculos.push(...pracaDeAlimentacao.restaurantes)
    this.areaPracaDeAlimentacao = {
      bottomLeft: pracaDeAlimentacao.leftBottom,
      topRight: pracaDeAlimentacao.topRight,
    }
  }

  protected buildBlocoInterno(bottomLeft: Position) {
    const blocoInterno = new BlocoFacade().make(this._setor.cor, 9, bottomLeft)

    this._setor.lojas.push(...blocoInterno.lojas)
    this._setor.banheiros.push(...blocoInterno.banheiros)
    this._setor.obstaculos.push(...blocoInterno.obstaculos)

    this.areaBlocoInterno = {
      bottomLeft: blocoInterno.leftBottom,
      topRight: blocoInterno.topRight,
    }
  }

  protected buildBoxes(bottomLeft: Position) {
    const boxesSetor = new BoxesSetorFacade().make(
      this._setor.cor,
      bottomLeft,
      [this.areaBlocoInterno, this.areaPracaDeAlimentacao]
    )
    if (!boxesSetor) {
      console.error('Erro ao criar boxes do setor')
      return
    }

    this._setor.boxes = boxesSetor.boxes
  }

  protected isInsideBounds(position: Position) {
    return (
      position.x >= this._setor.leftBottom.x &&
      position.x <= this._setor.topRight.x &&
      position.y >= this._setor.leftBottom.y &&
      position.y <= this._setor.topRight.y
    )
  }

  protected verifyIfEverythingInsideSetorBounds() {
    for (const loja of this._setor.lojas) {
      for (const pos of loja.gridArea) {
        if (!this.isInsideBounds(pos)) {
          console.error('Loja fora dos limites do setor: ', loja)
        }
      }
    }
    for (const box of this._setor.boxes) {
      if (!this.isInsideBounds(box.positionInGrid)) {
        console.error('Box fora dos limites do setor: ', box)
      }
    }
    for (const banheiro of this._setor.banheiros) {
      for (const pos of banheiro.gridArea) {
        if (!this.isInsideBounds(pos)) {
          console.error('Banheiro fora dos limites do setor: ', banheiro)
        }
      }
    }
    for (const obstaculo of this._setor.obstaculos) {
      for (const pos of obstaculo.gridArea) {
        if (!this.isInsideBounds(pos)) {
          console.error('Obstáculo fora dos limites do setor: ', obstaculo)
        }
      }
    }
  }
}
