import { Rectangle } from 'react-leaflet'
import 'leaflet-extra-markers'

interface BoxeProps {
  x: number
  y: number
  onClick: () => void
}

const Boxe = ({ x, y, onClick }: BoxeProps) => {
  return (
    <Rectangle
      bounds={[
        [y, x],
        [y + 1, x + 1],
      ]}
      color="#ffffff00"
      fillColor="orange"
      eventHandlers={{
        click: onClick,
      }}
    />
  )
}
export default Boxe
