import { LojaExterna } from "../models/LojaExterna";

export function createBlocoLojasExternas(
  setor: "Laranja" | "Azul" | "Vermelho" | "Verde" | "Amarelo" | "Branco",
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

  const widthLoja = 3;
  const lojas: LojaExterna[] = [];

  const widthBloco = 8;

  const edgeBtmRightYX = [edgeBtmLeftYX[0], edgeBtmLeftYX[1] + widthBloco - 1];
  const qtdLojasFrontais = 5;
  let yOffset = 0;
  for (let k = 1; k <= qtdLojasFrontais; k++) {
    const loja = new LojaExterna({
      setor,
      bloco,
      numLoja: k,
      gridArea: []
    })

    // se numero impar, heightLoja = 1, else heightLoja = 2
    const heightLoja = k % 2 === 0 ? 1 : 2;

    for (let i = 0; i < widthLoja; i++) {
      for (let j = 0; j < heightLoja; j++) {
        const y = edgeBtmRightYX[0] + j + yOffset;
        const x = edgeBtmRightYX[1] - i;
        loja.gridArea.push({ y, x });
      }
    }
    lojas.push(loja);
    yOffset += heightLoja;
  }

  let xOffset = 0;
  for (let k = 6; k <= 10; k++) {
    const loja = new LojaExterna({
      setor,
      bloco,
      numLoja: k,
      gridArea: [
        { y: edgeBtmLeftYX[0] + 6, x: edgeBtmLeftYX[1] + 4 + xOffset },
        { y: edgeBtmLeftYX[0] + 5, x: edgeBtmLeftYX[1] + 4 + xOffset },
        { y: edgeBtmLeftYX[0] + 4, x: edgeBtmLeftYX[1] + 4 + xOffset },
      ]
    })
    xOffset--;
    lojas.push(loja);
  }

  xOffset = 0;
  for (let k = 11; k <= 15; k++) {
    const loja = new LojaExterna({
      setor,
      bloco,
      numLoja: k,
      gridArea: [
        { y: edgeBtmLeftYX[0] + 1, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + 2, x: edgeBtmLeftYX[1] + xOffset },
        { y: edgeBtmLeftYX[0] + 3, x: edgeBtmLeftYX[1] + xOffset },
      ]
    })
    xOffset++;
    lojas.push(loja);
  }

  return lojas;
}