import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge' // permite que passamos estilos via className para o componente sem substituir sua estilização padrão. Ou seja, "junta" os dois classNames.

type IconButtonProps = ComponentProps<'button'>

export function IconButton({
  className,
  type = 'button',
  disabled = false,
  ...props
}: IconButtonProps) {
  const typeStyles = {
    button:
      'bg-white text-green-700 border-2 border-green-700 box-border hover:bg-gray06',
    submit: 'bg-green-600 hover:bg-green-700 text-white',
    reset: 'bg-red-600 hover:bg-red-700 text-white',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(
        'px-5 py-1.5 text-blue rounded-4xl cursor-pointer transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        typeStyles[type],
        className
      )}
      {...props}
    />
  )
}
