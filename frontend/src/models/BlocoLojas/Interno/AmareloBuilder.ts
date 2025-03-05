import BlocoInternoBuilder from './Builder'

export default class BlocoInternoAmareloBuilder extends BlocoInternoBuilder {
  public buildValores() {
    //identico ao azul
    this._bloco.setor = 'Amarelo'
    this._bloco.numBloco = 9

    const { lojas, banheiros, obstaculos } = this.blocoInternoStructure()

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros
    this._bloco.obstaculos = obstaculos

    return this
  }
}
