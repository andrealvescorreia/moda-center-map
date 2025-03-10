import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge' // permite que passamos estilos via className para o componente sem substituir sua estilização padrão. Ou seja, "junta" os dois classNames.

type IconButtonProps = ComponentProps<'button'>

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      className={twMerge(
        'p-1.5 bg-gray-500 text-blue rounded-md cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300',
        className
      )}
      {...props}
    />
  )
}
