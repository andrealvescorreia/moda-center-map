import Boxe from "./Boxe";


/*const isElementInArray = (array: Position[], element: Position) => {
  return array.some(item => item.x == element.x && item.y == element.y);
};*/

// cria os quadrados do grid. Não eficiente para o mapa grande. TODO: substituir por img overlay e usar a posição do click do mouse para saber qual quadrado foi clicado
interface BoxDrawerProps {
  grid: number[][];
  mapBounds: MapBounds;
}

interface MapBounds {
  getSouthWest: () => { lat: number, lng: number };
  getNorthEast: () => { lat: number, lng: number };
}

const BoxDrawer = ({ grid, mapBounds }: BoxDrawerProps) => {

  const SWLat = mapBounds.getSouthWest().lat;
  const NELat = mapBounds.getNorthEast().lat;

  const SWLng = mapBounds.getSouthWest().lng;
  const NELng = mapBounds.getNorthEast().lng;

  const components = [];

  for (let i = 0; i < grid.length; i++) {// y (lat)
    for (let j = 0; j < grid[i].length; j++) {// x (lng)
      if (i >= SWLat - 1 && i <= NELat + 1 && j >= SWLng - 1 && j <= NELng + 1) {
        if (grid[i][j] === 1) {
          components.push(

            <Boxe
              y={i} x={j}
              innerText='12'
              onClick={() => { }}
            />
          );
        }
      }
    }
  }
  return components;
}
export default BoxDrawer;