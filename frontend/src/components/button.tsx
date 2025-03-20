import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
type ButtonProps = ComponentProps<'button'>

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'flex justify-between items-center px-5 h-12 w-full bg-green-primary text-white font-semibold rounded-xl cursor-pointer hover:bg-green-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
