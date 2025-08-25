import { MapContainer, useMap } from 'react-leaflet'
import MapDrawer from '../../components/Map/map-drawer'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import Logo from '../../assets/logo.png'
import { ClickPosition } from '../../components/Map/click-position'
import FlyTo from '../../components/Map/fly-to'
import RouteButton from '../../components/Routing/route-button'
import CallToLogin from '../../components/call-to-login'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import NavBar from '../../components/nav'
import type { Route } from '../../interfaces/Route'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useNavContext } from '../../providers/NavProvider'
import { useRouteContext } from '../../providers/RouteProvider'
import { useUserContext } from '../../providers/UserProvider'
import DraggableMarker from './Routing/DraggableMarker'
import RouteDrawer from './Routing/RouteDrawer'
import RoutingManager from './Routing/RoutingManager'
import SearchSeller from './search-seller'
const modaCenterGridMap = new ModaCenterGridMap()
const minZoomLevelToRenderMarkers = 5

function Home() {
  const { route, setRoute } = useRouteContext()
  const { show, setShow } = useNavContext()
  const { user } = useUserContext()
  const [isSearching, setIsSearching] = useState(false)
  const [isManagingRoute, setIsManagingRoute] = useState(false)

  type RoutingManagerRef = {
    handleUpdate: (route: Route) => void
  }
  const childRef = useRef<RoutingManagerRef>(null)

  useEffect(() => {
    if (isManagingRoute) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [isManagingRoute, setShow])

  useEffect(() => {
    setShow(true)
  }, [setShow])
  if (isSearching) {
    return <SearchSeller onCancel={() => setIsSearching(false)} />
  }

  function setInitialPosition(position: [number, number]) {
    if (!route) return
    const newRoute = {
      ...route,
      inicio: {
        position: { x: position[1], y: position[0] },
        sellingLocation: modaCenterGridMap.findNearestBoxe(
          position[0],
          position[1]
        ),
      },
      destinos: route?.destinos ?? [],
      passos: route?.passos ?? [],
    }
    if (!childRef.current) return
    childRef.current.handleUpdate(newRoute)
  }

  function handleChangeStartPoint(newPosition: [number, number]) {
    const y = Math.round(newPosition[0])
    const x = Math.round(newPosition[1])
    if (!modaCenterGridMap.isInsideGridMap(y, x)) {
      setInitialPosition([
        route?.inicio?.position.y ?? 0,
        route?.inicio?.position.x ?? 0,
      ])
      setRoute((prev) => (prev ? { ...prev } : undefined)) // force re-render to update marker position
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
      setRoute((prev) => (prev ? { ...prev } : undefined)) // force re-render to update marker position
      return
    }

    setInitialPosition([y, adjustedX])
  }

  function MapMaxBoundsUpdater() {
    const map = useMap()
    map.on('zoom', () => {
      const zoomLevel = map.getZoom()
      const offset = 5 + 2.4 ** (7 - zoomLevel)
      map.setMaxBounds([
        [
          modaCenterGridMap.getBounds()[0][0] - offset,
          modaCenterGridMap.getBounds()[0][1] - offset / 2,
        ],
        [
          modaCenterGridMap.getBounds()[1][0] + offset,
          modaCenterGridMap.getBounds()[1][1] + offset / 2,
        ],
      ])
    })
    return null
  }

  return (
    <>
      <NavBar />

      <div className="absolute ui top-0 w-full ">
        {show && !user && <CallToLogin />}
        {show && (
          <div className="md:absolute md:mt-0 mt-2 w-full px-2 md:max-w-125 md:top-0 ml-[50%] transform -translate-x-1/2">
            <InputRoot>
              <InputIcon>
                <img src={Logo} alt="Logo" className="h-6" />
              </InputIcon>
              <InputField
                placeholder="Busque pontos de venda"
                onClick={() => setIsSearching(true)}
              />
            </InputRoot>
          </div>
        )}
      </div>

      {!isManagingRoute ? (
        <span className="absolute  ui bottom-20 right-5">
          <RouteButton
            onClick={() => setIsManagingRoute(true)}
            className="relative"
          />
        </span>
      ) : (
        <RoutingManager
          ref={childRef}
          gridMap={modaCenterGridMap}
          onStopManagingRoute={() => setIsManagingRoute(false)}
        />
      )}

      <MapContainer
        crs={L.CRS.Simple}
        bounds={modaCenterGridMap.getBounds()}
        maxBounds={[
          [
            modaCenterGridMap.getBounds()[0][0] - 85,
            modaCenterGridMap.getBounds()[0][1] - 85 / 2,
          ],
          [
            modaCenterGridMap.getBounds()[1][0] + 85,
            modaCenterGridMap.getBounds()[1][1] + 85 / 2,
          ],
        ]}
        maxZoom={6}
        minZoom={1}
        center={modaCenterGridMap.getCenter()}
        zoom={2}
        //preferCanvas={true}
      >
        <MapMaxBoundsUpdater />
        <MapDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />
        {isManagingRoute && (
          <span>
            {route && (
              <RouteDrawer
                destinos={route.destinos}
                passos={route.passos ?? []}
              />
            )}
            {route?.inicio && (
              <DraggableMarker
                position={route.inicio.position}
                onUpdatePosition={handleChangeStartPoint}
              />
            )}
            {route?.inicio && <FlyTo position={route.inicio.position} />}
          </span>
        )}
        <ClickPosition />
      </MapContainer>
    </>
  )
}

export default Home
