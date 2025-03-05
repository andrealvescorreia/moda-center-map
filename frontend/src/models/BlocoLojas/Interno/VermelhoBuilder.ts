import { StructureReflector } from '../../StructureReflector'
import BlocoInternoBuilder from './Builder'

export default class BlocoInternoVermelhoBuilder extends BlocoInternoBuilder {
  public buildValores() {
    this._bloco.setor = 'Vermelho'
    this._bloco.numBloco = 9

    const { lojas, banheiros, obstaculos } = this.blocoInternoStructure()

    const reflector = new StructureReflector()
      .setObjs([...lojas, ...banheiros, ...obstaculos])
      .setBounds({
        bottomLeft: this._bloco.leftBottom,
        topRight: this._bloco.topRight,
      })

    reflector.reflect({
      reflectX: false,
      reflectY: true,
    })

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros
    this._bloco.obstaculos = obstaculos

    return this
  }
}
