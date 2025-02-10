import React, { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

// vai interagir com o mapa

const ClickPosition = (onClick) => {
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

const RouteEditor: React.FC = () => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(false);
  const [marcadorInicio, setMarcadorInicio] = useState<{ x: number, y: number } | null>(null);

  return (
    <div>
      <ClickPosition />
      <div>
        Seu local de início é: {marcadorInicio?.x}, {marcadorInicio?.y}
        <button
          onClick={() => isEditingMarcadorInicio ? setIsEditingMarcadorInicio(false) : setIsEditingMarcadorInicio(true)}
          style={{ backgroundColor: isEditingMarcadorInicio ? 'green' : 'white' }}
        >Editar local de início</button>
      </div>
    </div>
  );
};

export default RouteEditor;