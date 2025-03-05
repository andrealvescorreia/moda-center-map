import BlocoInternoBuilder from './Builder'

export default class BlocoInternoAzulBuilder extends BlocoInternoBuilder {
  public buildValores() {
    this._bloco.setor = 'Azul'
    this._bloco.numBloco = 9

    const { lojas, banheiros, obstaculos } = this.blocoInternoStructure()

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros
    this._bloco.obstaculos = obstaculos

    return this
  }
}
