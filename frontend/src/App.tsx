import { MapContainer, Marker } from 'react-leaflet'
import GridDrawer from './components/GridDrawer';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import DestinyMarker from './components/DestinyMarker';
import AntPath from './components/AntPath';
import { Position } from './interfaces/Position';
import RouteEditor from './components/RouteEditor';
import { GridMap } from './models/GridMap';



const modaCenterGridMap = new GridMap([225, 92]);
const minZoomLevelToRenderMarkers = 5;
//let counter = 0;

function App() {
  //counter++;
  //console.warn('render', counter);

  const [marcadorInicio, setMarcadorInicio] = useState<Position>({ y: 0, x: 0 });

  const [marcadoresDestino, setMarcadoresDestino] = useState<Position[]>([]);
  const [marcadoresDestinoMelhorOrdem, setMarcadoresDestinoMelhorOrdem] = useState<Position[]>([]);

  // caminho completo, com cada posição na grid a ser andada.
  const [melhoresPassos, setMelhoresPassos] = useState<Position[]>([]);

  //'useEffect(() => { console.log('info', mapInfo) }, [mapInfo]);


  const positionListToLatLngList = (positions: Position[]) => {
    return positions.map(p => [p.y + 0.5, p.x + 0.5]);
  }

  useEffect(() => {
    setMarcadorInicio({ x: 0, y: 0 });

    setMarcadoresDestino([{ x: 0, y: 3 }, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 6, y: 2 }]);
  }, [])

  useEffect(() => {
    setMarcadoresDestinoMelhorOrdem(modaCenterGridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).destiniesBestOrder);

  }, [marcadorInicio, marcadoresDestino])

  useEffect(() => {
    if (marcadoresDestinoMelhorOrdem.length > 1)
      setMelhoresPassos(modaCenterGridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).steps);
  }, [marcadorInicio, marcadoresDestino, marcadoresDestinoMelhorOrdem])

  useEffect(() => {
    console.log('melhorCaminho: ', melhoresPassos);
  }, [melhoresPassos])

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

        {
          <AntPath positions={positionListToLatLngList(melhoresPassos)} options={{ color: 'red' }} />
        }
        <RouteEditor />

        {
          marcadorInicio && <Marker position={[marcadorInicio.y + 0.5, marcadorInicio.x + 0.5]}></Marker>
        }
        {
          marcadoresDestinoMelhorOrdem?.map((marcador, index) => {
            if (index < marcadoresDestinoMelhorOrdem.length - 1 && index > 0)
              return <DestinyMarker key={index} x={marcador.x} y={marcador.y} innerText={index.toString()} />
          }
          )
        }
        <GridDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />

      </MapContainer>
    </div>
  )
}

export default App;
