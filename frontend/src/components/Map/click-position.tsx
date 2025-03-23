import { useMapEvents } from 'react-leaflet'
import { useClickContext } from '../../providers/ClickProvider'

export function ClickPosition() {
  const { setClickLocation } = useClickContext()
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      setClickLocation({
        lat: Number.parseInt(lat.toString()),
        lng: Number.parseInt(lng.toString()),
      })
    },
  })
  return false
}
