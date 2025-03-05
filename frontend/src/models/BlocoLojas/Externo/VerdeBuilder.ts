import { StructureReflector } from '../../StructureReflector'
import BlocoExternoTipoABuilder from './TipoABuilder'

export class BlocoExternoVerdeBuilder extends BlocoExternoTipoABuilder {
  public buildValores() {
    this._bloco.setor = 'Verde'

    const { lojas, banheiros } =
      this._bloco.numBloco === 8
        ? this.bloco8WithBathroomsStructure()
        : this.bloco1to7Structure()

    new StructureReflector()
      .setObjs([...lojas, ...banheiros])
      .setBounds({
        bottomLeft: this._bloco.leftBottom,
        topRight: this._bloco.topRight,
      })
      .reflect({
        reflectX: true,
        reflectY: false,
      })

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros

    return this
  }
}
