import type { ComponentProps } from 'react'

export default function ButtonRounded(props: ComponentProps<'button'>) {
  return (
    <button
      type="submit"
      className="bg-green-primary text-white px-8 py-3 rounded-4xl w-full hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed"
      {...props}
    />
  )
}
