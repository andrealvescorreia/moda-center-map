import { Marker } from 'react-leaflet'
import 'leaflet-extra-markers'
import { ExtraMarkers } from 'leaflet'

interface DestinyMarkerProps {
  x: number
  y: number
  innerText: string
}
//https://www.raymondcamden.com/2024/10/09/custom-markers-with-leaflet

const DestinyMarker = ({ x, y, innerText }: DestinyMarkerProps) => {
  const marker = ExtraMarkers.icon({
    innerHTML: `<div style="display: flex; align-items:center; justify-content: center; border-style: solid; border-radius: 100%; width: 1.2rem; height: 1.2rem; margin-left:0.35rem; background-color:white;"> ${innerText} </div> <div style="display:flex; justify-content: center; ">V</div>`,
  })

  return <Marker position={[y + 0.5, x + 0.5]} icon={marker} />
}
export default DestinyMarker
