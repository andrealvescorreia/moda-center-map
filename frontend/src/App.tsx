import { MapContainer, Marker, Rectangle, useMapEvents } from 'react-leaflet'
import BoxDrawer from './components/BoxDrawer';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import DestinyMarker from './components/DestinyMarker';
import melhorRota from './melhorRota';
import PF from 'pathfinding';
import AntPath from './components/AntPath';
import MapInfoCollector from './components/MapInfoCollector';
const tam = [225, 92]// y, x
const grid = Array.from({ length: tam[0] }, () => Array(tam[1]).fill(0));
const bounds: L.LatLngBoundsLiteral = [[0, 0], [tam[0], tam[1]]];

interface Position {
  y: number;// Lat (vertical, Norte - Sul)
  x: number;// Lng (horizontal, Leste - Oeste)
}

interface MapInfo {
  center: L.LatLng;
  bounds: L.LatLngBounds;
  zoom: number;
}

// 0: caminho livre
// 1: boxe (obstáculo)


function criaGrid() {
  const stepX = 3;
  const stepY = 5;
  const boxWidth = 2;
  const boxHeight = 4;

  for (let i = 1; i < tam[1]; i += stepX) {
    for (let j = 1; j < tam[0]; j += stepY) {
      for (let x = i; x < i + boxWidth && x < tam[1]; x++) {
        for (let y = j; y < j + boxHeight && y < tam[0]; y++) {
          grid[y][x] = 1;
        }
      }
    }
  }
}

let counter = 0;
function App() {
  counter++;
  console.warn('render', counter);
  const [marcadorInicio, setMarcadorInicio] = useState<Position>({ y: 0, x: 0 });
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(false);

  const [marcadoresDestino, setMarcadoresDestino] = useState<Position[]>([]);
  const [marcadoresDestinoMelhorRota, setMarcadoresDestinoMelhorRota] = useState<Position[]>([]);// mesmo tamanho de marcadoresDestino

  const [melhorCaminho, setMelhorCaminho] = useState<Position[]>([]);// caminho completo, com cada posição na grid a ser percorrida
  const [mapInfo, setMapInfo] = useState<MapInfo>();
  useEffect(() => { console.log('info', mapInfo) }, [mapInfo]);


  const MapEvents = () => {
    useMapEvents({
      click(e) {
        // setState your coords here
        // coords exist in "e.latlng.lat" and "e.latlng.lng"
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      },
    });
    return false;
  }

  const positionListToLatLngList = (positions: Position[]) => {
    return positions.map(p => [p.y + 0.5, p.x + 0.5]);
  }


  useEffect(() => {
    criaGrid();
    setMarcadoresDestino([{ x: 0, y: 3 }, { x: 2, y: 0 }, { x: 3, y: 4 }, { x: 6, y: 2 }]);
  }, [])

  /*useEffect(() => {
    for (const destino of marcadoresDestino) {
      grid[destino.y][destino.x] = 0;
    }
  }, [marcadoresDestino])*/

  useEffect(() => {
    setMarcadoresDestinoMelhorRota(melhorRota(grid, marcadorInicio, marcadoresDestino));
  }, [marcadorInicio, marcadoresDestino])

  useEffect(() => {
    if (marcadoresDestinoMelhorRota.length > 1) {
      const finder = new PF.AStarFinder();
      let caminhos: Position[] = [{ x: marcadoresDestinoMelhorRota[0].x, y: marcadoresDestinoMelhorRota[0].y }];
      for (let i = 0; i < marcadoresDestinoMelhorRota.length - 1; i++) {
        const path = finder.findPath(marcadoresDestinoMelhorRota[i].x, marcadoresDestinoMelhorRota[i].y, marcadoresDestinoMelhorRota[i + 1].x, marcadoresDestinoMelhorRota[i + 1].y, new PF.Grid(grid));

        path.shift();// remove repetido

        caminhos = [...caminhos, ...(path.map(p => { return { x: p[0], y: p[1] } }))];
      }
      setMelhorCaminho(caminhos);
    }
  }, [marcadoresDestinoMelhorRota])

  useEffect(() => {
    console.log('melhorCaminho: ', melhorCaminho);
  }, [melhorCaminho])



  return (
    <div>
      <div>
        Seu local de início é: {marcadorInicio?.x}, {marcadorInicio?.y}
        <button
          onClick={() => isEditingMarcadorInicio ? setIsEditingMarcadorInicio(false) : setIsEditingMarcadorInicio(true)}
          style={{ backgroundColor: isEditingMarcadorInicio ? 'green' : 'white' }}
        >Editar local de início</button>
      </div>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        center={[3, 3.5]}
        zoom={5}
        maxZoom={7}
      >
        <MapInfoCollector onUpdateInfo={(newInfo) => setMapInfo(newInfo)} />
        {
          <AntPath positions={positionListToLatLngList(melhorCaminho)} options={{ color: 'red' }} />
        }
        <MapEvents />
        <Rectangle
          bounds={[[0, 0], [tam[0], tam[1]]]}
          color='white'
          fillColor='#ffffff00'
        />

        {
          mapInfo && mapInfo?.zoom > 4 && <BoxDrawer grid={grid} mapBounds={mapInfo?.bounds} />
        }
       
        {
          marcadorInicio && <Marker position={[marcadorInicio.y + 0.5, marcadorInicio.x + 0.5]}></Marker>
        }
        {
          marcadoresDestinoMelhorRota?.map((marcador, index) => {
            if (index < marcadoresDestinoMelhorRota.length - 1 && index > 0)
              return <DestinyMarker key={index} x={marcador.x} y={marcador.y} innerText={index.toString()} />
          }
          )
        }

      </MapContainer>
    </div>
  )
}

export default App
