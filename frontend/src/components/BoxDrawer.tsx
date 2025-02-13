import Boxe from "./Boxe";
import PixiOverlay from "react-leaflet-pixi-overlay";
//import * as PIXI from 'pixi.js';

/*const isElementInArray = (array: Position[], element: Position) => {
  return array.some(item => item.x == element.x && item.y == element.y);
};*/

const numeroDoBoxe = (y: number, x: number) => {
  const valorY = y * 2 - (parseInt((y / 5).toString()) * 2)
  const valorX = x - 3 * parseInt((x / 3).toString())
  return valorY - 2 + valorX
}

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

  let markers = [];
  const boxes = [];

  for (let i = 0; i < grid.length; i++) {// y (lat)
    for (let j = 0; j < grid[i].length; j++) {// x (lng)
      if (i >= SWLat - 1 && i <= NELat + 1 && j >= SWLng - 1 && j <= NELng + 1) {
        if (grid[i][j] === 1) {
          markers.push({
            id: `${i}-${j}`,
            position: [i + 0.5, j + 0.5] as [number, number],
            iconColor: 'red',
            iconId: `${numeroDoBoxe(i, j)}`,
            customIcon: `
            <svg height="20" width="50" xmlns="http://www.w3.org/2000/svg">
              <text x="15" y="20" fill="black">${numeroDoBoxe(i, j)}</text>
              ${numeroDoBoxe(i, j)}
            </svg>
            `
          });
          boxes.push(
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



  return (
    <>
      {boxes}
      <PixiOverlay markers={markers} />
    </>
  );
  
  //return components;
}
export default BoxDrawer;