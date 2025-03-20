import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'>

export default function IconOnlyButton(props: ButtonProps) {
  return (
    <button
      className="flex bg-gray05 rounded-2xl text-gray04 hover:cursor-pointer"
      {...props}
    />
  )
}
