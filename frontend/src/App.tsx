import { MapContainer, Marker, Rectangle } from 'react-leaflet'
import BoxDrawer from './components/BoxDrawer';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import DestinyMarker from './components/DestinyMarker';
import AntPath from './components/AntPath';
import MapInfoCollector from './components/MapInfoCollector';
import { Position } from './interfaces/Position';
import RouteEditor from './components/RouteEditor';
import { GridMap } from './models/GridMap';


interface MapInfo {
  center: L.LatLng;
  bounds: L.LatLngBounds;
  zoom: number;
}


const gridMap = new GridMap([225, 92]);
let counter = 0;

function App() {
  counter++;
  console.warn('render', counter);

  const [marcadorInicio, setMarcadorInicio] = useState<Position>({ y: 0, x: 0 });

  const [marcadoresDestino, setMarcadoresDestino] = useState<Position[]>([]);
  const [marcadoresDestinoMelhorOrdem, setMarcadoresDestinoMelhorOrdem] = useState<Position[]>([]);

  // caminho completo, com cada posição na grid a ser andada.
  const [melhoresPassos, setMelhoresPassos] = useState<Position[]>([]);

  const [mapInfo, setMapInfo] = useState<MapInfo>();
  useEffect(() => { console.log('info', mapInfo) }, [mapInfo]);


  const positionListToLatLngList = (positions: Position[]) => {
    return positions.map(p => [p.y + 0.5, p.x + 0.5]);
  }

  useEffect(() => {
    setMarcadoresDestino([{ x: 0, y: 3 }, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 6, y: 2 }]);
  }, [])

  useEffect(() => {
    setMarcadoresDestinoMelhorOrdem(gridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).destiniesBestOrder);

  }, [marcadorInicio, marcadoresDestino])

  useEffect(() => {
    if (marcadoresDestinoMelhorOrdem.length > 1)
      setMelhoresPassos(gridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).steps);
  }, [marcadorInicio, marcadoresDestino, marcadoresDestinoMelhorOrdem])

  useEffect(() => {
    console.log('melhorCaminho: ', melhoresPassos);
  }, [melhoresPassos])

  return (
    <div>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={gridMap.getBounds()}
        center={[3, 3.5]}
        zoom={5}
        maxZoom={7}
      >
        <MapInfoCollector onUpdateInfo={(newInfo) => setMapInfo(newInfo)} />
        {
          <AntPath positions={positionListToLatLngList(melhoresPassos)} options={{ color: 'red' }} />
        }
        <RouteEditor />
        <Rectangle
          bounds={gridMap.getBounds()}
          color='white'
          fillColor='#ffffff00'
        />

        {
          mapInfo && mapInfo?.zoom > 4 && <BoxDrawer grid={gridMap.getGrid()} mapBounds={mapInfo?.bounds} />
        }

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

      </MapContainer>
    </div>
  )
}

export default App;
