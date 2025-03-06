import BoxesSetorBuilder from './Builder'

export default class BoxesSetorBrancoBuilder extends BoxesSetorBuilder {
  protected qtdBoxesHorizontal = 128

  buildValores() {
    this._boxesSetor.setor = 'Branco'
    const { boxes } = this.buildBoxesStructure()
    this._boxesSetor.boxes = boxes
    this.reflectBoxes({ reflectX: true, reflectY: false })

    this._boxesSetor.boxes = this.removeBoxesInIgnoredAreas(boxes)
    return this
  }
}
