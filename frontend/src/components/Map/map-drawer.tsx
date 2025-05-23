import L from 'leaflet'
import { useState } from 'react'
import { ImageOverlay, Marker, Rectangle } from 'react-leaflet'
import type { JSX } from 'react/jsx-runtime'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import MapInfoCollector from './map-info-collector'
import 'leaflet-extra-markers'

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
const MapDrawer = ({
  gridMap,
  //minZoomLevelToRenderMarkers = 5,
  minZoomLevelToRenderBoxes = 2,
}: GridDrawerProps) => {
  const markers: JSX.Element[] = []
  const components: JSX.Element[] = []
  const grid = gridMap.getGrid()

  const [mapInfo, setMapInfo] = useState<MapInfo>()

  const DEBUG = false

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
          markers.push(
            <Marker
              key={`${i}-${j}`}
              position={[i + 0.5, j + 0.5]}
              icon={
                new L.DivIcon({
                  className: 'boxe-marker',
                  html: `<div>${numDoBoxe}</div>`,
                })
              }
            />
          )
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

  if (DEBUG) {
    drawMarkers()
    drawBoxes()
    drawLojasExternas()
    drawBanheiros()
    drawObstaculos()
  }

  return (
    <>
      <MapInfoCollector onUpdateInfo={(newInfo) => setMapInfo(newInfo)} />
      {!DEBUG && (
        <ImageOverlay
          url={
            mapInfo && mapInfo.zoom >= 4
              ? '/grid v2 (detailed).jpg'
              : mapInfo && mapInfo.zoom >= 2
                ? '/grid (medium detail).jpg'
                : '/grid (no detail).jpg'
          }
          bounds={gridMap.getBounds()}
          alt="mapa moda center"
          zIndex={-1}
        />
      )}
      {components}
      {markers}
    </>
  )
}
export default MapDrawer

interface BoxeProps {
  x: number
  y: number
  onClick: () => void
}

const Boxe = ({ x, y, onClick }: BoxeProps) => {
  return (
    <Rectangle
      bounds={[
        [y, x],
        [y + 1, x + 1],
      ]}
      color="#ffffff00"
      fillColor="orange"
      eventHandlers={{
        click: onClick,
      }}
    />
  )
}
