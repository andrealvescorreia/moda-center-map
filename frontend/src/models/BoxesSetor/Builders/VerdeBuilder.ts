import BoxesSetorBuilder from './Builder'

export default class BoxesSetorVerdeBuilder extends BoxesSetorBuilder {
  buildValores() {
    this._boxesSetor.setor = 'Verde'
    const { boxes } = this.buildBoxesStructure()
    this._boxesSetor.boxes = boxes
    this.reflectBoxes({ reflectX: true, reflectY: true })

    this._boxesSetor.boxes = this.removeBoxesInIgnoredAreas(boxes)
    return this
  }
}
