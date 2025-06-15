import z from 'zod'

const sector_colors = z.enum([
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'white',
])

const registerSellerSchema = z.object({
  name: z.string().min(3).max(255),
  phone_number: z.string().min(10).max(11).optional(),
  product_categories: z.array(z.string()).optional(),
  sellingLocations: z.object({
    boxes: z
      .array(
        z.object({
          sector_color: sector_colors,
          box_number: z.number().int().positive().max(128),
          street_letter: z.string().regex(/^[A-P]$/),
        })
      )
      .optional(),
    stores: z
      .array(
        z.object({
          sector_color: sector_colors,
          store_number: z.number().int().positive().max(19),
          block_number: z.number().int().positive().max(9),
        })
      )
      .optional(),
  }),
})

const updateSellerSchema = z.object({
  name: z.string().min(3).max(255),
  phone_number: z.string().min(10).max(11).optional().nullable(),
  product_categories: z.array(z.string()).optional(),

  boxes: z
    .array(
      z.object({
        sector_color: sector_colors,
        box_number: z.number().int().positive().max(128),
        street_letter: z.string().regex(/^[A-P]$/),
      })
    )
    .optional(),
  stores: z
    .array(
      z.object({
        sector_color: sector_colors,
        store_number: z.number().int().positive().max(19),
        block_number: z.number().int().positive().max(9),
      })
    )
    .optional(),
})

export { registerSellerSchema, updateSellerSchema }
