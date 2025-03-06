import type { Bounds } from '../../../interfaces/Bounds'
import type { Boxe } from '../../../interfaces/Boxe'
import type { Position } from '../../../interfaces/Position'
import BoxesSetor from '../BoxesSetor'

export default abstract class BoxesSetorBuilder {
  protected _boxesSetor: BoxesSetor = new BoxesSetor()
  protected qtdRuas = 16
  protected qtdBoxesHorizontal = 120

  public buildIgnoredAreas(ignoredAreas: Bounds[]) {
    this._boxesSetor.ignoredAreas = ignoredAreas
    return this
  }

  public buildBottomLeft(bottomLeft: Position) {
    this._boxesSetor.leftBottom = bottomLeft
    this.buildTopRight()
    return this
  }

  public buildQtdRuas(qtdRuas: number) {
    this.qtdRuas = qtdRuas
    this.buildTopRight()
    return this
  }

  public buildQtdBoxesHorizontal(qtdBoxesHorizontal: number) {
    this.qtdBoxesHorizontal = qtdBoxesHorizontal
    this.buildTopRight()
    return this
  }

  private buildTopRight() {
    this._boxesSetor.topRight = {
      y: this._boxesSetor.leftBottom.y + this.qtdBoxesHorizontal / 1.6 + 1,
      x: this._boxesSetor.leftBottom.x + (this.qtdRuas - 1) * 3 + 1,
    }
    return this
  }

  protected buildBoxesStructure() {
    const boxes: Boxe[] = []

    const stepX = 3
    const stepY = 5
    const boxWidth = 2
    const boxHeight = 4

    const bottomLeft = this._boxesSetor.leftBottom
    const topRight = this._boxesSetor.topRight

    for (let i = bottomLeft.x + 1; i < topRight.x; i += stepX) {
      for (let j = bottomLeft.y + 1; j < topRight.y; j += stepY) {
        for (let x = i; x < i + boxWidth && x < topRight.x; x++) {
          for (let y = j; y < j + boxHeight && y < topRight.y; y++) {
            boxes.push(this.getBoxe(y, x))
          }
        }
      }
    }

    return { boxes }
  }

  private getRuaDoBoxe = (x: number) => {
    const letterPCharCode = 'P'.charCodeAt(0)

    const offset = Math.floor((x - this._boxesSetor.leftBottom.x - 2) / 3)
    const ruaCharCode = letterPCharCode - offset - 1
    return String.fromCharCode(ruaCharCode)
  }

  private getNumeroDoBoxe = (y: number, x: number) => {
    const xOffSet = x - this._boxesSetor.leftBottom.x - 1
    const yOffset = y - this._boxesSetor.leftBottom.y

    const valorY = yOffset * 2 - Number.parseInt((yOffset / 5).toString()) * 2
    const valorX = xOffSet - 3 * Number.parseInt((xOffSet / 3).toString())
    return valorY - valorX
  }

  protected getBoxe(y: number, x: number) {
    return {
      setor: this._boxesSetor.setor,
      rua: this.getRuaDoBoxe(x),
      numero: this.getNumeroDoBoxe(y, x),
      positionInGrid: { y, x },
    }
  }

  private isInIgnoredArea = (y: number, x: number) => {
    return this._boxesSetor.ignoredAreas.some(
      ({ bottomLeft: bttmLeft, topRight }) =>
        y >= bttmLeft.y && y <= topRight.y && x >= bttmLeft.x && x <= topRight.x
    )
  }
  protected removeBoxesInIgnoredAreas(boxes: Boxe[]) {
    return boxes.filter(({ positionInGrid }) => {
      return !this.isInIgnoredArea(positionInGrid.y, positionInGrid.x)
    })
  }

  protected reflectBoxes({
    reflectX,
    reflectY,
  }: {
    reflectX: boolean
    reflectY: boolean
  }) {
    const center = {
      y:
        this._boxesSetor.leftBottom.y +
        (this._boxesSetor.topRight.y - this._boxesSetor.leftBottom.y) / 2,
      x:
        this._boxesSetor.leftBottom.x +
        (this._boxesSetor.topRight.x - this._boxesSetor.leftBottom.x) / 2,
    }

    for (let i = 0; i < this._boxesSetor.boxes.length; i++) {
      const boxe = this._boxesSetor.boxes[i]
      const y = boxe.positionInGrid.y
      const x = boxe.positionInGrid.x
      boxe.positionInGrid = {
        y: reflectY ? center.y - (y - center.y) - 1 : y,
        x: reflectX ? center.x - (x - center.x) - 1 : x,
      }
    }
  }

  public abstract buildValores(): BoxesSetorBuilder

  public getResult() {
    return this._boxesSetor
  }
}
