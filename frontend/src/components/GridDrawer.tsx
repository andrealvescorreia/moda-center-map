import L from 'leaflet'
import { useState } from 'react'
import { Rectangle } from 'react-leaflet'
import PixiOverlay from 'react-leaflet-pixi-overlay'
import type { JSX } from 'react/jsx-runtime'
import { GridMap } from '../models/GridMap'
import Boxe from './Boxe'
import MapInfoCollector from './MapInfoCollector'

// cria os quadrados do grid. Não eficiente para o mapa grande. TODO: substituir por img overlay quando zoom out

interface MapCameraBounds {
  getSouthWest: () => { lat: number; lng: number }
  getNorthEast: () => { lat: number; lng: number }
}

const isInsideCameraBounds = (
  cameraBounds: MapCameraBounds,
  y: number,
  x: number
) => {
  const SWLat = cameraBounds.getSouthWest().lat
  const NELat = cameraBounds.getNorthEast().lat
  const SWLng = cameraBounds.getSouthWest().lng
  const NELng = cameraBounds.getNorthEast().lng
  return y >= SWLat - 1 && y <= NELat + 1 && x >= SWLng - 1 && x <= NELng + 1
}

interface MapInfo {
  center: L.LatLng
  bounds: L.LatLngBounds
  zoom: number
}

interface GridDrawerProps {
  gridMap: GridMap
  minZoomLevelToRenderMarkers?: number
  minZoomLevelToRenderBoxes?: number
}
const GridDrawer = ({
  gridMap,
  minZoomLevelToRenderMarkers = 5,
  minZoomLevelToRenderBoxes = 2,
}: GridDrawerProps) => {
  interface Marker {
    id: string
    position: [number, number]
    iconColor: string
    iconId: string
    customIcon: string
  }

  const markers: Marker[] = []
  const components: JSX.Element[] = []
  const grid = gridMap.getGrid()

  const [mapInfo, setMapInfo] = useState<MapInfo>()

  function drawBoxes() {
    if (!mapInfo || mapInfo.zoom <= minZoomLevelToRenderBoxes) return

    for (let i = 0; i < grid.length; i++) {
      // y (lat)
      for (let j = 0; j < grid[i].length; j++) {
        // x (lng)
        if (!isInsideCameraBounds(mapInfo.bounds, i, j)) continue

        if (grid[i][j] === GridMap.BOXE) {
          const numDoBoxe = gridMap.getBoxe(i, j)?.numero

          markers.push({
            id: `${i}-${j}`,
            position: [i + 0.5, j + 0.5] as [number, number],
            iconColor: 'red',
            iconId: `${numDoBoxe}`,
            customIcon: `
                <svg height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <text x="15" y="20" fill="black">${numDoBoxe}</text>
                  ${numDoBoxe}
                </svg>
                `,
          })
          components.push(
            <Boxe y={i} x={j} onClick={() => {}} key={`${i}-${j}`} />
          )
        }
        /*else if (grid[i][j] !== GridMap.CAMINHO) {//!temporário
          components.push(
            <Rectangle
              key={`${i}-${j}`}
              bounds={[[i, j], [i + 1, j + 1]]}
              //color='#ffffff00'
              fillColor='#fff0000' />
          );
        }*/
      }
    }
  }

  function drawLojasExternas() {
    for (const loja of gridMap.getLojas()) {
      components.push(
        <Rectangle
          key={`setor${loja.setor}-loja${loja.numLoja}-bloco${loja.bloco}-${loja.gridArea[0].y}-${loja.gridArea[0].x}`}
          bounds={L.latLngBounds(loja.getBounds() as [number, number][])}
          fillColor="#ff0000"
        />
      )
    }
  }

  function drawBanheiros() {
    for (const banheiro of gridMap.getBanheiros()) {
      components.push(
        <Rectangle
          key={`banheiro-${banheiro.genero}-setor${banheiro.setor}-area${banheiro.area}`}
          bounds={L.latLngBounds(banheiro.getBounds() as [number, number][])}
          fillColor={banheiro.genero === 'M' ? '#0000ff' : '#ff00ff'}
        />
      )
    }
  }

  function drawObstaculos() {
    for (const obstaculo of gridMap.getObstaculos()) {
      const bounds = L.latLngBounds(
        [obstaculo.bounds.bottomLeft.y, obstaculo.bounds.bottomLeft.x],
        [obstaculo.bounds.topRight.y, obstaculo.bounds.topRight.x]
      )
      components.push(
        <Rectangle
          key={`obstaculo-${obstaculo.bounds.bottomLeft.x}-${obstaculo.bounds.bottomLeft.y}`}
          bounds={bounds}
          fillColor="#0000ff"
        />
      )
    }
  }

  drawBoxes()
  drawLojasExternas()
  drawBanheiros()
  drawObstaculos()

  return (
    <>
      <MapInfoCollector onUpdateInfo={(newInfo) => setMapInfo(newInfo)} />
      {
        <PixiOverlay
          markers={
            mapInfo && mapInfo.zoom >= minZoomLevelToRenderMarkers
              ? markers
              : []
          }
        />
      }
      {components}
      <Rectangle
        bounds={gridMap.getBounds()}
        color="#ffffff00"
        fillColor="#33b4ff"
      />
    </>
  )
}
export default GridDrawer
