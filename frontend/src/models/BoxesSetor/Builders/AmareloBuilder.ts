import BoxesSetorBuilder from './Builder'

export default class BoxesSetorAmareloBuilder extends BoxesSetorBuilder {
  protected qtdBoxesHorizontal = 128

  buildValores() {
    this._boxesSetor.setor = 'Amarelo'
    let { boxes } = this.buildBoxesStructure()
    boxes = this.removeBoxesInIgnoredAreas(boxes)

    this._boxesSetor.boxes = boxes
    return this
  }
}
