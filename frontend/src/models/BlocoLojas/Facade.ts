import type { Position } from '../../interfaces/Position'
import type BlocoLoja from './BlocoLojas'
import type BlocoBuilder from './Builder'
import { BlocoExternoAzulBuilder } from './Externo/AzulBuilder'
import { BlocoExternoLaranjaBuilder } from './Externo/LaranjaBuilder'
import { BlocoExternoVerdeBuilder } from './Externo/VerdeBuilder'
import { BlocoExternoVermelhoBuilder } from './Externo/VermelhoBuilder'
import BlocoInternoAzulBuilder from './Interno/AzulBuilder'
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
      default:
        console.error('Setor ainda não suportado: ', setor)
        return this.getBlocoSetorAzul(numBloco, leftBottom)

      //TODO... fazer para os setores branco e amarelo
    }
  }
}
