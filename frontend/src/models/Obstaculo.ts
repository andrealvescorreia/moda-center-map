import type { Bounds } from '../interfaces/Bounds'
import type { IObstaculo } from '../interfaces/IObstaculo'
import type { Position } from '../interfaces/Position'

export default class Obstaculo implements IObstaculo {
  gridArea: Position[] = []

  get bounds(): Bounds {
    const yValues = this.gridArea.map((pos) => pos.y)
    const xValues = this.gridArea.map((pos) => pos.x)
    const bottomLeft: Position = {
      y: Math.min(...yValues),
      x: Math.min(...xValues),
    }

    const topRight: Position = {
      y: Math.max(...yValues) + 1,
      x: Math.max(...xValues) + 1,
    }

    return {
      bottomLeft,
      topRight,
    }
  }
}
