import z from 'zod'
import { boxeSchema } from './boxeSchema'
import { storeSchema } from './storeSchema'

const registerSellerSchema = z.object({
  name: z.string().min(3).max(255),
  phone_number: z.string().min(10).max(11).optional(),
  product_categories: z.array(z.string()).optional(),
  sellingLocations: z.object({
    boxes: z.array(boxeSchema).optional(),
    stores: z.array(storeSchema).optional(),
  }),
})

const updateSellerSchema = z.object({
  name: z.string().min(3).max(255),
  phone_number: z.string().min(10).max(11).optional().nullable(),
  product_categories: z.array(z.string()).optional(),
  boxes: z.array(boxeSchema).optional(),
  stores: z.array(storeSchema).optional(),
})

export { registerSellerSchema, updateSellerSchema }
