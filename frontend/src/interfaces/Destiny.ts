import type { Boxe } from './Boxe'
import type { Loja } from './Loja'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  sellingLocation: Boxe | Loja | null
  sellerName?: string
  sellerId?: string
}
