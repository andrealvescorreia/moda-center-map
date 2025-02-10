import PF from 'pathfinding';
import { getCycle } from 'held-karp';


/**
 * Retorna a melhor sequência para percorrer todos os destinos a partir do inicio
 * @param matrizGrid matriz 2d que representa o mapa
 * @param inicio coordenadas do ponto de inicio
 * @param destinos lista de coordenadas dos destinos
 * @returns a sequência de destinos que minimiza a distância total percorrida
 * @example
 * const inicio = { x: 0, y: 0 };
 * const destinos = [{x: 1, y: 3}, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 4, y: 2 }];
 * const matrixGrid = [// representa o 'mapa'
 *  [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * [0, 0, 0, 0, 0, 0, 0],
 * ];
 * @returns [{ x: 0, y: 0 }, { x: 1, y: 3 }, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 4, y: 2 }]
 * 
 */
export default function melhorRota(matrizGrid: number[][], inicio: { x: number; y: number; }, destinos: { x: number; y: number; }[]) {
  destinos = [inicio, ...destinos];

  // matriz 2d reflexiva com as distancias entre cada par de destinos
  const distancias = Array.from({ length: destinos.length }, () => Array(destinos.length).fill(0));
  const finder = new PF.AStarFinder();

  // preenche a matriz de distancias de forma reflexiva
  for (let i = 0; i < destinos.length; i++) {
    for (let j = i + 1; j < destinos.length; j++) {
      const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[j].x, destinos[j].y, new PF.Grid(matrizGrid));
      distancias[i][j] = path.length;
      distancias[j][i] = path.length;
    }
  }

  const indicesMelhorCaminho = getCycle(distancias).cycle;
  const caminho = indicesMelhorCaminho.map((i: number) => destinos[i]);
  return caminho;
}

/*
function exemplo() {
  const inicio = { x: 0, y: 0 };
  const destinos = [{x: 1, y: 3}, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 4, y: 2 }];

  const matrixGrid = [// representa o 'mapa'
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  console.log('melhor caminho: ', melhorRota(matrixGrid, inicio, destinos));
}
  */

