import { useState } from "react";
import { GridMap } from "../../models/GridMap";
import { useMapEvents } from "react-leaflet";
import { Route } from "../../interfaces/Route";

interface RouteEditorProps {
  gridMap: GridMap;
  route: Route
  onUpdate: (route: Route) => void;
  onCancel: () => void;
}

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

const RouteEditor = ({ gridMap, route, onUpdate, onCancel }: RouteEditorProps) => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(true);
  const [isAddingDestiny, setIsAddingDestiny] = useState(false);

  const isInsideGridMap = (lat: number, lng: number) => {
    return lat >= 0 && lat < gridMap.getDimensions()[0] && lng >= 0 && lng < gridMap.getDimensions()[1];
  }

  const onClickMouse = (lat: number, lng: number) => {
    if (!isInsideGridMap(lat, lng)) return;

    if (isEditingMarcadorInicio && gridMap.getGrid()[lat][lng] === 0) {
      const newRoute = { ...route, inicio: { setor: 'Laranja', rua: 'A', numero: 1, position: { x: lng, y: lat } } };
      onUpdate(newRoute);
      setIsEditingMarcadorInicio(false);
    }
    if (isAddingDestiny && gridMap.getGrid()[lat][lng] === 1) {
      const newRoute = { ...route, destinos: [...route.destinos, { setor: 'Laranja', rua: 'A', numero: 1, position: { x: lng, y: lat } }] };
      onUpdate(newRoute);
      setIsAddingDestiny(false);
    }
  }

  const removeDestiny = (index: number) => {
    const newRoute = { ...route, destinos: route.destinos.filter((_, i) => i !== index) };
    onUpdate(newRoute);
  }

  const cancel = () => {
    setIsEditingMarcadorInicio(false);
    setIsAddingDestiny(false);
    onCancel();
  }

  return (
    <div className='route-editor-content'>
      <ClickPosition onClick={onClickMouse} />

      {
        isEditingMarcadorInicio &&
        <div>
          Clique no local de início
        </div>
      }

      {
        route.inicio && !isEditingMarcadorInicio &&
        <button
          onClick={() => {
            setIsEditingMarcadorInicio(true)
            setIsAddingDestiny(false);
          }}
        >
          Posição inicial: {route.inicio.setor} {route.inicio.rua} {route.inicio.numero}
        </button>

      }

      {
        route.destinos.map((destiny, index) => {
          return <div key={index}>
            Destino {index + 1}: {destiny.setor} {destiny.rua} {destiny.numero}
            <button onClick={() => removeDestiny(index)}>X</button>
          </div>
        })
      }


      {
        !isAddingDestiny &&
        <button disabled={isEditingMarcadorInicio} onClick={() => {
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
          <button onClick={cancel}>Cancelar</button>
          <button disabled={!route.inicio || route.destinos.length == 0} onClick={() => {
            console.log('marcadorInicio: ', route.inicio);
            console.log('marcadoresDestino: ', route.destinos);
          }}>🔼Iniciar</button>
        </div>
      }

    </div>
  );
}

export default RouteEditor;