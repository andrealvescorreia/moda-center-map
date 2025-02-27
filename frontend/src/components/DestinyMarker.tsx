import { Marker } from 'react-leaflet'
import 'leaflet-extra-markers'
import { ExtraMarkers } from 'leaflet'

interface DestinyMarkerProps {
  x: number
  y: number
  innerText: string
}
//https://www.raymondcamden.com/2024/10/09/custom-markers-with-leaflet
/*const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});*/

const DestinyMarker = ({ x, y, innerText }: DestinyMarkerProps) => {
  //return <CircleMarker center={[y + 0.5, x + 0.5]} radius={10} color="red" icon={<div>a</div>}></CircleMarker>
  const redMarker = ExtraMarkers.icon({
    icon: 'fa-camera',
    markerColor: 'red',
    shape: 'square',
    prefix: 'fa',
    innerHTML: `<div style="display: flex; align-items:center; justify-content: center; border-style: solid; border-radius: 100%; width: 1.2rem; height: 1.2rem; margin-left:0.35rem; background-color:white;"> ${innerText} </div> <div style="display:flex; justify-content: center; ">V</div>`,
  })

  //const text = L.divIcon({ html: '<div style="background: none; border: none; background-color: none; display: flex">aaa</div>' });
  return <Marker position={[y + 0.5, x + 0.5]} icon={redMarker} />
}
export default DestinyMarker
