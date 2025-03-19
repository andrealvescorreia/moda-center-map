import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'>

export function Button(props: ButtonProps) {
  return (
    <button
      className="flex justify-between items-center px-5 h-12 w-full bg-green-primary text-white font-semibold rounded-xl cursor-pointer hover:bg-green-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  )
}
