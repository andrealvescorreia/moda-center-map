import type { IBanheiro } from '../interfaces/IBanheiro'
import type { Position } from '../interfaces/Position'

export class Banheiro implements IBanheiro {
  setor: IBanheiro['setor']
  genero: IBanheiro['genero']
  area: IBanheiro['area']
  gridArea: IBanheiro['gridArea']

  constructor({
    setor,
    genero,
    area,
    gridArea,
  }: {
    setor: IBanheiro['setor']
    genero: IBanheiro['genero']
    area: IBanheiro['area']
    gridArea: IBanheiro['gridArea']
  }) {
    this.setor = setor
    this.genero = genero
    this.area = area
    this.gridArea = gridArea
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

  getEntrance() {
    //TODO: ainda não sei a posição dos banheiros em todos os setores,
    // os único que tenho certeza são os setores Verde e Vermelho,
    // onde o Feminino é na parte de cima e o Masculino na parte de baixo
    // (isso para lojas internas, ainda não sei para lojas externas)

    if (this.setor === 'Verde' || this.setor === 'Vermelho') {
      if (this.genero === 'F') return this.#farUp()
      return this.#farDown()
    }

    // passível a estar errado.
    if (this.genero === 'F') return this.#farDown()
    return this.#farUp()
  }

  #farUp() {
    return this.#findExtreme('y', false)
  }
  #farDown() {
    return this.#findExtreme('y', true)
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
}
