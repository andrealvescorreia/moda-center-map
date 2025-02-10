import { Marker, Popup, Rectangle } from 'react-leaflet'
import 'leaflet-extra-markers';
import { ExtraMarkers } from 'leaflet';
import L from 'leaflet';

interface BoxeProps {
  x: number;
  y: number;
  onClick: () => void;
  innerText: string;
}

const Boxe = ({ x, y, onClick, innerText }: BoxeProps) => {
  const text = new L.DivIcon({
    html: `<div style="display: flex; align-items:center; justify-content: center;  bacground: none;"> ${innerText} </div>`,
    className: 'transparent-icon'
  });

  return (
    <Rectangle
      bounds={[[y, x], [y + 1, x + 1]]}
      color='#ffffff00'
      fillColor='orange'
      eventHandlers=
      {{
        click: onClick
      }}
    >

      {<Marker position={[y+0.5, x+0.5]} icon={text} />}
      <Popup>
        <div>
          <h2>{`${y}, ${x}`}</h2>
        </div>
      </Popup>


    </Rectangle>
  )
};
export default Boxe;