import type { ButtonHTMLAttributes } from 'react'

interface RouteStartingPointProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  x: number
  y: number
}

const RouteStartingPoint = ({ x, y, ...rest }: RouteStartingPointProps) => {
  return (
    <div>
      Início: {x}, {y}
      <button {...rest}>✏️</button>
    </div>
  )
}
export default RouteStartingPoint
