import type { LojaExterna } from '../models/LojaExterna'
import type { Position } from './Position'

export interface Destiny {
  position: Position
  info: Boxe | LojaExterna | null
}

export interface Boxe {
  setor: string
  numero: number
  rua: string
}
