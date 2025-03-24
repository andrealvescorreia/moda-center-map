import type { ReactNode } from 'react'

interface SellerCardProps {
  name: string
  description?: string
  children?: ReactNode
}

export default function SellerCard(props: SellerCardProps) {
  return (
    <div className="h-20 relative flex md:px-10 w-full" {...props}>
      <div className="flex items-center justify-between w-full">
        <div className="bg-gray06 size-20 rounded-xl" />
        <div className="flex flex-col gap-1 items-start px-3  ">
          <h2 className="font-semibold text-3xl text-gray02 whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]">
            {props.name}
          </h2>
          <p className="text-gray03 text-xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]">
            {props.description}
          </p>
        </div>
        {props.children}
      </div>
    </div>
  )
}
