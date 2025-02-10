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