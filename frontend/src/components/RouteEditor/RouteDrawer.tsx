import { Marker } from "react-leaflet";
import { Position } from "../../interfaces/Position";
import DestinyMarker from "../DestinyMarker";
import AntPath from '../../components/AntPath';


interface RouteDrawerProps {
  inicio: Position;
  destinos: Position[];
  passos: Position[];
}

const positionListToLatLngList = (positions: Position[]) => {
  return positions.map(p => [p.y + 0.5, p.x + 0.5]);
}


const RouteDrawer = ({ inicio, destinos, passos }: RouteDrawerProps) => {
  return (
    <>
      {
        inicio && <Marker position={[inicio.y + 0.5, inicio.x + 0.5]}></Marker>
      }
      {
        destinos?.map((marcador, index) => {
          if (index < destinos.length && index > 0)
            return <DestinyMarker key={index} x={marcador.x} y={marcador.y} innerText={index.toString()} />
        }
        )
      }
      {
        passos.length > 0 &&
        <AntPath positions={positionListToLatLngList(passos)} options={{ color: 'purple' }} />
      }
    </>
  )
};

export default RouteDrawer;