import BoxesSetorBuilder from './Builder'

export default class BoxesSetorAzulBuilder extends BoxesSetorBuilder {
  buildValores() {
    this._boxesSetor.setor = 'Azul'
    let { boxes } = this.buildBoxesStructure()
    boxes = this.removeBoxesInIgnoredAreas(boxes)

    this._boxesSetor.boxes = boxes
    return this
  }
}
