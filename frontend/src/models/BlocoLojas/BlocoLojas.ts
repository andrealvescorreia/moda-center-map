import type { IBanheiro } from '../../interfaces/IBanheiro'
import type { IObstaculo } from '../../interfaces/IObstaculo'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'

export default class BlocoLojas {
  public setor:
    | 'Azul'
    | 'Laranja'
    | 'Vermelho'
    | 'Verde'
    | 'Amarelo'
    | 'Branco' = 'Azul'
  public numBloco = 1
  public lojas: Loja[] = []
  public banheiros: IBanheiro[] = []
  public obstaculos: IObstaculo[] = []
  public leftBottom: Position = { x: 0, y: 0 }
  public topRight: Position = { x: 0, y: 0 }
}
