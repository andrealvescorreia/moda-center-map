import { z } from 'zod'
import type { Loja } from '../interfaces/Loja'
import type { Position } from '../interfaces/Position'

export class LojaInterna implements Loja {
  setor: Loja['setor'] = 'Azul'
  bloco = 9
  numLoja = 0
  gridArea: { y: number; x: number }[] = []

  static schema = z.object({
    setor: z.enum([
      'Laranja',
      'Azul',
      'Vermelho',
      'Verde',
      'Amarelo',
      'Branco',
    ]),
    numLoja: z.number().int().nonnegative().max(19),
    gridArea: z.array(
      z.object({
        y: z.number().int(),
        x: z.number().int(),
      })
    ),
  })

  constructor({
    setor,
    numLoja,
    gridArea,
  }: z.infer<typeof LojaInterna.schema>) {
    const parsed = LojaInterna.schema.parse({
      setor,
      numLoja,
      gridArea,
    })
    this.setor = parsed.setor
    if (setor === 'Branco' || setor === 'Amarelo') {
      this.bloco = 5
    } else {
      this.bloco = 9
    }
    this.numLoja = parsed.numLoja
    this.gridArea = parsed.gridArea
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

  #farRight() {
    return this.#findExtreme('x', false)
  }
  #farUp() {
    return this.#findExtreme('y', false)
  }
  #farLeft() {
    return this.#findExtreme('x', true)
  }
  #farDown() {
    return this.#findExtreme('y', true)
  }

  getBounds(): number[][] {
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

  getEntrance() {
    if (this.setor === 'Azul') {
      if (this.numLoja <= 5) return this.#farRight()
      if (this.numLoja <= 10) return this.#farUp()
      if (this.numLoja <= 15) return this.#farLeft()
      return this.#farDown()
    }
    //TODO: implementar para os outros setores
    console.error('Entrance not implemented for this setor ', this.setor)
    return { y: 0, x: 0 }
  }
}
