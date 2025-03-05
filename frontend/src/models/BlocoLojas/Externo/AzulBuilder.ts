import BlocoExternoTipoABuilder from './TipoABuilder'

export class BlocoExternoAzulBuilder extends BlocoExternoTipoABuilder {
  public buildValores() {
    this._bloco.setor = 'Azul'

    const { lojas, banheiros } =
      this._bloco.numBloco === 8
        ? this.bloco8Structure()
        : this.bloco1to7Structure()

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros

    return this
  }
}
