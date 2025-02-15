import { MapContainer } from 'react-leaflet'
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



const modaCenterGridMap = new GridMap([26, 28]);
const minZoomLevelToRenderMarkers = 4;
//let counter = 0;

function App() {
  //counter++;
  //console.warn('render', counter);
 

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
        <RouteEditor gridMap={modaCenterGridMap} />
        <GridDrawer
          gridMap={modaCenterGridMap}
          minZoomLevelToRenderMarkers={minZoomLevelToRenderMarkers}
        />

      </MapContainer>
    </div>
  )
}

export default App;
