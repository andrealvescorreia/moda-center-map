import SetorBuilder from './Builder'

export default class SetorVerdeBuilder extends SetorBuilder {
  public buildValores() {
    this._setor.cor = 'Verde'

    this.buildAreaInternaBounds(this._setor.leftBottom)
    this.buildAreaExterna({
      x: this.areaInternaBounds.topRight.x,
      y: this.areaInternaBounds.bottomLeft.y,
    })

    const pracaDeAlimentacaoBottomLeft = {
      y: this.areaInternaBounds.bottomLeft.y,
      x: this.areaInternaBounds.bottomLeft.x + 1,
    }
    this.buildPracaDeAlimentacao(pracaDeAlimentacaoBottomLeft)

    const blocoInternoBottomLeft = {
      y: this.areaInternaBounds.topRight.y - 4 * 5 - 15,
      x: 5 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
    }
    this.buildBlocoInterno(blocoInternoBottomLeft)

    this.buildBoxes(this.areaInternaBounds.bottomLeft)

    this._setor.topRight = this.areaExternaBounds.topRight

    return this
  }
}
