import React, { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import './RouteEditor.scss';
import { GridMap } from '../../models/GridMap';
import { Position } from '../../interfaces/Position';
import RouteButton from './RouteButton';
import RouteStartingPoint from './RouteStartingPoint';
import RouteDrawer from './RouteDrawer';

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

  const startCreatingRoute = () => {
    setIsCreatingRoute(true)
    setIsEditingMarcadorInicio(true);
  }

  const goBack = () => {
    if (isEditingMarcadorInicio) {
      setIsEditingMarcadorInicio(false);
      return;
    }
    if (isAddingDestiny) {
      setIsAddingDestiny(false);
      return;
    }
    setIsCreatingRoute(false)
    setIsEditingMarcadorInicio(false);
    setMarcadorInicio(null);
    setIsAddingDestiny(false);
    setMarcadoresDestino([]);
  }

  const removeDestiny = (index: number) => {
    setMarcadoresDestino(marcadoresDestino.filter((_, i) => i !== index));
  }

  return (
    <div className='route-editor'>




      {<ClickPosition onClick={onClickMouse} />}
      {
        !isCreatingRoute ? <RouteButton onClick={startCreatingRoute} />
          :
          <div className='route-editor-content'>
            {
              isEditingMarcadorInicio &&
              <div>
                Clique no local de início
              </div>
            }

            {
              marcadorInicio && !isEditingMarcadorInicio &&
              <RouteStartingPoint
                x={marcadorInicio.x}
                y={marcadorInicio.y}
                onClick={() => {
                  setIsEditingMarcadorInicio(true)
                  setIsAddingDestiny(false);
                }}
              />
            }

            {
              marcadoresDestino.map((destiny, index) => {
                return <div key={index}>
                  Destino {index + 1}: {destiny.x}, {destiny.y}
                  <button onClick={() => {
                    removeDestiny(index);
                  }}>X</button>
                </div>
              })
            }


            {
              !isAddingDestiny &&
              <button onClick={() => {
                setIsAddingDestiny(true);
                setIsEditingMarcadorInicio(false);
              }}>Adicionar parada</button>
            }

            {
              isAddingDestiny &&
              <div>
                Clique no Boxe destino
              </div>
            }
            <br />
            {
              <div>
                <button onClick={goBack}>Cancelar</button>
                <button disabled={!marcadorInicio || marcadoresDestino.length == 0} onClick={() => {
                  console.log('marcadorInicio: ', marcadorInicio);
                  console.log('marcadoresDestino: ', marcadoresDestino);
                }}>Iniciar</button>
              </div>
            }

          </div>
      }

      {
        marcadorInicio &&
        <RouteDrawer inicio={marcadorInicio} destinos={marcadoresDestinoMelhorOrdem} passos={melhoresPassos} />
      }

    </div>
  );
};

export default RouteEditor;