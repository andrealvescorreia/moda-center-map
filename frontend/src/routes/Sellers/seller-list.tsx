import type { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'
import type { SellerResponse } from '../../http/responses'

interface SellerItemProps extends ComponentProps<'button'> {
  name: string
  description?: string
}
function SellerItem(props: SellerItemProps) {
  return (
    <button
      type="button"
      className="hover:cursor-pointer h-20 relative flex md:px-10 w-full"
      {...props}
    >
      <div className="flex items-center justify-between p-4">
        <div className="bg-gray06 size-13 min-w-13 rounded-xl" />
        <div className="flex flex-col gap-1 items-start px-3  ">
          <h3 className="font-semibold  text-gray04 text-ellipsis overflow-hidden whitespace-nowrap  max-w-[70vw]">
            {props.name}
          </h3>
          <p className="text-gray03 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]">
            {props.description}
          </p>
          <hr className="w-[80%] md:text-white py-[0.5px] text-gray05 absolute bottom-0" />
        </div>
      </div>
    </button>
  )
}

interface SellerListProps {
  sellers: SellerResponse[]
  onClick: (id: SellerResponse['id']) => void
}
export default function SellerList({ sellers, onClick }: SellerListProps) {
  function joinCategories(seller: SellerResponse) {
    if (!seller.product_categories) return undefined
    const categories = seller.product_categories.map(
      (category) => category.category
    )
    return categories.join(', ')
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {sellers.map((seller) => (
        <NavLink
          to={`/sellers/${seller.id}`}
          key={seller.id}
          className="w-full"
        >
          <SellerItem
            name={seller.name}
            description={joinCategories(seller)}
            onClick={() => onClick(seller.id)}
          />
        </NavLink>
      ))}
    </div>
  )
}
