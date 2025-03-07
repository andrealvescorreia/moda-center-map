import { StructureReflector } from '../../StructureReflector'
import BlocoExternoTipoBBuilder from './TipoBBuilder'

export class BlocoExternoBrancoBuilder extends BlocoExternoTipoBBuilder {
  public buildValores() {
    this._bloco.setor = 'Branco'

    const lojas = this.blocoStructure(this._bloco.numBloco)

    const reflector = new StructureReflector().setObjs(lojas).setBounds({
      bottomLeft: this._bloco.leftBottom,
      topRight: this._bloco.topRight,
    })
    reflector.reflect({
      reflectX: true,
      reflectY: false,
    })

    this._bloco.lojas = lojas

    return this
  }
}
