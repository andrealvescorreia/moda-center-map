import { MapContainer } from 'react-leaflet'
import GridDrawer from '../../components/GridDrawer'
import 'leaflet/dist/leaflet.css'
import './App.css'
import L from 'leaflet'
import Logo from '../../assets/logo.png'

import { useCallback, useState } from 'react'
import { ClickPosition } from '../../components/ClickPosition'
import RouteDrawer from '../../components/Routing/RouteDrawer'
import RoutingManager from '../../components/Routing/RoutingManager'
import CallToLogin from '../../components/call-to-login'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import type { Destiny } from '../../interfaces/Destiny'
import type { Position } from '../../interfaces/Position'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useNavContext } from '../../providers/NavProvider'
const modaCenterGridMap = new ModaCenterGridMap()
const minZoomLevelToRenderMarkers = 5

interface MyRoute {
  inicio: Position | null
  destinos: Destiny[]
  passos: Position[]
}

function App() {
  const [route, setRoute] = useState<MyRoute>()
  const { show } = useNavContext()

  const handleUpdate = useCallback((route: MyRoute) => setRoute(route), [])

  return (
    <div>
      <div className="absolute ui top-0 w-full shadow-md">
        {show && <CallToLogin />}
        {show && (
          <div className="absolute top-15 w-full px-5 md:max-w-125 md:top-0 ml-[50%] transform -translate-x-1/2">
            <InputRoot>
              <InputIcon>
                <img src={Logo} alt="Logo" className="size-6" />
              </InputIcon>
              <InputField placeholder="Busque pontos de venda" />
            </InputRoot>
          </div>
        )}
      </div>

      <RoutingManager
        gridMap={modaCenterGridMap}
        onUpdateRoute={handleUpdate}
      />
      <MapContainer
        crs={L.CRS.Simple}
        bounds={modaCenterGridMap.getBounds()}
        maxBounds={[
          [
            modaCenterGridMap.getBounds()[0][0] - 60, //TODO: multiply by zoom level
            modaCenterGridMap.getBounds()[0][1] - 60,
          ],
          [
            modaCenterGridMap.getBounds()[1][0] + 60,
            modaCenterGridMap.getBounds()[1][1] + 60,
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
    </div>
  )
}

export default App
