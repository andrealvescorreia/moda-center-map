import { Marker, Popup, Rectangle } from 'react-leaflet'
import 'leaflet-extra-markers';
import L from 'leaflet';

interface BoxeProps {
  x: number;
  y: number;
  onClick: () => void;
  innerText: string;
}

const Boxe = ({ x, y, onClick }: BoxeProps) => {
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
    </Rectangle>
  )
};
export default Boxe;