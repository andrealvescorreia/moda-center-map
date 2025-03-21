import type { BoxeSchema } from '../schemas/box'
import type { StoreSchema } from '../schemas/store'

interface BoxeResponse extends BoxeSchema {
  id: string
  seller_id: string
}

interface StoreResponse extends StoreSchema {
  id: string
  seller_id: string
}

interface ProductCategoryResponse {
  id: string
  category: string
}

interface SellerResponse {
  id: string
  name: string
  phone_number?: string
  boxes: BoxeResponse[]
  stores: StoreResponse[]
  product_categories: ProductCategoryResponse[]
}
export type { SellerResponse }
