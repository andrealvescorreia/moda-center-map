import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import PersonWalking from '../../assets/person-walking.svg'

type RouteButtonProps = ComponentProps<'button'>

const RouteButton = ({ className, ...props }: RouteButtonProps) => {
  return (
    <button
      className={twMerge(
        'flex items-center justify-center bg-green-primary px-2 h-16 w-16 rounded-md outline-white outline-solid shadow-md hover:bg-green-secondary hover:cursor-pointer transition-colors duration-300 text-white flex-col gap-1',
        className
      )}
      {...props}
    >
      <img src={PersonWalking} alt="Iniciar rota" className="w-5" />
      <span className="text-xs">Rota</span>
    </button>
  )
}

export default RouteButton
