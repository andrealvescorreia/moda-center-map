import { z } from 'zod'
import type { Loja } from '../../interfaces/Loja'
import type { Position } from '../../interfaces/Position'

// lojas externas de estrutura utilizada nos setores Branco e Amarelo
export class LojaExternaTipoB implements Loja {
  setor: Loja['setor']
  bloco: number
  numLoja: number
  gridArea: Position[]

  static schema = z.object({
    setor: z.enum(['Branco', 'Amarelo']),
    bloco: z.number().int().nonnegative().max(4),
    numLoja: z.number().int().nonnegative().max(18),
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
  }: z.infer<typeof LojaExternaTipoB.schema>) {
    const parsed = LojaExternaTipoB.schema.parse({
      setor,
      bloco,
      numLoja,
      gridArea,
    })

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
  #farRight = () => this.#findExtreme('x', false)

  #farUp() {
    return this.#findExtreme('y', false)
  }
  #farLeft() {
    return this.#findExtreme('x', true)
  }
  #farDown() {
    return this.#findExtreme('y', true)
  }

  getEntrance() {
    if (this.setor === 'Amarelo') {
      return this.#getEntranceLeftSetor()
    }
    return this.#getEntranceRightSetor()
  }

  //para o setor amarelo
  #getEntranceLeftSetor() {
    if (this.numLoja <= 3) return this.#farRight()
    if (this.numLoja <= 7) return this.#farUp()
    if (this.numLoja <= 11) return this.#farRight()
    if (this.numLoja <= 15) return this.#farDown()
    return this.#farRight()
  }

  //para o setor branco
  #getEntranceRightSetor() {
    if (this.numLoja <= 3) return this.#farLeft()
    if (this.numLoja <= 7) return this.#farUp()
    if (this.numLoja <= 11) return this.#farLeft()
    if (this.numLoja <= 15) return this.#farDown()
    return this.#farLeft()
  }
}
