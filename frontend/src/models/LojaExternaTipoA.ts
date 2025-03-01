import { z } from 'zod'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'

// lojas externas de estrutura utilizada nos setores azul, laranja, vermelho e verde
export class LojaExternaTipoA implements Loja {
  setor: Loja['setor']
  bloco: number
  numLoja: number
  gridArea: Position[]

  static schema = z.object({
    setor: z.enum(['Laranja', 'Azul', 'Vermelho', 'Verde']),
    bloco: z.number().int().nonnegative().max(8),
    numLoja: z.number().int().nonnegative().max(15),
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
  }: z.infer<typeof LojaExternaTipoA.schema>) {
    const parsed = LojaExternaTipoA.schema.parse({
      setor,
      bloco,
      numLoja,
      gridArea,
    })
    if (bloco === 8 && numLoja > 14) {
      console.error('LojaExternaTipoA: bloco 8 não pode ter mais de 14 lojas')
    }
    if (
      bloco === 8 &&
      (setor === 'Vermelho' || setor === 'Verde') &&
      numLoja > 6
    ) {
      console.error(
        'LojaExternaTipoA: bloco 8 dos setores Vermelho e Verde não pode ter mais de 6 lojas, devido espaço para os banheiros'
      )
    }
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

  #findExtreme(key: 'x' | 'y', isMin: boolean) {
    const compare = (
      a: Position,
      b: Position,
      key: 'x' | 'y',
      isMin: boolean
    ) => (isMin ? a[key] < b[key] : a[key] > b[key])
    return this.gridArea.reduce((extreme, pos) =>
      compare(pos, extreme, key, isMin) ? pos : extreme
    )
  }

  getEntrance() {
    if (this.setor === 'Azul' || this.setor === 'Vermelho') {
      return this.#getEntranceLeftSetor()
    }
    return this.#getEntranceRightSetor()
  }

  //para o setor azul e vermelho
  #getEntranceLeftSetor() {
    let offset = 0
    if (this.bloco === 8) offset = -1

    if (this.numLoja <= 5 + offset) return this.#findExtreme('x', false)
    if (this.numLoja <= 10 + offset) return this.#findExtreme('y', false)
    return this.#findExtreme('y', true)
  }

  //para o setor laranja e verde
  #getEntranceRightSetor() {
    let offset = 0
    if (this.bloco === 8) offset = -1

    if (this.numLoja <= 5 + offset) return this.#findExtreme('x', true)
    if (this.numLoja <= 10 + offset) return this.#findExtreme('y', false)
    return this.#findExtreme('y', true)
  }
}
