import SetorBuilder from './Builder'

export default class SetorLaranjaBuilder extends SetorBuilder {
  public buildValores() {
    this._setor.cor = 'Laranja'

    this.buildAreaInternaBounds(this._setor.leftBottom)
    this.buildAreaExterna({
      x: this.areaInternaBounds.topRight.x,
      y: this.areaInternaBounds.bottomLeft.y,
    })

    const pracaDeAlimentacaoBottomLeft = {
      y: 11 * 5 + 1 + this.areaInternaBounds.bottomLeft.y,
      x: this.areaInternaBounds.bottomLeft.x + 1,
    }
    this.buildPracaDeAlimentacao(pracaDeAlimentacaoBottomLeft)

    const blocoInternoBottomLeft = {
      x: 5 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
      y: 4 * 5 + 1 + this.areaInternaBounds.bottomLeft.y,
    }
    this.buildBlocoInterno(blocoInternoBottomLeft, 9)

    this.buildBoxes(this.areaInternaBounds.bottomLeft)

    this._setor.topRight = this.areaExternaBounds.topRight

    return this
  }
}
