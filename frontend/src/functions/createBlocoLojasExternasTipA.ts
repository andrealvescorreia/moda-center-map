import { LojaExternaTipoA } from '../models/LojaExternaTipoA'

export function createBlocoLojasExternasTipoA(
  setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde',
  bloco: number,
  edgeBtmLeftYX: [number, number]
) {
  //TODO: implementar lógica para outros setores e para bloco 8
  //ideia: utilizar o strategy pattern
  /*
  combinações:
  - setor azul, bloco 1-7 [X]
  - setor azul, bloco 8
  - setor laranja, bloco 1-7
  - setor laranja, bloco 8
  - setor vermelho, bloco 1-7
  - setor vermelho, bloco 8
  - setor verde, bloco 1-7
  - setor verde, bloco 8
  - setor amarelo, bloco 1-4
  - setor branco, bloco 1-4
  */
  if (bloco < 8) {
    return blocoDe1a7(setor, bloco, edgeBtmLeftYX)
  }
  if (bloco === 8 && (setor === 'Azul' || setor === 'Laranja')) {
    return bloco8SetorAzulELaranja(setor, bloco, edgeBtmLeftYX)
  }
}

function blocoDe1a7(
  setor: 'Laranja' | 'Azul' | 'Vermelho' | 'Verde',
  bloco: number,
  edgeBtmLeftYX: [number, number]
) {
  const widthLoja = 3
  const widthBloco = 8
  const qtdLojasFrontais = 5
  const lojas: LojaExternaTipoA[] = []

  let yOffset = 0

  const createLoja = (
    numLoja: number,
    gridArea: { y: number; x: number }[]
  ) => {
    return new LojaExternaTipoA({
      setor,
      bloco,
      numLoja,
      gridArea,
    })
  }

  for (let k = 1; k <= qtdLojasFrontais; k++) {
    const heightLoja = k % 2 === 0 ? 1 : 2
    const gridArea = []

    for (let i = 0; i < widthLoja; i++) {
      for (let j = 0; j < heightLoja; j++) {
        const y = edgeBtmLeftYX[0] + j + yOffset
        const x = edgeBtmLeftYX[1] + widthBloco - 1 - i
        gridArea.push({ y, x })
      }
    }
    lojas.push(createLoja(k, gridArea))
    yOffset += heightLoja
  }

  const createLateralLojas = (
    start: number,
    end: number,
    xOffsetStart: number,
    yOffsetStart: number,
    xOffsetStep: number
  ) => {
    let xOffset = xOffsetStart
    yOffset = yOffsetStart
    for (let k = start; k <= end; k++) {
      const gridArea = [
        { y: edgeBtmLeftYX[0] + yOffset, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + yOffset + 1, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + yOffset + 2, x: edgeBtmLeftYX[1] + xOffset },
      ]
      lojas.push(createLoja(k, gridArea))
      xOffset += xOffsetStep
    }
  }

  createLateralLojas(6, 10, 4, 4, -1) // 6 a 10
  createLateralLojas(11, 15, 0, 1, 1) // 11 a 15

  return lojas
}

function bloco8SetorAzulELaranja(
  setor: 'Laranja' | 'Azul',
  bloco: number,
  edgeBtmLeftYX: [number, number]
) {
  const widthLoja = 3
  const widthBloco = 8
  const qtdLojasFrontais = 4
  const lojas: LojaExternaTipoA[] = []
  let yOffset = 0

  const createLoja = (
    numLoja: number,
    gridArea: { y: number; x: number }[]
  ) => {
    return new LojaExternaTipoA({
      setor,
      bloco,
      numLoja,
      gridArea,
    })
  }

  const createLateralLojas = (
    start: number,
    end: number,
    xOffsetStart: number,
    yOffsetStart: number,
    xOffsetStep: number
  ) => {
    let xOffset = xOffsetStart
    yOffset = yOffsetStart
    for (let k = start; k <= end; k++) {
      const gridArea = [
        { y: edgeBtmLeftYX[0] + yOffset, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + yOffset + 1, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + yOffset + 2, x: edgeBtmLeftYX[1] + xOffset },
      ]
      lojas.push(createLoja(k, gridArea))
      xOffset += xOffsetStep
    }
  }

  yOffset = 1
  for (let k = 1; k <= qtdLojasFrontais; k++) {
    const heightLoja = k % 2 === 0 ? 1 : 2
    const gridArea = []

    for (let i = 0; i < widthLoja; i++) {
      for (let j = 0; j < heightLoja; j++) {
        const y = edgeBtmLeftYX[0] + j + yOffset
        const x = edgeBtmLeftYX[1] + widthBloco - 1 - i
        gridArea.push({ y, x })
      }
    }
    lojas.push(createLoja(k, gridArea))
    yOffset += heightLoja
  }

  createLateralLojas(5, 9, 4, 4, -1) // 5 a 9
  createLateralLojas(10, 14, 0, 1, 1) // 10 a 14
  return lojas
}
