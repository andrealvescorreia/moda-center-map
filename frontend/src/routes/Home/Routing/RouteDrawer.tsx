import { useNavigate } from 'react-router-dom'
import AntPath from '../../../components/Routing/ant-path'
import DestinyMarker from '../../../components/Routing/destiny-marker'
import type { Destiny } from '../../../interfaces/Destiny'
import type { Position } from '../../../interfaces/Position'

interface RouteDrawerProps {
  destinos: Destiny[]
  passos: Position[]
}

const RouteDrawer = ({ destinos, passos }: RouteDrawerProps) => {
  const navigate = useNavigate()
  const positionListToLatLngList = (positions: Position[]) => {
    return positions.map((p) => [p.y + 0.5, p.x + 0.5])
  }
  const adjustedPassos = passos.map((p) => ({
    x: p.x + 0.2,
    y: p.y,
  }))
  return (
    <>
      {destinos?.map((destino, index) => {
        if (index < destinos.length)
          return (
            <DestinyMarker
              key={`${destino.position.x}-${destino.position.y}`}
              x={destino.position.x}
              y={destino.position.y}
              innerText={(index + 1).toString()}
              isEnd={index === destinos.length - 1}
              destiny={destino}
              onClickDestiny={() => navigate(`/sellers/${destino.sellerId}`)}
            />
          )
      })}
      {passos.length > 0 && (
        <AntPath
          positions={positionListToLatLngList(adjustedPassos)}
          options={{ color: 'purple' }}
        />
      )}
    </>
  )
}

export default RouteDrawer
