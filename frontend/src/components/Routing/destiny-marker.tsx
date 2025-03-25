import { Marker } from 'react-leaflet'
import 'leaflet-extra-markers'
import { ExtraMarkers } from 'leaflet'

interface DestinyMarkerProps {
  x: number
  y: number
  innerText: string
  isEnd?: boolean
}
//https://www.raymondcamden.com/2024/10/09/custom-markers-with-leaflet

const DestinyMarker = ({
  x,
  y,
  innerText,
  isEnd = false,
}: DestinyMarkerProps) => {
  const marker = ExtraMarkers.icon({
    innerHTML: `<div class="w-full h-full  flex flex-col items-center justify-center"> 
      <div class="mt-auto flex items-center justify-center border-solid border-2 rounded-2xl 
      size-7 md:size-6 font-bold
      ${
        isEnd
          ? 'bg-purple02 text-white border-purple01'
          : 'bg-white text-purple01 border-purple01'
      }
       ">${innerText}</div>
      
    </div>`,
  })

  return <Marker position={[y + 0.5, x + 0.5]} icon={marker} />
}
export default DestinyMarker
