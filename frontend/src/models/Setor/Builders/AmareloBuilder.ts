import SetorBuilder from './Builder'

export default class SetorAmareloBuilder extends SetorBuilder {
  public buildValores() {
    this._setor.cor = 'Amarelo'

    this.buildAreaExterna(this._setor.leftBottom)
    this.buildAreaInternaBounds({
      x: this.areaExternaBounds.topRight.x,
      y: this.areaExternaBounds.bottomLeft.y,
    })

    const pracaDeAlimentacaoBottomLeft = {
      y: this.areaInternaBounds.bottomLeft.y + 5,
      x: 11 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
    }
    this.buildPracaDeAlimentacao(pracaDeAlimentacaoBottomLeft)

    const blocoInternoBottomLeft = {
      y: this.areaInternaBounds.topRight.y - 4 * 5 - 15,
      x: 5 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
    }
    this.buildBlocoInterno(blocoInternoBottomLeft, 5)

    this.buildBoxes(this.areaInternaBounds.bottomLeft)

    this._setor.topRight = this.areaInternaBounds.topRight

    return this
  }
}
