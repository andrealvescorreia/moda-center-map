export interface Loja {
  setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde' | 'Amarelo' | 'Branco'
  bloco: number
  numLoja: number
  gridArea: {
    y: number
    x: number
  }[]

  getBounds(): number[][]
  getEntrance(): { y: number; x: number }
}
