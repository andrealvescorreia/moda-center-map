import BoxesSetorBuilder from './Builder'

export default class BoxesSetorVermelhoBuilder extends BoxesSetorBuilder {
  buildValores() {
    this._boxesSetor.setor = 'Vermelho'
    const { boxes } = this.buildBoxesStructure()
    this._boxesSetor.boxes = boxes
    this.reflectBoxes({ reflectX: false, reflectY: true })

    this._boxesSetor.boxes = this.removeBoxesInIgnoredAreas(boxes)
    return this
  }
}
