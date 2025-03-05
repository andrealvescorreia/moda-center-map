import type { Bounds } from './Bounds'

export interface IObstaculo {
  gridArea: { x: number; y: number }[]
  bounds: Bounds
}
