export interface IBanheiro {
  setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde' | 'Amarelo' | 'Branco'
  genero: 'M' | 'F'
  area: 'Interna' | 'Externa'
  gridArea: {
    y: number
    x: number
  }[]

  getBounds(): number[][]
  getEntrance(): { y: number; x: number }
}
