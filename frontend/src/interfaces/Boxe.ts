import type { Position } from './Position'

export interface Boxe {
  setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde' | 'Amarelo' | 'Branco'
  numero: number
  rua: string
  positionInGrid: Position
}
