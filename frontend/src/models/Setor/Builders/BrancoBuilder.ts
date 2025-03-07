import SetorBuilder from './Builder'

export default class SetorBrancoBuilder extends SetorBuilder {
  public buildValores() {
    this._setor.cor = 'Branco'

    this.buildAreaInternaBounds(this._setor.leftBottom)
    this.buildAreaExterna({
      x: this.areaInternaBounds.topRight.x,
      y: this.areaInternaBounds.bottomLeft.y,
    })

    const pracaDeAlimentacaoBottomLeft = {
      y: this.areaInternaBounds.bottomLeft.y + 5,
      x: this.areaInternaBounds.bottomLeft.x + 1,
    }
    this.buildPracaDeAlimentacao(pracaDeAlimentacaoBottomLeft)

    const blocoInternoBottomLeft = {
      y: this.areaInternaBounds.topRight.y - 4 * 5 - 15,
      x: 5 * 3 + 1 + this.areaInternaBounds.bottomLeft.x,
    }
    this.buildBlocoInterno(blocoInternoBottomLeft, 5)

    this.buildBoxes(this.areaInternaBounds.bottomLeft)

    this._setor.topRight = {
      x: this.areaExternaBounds.topRight.x,
      y:
        this.areaInternaBounds.topRight.y > this.areaExternaBounds.topRight.y
          ? this.areaInternaBounds.topRight.y
          : this.areaExternaBounds.topRight.y,
    }

    return this
  }
}
