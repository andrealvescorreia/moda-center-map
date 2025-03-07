import BlocoExternoTipoBBuilder from './TipoBBuilder'

export class BlocoExternoAmareloBuilder extends BlocoExternoTipoBBuilder {
  public buildValores() {
    this._bloco.setor = 'Amarelo'

    const lojas = this.blocoStructure(this._bloco.numBloco)

    this._bloco.lojas = lojas

    return this
  }
}
