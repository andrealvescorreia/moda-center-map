import type { Boxe } from './Boxe'
import type { Loja } from './Loja'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  info: Boxe | Loja | null
}
