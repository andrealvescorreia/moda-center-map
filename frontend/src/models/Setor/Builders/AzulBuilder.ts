import SetorBuilder from './Builder'

export default class SetorAzulBuilder extends SetorBuilder {
  public buildValores() {
    this._setor.cor = 'Azul'

    this.buildAreaExterna(this._setor.leftBottom)
    this.buildAreaInternaBounds({
      x: this.areaExternaBounds.topRight.x,
      y: this.areaExternaBounds.bottomLeft.y,
    })

    const pracaDeAlimentacaoBottomLeft = {
      y: 11 * 5 + 1 + this.areaInternaBounds.bottomLeft.y,
      x: 11 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
    }
    this.buildPracaDeAlimentacao(pracaDeAlimentacaoBottomLeft)

    const blocoInternoBottomLeft = {
      x: 5 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
      y: 4 * 5 + 1 + this.areaInternaBounds.bottomLeft.y,
    }
    this.buildBlocoInterno(blocoInternoBottomLeft)

    this.buildBoxes(this.areaInternaBounds.bottomLeft)

    this._setor.topRight = this.areaInternaBounds.topRight

    return this
  }
}
