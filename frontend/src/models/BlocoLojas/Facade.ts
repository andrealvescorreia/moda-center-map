import type { Position } from '../../interfaces/Position'
import type BlocoLoja from './BlocoLojas'
import type BlocoBuilder from './Builder'
import { BlocoExternoAmareloBuilder } from './Externo/AmareloBuilder'
import { BlocoExternoAzulBuilder } from './Externo/AzulBuilder'
import { BlocoExternoBrancoBuilder } from './Externo/BrancoBuilder'
import { BlocoExternoLaranjaBuilder } from './Externo/LaranjaBuilder'
import { BlocoExternoVerdeBuilder } from './Externo/VerdeBuilder'
import { BlocoExternoVermelhoBuilder } from './Externo/VermelhoBuilder'
import BlocoInternoAmareloBuilder from './Interno/AmareloBuilder'
import BlocoInternoAzulBuilder from './Interno/AzulBuilder'
import BlocoInternoBrancoBuilder from './Interno/BrancoBuilder'
import BlocoInternoLaranjaBuilder from './Interno/LaranjaBuilder'
import BlocoInternoVerdeBuilder from './Interno/VerdeBuilder'
import BlocoInternoVermelhoBuilder from './Interno/VermelhoBuilder'

export default class BlocoFacade {
  private _builder!: BlocoBuilder

  private getBloco(numBloco: number, bottomLeft: Position): BlocoLoja {
    return this._builder
      .buildNumBloco(numBloco)
      .buildBottomLeft(bottomLeft)
      .buildValores()
      .getResult()
  }

  public getBlocoSetorAzul(numBloco: number, leftBottom: Position) {
    if (numBloco === 9) this._builder = new BlocoInternoAzulBuilder()
    else this._builder = new BlocoExternoAzulBuilder()
    return this.getBloco(numBloco, leftBottom)
  }

  public getBlocoSetorLaranja(numBloco: number, leftBottom: Position) {
    if (numBloco === 9) this._builder = new BlocoInternoLaranjaBuilder()
    else this._builder = new BlocoExternoLaranjaBuilder()
    return this.getBloco(numBloco, leftBottom)
  }

  public getBlocoSetorVermelho(numBloco: number, leftBottom: Position) {
    if (numBloco === 9) this._builder = new BlocoInternoVermelhoBuilder()
    else this._builder = new BlocoExternoVermelhoBuilder()

    return this.getBloco(numBloco, leftBottom)
  }

  public getBlocoSetorVerde(numBloco: number, leftBottom: Position) {
    if (numBloco === 9) this._builder = new BlocoInternoVerdeBuilder()
    else this._builder = new BlocoExternoVerdeBuilder()

    return this.getBloco(numBloco, leftBottom)
  }

  public getBlocoSetorAmarelo(numBloco: number, leftBottom: Position) {
    if (numBloco === 5) this._builder = new BlocoInternoAmareloBuilder()
    else this._builder = new BlocoExternoAmareloBuilder()

    return this.getBloco(numBloco, leftBottom)
  }

  public getBlocoSetorBranco(numBloco: number, leftBottom: Position) {
    if (numBloco === 5) this._builder = new BlocoInternoBrancoBuilder()
    else this._builder = new BlocoExternoBrancoBuilder()

    return this.getBloco(numBloco, leftBottom)
  }

  public make(
    setor: BlocoLoja['setor'],
    numBloco: number,
    leftBottom: Position
  ) {
    switch (setor) {
      case 'Azul':
        return this.getBlocoSetorAzul(numBloco, leftBottom)
      case 'Laranja':
        return this.getBlocoSetorLaranja(numBloco, leftBottom)
      case 'Vermelho':
        return this.getBlocoSetorVermelho(numBloco, leftBottom)
      case 'Verde':
        return this.getBlocoSetorVerde(numBloco, leftBottom)
      case 'Amarelo':
        return this.getBlocoSetorAmarelo(numBloco, leftBottom)
      case 'Branco':
        return this.getBlocoSetorBranco(numBloco, leftBottom)

      //TODO... fazer para os setores branco e amarelo
    }
  }
}
