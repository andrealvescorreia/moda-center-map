import type { LojaExternaTipoA } from '../models/Loja/LojaExternaTipoA'
import type { Boxe } from './Boxe'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  info: Boxe | LojaExternaTipoA | null
}
