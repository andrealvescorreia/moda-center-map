import type { Bounds } from '../interfaces/Bounds'
import type { Position } from '../interfaces/Position'

export class StructureReflector {
  #objs: { gridArea: Position[] }[] = []
  #bounds: Bounds = { bottomLeft: { y: 0, x: 0 }, topRight: { y: 0, x: 0 } }

  setObjs(objs: { gridArea: Position[] }[]) {
    this.#objs = objs
    return this
  }
  setBounds(bounds: Bounds) {
    this.#bounds = bounds
    return this
  }

  reflect({
    reflectX,
    reflectY,
  }: {
    reflectX: boolean
    reflectY: boolean
  }) {
    const center = {
      y:
        this.#bounds.bottomLeft.y +
        (this.#bounds.topRight.y - this.#bounds.bottomLeft.y) / 2,
      x:
        this.#bounds.bottomLeft.x +
        (this.#bounds.topRight.x - this.#bounds.bottomLeft.x) / 2,
    }

    for (let i = 0; i < this.#objs.length; i++) {
      const obj = this.#objs[i]
      const gridArea = obj.gridArea.map(({ y, x }) => {
        return {
          y: reflectY ? center.y - (y - center.y) - 1 : y,
          x: reflectX ? center.x - (x - center.x) - 1 : x,
        }
      })
      obj.gridArea = gridArea
    }
    return { objs: this.#objs }
  }
}
