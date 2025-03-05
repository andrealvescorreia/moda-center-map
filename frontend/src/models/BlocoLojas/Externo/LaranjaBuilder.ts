import { StructureReflector } from '../../StructureReflector'
import BlocoExternoTipoABuilder from './TipoABuilder'

export class BlocoExternoLaranjaBuilder extends BlocoExternoTipoABuilder {
  public buildValores() {
    this._bloco.setor = 'Laranja'

    const { lojas, banheiros } =
      this._bloco.numBloco === 8
        ? this.bloco8Structure()
        : this.bloco1to7Structure()

    // Cada bloco laranja é um reflexo dos blocos azuis
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
