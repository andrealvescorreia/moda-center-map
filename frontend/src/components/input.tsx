import type { ComponentProps } from 'react'

// Pattern: Composition

interface InputRootProps extends ComponentProps<'div'> {
  error?: boolean
}
export function InputRoot({ error = false, ...props }: InputRootProps) {
  return (
    <div
      data-error={error}
      className="group bg-white h-12 border-gray05 border-[1.5px] rounded-4xl px-4 flex items-center gap-2 focus-within:border-gray04 data-[error=true]:border-danger"
      {...props}
    />
  )
}

type InputIconProps = ComponentProps<'span'>
export function InputIcon(props: InputIconProps) {
  return (
    <span
      className="text-gray04 group-focus-within:text-gray04
      group-data-[error=true]:text-danger"
      {...props}
    />
  )
}

type InputField = ComponentProps<'input'>
export function InputField(props: InputField) {
  return (
    <input
      className="text-black w-full outline-0 placeholder:text-gray03"
      {...props}
    />
  )
}
