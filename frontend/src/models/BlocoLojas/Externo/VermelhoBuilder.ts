import BlocoExternoTipoABuilder from './TipoABuilder'

export class BlocoExternoVermelhoBuilder extends BlocoExternoTipoABuilder {
  public buildValores() {
    this._bloco.setor = 'Vermelho'

    const { lojas, banheiros } =
      this._bloco.numBloco === 8
        ? this.bloco8WithBathroomsStructure()
        : this.bloco1to7Structure()

    this._bloco.lojas = lojas
    this._bloco.banheiros = banheiros

    return this
  }
}
