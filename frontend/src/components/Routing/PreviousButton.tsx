import type { ButtonHTMLAttributes } from 'react'

const PreviousButton = ({
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button {...rest}>⬅️</button>
}

export default PreviousButton
