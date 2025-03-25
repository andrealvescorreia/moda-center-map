import { MapContainer } from 'react-leaflet'
import GridDrawer from '../../components/GridDrawer'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'
import { useMemo, useRef } from 'react'
import { Marker } from 'react-leaflet'
import Logo from '../../assets/logo.png'
import { ClickPosition } from '../../components/Map/click-position'
import FlyTo from '../../components/Map/fly-to'
import RouteDrawer from '../../components/Routing/RouteDrawer'
import RoutingManager from '../../components/Routing/RoutingManager'
import CallToLogin from '../../components/call-to-login'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import NavBar from '../../components/nav'
import type { Position } from '../../interfaces/Position'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useNavContext } from '../../providers/NavProvider'
import { useRouteContext } from '../../providers/RouteProvider'
import { useUserContext } from '../../providers/UserProvider'
import Search from './search'
const modaCenterGridMap = new ModaCenterGridMap()
const minZoomLevelToRenderMarkers = 5

function App() {
  const { route, setRoute } = useRouteContext()
  const { show } = useNavContext()
  const { user } = useUserContext()
  const [isSearching, setIsSearching] = useState(false)

  if (isSearching) {
    return <Search onCancel={() => setIsSearching(false)} />
  }

  function setInitialPosition(position: [number, number]) {
    if (!route) return
    setRoute((prevRoute) => ({
      ...prevRoute,
      inicio: {
        position: { x: position[1], y: position[0] },
        sellingLocation: modaCenterGridMap.findNearestBoxe(
          position[0],
          position[1]
        ),
      },
      destinos: prevRoute?.destinos ?? [],
      passos: prevRoute?.passos ?? [],
    }))
  }

  function isInsideGridMap(lat: number, lng: number) {
    const [rows, cols] = modaCenterGridMap.getDimensions()
    return lat >= 0 && lat < rows && lng >= 0 && lng < cols
  }
  function handleChangeStartPoint(newPosition: [number, number]) {
    const y = Math.round(newPosition[0])
    const x = Math.round(newPosition[1])
    if (!isInsideGridMap(y, x)) {
      setInitialPosition([
        route?.inicio?.position.y ?? 0,
        route?.inicio?.position.x ?? 0,
      ])
      return
    }

    const isBoxe = modaCenterGridMap.getGrid()[y][x] === ModaCenterGridMap.BOXE
    const isCaminho = (lat: number, lng: number) =>
      modaCenterGridMap.getGrid()[lat][lng] === ModaCenterGridMap.CAMINHO

    const adjustedX = isBoxe
      ? ([x + 1, x - 1].find((lng) => isCaminho(y, lng)) ?? x)
      : x

    if (!isCaminho(y, adjustedX)) {
      setInitialPosition([
        route?.inicio?.position.y ?? 0,
        route?.inicio?.position.x ?? 0,
      ])
      return
    }

    setInitialPosition([y, adjustedX])
  }

  return (
    <div>
      <NavBar />

      <div className="absolute ui top-0 w-full ">
        {show && !user && <CallToLogin />}
        {show && (
          <div className="md:absolute md:mt-0 mt-5   w-full px-5 md:max-w-125 md:top-0 ml-[50%] transform -translate-x-1/2">
            <InputRoot>
              <InputIcon>
                <img src={Logo} alt="Logo" className="size-6" />
              </InputIcon>
              <InputField
                placeholder="Busque pontos de venda"
                onClick={() => setIsSearching(true)}
              />
            </InputRoot>
          </div>
        )}
      </div>

      <RoutingManager gridMap={modaCenterGridMap} />
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
        maxZoom={6}
        minZoom={1}
        center={modaCenterGridMap.getCenter()}
        zoom={2}
        preferCanvas={true}
      >
        <GridDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />
        {route && (
          <RouteDrawer destinos={route.destinos} passos={route.passos ?? []} />
        )}
        {route?.inicio && (
          <DraggableMarker
            position={route.inicio.position}
            onUpdatePosition={handleChangeStartPoint}
          />
        )}
        {route?.inicio && <FlyTo position={route.inicio.position} />}
        <ClickPosition />
      </MapContainer>
    </div>
  )
}

function DraggableMarker({
  position,
  onUpdatePosition,
}: {
  position: Position
  onUpdatePosition: (position: [number, number]) => void
}) {
  const markerRef = useRef<L.Marker>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = marker.getLatLng()
          onUpdatePosition([lat, lng])
        }
      },
    }),
    [onUpdatePosition]
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.y + 0.5, position.x + 0.5]}
      ref={markerRef}
    />
  )
}

export default App
