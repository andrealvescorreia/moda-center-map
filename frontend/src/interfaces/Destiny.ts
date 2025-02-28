import type { LojaExternaTipoA } from '../models/LojaExternaTipoA'
import type { Boxe } from './Boxe'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  info: Boxe | LojaExternaTipoA | null
}
