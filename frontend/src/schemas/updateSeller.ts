import { z } from 'zod'
import boxeSchema from './box'
import storeSchema from './store'

const updateSellerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve conter no mínimo 3 caracteres.')
      .max(255, 'Nome deve conter no máximo 255 caracteres.'),
    phone_number: z
      .string()
      .transform((value) => value.replace(/[^0-9]/g, ''))
      .optional(),

    boxes: z.array(boxeSchema).optional(),
    stores: z.array(storeSchema).optional(),
    productCategories: z.array(z.string()).optional(),
  })
  .superRefine((values, ctx) => {
    if (
      (!values.boxes && !values.stores) ||
      (values.boxes?.length === 0 && values.stores?.length === 0)
    ) {
      ctx.addIssue({
        message: 'O vendedor deve ter ao menos um local de venda.',
        code: z.ZodIssueCode.custom,
        path: ['boxes', 'stores'],
      })
    }
  })

export default updateSellerSchema
export type SellerSchema = z.infer<typeof updateSellerSchema>
