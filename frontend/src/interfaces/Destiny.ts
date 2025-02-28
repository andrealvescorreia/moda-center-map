import type { LojaExterna } from '../models/LojaExterna'
import type { Boxe } from './Boxe'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  info: Boxe | LojaExterna | null
}
