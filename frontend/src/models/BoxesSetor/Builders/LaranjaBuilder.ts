import BoxesSetorBuilder from './Builder'

export default class BoxesSetorLaranjaBuilder extends BoxesSetorBuilder {
  buildValores() {
    this._boxesSetor.setor = 'Laranja'
    const { boxes } = this.buildBoxesStructure()
    this._boxesSetor.boxes = boxes
    this.reflectBoxes({ reflectX: true, reflectY: false })

    this._boxesSetor.boxes = this.removeBoxesInIgnoredAreas(boxes)
    return this
  }
}
