import type { Position } from '../../interfaces/Position'
import type Setor from '../Setor/Setor'
import SetorAmareloBuilder from './Builders/AmareloBuilder'
import SetorAzulBuilder from './Builders/AzulBuilder'
import SetorBrancoBuilder from './Builders/BrancoBuilder'
import type SetorBuilder from './Builders/Builder'
import SetorLaranjaBuilder from './Builders/LaranjaBuilder'
import SetorVerdeBuilder from './Builders/VerdeBuilder'
import SetorVermelhoBuilder from './Builders/VermelhoBuilder'

export default class SetorFacade {
  private _builder!: SetorBuilder

  private getSetor(bottomLeft: Position): Setor {
    return this._builder.buildBottomLeft(bottomLeft).buildValores().getResult()
  }

  public getSetorAzul(bottomLeft: Position) {
    this._builder = new SetorAzulBuilder()
    return this.getSetor(bottomLeft)
  }

  public getSetorLaranja(bottomLeft: Position) {
    this._builder = new SetorLaranjaBuilder()
    return this.getSetor(bottomLeft)
  }

  public getSetorVermelho(bottomLeft: Position) {
    this._builder = new SetorVermelhoBuilder()
    return this.getSetor(bottomLeft)
  }

  public getSetorVerde(bottomLeft: Position) {
    this._builder = new SetorVerdeBuilder()
    return this.getSetor(bottomLeft)
  }

  public getSetorAmarelo(bottomLeft: Position) {
    this._builder = new SetorAmareloBuilder()
    return this.getSetor(bottomLeft)
  }

  public getSetorBranco(bottomLeft: Position) {
    this._builder = new SetorBrancoBuilder()
    return this.getSetor(bottomLeft)
  }

  public make(setor: Setor['cor'], bottomLeft: Position) {
    switch (setor) {
      case 'Azul':
        return this.getSetorAzul(bottomLeft)
      case 'Laranja':
        return this.getSetorLaranja(bottomLeft)
      case 'Vermelho':
        return this.getSetorVermelho(bottomLeft)
      case 'Verde':
        return this.getSetorVerde(bottomLeft)
      case 'Amarelo':
        return this.getSetorAmarelo(bottomLeft)
      case 'Branco':
        return this.getSetorBranco(bottomLeft)
    }
  }
}
