import { MapContainer } from 'react-leaflet'
import GridDrawer from './components/GridDrawer'
import 'leaflet/dist/leaflet.css'
import './App.css'
import L from 'leaflet'
import RoutingManager from './components/Routing/RoutingManager'
import { ModaCenterGridMap } from './models/ModaCenterGridMap'
import './globals.css'
import { useCallback, useState } from 'react'
import { ClickPosition } from './components/ClickPosition'
import RouteDrawer from './components/Routing/RouteDrawer'
import type { Destiny } from './interfaces/Destiny'
import type { Position } from './interfaces/Position'
import ClickProvider from './providers/ClickProvider'

const modaCenterGridMap = new ModaCenterGridMap()
const minZoomLevelToRenderMarkers = 5

interface MyRoute {
  inicio: Position | null
  destinos: Destiny[]
  passos: Position[]
}

function App() {
  const [route, setRoute] = useState<MyRoute>()

  const handleUpdate = useCallback((route: MyRoute) => setRoute(route), [])

  return (
    <ClickProvider>
      <RoutingManager
        gridMap={modaCenterGridMap}
        onUpdateRoute={handleUpdate}
      />

      <MapContainer
        crs={L.CRS.Simple}
        bounds={modaCenterGridMap.getBounds()}
        maxBounds={[
          [
            modaCenterGridMap.getBounds()[0][0] - 10,
            modaCenterGridMap.getBounds()[0][1] - 10,
          ],
          [
            modaCenterGridMap.getBounds()[1][0] + 10,
            modaCenterGridMap.getBounds()[1][1] + 10,
          ],
        ]}
        center={[3, 3.5]}
        zoom={5}
        maxZoom={6}
        minZoom={1}
        preferCanvas={true}
      >
        <GridDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />
        {route?.inicio && (
          <RouteDrawer
            inicio={route.inicio}
            destinos={route.destinos}
            passos={route.passos}
          />
        )}
        <ClickPosition />
      </MapContainer>
    </ClickProvider>
  )
}

export default App
