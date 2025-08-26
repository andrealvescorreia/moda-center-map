import L from 'leaflet'
import { useMap } from 'react-leaflet'
import type { Position } from '../../interfaces/Position'

export default function PanTo({ position }: { position: Position }) {
  const map = useMap()
  map.panTo(L.latLng(position.y, position.x), { animate: true })
  return null
}
