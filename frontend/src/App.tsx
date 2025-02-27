import { MapContainer } from 'react-leaflet'
import GridDrawer from './components/GridDrawer'
import 'leaflet/dist/leaflet.css'
import './App.css'
import L from 'leaflet'
import RoutingManager from './components/Routing/RoutingManager'
import { GridMap } from './models/GridMap'

const modaCenterGridMap = new GridMap()
const minZoomLevelToRenderMarkers = 1

function App() {
  return (
    <div>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={modaCenterGridMap.getBounds()}
        center={[3, 3.5]}
        zoom={5}
        maxZoom={7}
        preferCanvas={true}
      >
        <RoutingManager gridMap={modaCenterGridMap} />
        <GridDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />
      </MapContainer>
    </div>
  )
}

export default App
