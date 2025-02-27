import PF from 'pathfinding';
import { Position } from "../interfaces/Position";
import { tspSolver } from '../utils/tsp';
import { LojaExterna } from './LojaExterna';
import { createBlocoLojasExternas } from '../utils/createBlocoLojasExternas';


export class GridMap {
  #yxDimensions: [number, number];
  #grid: number[][];

  static CAMINHO = 0;
  static BOXE = 1;
  static LOJAS_INTERNAS = 2;
  static RESTAURANTES = 3;
  static LOJAS_EXTERNAS = 4;
  static BANHEIROS = 5;

  #widthHeightBlocoLojasExternas = [8, 8];
  #gapBetweenLojasExternasAndBoxes = 1;

  #boxesAreaAzulLeftBottomCorner: Position = {
    x: this.#widthHeightBlocoLojasExternas[0] + this.#gapBetweenLojasExternasAndBoxes * 2,
    y: 0
  }

  #lojasExternas: LojaExterna[] = [];

  constructor() {
    this.#yxDimensions = [
      (15 * 5 + 1),
      (15 * 3 + 1) + this.#widthHeightBlocoLojasExternas[0] + this.#gapBetweenLojasExternasAndBoxes * 2
    ];

    this.#grid = Array.from({ length: this.#yxDimensions[0] }, () => Array(this.#yxDimensions[1]).fill(0));
    this.#fillGridWithBoxes();
    this.#fillGridWithLojasInternasEBanheiros();
    this.#fillGridWithPraçasDeAlimentação();
    this.#fillGridWithLojasExternas();
  }

  #fillGridWithBoxes() {
    const stepX = 3;
    const stepY = 5;
    const boxWidth = 2;
    const boxHeight = 4;
    for (let i = this.#boxesAreaAzulLeftBottomCorner.x + 1; i < this.#yxDimensions[1]; i += stepX) {
      for (let j = this.#boxesAreaAzulLeftBottomCorner.y + 1; j < this.#yxDimensions[0]; j += stepY) {
        for (let x = i; x < i + boxWidth && x < this.#yxDimensions[1]; x++) {
          for (let y = j; y < j + boxHeight && y < this.#yxDimensions[0]; y++) {
            this.#grid[y][x] = GridMap.BOXE;
          }
        }
      }
    }
  }

  #fillGridWithLojasExternas() {
    const gapBetweenBlocosLojasExternas = 2;
    const stepY = gapBetweenBlocosLojasExternas + this.#widthHeightBlocoLojasExternas[1];
    let yOffset = 0;

    for (let i = 0; i < 7; i++) {
      const edgeBtmLeftYX: [number, number] = [
        0 + yOffset,
        this.#boxesAreaAzulLeftBottomCorner.x - this.#widthHeightBlocoLojasExternas[0] - this.#gapBetweenLojasExternasAndBoxes
      ];// setor azul
      const bloco1LojasExternas = createBlocoLojasExternas("Azul", i, edgeBtmLeftYX);
      this.#lojasExternas = [...this.#lojasExternas, ...bloco1LojasExternas];

      for (const loja of bloco1LojasExternas) {
        for (const pos of loja.gridArea) {
          this.#grid[pos.y][pos.x] = GridMap.LOJAS_EXTERNAS;
        }
      }
      yOffset += stepY;
    }
  }

  getLojasExternas() {
    return this.#lojasExternas;
  }

  #fillGridWithLojasInternasEBanheiros() {
    const areaHeight = 14;
    const areaWidth = 14;

    // vale para setor azul e laranja
    const edgeBtmLeft = {
      y: (4 * 5 + 1),
      x: (5 * 3 + 1) + this.#boxesAreaAzulLeftBottomCorner.x
    }

    for (let i = 0; i < areaWidth; i++) {
      for (let j = 0; j < areaHeight; j++) {
        this.#grid[edgeBtmLeft.y + j][edgeBtmLeft.x + i] = GridMap.LOJAS_INTERNAS;
      }
    }
  }

  #fillGridWithPraçasDeAlimentação() {
    const areaHeight = 19;
    const areaWidth = 11;

    const edgeBtmLeftYX = [(11 * 5 + 1), (11 * 3 + 1) + this.#boxesAreaAzulLeftBottomCorner.x];// setor azul

    for (let i = 0; i < areaHeight; i++) {
      for (let j = 0; j < areaWidth; j++) {
        if (j < areaWidth / 2) this.#grid[edgeBtmLeftYX[0] + i][edgeBtmLeftYX[1] + j] = GridMap.CAMINHO;
        else this.#grid[edgeBtmLeftYX[0] + i][edgeBtmLeftYX[1] + j] = GridMap.RESTAURANTES;
      }
    }
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

  getBoxe(y: number, x: number) {
    return {
      setor: 'Laranja',
      rua: 'A',
      numero: this.#getNumeroDoBoxe(y, x),
    }
  }

  #getNumeroDoBoxe = (y: number, x: number) => {
    const valorY = y * 2 - (parseInt((y / 5).toString()) * 2)
    const valorX = x - 3 * parseInt((x / 3).toString())
    return valorY - 2 + valorX
  }

  calculateBestRoute(startPos: Position, destinies: Position[]) {
    if (startPos.x < 0 || startPos.y < 0 || startPos.x >= this.#yxDimensions[1] || startPos.y >= this.#yxDimensions[0] || this.#grid[startPos.y][startPos.x] !== GridMap.CAMINHO) {
      console.error('Posição inicial inválida x: ', startPos.x, ' y: ', startPos.y);
    }
    const auxGrid = structuredClone(this.#grid);
    for (const dest of destinies) {
      if (dest.x < 0 || dest.y < 0 || dest.x >= this.#yxDimensions[1] || dest.y >= this.#yxDimensions[0] || this.#grid[dest.y][dest.x] !== GridMap.BOXE) {
        console.error(`Posição de destino inválida x: ${dest.x} y: ${dest.y}`);
      }
      auxGrid[dest.y][dest.x] = 0;
    }

    const destinos = [startPos, ...destinies];

    const destiniesBestOrder = this.#calculateBestOrder(destinos, auxGrid);
    const steps = this.#calculateBestSteps(destiniesBestOrder, auxGrid);

    return {
      destiniesBestOrder,
      steps
    };
  }

  #calculateBestOrder(destinos: Position[], grid: number[][]) {
    // matriz 2d reflexiva com as distancias entre cada par de destinos
    const distancias = Array.from({ length: destinos.length }, () => Array(destinos.length).fill(0));
    const finder = new PF.AStarFinder();

    // preenche a matriz de distancias de forma reflexiva
    for (let i = 0; i < destinos.length; i++) {
      for (let j = i + 1; j < destinos.length; j++) {
        const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[j].x, destinos[j].y, new PF.Grid(grid));
        distancias[i][j] = path.length;
        distancias[j][i] = path.length;
      }
    }
    const indicesMelhorCaminho = tspSolver(distancias);
    const destiniesBestOrder = indicesMelhorCaminho.map((i: number) => destinos[i]);
    return destiniesBestOrder;
  }

  #calculateBestSteps(destinos: Position[], grid: number[][]) {
    const finder = new PF.AStarFinder();
    let steps: Position[] = [{ x: destinos[0].x, y: destinos[0].y }];
    for (let i = 0; i < destinos.length - 1; i++) {
      const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[i + 1].x, destinos[i + 1].y, new PF.Grid(grid));

      path.shift();// remove repetido

      steps = [...steps, ...(path.map(p => { return { x: p[0], y: p[1] } }))];
    }
    return steps;
  }
} 