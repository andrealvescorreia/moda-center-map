import type { Boxe } from '../../interfaces/Boxe'
import type { IBanheiro } from '../../interfaces/IBanheiro'
import type { IObstaculo } from '../../interfaces/IObstaculo'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'

export default class Setor {
  public cor: 'Azul' | 'Laranja' | 'Vermelho' | 'Verde' | 'Amarelo' | 'Branco' =
    'Azul'
  public boxes: Boxe[] = []
  public lojas: Loja[] = []
  public banheiros: IBanheiro[] = []
  public obstaculos: IObstaculo[] = []
  public leftBottom: Position = { x: 0, y: 0 }
  public topRight: Position = { x: 0, y: 0 }
}
