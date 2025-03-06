import type { Bounds } from '../../interfaces/Bounds'
import type { Boxe } from '../../interfaces/Boxe'
import type { Position } from '../../interfaces/Position'
import type Setor from '../Setor/Setor'

export default class BoxesSetor {
  public setor: Setor['cor'] = 'Azul'
  public boxes: Boxe[] = []
  public leftBottom: Position = { x: 0, y: 0 }
  public topRight: Position = { x: 0, y: 0 }
  public ignoredAreas: Bounds[] = []
}
