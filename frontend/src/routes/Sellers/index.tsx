import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavBar from '../../components/nav'
import { getSellers } from '../../http/api'

interface SellingLocation {
  id: string
  sector_color: string
  seller_id: string
}

interface Boxe extends SellingLocation {
  street_letter: string
  box_number: number
}

interface Store extends SellingLocation {
  store_number: number
  block_number: number
}

interface ProductCategory {
  id: string
  category: string
}

interface Seller {
  id: string
  name: string
  phone_number: string
  boxes: Boxe[]
  stores: Store[]
  product_categories: ProductCategory[]
}

export default function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>([])

  useEffect(() => {
    const fetchSellers = async () => {
      const response = await getSellers()
      setSellers(response.data)
    }
    fetchSellers()
  }, [])

  return (
    <div>
      <NavBar />
      <NavLink to="/sellers/new">Novo Vendedor</NavLink>
      {sellers.map((seller) => {
        return (
          <div key={seller.id}>
            <h1>{seller.name}</h1>
            <p>{seller.phone_number}</p>
            <h2>Boxes</h2>
            {seller.boxes.map((box) => {
              return (
                <div key={box.id}>
                  <p>{box.street_letter}</p>
                  <p>{box.box_number}</p>
                </div>
              )
            })}
            <h2>Stores</h2>
            {seller.stores.map((store) => {
              return (
                <div key={store.id}>
                  <p>{store.store_number}</p>
                  <p>{store.block_number}</p>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
