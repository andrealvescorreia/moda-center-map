import L from 'leaflet'
import { useMemo, useRef } from 'react'
import { Marker } from 'react-leaflet'
import PersonMarker from '../../../assets/person.png'
import type { Position } from '../../../interfaces/Position'

export default function DraggableMarker({
  position,
  onUpdatePosition,
}: {
  position: Position
  onUpdatePosition: (position: [number, number]) => void
}) {
  const markerRef = useRef<L.Marker>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = marker.getLatLng()
          onUpdatePosition([lat, lng])
        }
      },
    }),
    [onUpdatePosition]
  )

  const personIcon = L.icon({
    iconUrl: PersonMarker,
    iconSize: [31, 50],
    iconAnchor: [16, 30], // point of the icon which will correspond to marker's location
  })

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.y + 0.5, position.x + 0.5]}
      ref={markerRef}
      icon={personIcon}
    />
  )
}
