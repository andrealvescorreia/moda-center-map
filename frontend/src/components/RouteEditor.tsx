import React, { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import './RouteEditor.scss';
import AntPath from '../components/AntPath';
import { GridMap } from '../models/GridMap';
import DestinyMarker from './DestinyMarker';
import { Position } from '../interfaces/Position';

// vai interagir com o mapa

const ClickPosition: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onClick(parseInt(lat.toString()), parseInt(lng.toString()));
    },
  });
  return false;
}

interface RouteEditorProps {
  gridMap: GridMap;
}

const positionListToLatLngList = (positions: Position[]) => {
  return positions.map(p => [p.y + 0.5, p.x + 0.5]);
}

const RouteEditor = ({ gridMap }: RouteEditorProps) => {
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(false);
  const [isAddingDestiny, setIsAddingDestiny] = useState(false);

  const [marcadorInicio, setMarcadorInicio] = useState<{ x: number, y: number } | null>(null);
  const [marcadoresDestino, setMarcadoresDestino] = useState<{ x: number, y: number }[]>([]);
  let marcadoresDestinoMelhorOrdem: Position[] = [];
  let melhoresPassos: Position[] = [];

  if (gridMap && marcadorInicio && marcadoresDestino.length > 0) {
    marcadoresDestinoMelhorOrdem = (gridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).destiniesBestOrder);
    melhoresPassos = (gridMap.calculateBestRoute(marcadorInicio, marcadoresDestino).steps);
  }
  useEffect(() => {
    setMarcadorInicio({ x: 0, y: 0 });
    setMarcadoresDestino([{ x: 1, y: 3 }, { x: 2, y: 1 }, { x: 8, y: 6 }]);
  }, [])

  const isInsideGridMap = (lat: number, lng: number) => {
    return lat >= 0 && lat < gridMap.getDimensions()[0] && lng >= 0 && lng < gridMap.getDimensions()[1];
  }

  const onClickMouse = (lat: number, lng: number) => {

    if (!isCreatingRoute) return;
    if (!isInsideGridMap(lat, lng)) return;

    if (isEditingMarcadorInicio && gridMap.getGrid()[lat][lng] === 0) {
      setMarcadorInicio({
        x: lng,
        y: lat
      });
      setIsEditingMarcadorInicio(false);
    }
    if (isAddingDestiny && gridMap.getGrid()[lat][lng] === 1) {
      setMarcadoresDestino([...marcadoresDestino, { x: lng, y: lat }]);
      setIsAddingDestiny(false);
    }
  }



  return (
    <div className='route-editor'>
      <ClickPosition onClick={onClickMouse} />

      {
        marcadoresDestinoMelhorOrdem?.map((marcador, index) => {
          if (index < marcadoresDestinoMelhorOrdem.length && index > 0)
            return <DestinyMarker key={index} x={marcador.x} y={marcador.y} innerText={index.toString()} />
        }
        )
      }


      {
        !isCreatingRoute ?
          <div>
            <button onClick={() => {
              setIsCreatingRoute(true)
              setIsEditingMarcadorInicio(true);

            }}>🚶‍♂️‍➡️ Rota</button>
          </div>
          :
          <div>
            <button onClick={() => {
              setIsCreatingRoute(false)
              setIsEditingMarcadorInicio(false);
              setMarcadorInicio(null);
              setIsAddingDestiny(false);
              setMarcadoresDestino([]);
            }}>⬅️</button>

            {
              isEditingMarcadorInicio &&
              <div>
                Clique no local de início
              </div>
            }
            {
              !isEditingMarcadorInicio && marcadorInicio &&
              <div>
                Início: {marcadorInicio.x}, {marcadorInicio.y}<br />
                <button onClick={() => {
                  setIsEditingMarcadorInicio(true);
                }
                }>Editar início</button>
                {
                  marcadoresDestino.map((destiny, index) => {
                    return <div key={index}>
                      Destino {index + 1}: {destiny.x}, {destiny.y}
                      <button onClick={() => {
                        setMarcadoresDestino(marcadoresDestino.filter((_, i) => i !== index));
                      }}>X</button>
                    </div>
                  })
                }


                {
                  !isAddingDestiny &&
                  <button onClick={() => {
                    setIsAddingDestiny(true);
                  }}>Adicionar destino</button>
                }

                {
                  isAddingDestiny &&
                  <div>
                    Clique no Boxe destino
                  </div>
                }
                <br />
                {
                  marcadorInicio && marcadoresDestino.length > 0 &&
                  <button onClick={() => {
                    console.log('marcadorInicio: ', marcadorInicio);
                    console.log('marcadoresDestino: ', marcadoresDestino);
                  }}>Calcular rota</button>
                }

              </div>
            }
          </div>
      }
      {
        marcadorInicio && <Marker position={[marcadorInicio.y + 0.5, marcadorInicio.x + 0.5]}></Marker>
      }
      {
        melhoresPassos.length > 0 &&
        <AntPath positions={positionListToLatLngList(melhoresPassos)} options={{ color: 'purple' }} />
      }
    </div>
  );
};

export default RouteEditor;