import L from 'leaflet'
import { useState } from 'react'
import { ImageOverlay, Rectangle } from 'react-leaflet'
import PixiOverlay from 'react-leaflet-pixi-overlay'
import type { JSX } from 'react/jsx-runtime'
import { ModaCenterGridMap } from '../models/ModaCenterGridMap'
import Boxe from './Boxe'
import MapInfoCollector from './MapInfoCollector'

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
  gridMap: ModaCenterGridMap
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

  const debug = false

  function drawBoxes() {
    if (!mapInfo || mapInfo.zoom <= minZoomLevelToRenderBoxes) return
    for (let i = 0; i < grid.length; i++) {
      // y (lat)
      for (let j = 0; j < grid[i].length; j++) {
        // x (lng)
        if (!isInsideCameraBounds(mapInfo.bounds, i, j)) continue

        if (grid[i][j] === ModaCenterGridMap.BOXE) {
          components.push(
            <Boxe y={i} x={j} onClick={() => {}} key={`${i}-${j}`} />
          )
        }
      }
    }
  }

  function drawMarkers() {
    if (!mapInfo || mapInfo.zoom <= minZoomLevelToRenderBoxes) return

    for (let i = 0; i < grid.length; i++) {
      // y (lat)
      for (let j = 0; j < grid[i].length; j++) {
        // x (lng)
        if (!isInsideCameraBounds(mapInfo.bounds, i, j)) continue

        if (grid[i][j] === ModaCenterGridMap.BOXE) {
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
        }
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

  drawMarkers()
  if (debug) {
    drawBoxes()
    drawLojasExternas()
    drawBanheiros()
    drawObstaculos()
  }

  return (
    <>
      <MapInfoCollector onUpdateInfo={(newInfo) => setMapInfo(newInfo)} />
      <ImageOverlay
        url="src\components\grid.png"
        bounds={gridMap.getBounds()}
        alt="deu ruim"
        zIndex={-1}
      />
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
    </>
  )
}
export default GridDrawer
