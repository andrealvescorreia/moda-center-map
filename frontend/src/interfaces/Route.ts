import type { Destiny } from './Destiny'
import type { Position } from './Position'

export interface Route {
  inicio: Destiny | null
  destinos: Destiny[]
  passos?: Position[]
}
