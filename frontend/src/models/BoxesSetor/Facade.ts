import type { Bounds } from '../../interfaces/Bounds'
import type { Position } from '../../interfaces/Position'
import type Setor from '../Setor/Setor'
import type BoxesSetor from './BoxesSetor'
import BoxesSetorAmareloBuilder from './Builders/AmareloBuilder'
import BoxesSetorAzulBuilder from './Builders/AzulBuilder'
import BoxesSetorBrancoBuilder from './Builders/BrancoBuilder'
import type BoxesSetorBuilder from './Builders/Builder'
import BoxesSetorLaranjaBuilder from './Builders/LaranjaBuilder'
import BoxesSetorVerdeBuilder from './Builders/VerdeBuilder'
import BoxesSetorVermelhoBuilder from './Builders/VermelhoBuilder'

export default class BoxesSetorFacade {
  private _builder!: BoxesSetorBuilder

  private getBoxesSetor(
    bottomLeft: Position,
    ignoredAreas: Bounds[]
  ): BoxesSetor {
    return this._builder
      .buildBottomLeft(bottomLeft)
      .buildIgnoredAreas(ignoredAreas)
      .buildValores()
      .getResult()
  }

  public getBoxesSetorAzul(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorAzulBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public getBoxesSetorLaranja(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorLaranjaBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public getBoxesSetorVermelho(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorVermelhoBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public getBoxesSetorVerde(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorVerdeBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public getBoxesSetorAmarelo(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorAmareloBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public getBoxesSetorBranco(bottomLeft: Position, ignoredAreas: Bounds[]) {
    this._builder = new BoxesSetorBrancoBuilder()
    return this.getBoxesSetor(bottomLeft, ignoredAreas)
  }

  public make(
    setor: Setor['cor'],
    bottomLeft: Position,
    ignoredAreas: Bounds[]
  ) {
    switch (setor) {
      case 'Azul':
        return this.getBoxesSetorAzul(bottomLeft, ignoredAreas)
      case 'Laranja':
        return this.getBoxesSetorLaranja(bottomLeft, ignoredAreas)
      case 'Vermelho':
        return this.getBoxesSetorVermelho(bottomLeft, ignoredAreas)
      case 'Verde':
        return this.getBoxesSetorVerde(bottomLeft, ignoredAreas)
      case 'Amarelo':
        return this.getBoxesSetorAmarelo(bottomLeft, ignoredAreas)
      case 'Branco':
        return this.getBoxesSetorBranco(bottomLeft, ignoredAreas)
    }
  }
}
