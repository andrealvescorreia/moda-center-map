import type { Position } from '../../interfaces/Position'
import BlocoLojas from './BlocoLojas'

export default abstract class BlocoBuilder {
  protected _bloco: BlocoLojas = new BlocoLojas()

  public buildNumBloco(numBloco: number) {
    this._bloco.numBloco = numBloco
    return this
  }

  public buildBottomLeft(bottomLeft: Position) {
    this._bloco.leftBottom = bottomLeft
    return this
  }

  public abstract buildValores(): BlocoBuilder

  public getResult() {
    return this._bloco
  }
}
