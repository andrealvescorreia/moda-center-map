import PF from 'pathfinding';

interface Position {
  y: number;// Lat (vertical, Norte - Sul)
  x: number;// Lng (horizontal, Leste - Oeste)
}

export interface GridConfig {
  stepX: number;
  stepY: number;
  boxWidth: number;
  boxHeight: number;
  tam: [number, number];
}

export function criaGrid(config: GridConfig): number[][] {
  const { stepX, stepY, boxWidth, boxHeight, tam } = config;
  const grid = Array.from({ length: tam[0] }, () => Array(tam[1]).fill(0));

  for (let i = 1; i < tam[1]; i += stepX) {
    for (let j = 1; j < tam[0]; j += stepY) {
      for (let x = i; x < i + boxWidth && x < tam[1]; x++) {
        for (let y = j; y < j + boxHeight && y < tam[0]; y++) {
          grid[y][x] = 1;
        }
      }
    }
  }

  return grid;
}

export const calculaMelhorCaminho = ({ grid, destinos }: { grid: number[][], destinos: Position[] }) => {
  const finder = new PF.AStarFinder();
  let caminhos: Position[] = [{ x: destinos[0].x, y: destinos[0].y }];
  for (let i = 0; i < destinos.length - 1; i++) {
    const path = finder.findPath(destinos[i].x, destinos[i].y, destinos[i + 1].x, destinos[i + 1].y, new PF.Grid(grid));

    path.shift();// remove repetido

    caminhos = [...caminhos, ...(path.map(p => { return { x: p[0], y: p[1] } }))];
  }
  return caminhos;

}