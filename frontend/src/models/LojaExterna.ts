import { z } from 'zod'
import type { Position } from '../interfaces/Position'

export type LojaExternaType = z.infer<typeof LojaExterna.schema>

export class LojaExterna {
  setor: string
  bloco: number
  numLoja: number
  gridArea: Position[]

  static schema = z.object({
    setor: z.enum([
      'Laranja',
      'Azul',
      'Vermelho',
      'Verde',
      'Amarelo',
      'Branco',
    ]),
    bloco: z.number().int().nonnegative().max(8),
    numLoja: z.number().int().nonnegative().max(15), // 1 - 15 (para bloco de 1 a 7) ou 1 - 14 (para bloco 8)
    gridArea: z.array(
      z.object({
        y: z.number().int(),
        x: z.number().int(),
      })
    ),
  })

  constructor({
    setor,
    bloco,
    numLoja,
    gridArea,
  }: z.infer<typeof LojaExterna.schema>) {
    const parsed = LojaExterna.schema.parse({ setor, bloco, numLoja, gridArea })
    this.setor = parsed.setor
    this.bloco = parsed.bloco
    this.numLoja = parsed.numLoja
    this.gridArea = parsed.gridArea
  }

  getBounds() {
    const yValues = this.gridArea.map((pos) => pos.y)
    const xValues = this.gridArea.map((pos) => pos.x)
    const lojaLeftBottom: [number, number] = [
      Math.min(...yValues),
      Math.min(...xValues),
    ]
    const lojaRightTop: [number, number] = [
      Math.max(...yValues) + 1,
      Math.max(...xValues) + 1,
    ]
    return [lojaLeftBottom, lojaRightTop]
  }
}
