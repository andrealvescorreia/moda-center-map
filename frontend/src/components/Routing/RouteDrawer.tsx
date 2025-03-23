import { Marker } from 'react-leaflet'
import type { Destiny } from '../../interfaces/Destiny'
import type { Position } from '../../interfaces/Position'
import AntPath from './ant-path'
import DestinyMarker from './destiny-marker'

interface RouteDrawerProps {
  inicio: Position
  destinos: Destiny[]
  passos: Position[]
}

const positionListToLatLngList = (positions: Position[]) => {
  return positions.map((p) => [p.y + 0.5, p.x + 0.5])
}

const RouteDrawer = ({ inicio, destinos, passos }: RouteDrawerProps) => {
  return (
    <>
      {inicio && <Marker position={[inicio.y + 0.5, inicio.x + 0.5]} />}
      {destinos?.map((destino, index) => {
        if (index < destinos.length && index > 0)
          return (
            <DestinyMarker
              key={`${destino.position.x}-${destino.position.y}`}
              x={destino.position.x}
              y={destino.position.y}
              innerText={index.toString()}
            />
          )
      })}
      {passos.length > 0 && (
        <AntPath
          positions={positionListToLatLngList(passos)}
          options={{ color: 'purple' }}
        />
      )}
    </>
  )
}

export default RouteDrawer
