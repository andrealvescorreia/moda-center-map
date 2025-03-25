import L from 'leaflet'
import { useMap } from 'react-leaflet'
import type { Position } from '../../interfaces/Position'

export default function FlyTo({
  position,
  zoom,
}: { position: Position; zoom?: number }) {
  const map = useMap()
  map.flyTo(L.latLng(position.y, position.x), zoom || map.getZoom(), {
    duration: 1,
  })
  return null
}
