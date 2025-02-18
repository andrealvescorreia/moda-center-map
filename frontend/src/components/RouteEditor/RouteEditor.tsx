import { useState } from 'react';
import './RouteEditor.scss';
import { GridMap } from '../../models/GridMap';
import { Position } from '../../interfaces/Position';
import RouteButton from './RouteButton';
import RouteDrawer from './RouteDrawer';
import RouteEditorUI from './RouteEditorUI';
import { Route } from '../../interfaces/Route';

interface RouteEditorProps {
  gridMap: GridMap;
}

const RouteEditor = ({ gridMap }: RouteEditorProps) => {
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  const [route, setRoute] = useState<Route>({
    inicio: null,
    destinos: []
  });

  let destinosMelhorOrdem: Position[] = [];
  let melhoresPassos: Position[] = [];

  if (route.inicio && route.destinos.length > 0) {
    const bestRoute = gridMap.calculateBestRoute(
      route.inicio.position, 
      route.destinos.map(destino => destino.position)
    );

    destinosMelhorOrdem = bestRoute.destiniesBestOrder;
    melhoresPassos = bestRoute.steps;
  }

  return (
    <div className='route-manager'>
      {
        !isCreatingRoute ? <RouteButton onClick={() => setIsCreatingRoute(true)} />
          :
          <RouteEditorUI
            gridMap={gridMap}
            route={route}
            onUpdate={(route) => setRoute(route)}
            onCancel={() => {
              setIsCreatingRoute(false)
              setRoute({
                inicio: null,
                destinos: []
              });
            }}
          />
      }
      {
        route.inicio &&
        <RouteDrawer inicio={route.inicio.position} destinos={destinosMelhorOrdem} passos={melhoresPassos} />
      }
    </div>
  );
};

export default RouteEditor;