import { Rotate3D } from 'lucide-react'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type RotateButtonProps = ComponentProps<'button'> & {
  active?: boolean
}

const RotateButton = ({
  className,
  active = false,
  ...props
}: RotateButtonProps) => {
  return (
    <button
      className={twMerge(
        `flex items-center justify-center px-2 h-16 w-16 rounded-md outline-white outline-solid shadow-md hover:cursor-pointer transition-colors duration-300 text-white flex-col gap-1 font-semibold
        ${active ? 'bg-green-primary' : ' bg-gray text-green-primary'}`,
        className
      )}
      {...props}
    >
      <Rotate3D className="w-5" />
      <span className="text-xs">Girar</span>
    </button>
  )
}

export default RotateButton
