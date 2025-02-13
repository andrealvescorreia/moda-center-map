import PF from 'pathfinding';
// @ts-expect-error a biblioteca não tem typesc
import { getCycle } from 'held-karp';
import { Position } from "../interfaces/Position";

export interface GridConfig {
  stepX: number;
  stepY: number;
  boxWidth: number;
  boxHeight: number;
  tam: [number, number];
}

export class GridMap {
  #grid: number[][];
  #yxDimensions: [number, number];

  constructor(yxDimensions: [number, number]) {
    this.#yxDimensions = yxDimensions;
    const stepX = 3;
    const stepY = 5;
    const boxWidth = 2;
    const boxHeight = 4;
    const grid = Array.from({ length: yxDimensions[0] }, () => Array(yxDimensions[1]).fill(0));

    // 0: caminho livre
    // 1: boxe (obstáculo)
    for (let i = 1; i < yxDimensions[1]; i += stepX) {
      for (let j = 1; j < yxDimensions[0]; j += stepY) {
        for (let x = i; x < i + boxWidth && x < yxDimensions[1]; x++) {
          for (let y = j; y < j + boxHeight && y < yxDimensions[0]; y++) {
            grid[y][x] = 1;
          }
        }
      }
    }
    this.#grid = grid;
  }

  getGrid() {
    return this.#grid;
  }
  getDimensions() {
    return this.#yxDimensions;
  }
  getBounds() {
    const bounds: L.LatLngBoundsLiteral = [[0, 0], [this.#yxDimensions[0], this.#yxDimensions[1]]];
    return bounds;
  }

  #getNumeroDoBoxe = (y: number, x: number) => {
    const valorY = y * 2 - (parseInt((y / 5).toString()) * 2)
    const valorX = x - 3 * parseInt((x / 3).toString())
    return valorY - 2 + valorX
  }

  getBoxe(y: number, x: number) {
    return {
      setor: 'Laranja',
      rua: 'A',
      numero: this.#getNumeroDoBoxe(y, x),
    }
  }

  calculateBestRoute(startPos: Position, destinies: Position[]) {
    const destinos = [startPos, ...destinies];

    const destiniesBestOrder = this.#calculateBestOrder(destinos);
    const steps = this.#calculateBestSteps(destiniesBestOrder);

    return {
      destiniesBestOrder,
      steps
    };
  }

  #calculateBestOrder(destinos: Position[]) {

    // matriz 2d reflexiva com as distancias entre cada par de destinos
    const distancias = Array.from({ length: destinos.length }, () => Array(destinos.length).fill(0));
    const finder = new PF.AStarFinder();

    // preenche a matriz de distancias de forma reflexiva
    for (let i = 0; i < destinos.length; i++) {
      for (let j = i + 1; j < destinos.length; j++) {
        const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[j].x, destinos[j].y, new PF.Grid(this.#grid));
        distancias[i][j] = path.length;
        distancias[j][i] = path.length;
      }
    }

    const indicesMelhorCaminho = getCycle(distancias).cycle;
    const destiniesBestOrder = indicesMelhorCaminho.map((i: number) => destinos[i]);
    return destiniesBestOrder;
  }

  #calculateBestSteps(destinos: Position[]) {
    const finder = new PF.AStarFinder();
    let steps: Position[] = [{ x: destinos[0].x, y: destinos[0].y }];
    for (let i = 0; i < destinos.length - 1; i++) {
      const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[i + 1].x, destinos[i + 1].y, new PF.Grid(this.#grid));

      path.shift();// remove repetido

      steps = [...steps, ...(path.map(p => { return { x: p[0], y: p[1] } }))];
    }
    return steps;
  }
} 