import type { Boxe } from '../interfaces/Boxe'
import type { IBanheiro } from '../interfaces/IBanheiro'
import type { IObstaculo } from '../interfaces/IObstaculo'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'
import type Setor from './Setor/Setor'

export default class ModaCenter {
  public boxes: Boxe[] = []
  public lojas: Loja[] = []
  public banheiros: IBanheiro[] = []
  public obstaculos: IObstaculo[] = []
  public leftBottom: Position = { x: 0, y: 0 }
  public topRight: Position = { x: 0, y: 0 }
  public setoresBounds: {
    cor: Setor['cor']
    bounds: { leftBottom: Position; topRight: Position }
  }[] = []
}
