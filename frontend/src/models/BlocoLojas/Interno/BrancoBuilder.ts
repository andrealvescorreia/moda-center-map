import { StructureReflector } from '../../StructureReflector'
import BlocoInternoBuilder from './Builder'

export default class BlocoInternoBrancoBuilder extends BlocoInternoBuilder {
  public buildValores() {
    //identico ao laranja
    this._bloco.setor = 'Branco'
    this._bloco.numBloco = 9

    const { lojas, banheiros, obstaculos } = this.blocoInternoStructure()

    const reflector = new StructureReflector()
      .setObjs([...lojas, ...banheiros, ...obstaculos])
      .setBounds({
        bottomLeft: this._bloco.leftBottom,
        topRight: this._bloco.topRight,
      })

    reflector.reflect({
      reflectX: true,
      reflectY: true,
    })

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros
    this._bloco.obstaculos = obstaculos

    return this
  }
}
